import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  classify, SAFETY_ENGINE_VERSION,
  type RuleSet, type SafetyRule, type ImmediacyTerm, type Classification, type RiskCategory,
} from "@/lib/companion/safetyEngine";
import { resourceKindsFor, filterResources, type RoutableResource } from "@/lib/companion/safetyRouting";

// Server-only. Safety Layer V2 orchestration: load the VERSIONED registry, run the
// deterministic engine (lib/companion/safetyEngine.ts) BEFORE normal processing,
// log a METADATA-ONLY event, and build the level-routed supportive response.
//
// No clinical content lives here — patterns / immediacy terms / response copy /
// resources are all clinician-authored in the registry. This module only loads +
// classifies + routes + logs. It NEVER copies raw learner text into logs,
// analytics, URLs, or the event store, and absence of a trigger is NEVER treated
// as evidence of safety (action_level 0 → null → caller proceeds normally).

export interface SafetyResource {
  id: string; name: string; description: string | null; contact: string | null;
  url: string | null; jurisdiction: string; hours: string | null;
}
export interface SafetyNoticeBlock { heading: string | null; message: string }
export interface SafetyInterrupt {
  action_level: 1 | 2 | 3;          // 0 never surfaces (no_safety_signal_detected)
  level: string;                     // routing key ("1" | "2" | "3" | "immediate_danger")
  immediate_danger: boolean;
  categories: RiskCategory[];
  digital_safety: boolean;           // IPV/SC → discreet UX: no auto-open, quick-exit (item 11)
  heading: string | null;
  message: string;                   // primary copy for the action level (1/2/3)
  resource_intro: string | null;
  immediate_notice: SafetyNoticeBlock | null;       // layered onto L3 when immediate_danger
  digital_safety_notice: SafetyNoticeBlock | null;  // shown when digital_safety
  resources: SafetyResource[];
}
export interface ScreenContext {
  userId: string;
  context: string;                   // "experience" | "blueprint" | "planner" | "journey_title"
  situationRef?: string | null;
  jurisdiction?: string;             // reserved for jurisdiction-aware routing (default US)
  minConfidenceLevel?: 1 | 2 | 3;    // ignore findings below this (e.g. Journey titles → 2)
}

// ---------------------------------------------------------------------------
// Registry loading (versioned, short-lived in-memory cache).
// ---------------------------------------------------------------------------
interface Cached { ruleSet: RuleSet; at: number }
let cache: Cached | null = null;
const TTL_MS = 60_000;

async function loadRuleSet(): Promise<RuleSet | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.ruleSet;
  const s = getSupabaseAdminClient();
  try {
    const [{ data: trig }, { data: imm }] = await Promise.all([
      s.from("companion_safety_triggers")
        .select("id, pattern, match_type, risk_category, canonical_concept, severity, context_required, negation_sensitive, self_directed_act, registry_version")
        .eq("is_active", true),
      s.from("companion_safety_immediacy_terms")
        .select("id, pattern, match_type, kind, implies_category, registry_version")
        .eq("is_active", true),
    ]);
    const rules: SafetyRule[] = (trig ?? [])
      .filter((r) => r.risk_category && r.canonical_concept && r.severity)
      .map((r) => ({
        id: r.id, risk_category: r.risk_category as RiskCategory,
        canonical_concept: r.canonical_concept as string, pattern: r.pattern,
        match_type: (r.match_type ?? "phrase") as SafetyRule["match_type"],
        severity: r.severity as SafetyRule["severity"],
        context_required: r.context_required ?? true,
        negation_sensitive: r.negation_sensitive ?? true,
        self_directed_act: r.self_directed_act ?? false,
      }));
    const immediacyTerms: ImmediacyTerm[] = (imm ?? []).map((t) => ({
      id: t.id, pattern: t.pattern, match_type: (t.match_type ?? "phrase") as ImmediacyTerm["match_type"],
      kind: t.kind as ImmediacyTerm["kind"],
      implies_category: (t.implies_category ?? undefined) as RiskCategory | undefined,
    }));
    // registry_version stamped on every event for later false-pos/neg review.
    const registry_version = (trig?.[0]?.registry_version as string | undefined) ?? "2.0.0";
    const ruleSet: RuleSet = { rules, immediacyTerms, registry_version };
    cache = { ruleSet, at: Date.now() };
    return ruleSet;
  } catch {
    // Fail SAFE for reads: without a registry we cannot classify. Return null so
    // the caller proceeds (we do not fabricate an interrupt), but this path is
    // monitored — an empty registry is an operational alarm, not a "safe" state.
    return null;
  }
}

/** Invalidate the registry cache (call from the admin CMS after edits). */
export function invalidateSafetyRegistry() { cache = null; }

// ---------------------------------------------------------------------------
// screenText — classify BEFORE normal processing, log metadata, route response.
// ---------------------------------------------------------------------------
export async function screenText(text: unknown, ctx: ScreenContext): Promise<SafetyInterrupt | null> {
  if (typeof text !== "string" || !text.trim()) return null;
  const ruleSet = await loadRuleSet();
  if (!ruleSet || (!ruleSet.rules.length && !ruleSet.immediacyTerms.length)) return null;

  const result = classify(text, ruleSet);       // pure; raw text stays in memory
  const floor = ctx.minConfidenceLevel ?? 1;
  if (result.action_level < floor || result.action_level === 0) return null;

  await logEvent(result, ctx);                   // METADATA ONLY
  return buildInterrupt(result, ctx);
}

// ---------------------------------------------------------------------------
// Structured, version-stamped, no-raw-text event logging (items 10).
// ---------------------------------------------------------------------------
async function logEvent(c: Classification, ctx: ScreenContext): Promise<void> {
  const s = getSupabaseAdminClient();
  const actionable = c.findings.filter((f) => f.actionable);
  const top = actionable[0];
  try {
    await s.from("companion_safety_events").insert({
      user_id: ctx.userId,
      trigger_id: isUuid(top?.ruleId) ? top!.ruleId : null,
      matched_pattern: top?.canonical_concept ?? null,      // concept, NOT user text
      level: String(c.action_level),
      action_level: c.action_level,
      immediate_danger: c.immediate_danger,
      categories: c.categories,
      immediacy_kinds: c.immediacy_kinds,
      // structured per-finding metadata — no raw disclosure, ever.
      findings_meta: actionable.map((f) => ({
        rule_id: f.ruleId, category: f.risk_category, concept: f.canonical_concept,
        severity: f.severity, subject: f.subject, temporality: f.temporality,
      })),
      safety_engine_version: c.engine_version,
      registry_version: c.registry_version,
      context: ctx.context,
      situation_ref: ctx.situationRef ?? null,
      action: c.action_level >= 2 ? "interrupted" : "noticed",
    });
  } catch { /* audit is best-effort; never block the safety response */ }
}

function isUuid(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

// ---------------------------------------------------------------------------
// Response routing (item 8) + IPV digital-safety flag (item 11).
// ---------------------------------------------------------------------------
async function buildInterrupt(c: Classification, ctx: ScreenContext): Promise<SafetyInterrupt> {
  const s = getSupabaseAdminClient();
  const primaryLevel = String(c.action_level);           // 1 | 2 | 3
  const jurisdiction = ctx.jurisdiction ?? "US";
  const digital_safety = c.categories.some((k) => k === "ipv" || k === "sexual_coercion");

  const [{ data: resp }, resources] = await Promise.all([
    // Primary copy for the action level, plus the two layered notices (immediate
    // danger + digital safety), fetched together so we can compose them.
    s.from("companion_safety_responses")
      .select("level, heading, message, resource_intro, discreet_mode")
      .in("level", [primaryLevel, "immediate_danger", "digital_safety"]).eq("is_active", true),
    routeResources(c, jurisdiction),
  ]);
  const rows = (resp ?? []) as { level: string; heading: string | null; message: string | null; resource_intro: string | null; discreet_mode: boolean }[];
  const byLevel = (lv: string) => rows.find((r) => r.level === lv) ?? null;
  const primary = byLevel(primaryLevel);
  const immediateRow = byLevel("immediate_danger");
  const digitalRow = byLevel("digital_safety");

  const block = (r: typeof primary): SafetyNoticeBlock | null =>
    r && r.message ? { heading: r.heading, message: r.message } : null;

  return {
    action_level: c.action_level as 1 | 2 | 3,
    level: c.immediate_danger ? "immediate_danger" : primaryLevel,
    immediate_danger: c.immediate_danger,
    categories: c.categories,
    digital_safety,
    heading: primary?.heading ?? null,
    // Non-diagnostic, non-directive, NOT falsely reassuring — fallback only if the
    // clinician hasn't authored the level copy. Never asserts what the relationship
    // "is" and never says the person is safe.
    message: primary?.message ??
      "It sounds like something serious may be going on. This is an educational tool and can’t help in a crisis or monitor you in real time — the resources below can, whenever you’re ready.",
    resource_intro: primary?.resource_intro ?? null,
    immediate_notice: c.immediate_danger ? block(immediateRow) : null,
    digital_safety_notice: digital_safety ? block(digitalRow) : null,
    resources,
  };
}

/** Route resources by detected category + jurisdiction; add emergency on acute. */
async function routeResources(c: Classification, jurisdiction: string): Promise<SafetyResource[]> {
  const s = getSupabaseAdminClient();
  const wantKinds = resourceKindsFor(c.categories, { immediate: c.immediate_danger, undetermined: c.category_undetermined });
  try {
    const { data } = await s.from("companion_safety_resources")
      .select("id, name, description, contact, url, jurisdiction, hours, applies_to_categories, resource_kind, is_active, sort_order")
      .eq("is_active", true).order("sort_order", { ascending: true });
    return filterResources((data ?? []) as RoutableResource[], wantKinds, c.categories, jurisdiction)
      .map(({ id, name, description, contact, url, jurisdiction, hours }) =>
        ({ id, name, description, contact, url, jurisdiction, hours }));
  } catch { return []; }
}

/** Verified resources for the persistent "Get help" screen (category-agnostic). */
export async function getActiveResources(jurisdiction = "US"): Promise<SafetyResource[]> {
  const s = getSupabaseAdminClient();
  try {
    const { data } = await s.from("companion_safety_resources")
      .select("id, name, description, contact, url, jurisdiction, hours, is_active, sort_order")
      .eq("is_active", true).order("sort_order", { ascending: true });
    return ((data ?? []) as (SafetyResource & { is_active: boolean })[])
      .filter((r) => r.jurisdiction === jurisdiction || r.jurisdiction === "GLOBAL")
      .map(({ id, name, description, contact, url, jurisdiction, hours }) =>
        ({ id, name, description, contact, url, jurisdiction, hours }));
  } catch { return []; }
}
