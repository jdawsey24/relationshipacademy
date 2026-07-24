import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only CRUD for the Safety V2 registry CMS (clinician/owner-authored).
// All writes go through the OWNER admin routes (requireOwner + audit). Content =
// trigger rules, immediacy terms, response copy, verified resources; plus a
// read-only METADATA-ONLY event log (never raw learner text). New rules are
// created INACTIVE — activation is an explicit, separate action.

const now = () => new Date().toISOString();

// ---- Trigger rules ----
const TRIGGER_COLS = "id, pattern, match_type, risk_category, canonical_concept, severity, context_required, negation_sensitive, registry_version, is_active, notes, created_by, updated_by, created_at, updated_at";

export async function listTriggers() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_triggers").select(TRIGGER_COLS).order("risk_category").order("created_at", { ascending: false });
  return data ?? [];
}
export async function createTrigger(p: Record<string, unknown>) {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("companion_safety_triggers").insert({
    pattern: String(p.pattern ?? "").trim(),
    match_type: (p.match_type as string) ?? "phrase",
    risk_category: (p.risk_category as string) ?? null,
    canonical_concept: (p.canonical_concept as string) ?? null,
    severity: p.severity != null ? Number(p.severity) : null,
    context_required: p.context_required != null ? Boolean(p.context_required) : true,
    negation_sensitive: p.negation_sensitive != null ? Boolean(p.negation_sensitive) : true,
    registry_version: (p.registry_version as string) || "2.0.1",
    is_active: false,                       // created inactive (guardrail 7)
    notes: (p.notes as string) ?? null,
    created_by: (p.actor as string) ?? null,
    updated_by: (p.actor as string) ?? null,
  }).select(TRIGGER_COLS).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
export async function updateTrigger(id: string, patch: Record<string, unknown>, actor: string | null) {
  const s = getSupabaseAdminClient();
  const allowed = ["pattern", "match_type", "risk_category", "canonical_concept", "severity", "context_required", "negation_sensitive", "registry_version", "is_active", "notes"];
  const clean: Record<string, unknown> = { updated_at: now(), updated_by: actor };
  for (const k of allowed) if (k in patch) clean[k] = patch[k];
  const { error } = await s.from("companion_safety_triggers").update(clean).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function getTrigger(id: string) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_triggers").select(TRIGGER_COLS).eq("id", id).maybeSingle();
  return data;
}
/** A rule referenced by a historical safety event must not be hard-deleted (9). */
export async function triggerReferencedByEvents(id: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { count } = await s.from("companion_safety_events").select("id", { count: "exact", head: true }).eq("trigger_id", id);
  return (count ?? 0) > 0;
}
export async function deleteTrigger(id: string) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_triggers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- Immediacy terms ----
const IMM_COLS = "id, pattern, match_type, kind, implies_category, registry_version, is_active, notes, created_by, updated_by, created_at, updated_at";
export async function listImmediacy() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_immediacy_terms").select(IMM_COLS).order("kind").order("created_at", { ascending: false });
  return data ?? [];
}
export async function createImmediacy(p: Record<string, unknown>) {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("companion_safety_immediacy_terms").insert({
    pattern: String(p.pattern ?? "").trim(),
    match_type: (p.match_type as string) ?? "phrase",
    kind: (p.kind as string) ?? null,
    implies_category: (p.implies_category as string) || null,
    registry_version: (p.registry_version as string) || "2.0.1",
    is_active: false,
    notes: (p.notes as string) ?? null,
    created_by: (p.actor as string) ?? null,
    updated_by: (p.actor as string) ?? null,
  }).select(IMM_COLS).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
export async function updateImmediacy(id: string, patch: Record<string, unknown>, actor: string | null) {
  const s = getSupabaseAdminClient();
  const allowed = ["pattern", "match_type", "kind", "implies_category", "registry_version", "is_active", "notes"];
  const clean: Record<string, unknown> = { updated_at: now(), updated_by: actor };
  for (const k of allowed) if (k in patch) clean[k] = (k === "implies_category" && patch[k] === "") ? null : patch[k];
  const { error } = await s.from("companion_safety_immediacy_terms").update(clean).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function getImmediacy(id: string) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_immediacy_terms").select(IMM_COLS).eq("id", id).maybeSingle();
  return data;
}
export async function deleteImmediacy(id: string) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_immediacy_terms").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- Response copy (one per protocol level) ----
export async function listResponses() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_responses").select("level, heading, message, resource_intro, discreet_mode, is_active, updated_by, updated_at").order("level");
  return data ?? [];
}
export async function upsertResponse(p: Record<string, unknown>, actor: string | null) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_responses").upsert({
    level: String(p.level), heading: (p.heading as string) ?? null, message: String(p.message ?? ""),
    resource_intro: (p.resource_intro as string) ?? null, discreet_mode: Boolean(p.discreet_mode),
    is_active: p.is_active != null ? Boolean(p.is_active) : true, updated_by: actor, updated_at: now(),
  }, { onConflict: "level" });
  if (error) throw new Error(error.message);
}

// ---- Resources ----
const RES_COLS = "id, name, description, contact, url, jurisdiction, hours, applies_to_categories, resource_kind, applies_to_levels, sort_order, is_active, verified_at, verified_by, source, updated_at";
export async function listResources() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_resources").select(RES_COLS).order("sort_order", { ascending: true });
  return data ?? [];
}
export async function createResource(p: Record<string, unknown>) {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("companion_safety_resources").insert({
    name: String(p.name ?? "").trim(), description: (p.description as string) ?? null, contact: (p.contact as string) ?? null, url: (p.url as string) ?? null,
    jurisdiction: (p.jurisdiction as string) || "US", hours: (p.hours as string) ?? null,
    applies_to_categories: (p.applies_to_categories as string[]) ?? [], resource_kind: (p.resource_kind as string) || null,
    applies_to_levels: (p.applies_to_levels as string[]) ?? [], sort_order: Number(p.sort_order ?? 0),
    is_active: false, source: (p.source as string) ?? null,
    verified_at: (p.verified_at as string) ?? null, verified_by: (p.verified_by as string) ?? null,
  }).select(RES_COLS).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
export async function updateResource(id: string, patch: Record<string, unknown>, _actor: string | null) {
  const s = getSupabaseAdminClient();
  const allowed = ["name", "description", "contact", "url", "jurisdiction", "hours", "applies_to_categories", "resource_kind", "applies_to_levels", "sort_order", "is_active", "verified_at", "verified_by", "source"];
  const clean: Record<string, unknown> = { updated_at: now() };
  for (const k of allowed) if (k in patch) clean[k] = patch[k];
  const { error } = await s.from("companion_safety_resources").update(clean).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function deleteResource(id: string) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_resources").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- Safety events (READ-ONLY, METADATA ONLY — never raw learner text) ----
export async function listSafetyEvents(limit = 100) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_events")
    .select("id, matched_pattern, level, action_level, immediate_danger, categories, context, situation_ref, action, safety_engine_version, registry_version, created_at")
    .order("created_at", { ascending: false }).limit(limit);
  return data ?? [];
}
