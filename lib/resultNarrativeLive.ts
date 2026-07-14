import { getSupabaseAdminClient } from "@/lib/supabase";
import { generateResultNarrative, type NarrativeInput } from "@/lib/ai/resultNarrative";
import { stableHash } from "@/lib/assembly";

// Server layer for the LIVE result narrative (Phase 2). Re-derives grounding from
// the session's STORED deterministic results INDEPENDENTLY — so app/api/results,
// app/api/score, and lib/scoring.ts stay byte-for-byte untouched. Fully resilient:
// every path returns null rather than throwing, so the results page always renders
// the deterministic report. Never sends email or raw responses to the model.

export interface GroundingResult { input: NarrativeInput; hash: string; completed: boolean }

export async function buildNarrativeGrounding(sessionId: string): Promise<GroundingResult | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data: session } = await s.from("quiz_sessions").select("id, name, completed_at").eq("id", sessionId).maybeSingle();
    if (!session) return null;
    const sess = session as Record<string, unknown>;
    const completed = !!sess.completed_at;

    // Structural context (self-selected phase).
    let structuralContext: string | null = null;
    const { data: sel } = await s.from("structural_phase_selection").select("structural_phase_id").eq("session_id", sessionId).maybeSingle();
    if (sel) {
      const { data: sp } = await s.from("structural_phases").select("*").eq("id", (sel as Record<string, unknown>).structural_phase_id).maybeSingle();
      const x = (sp ?? {}) as Record<string, unknown>;
      structuralContext = (x.consumer_name as string) || (x.name as string) || null;
    }

    // Domain scores → strengths (top 2) + growth area (lowest), by name.
    let strengths: string[] = [];
    let growthArea: string | null = null;
    const { data: ds } = await s.from("domain_scores").select("domain_id, average_score").eq("session_id", sessionId);
    const dsRows = (ds ?? []) as { domain_id: string; average_score: number }[];
    if (dsRows.length) {
      const { data: doms } = await s.from("domains").select("id, name").in("id", dsRows.map((d) => d.domain_id));
      const nameById = new Map((doms ?? []).map((d) => [String((d as Record<string, unknown>).id), String((d as Record<string, unknown>).name ?? "")]));
      const sorted = [...dsRows].sort((a, b) => b.average_score - a.average_score);
      strengths = sorted.slice(0, 2).map((d) => nameById.get(d.domain_id) || "").filter(Boolean);
      const lowest = sorted[sorted.length - 1];
      growthArea = lowest ? nameById.get(lowest.domain_id) || null : null;
    }

    // Alignment.
    let alignmentStatus: string | null = null;
    let phaseAlignment: string | null = null;
    const { data: al } = await s.from("alignment_results").select("alignment_status, interpretation_text").eq("session_id", sessionId).maybeSingle();
    if (al) {
      alignmentStatus = ((al as Record<string, unknown>).alignment_status as string) ?? null;
      phaseAlignment = ((al as Record<string, unknown>).interpretation_text as string) ?? null;
    }

    const firstName = String(sess.name ?? "").trim().split(/\s+/)[0] || null;
    const input: NarrativeInput = { firstName, structuralContext, phaseAlignment, alignmentStatus, strengths, growthArea, authoredSections: [] };
    const hash = stableHash({ structuralContext, strengths, growthArea, alignmentStatus });
    return { input, hash, completed };
  } catch {
    return null;
  }
}

export interface LiveNarrative { sections: { heading: string; body: string }[] }

/** Cache-first. Generates ONCE per completed session; a safety-flagged or errored
 *  narrative returns null and is NOT cached (never shown to a consumer). */
export async function getOrCreateLiveNarrative(sessionId: string): Promise<LiveNarrative | null> {
  try {
    const s = getSupabaseAdminClient();
    // A read ERROR means the cache table is absent (migration 0029 not yet run) →
    // treat as not-ready and generate NOTHING (avoids uncached regeneration if the
    // flag is enabled before the migration). A null row (no error) → generate once.
    const { data: cached, error: cacheErr } = await s.from("result_narratives").select("sections").eq("session_id", sessionId).maybeSingle();
    if (cacheErr) return null;
    if (cached) return { sections: ((cached as Record<string, unknown>).sections as { heading: string; body: string }[]) ?? [] };

    const grounding = await buildNarrativeGrounding(sessionId);
    if (!grounding || !grounding.completed) return null; // only real completed sessions generate

    const res = await generateResultNarrative(grounding.input);
    if (res.safety_status !== "ok" || res.sections.length === 0) return null; // never cache/show flagged

    await s.from("result_narratives").upsert(
      { session_id: sessionId, sections: res.sections, model: res.model, safety_status: res.safety_status, inputs_hash: grounding.hash, created_at: new Date().toISOString() },
      { onConflict: "session_id" }
    );
    return { sections: res.sections };
  } catch {
    return null;
  }
}
