import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only. V1 lightweight safety layer: screen free-text learner input
// against the clinician-authored trigger library; on a match, return the
// supportive response + verified resources and log a METADATA-ONLY audit event.
// NO clinical content lives here — patterns/messages/resources are authored in
// the admin CMS. This module only matches + serves + logs.

export interface SafetyResource {
  id: string; name: string; description: string | null; contact: string | null;
  url: string | null; jurisdiction: string; hours: string | null;
}
export interface SafetyInterrupt {
  level: string;
  heading: string | null;
  message: string;
  resource_intro: string | null;
  resources: SafetyResource[];
}
export interface ScreenContext {
  userId: string;
  context: string;        // "experience" | "blueprint" | "journal" | "planner"
  situationRef?: string | null;
}

interface TriggerRow { id: string; pattern: string; match_type: string; level: string }

function matches(text: string, t: TriggerRow): boolean {
  const hay = text.toLowerCase();
  const needle = t.pattern.toLowerCase().trim();
  if (!needle) return false;
  if (t.match_type === "regex") {
    try { return new RegExp(t.pattern, "i").test(text); } catch { return false; }
  }
  if (t.match_type === "phrase") return hay.includes(needle);
  // keyword: whole-word match (avoid substring false-positives)
  return new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i").test(hay);
}

/**
 * Screen a piece of learner free-text. Returns a SafetyInterrupt if a trigger
 * fires (and logs a metadata-only event), else null. Fails OPEN on infra errors
 * for reads but is defensive: any classifier uncertainty is out of scope in V1.
 */
export async function screenText(text: unknown, ctx: ScreenContext): Promise<SafetyInterrupt | null> {
  if (typeof text !== "string" || !text.trim()) return null;
  const s = getSupabaseAdminClient();

  let triggers: TriggerRow[] = [];
  try {
    const { data } = await s.from("companion_safety_triggers")
      .select("id, pattern, match_type, level").eq("is_active", true);
    triggers = (data ?? []) as TriggerRow[];
  } catch { return null; }
  if (!triggers.length) return null;

  const hit = triggers.find((t) => matches(text, t));
  if (!hit) return null;

  // Log the event — METADATA ONLY (never the learner's text).
  try {
    await s.from("companion_safety_events").insert({
      user_id: ctx.userId, trigger_id: hit.id, matched_pattern: hit.pattern,
      level: hit.level, context: ctx.context, situation_ref: ctx.situationRef ?? null, action: "interrupted",
    });
  } catch { /* audit is best-effort; never block the safety response */ }

  return buildInterrupt(hit.level);
}

/** Assemble the supportive response + resources for a level. */
async function buildInterrupt(level: string): Promise<SafetyInterrupt> {
  const s = getSupabaseAdminClient();
  const [{ data: resp }, resources] = await Promise.all([
    s.from("companion_safety_responses").select("heading, message, resource_intro").eq("level", level).eq("is_active", true).maybeSingle(),
    getActiveResources(level),
  ]);
  const r = resp as { heading: string | null; message: string | null; resource_intro: string | null } | null;
  return {
    level,
    heading: r?.heading ?? null,
    // Safe fallback ONLY if the clinician hasn't authored a message yet — generic,
    // non-diagnostic, non-directive. She overrides this in the CMS.
    message: r?.message ?? "It sounds like you may be going through something serious. This is an educational tool and isn’t able to help in a crisis — please reach out to one of the resources below or a trusted person.",
    resource_intro: r?.resource_intro ?? null,
    resources,
  };
}

/** Active verified resources for a level (used by the interrupt + the persistent "Get help" screen). */
export async function getActiveResources(level = "high_risk"): Promise<SafetyResource[]> {
  const s = getSupabaseAdminClient();
  try {
    const { data } = await s.from("companion_safety_resources")
      .select("id, name, description, contact, url, jurisdiction, hours, applies_to_levels, sort_order")
      .eq("is_active", true).order("sort_order", { ascending: true });
    return ((data ?? []) as (SafetyResource & { applies_to_levels: string[] })[])
      .filter((r) => r.applies_to_levels?.includes(level) ?? true)
      .map(({ id, name, description, contact, url, jurisdiction, hours }) => ({ id, name, description, contact, url, jurisdiction, hours }));
  } catch { return []; }
}
