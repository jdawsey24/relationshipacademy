import { getSupabaseAdminClient } from "@/lib/supabase";
import { generateResultNarrative, type NarrativeInput } from "@/lib/ai/resultNarrative";
import { getAttemptTrace } from "@/lib/studioScoringData";
import { domainLabel } from "@/lib/studioAssessment";
import { stableHash } from "@/lib/assembly";

// LIVE result narrative for a STUDIO instrument attempt (the /snapshot flagship
// and any /assess/[slug]). Mirrors lib/resultNarrativeLive.ts but grounds from
// the studio attempt trace (studio_assessment_attempts/findings) instead of the
// legacy quiz_* stack. Fully additive + resilient: every path returns null rather
// than throwing, so the results page always renders its deterministic report.
// Never sends email or raw responses to the model. Generate-once, cached.

// Cache reuses result_narratives (session_id is FK-free text); studio attempts are
// namespaced so they never collide with legacy session ids.
const CACHE_PREFIX = "studio:";

interface Finding { finding_type: string; finding_key: string; consumer_summary?: string }

async function buildStudioGrounding(attemptId: string): Promise<{ input: NarrativeInput; hash: string } | null> {
  const trace = await getAttemptTrace(attemptId);
  if (!trace) return null;
  const attempt = trace.attempt as Record<string, unknown>;
  const findings = (trace.findings as Finding[]) ?? [];

  const strengths = findings.filter((f) => f.finding_type === "strength").map((f) => domainLabel(f.finding_key)).filter(Boolean).slice(0, 2);
  const growthF = findings.find((f) => f.finding_type === "growth_priority");
  const growthArea = growthF ? domainLabel(growthF.finding_key) : null;

  // Phase alignment → consumer-facing phase name.
  let phaseAlignment: string | null = null;
  const phaseF = findings.find((f) => f.finding_type === "phase_alignment");
  if (phaseF) {
    const s = getSupabaseAdminClient();
    const { data: ph } = await s.from("competency_phases").select("consumer_name").eq("slug", phaseF.finding_key).maybeSingle();
    phaseAlignment = ((ph as Record<string, unknown> | null)?.consumer_name as string) || domainLabel(phaseF.finding_key);
  }

  const alignmentStatus = findings.some((f) => f.finding_type === "incongruence") ? "Incongruent" : "Congruent";
  const structuralContext = (attempt.structural_context as string) ?? null;
  const firstName = String(attempt.respondent_name ?? "").trim().split(/\s+/)[0] || null;

  const input: NarrativeInput = { firstName, structuralContext, phaseAlignment, alignmentStatus, strengths, growthArea, authoredSections: [] };
  const hash = stableHash({ structuralContext, strengths, growthArea, alignmentStatus });
  return { input, hash };
}

export interface StudioNarrative { sections: { heading: string; body: string }[] }

/** Cache-first. Generates ONCE per attempt; a safety-flagged or errored narrative
 *  returns null and is NOT cached (never shown to a consumer). */
export async function getOrCreateStudioNarrative(attemptId: string): Promise<StudioNarrative | null> {
  try {
    const s = getSupabaseAdminClient();
    const key = CACHE_PREFIX + attemptId;
    // A read ERROR means the cache table is absent → generate NOTHING (avoids
    // uncached regeneration). A null row (no error) → generate once.
    const { data: cached, error: cacheErr } = await s.from("result_narratives").select("sections").eq("session_id", key).maybeSingle();
    if (cacheErr) return null;
    if (cached) return { sections: ((cached as Record<string, unknown>).sections as { heading: string; body: string }[]) ?? [] };

    const grounding = await buildStudioGrounding(attemptId);
    if (!grounding) return null;

    const res = await generateResultNarrative(grounding.input);
    if (res.safety_status !== "ok" || res.sections.length === 0) return null;

    await s.from("result_narratives").upsert(
      { session_id: key, sections: res.sections, model: res.model, safety_status: res.safety_status, inputs_hash: grounding.hash, created_at: new Date().toISOString() },
      { onConflict: "session_id" }
    );
    return { sections: res.sections };
  } catch {
    return null;
  }
}
