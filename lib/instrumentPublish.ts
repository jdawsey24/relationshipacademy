import { getSupabaseAdminClient } from "@/lib/supabase";
import { slugify } from "@/lib/studio";

// Server layer for publishing a Studio-assembled instrument as a live consumer
// assessment. Publishing is READINESS-GATED: an instrument cannot go live until
// its scoring rules have established cut-points AND every membership item has
// consumer text — so no real respondent is ever scored on missing thresholds or
// shown raw authored item stems. Service-role only. Resilient.

export class PublishError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export interface ReadinessCheck { key: string; label: string; ok: boolean; detail: string }
export interface Readiness { ready: boolean; checks: ReadinessCheck[]; slug: string | null; live_enabled: boolean }

const SCORE_LEVELS = ["competency", "domain", "phase"] as const;

export async function publishReadiness(assessmentId: string): Promise<Readiness> {
  const checks: ReadinessCheck[] = [];
  let slug: string | null = null;
  let live_enabled = false;
  try {
    const s = getSupabaseAdminClient();

    const { data: assess } = await s.from("studio_assessments").select("public_slug, live_enabled").eq("assessment_id", assessmentId).maybeSingle();
    slug = (assess as Record<string, unknown> | null)?.public_slug as string ?? null;
    live_enabled = !!(assess as Record<string, unknown> | null)?.live_enabled;

    // 1) Approved assembled membership.
    const { data: mem } = await s.from("studio_assessment_membership")
      .select("item_id").eq("assessment_id", assessmentId).eq("status", "approved").eq("source", "assembled");
    const itemIds = (mem ?? []).map((r) => String((r as Record<string, unknown>).item_id));
    checks.push({ key: "membership", label: "Approved assembled item set", ok: itemIds.length > 0, detail: itemIds.length ? `${itemIds.length} items` : "No approved assembly — assemble & approve first" });

    // 2) Scoring cut-points established for the levels the engine uses.
    const { data: rules } = await s.from("studio_scoring_rules").select("level, cut_points");
    const levelHasBands = (lvl: string) => (rules ?? []).some((r) => {
      const x = r as Record<string, unknown>;
      return String(x.level ?? "").toLowerCase().includes(lvl) && Array.isArray(x.cut_points) && (x.cut_points as unknown[]).length > 0;
    });
    const missingLevels = SCORE_LEVELS.filter((l) => !levelHasBands(l));
    checks.push({ key: "cut_points", label: "Scoring cut-points established", ok: missingLevels.length === 0, detail: missingLevels.length ? `Missing bands for: ${missingLevels.join(", ")}` : "All levels have bands" });

    // 3) Consumer text present for every membership item.
    let missingText = itemIds.length;
    if (itemIds.length) {
      const { data: items } = await s.from("studio_assessment_items").select("item_id, consumer_item_text").in("item_id", itemIds);
      const rows = (items ?? []) as Record<string, unknown>[];
      const withText = rows.filter((i) => i.consumer_item_text != null && String(i.consumer_item_text).trim() !== "").length;
      missingText = itemIds.length - withText;
    }
    checks.push({ key: "consumer_text", label: "Consumer item text authored", ok: itemIds.length > 0 && missingText === 0, detail: missingText === 0 && itemIds.length ? "Every item has consumer text" : `${missingText} item(s) missing consumer text` });

    // 4) Results templates authored.
    const { count: tplCount } = await s.from("studio_results_templates").select("*", { count: "exact", head: true }).eq("assessment_id", assessmentId);
    checks.push({ key: "results_templates", label: "Results templates authored", ok: (tplCount ?? 0) > 0, detail: (tplCount ?? 0) > 0 ? `${tplCount} sections` : "No results templates — author consumer copy" });

    return { ready: checks.every((c) => c.ok), checks, slug, live_enabled };
  } catch {
    return { ready: false, checks: [{ key: "error", label: "Readiness", ok: false, detail: "Could not evaluate readiness (is migration 0030 applied?)" }], slug, live_enabled };
  }
}

export async function publishInstrument(assessmentId: string, actor: string | null): Promise<{ slug: string }> {
  const s = getSupabaseAdminClient();
  const r = await publishReadiness(assessmentId);
  if (!r.ready) throw new PublishError("Not ready to publish — resolve the readiness checklist first.", 409);
  const { data: assess } = await s.from("studio_assessments").select("name, public_slug").eq("assessment_id", assessmentId).maybeSingle();
  if (!assess) throw new PublishError("Assessment not found.", 404);
  const existing = (assess as Record<string, unknown>).public_slug as string | null;
  const slug = existing || slugify(String((assess as Record<string, unknown>).name ?? assessmentId)) || assessmentId.toLowerCase();
  const { error } = await s.from("studio_assessments").update({
    public_slug: slug, live_enabled: true, published_at: new Date().toISOString(), updated_at: new Date().toISOString(), updated_by: actor,
  }).eq("assessment_id", assessmentId);
  if (error) throw new PublishError(error.message, 500);
  return { slug };
}

export async function unpublishInstrument(assessmentId: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_assessments").update({ live_enabled: false, updated_at: new Date().toISOString(), updated_by: actor }).eq("assessment_id", assessmentId);
  if (error) throw new PublishError(error.message, 500);
}

export interface PublicInstrument {
  assessment_id: string;
  name: string;
  public_slug: string;
  purpose: string | null;
  estimated_time: string | null;
  intro_copy: Record<string, unknown>;
}

/** Resolve a PUBLISHED + live instrument by public slug. Null unless live. */
export async function getPublicInstrumentBySlug(slug: string): Promise<PublicInstrument | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_assessments")
      .select("assessment_id, name, public_slug, purpose, estimated_time, intro_copy, live_enabled")
      .eq("public_slug", slug).eq("live_enabled", true).maybeSingle();
    if (!data) return null;
    const x = data as Record<string, unknown>;
    return { assessment_id: String(x.assessment_id), name: String(x.name ?? ""), public_slug: String(x.public_slug), purpose: (x.purpose as string) ?? null, estimated_time: (x.estimated_time as string) ?? null, intro_copy: (x.intro_copy as Record<string, unknown>) ?? {} };
  } catch {
    return null;
  }
}

/** Any currently-live instrument (for the marketing site card). */
export async function listLiveInstruments(): Promise<PublicInstrument[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_assessments")
      .select("assessment_id, name, public_slug, purpose, estimated_time, intro_copy")
      .eq("live_enabled", true).not("public_slug", "is", null).order("published_at", { ascending: false });
    return ((data ?? []) as Record<string, unknown>[]).map((x) => ({ assessment_id: String(x.assessment_id), name: String(x.name ?? ""), public_slug: String(x.public_slug), purpose: (x.purpose as string) ?? null, estimated_time: (x.estimated_time as string) ?? null, intro_copy: (x.intro_copy as Record<string, unknown>) ?? {} }));
  } catch {
    return [];
  }
}
