import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  coverageTier, LIVE_VALIDATION_STATUS,
  type CoverageTier, type QuestionMap, type QuestionMapRow, type SnapshotQuestion,
} from "@/lib/questionMap";

// Server-only reads/writes for the governed Question→Indicator→Competency mapping
// layer. Service role (RLS-locked) + RESILIENT: if migration 0027 is absent every
// read returns empty and writes throw a clear error. Append-only governance:
// approved history is never deleted or overwritten. This module NEVER touches the
// live results/score request path — it only READS quiz_responses for descriptive
// aggregates.

export class MapError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// ---- reference reads ---------------------------------------------------------

/** The 47 live Snapshot questions, with derived domain/phase + measure_type. */
export async function listSnapshotQuestions(): Promise<SnapshotQuestion[]> {
  try {
    const s = getSupabaseAdminClient();
    const [{ data: qs }, { data: domains }, { data: phases }] = await Promise.all([
      s.from("questions").select("id, question_text, domain_id, competency_phase_id").eq("in_snapshot", true).order("id"),
      s.from("domains").select("id, slug"),
      s.from("competency_phases").select("id, slug, measure_type"),
    ]);
    const domainSlug = new Map((domains ?? []).map((d) => [String((d as Record<string, unknown>).id), String((d as Record<string, unknown>).slug ?? "")]));
    const phaseById = new Map((phases ?? []).map((p) => [String((p as Record<string, unknown>).id), p as Record<string, unknown>]));
    return (qs ?? []).map((q) => {
      const x = q as Record<string, unknown>;
      const ph = phaseById.get(String(x.competency_phase_id));
      return {
        id: String(x.id),
        question_text: (x.question_text as string) ?? null,
        domain_slug: domainSlug.get(String(x.domain_id)) ?? null,
        phase_slug: (ph?.slug as string) ?? null,
        measure_type: (ph?.measure_type as string) ?? null,
      };
    });
  } catch {
    return [];
  }
}

/** All mapping rows (incl. history), enriched with indicator + competency labels. */
export async function listQuestionMaps(): Promise<QuestionMap[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s.from("live_question_map").select("*").order("question_id").order("version_no", { ascending: false });
    if (error || !data) return [];
    const rows = data as unknown as QuestionMap[];
    const behaviorIds = [...new Set(rows.map((r) => r.behavior_id).filter(Boolean))] as string[];
    const compCodes = [...new Set(rows.map((r) => r.competency_id).filter(Boolean))] as string[];
    const [indicatorText, competencyName] = await Promise.all([
      (async () => {
        if (!behaviorIds.length) return new Map<string, string>();
        const { data: bi } = await s.from("studio_behavioral_indicators").select("behavior_id, indicator").in("behavior_id", behaviorIds);
        return new Map((bi ?? []).map((r) => [String((r as Record<string, unknown>).behavior_id), String((r as Record<string, unknown>).indicator ?? "")]));
      })(),
      (async () => {
        if (!compCodes.length) return new Map<string, string>();
        const { data: kb } = await s.from("kb_competencies").select("code, name").in("code", compCodes);
        return new Map((kb ?? []).map((r) => [String((r as Record<string, unknown>).code), String((r as Record<string, unknown>).name ?? "")]));
      })(),
    ]);
    for (const r of rows) {
      r.indicator_text = r.behavior_id ? indicatorText.get(r.behavior_id) ?? null : null;
      r.competency_name = r.competency_id ? competencyName.get(r.competency_id) ?? null : null;
    }
    return rows;
  } catch {
    return [];
  }
}

/** Questions joined to their current approved mapping + latest draft + history count. */
export async function getQuestionMapRows(): Promise<QuestionMapRow[]> {
  const [questions, maps] = await Promise.all([listSnapshotQuestions(), listQuestionMaps()]);
  return questions.map((question) => {
    const forQ = maps.filter((m) => m.question_id === question.id);
    const current = forQ.find((m) => m.status === "approved" && !m.effective_to) ?? null;
    const draft = forQ.filter((m) => m.status === "draft").sort((a, b) => b.version_no - a.version_no)[0] ?? null;
    const historyCount = forQ.filter((m) => m.status === "superseded" || m.status === "retired").length;
    return { question, current, draft, historyCount };
  });
}

async function activeAssessmentVersion(s: ReturnType<typeof getSupabaseAdminClient>): Promise<{ id: string | null; label: string | null }> {
  try {
    const { data } = await s.from("assessment_versions").select("id, version_label").is("active_to", null).limit(1);
    const r = data?.[0] as { id?: string; version_label?: string } | undefined;
    return { id: r?.id ?? null, label: r?.version_label ?? null };
  } catch {
    return { id: null, label: null };
  }
}

// ---- governed writes ---------------------------------------------------------

export interface DraftInput {
  question_id: string;
  mapping_kind: "indicator" | "competency_direct";
  behavior_id?: string | null;
  competency_id?: string | null;
  exception_reason?: string | null;
  rationale?: string | null;
  confidence_level?: string | null;
  actor: string | null;
}

/** Create a DRAFT mapping. For indicator mappings, competency_id is derived from
 *  the indicator (authoritative). Direct-to-competency requires an exception and
 *  is marked scoring_ineligible. */
export async function createDraftMapping(input: DraftInput): Promise<QuestionMap> {
  const s = getSupabaseAdminClient();
  let competency_id = input.competency_id ?? null;
  let scoring_eligible = true;

  if (input.mapping_kind === "indicator") {
    if (!input.behavior_id) throw new MapError("Select a behavioral indicator.");
    const { data: bi } = await s.from("studio_behavioral_indicators").select("competency_id").eq("behavior_id", input.behavior_id).maybeSingle();
    competency_id = (bi as { competency_id?: string } | null)?.competency_id ?? null;
    if (!competency_id) throw new MapError("That indicator has no competency.", 422);
  } else {
    if (!competency_id) throw new MapError("Select a competency.");
    if (!input.exception_reason?.trim()) throw new MapError("A documented exception reason is required to map a question directly to a competency.", 422);
    scoring_eligible = false; // excluded from future validated scoring by default
  }

  const { data: existing } = await s.from("live_question_map").select("version_no").eq("question_id", input.question_id).order("version_no", { ascending: false }).limit(1);
  const nextVersion = ((existing?.[0] as { version_no?: number } | undefined)?.version_no ?? 0) + 1;
  const { id: assessment_version_id } = await activeAssessmentVersion(s);

  const row = {
    question_id: input.question_id,
    behavior_id: input.mapping_kind === "indicator" ? input.behavior_id : null,
    competency_id,
    mapping_kind: input.mapping_kind,
    exception_reason: input.mapping_kind === "competency_direct" ? input.exception_reason : null,
    scoring_eligible,
    rationale: input.rationale ?? null,
    confidence_level: input.confidence_level ?? null,
    assessment_version_id,
    status: "draft",
    version_no: nextVersion,
    created_by: input.actor,
  };
  const { data, error } = await s.from("live_question_map").insert(row).select("*").maybeSingle();
  if (error || !data) throw new MapError(error?.message ?? "Could not save the draft mapping.", 500);
  return data as unknown as QuestionMap;
}

/** Approve a draft (owner). Supersedes ALL current approved rows for the same
 *  question (V1 = one current mapping per question); approved history is preserved
 *  via effective_to, never deleted. */
export async function approveMapping(id: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: draft } = await s.from("live_question_map").select("id, question_id, status").eq("id", id).maybeSingle();
  const d = draft as { id: string; question_id: string; status: string } | null;
  if (!d) throw new MapError("Mapping not found.", 404);
  if (d.status !== "draft") throw new MapError("Only a draft mapping can be approved.", 409);
  const now = new Date().toISOString();
  // Supersede prior current-approved rows for this question.
  await s.from("live_question_map").update({ status: "superseded", effective_to: now, updated_at: now })
    .eq("question_id", d.question_id).eq("status", "approved").is("effective_to", null);
  const { error } = await s.from("live_question_map").update({ status: "approved", approved_by: actor, effective_from: now, updated_at: now }).eq("id", id);
  if (error) throw new MapError(error.message, 500);
}

/** Retire an approved or draft mapping (owner). History preserved. */
export async function retireMapping(id: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: row } = await s.from("live_question_map").select("status").eq("id", id).maybeSingle();
  const st = (row as { status?: string } | null)?.status;
  if (!st) throw new MapError("Mapping not found.", 404);
  if (st === "superseded" || st === "retired") throw new MapError("Already inactive.", 409);
  const now = new Date().toISOString();
  const { error } = await s.from("live_question_map").update({ status: "retired", effective_to: now, reviewed_by: actor, updated_at: now }).eq("id", id);
  if (error) throw new MapError(error.message, 500);
}

/** Delete a mapping — DRAFT only. Approved/superseded/retired history is immutable. */
export async function deleteDraftMapping(id: string): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: row } = await s.from("live_question_map").select("status").eq("id", id).maybeSingle();
  const st = (row as { status?: string } | null)?.status;
  if (!st) throw new MapError("Mapping not found.", 404);
  if (st !== "draft") throw new MapError("Only draft mappings can be deleted; approved history is immutable.", 409);
  const { error } = await s.from("live_question_map").delete().eq("id", id);
  if (error) throw new MapError(error.message, 500);
}

// ---- descriptive read (Analytics) -------------------------------------------

export interface CompetencyLiveSummary {
  mappedQuestions: number;        // distinct compatible question ids
  mappedIndicators: number;       // distinct behavior ids
  contributingSessions: number;   // distinct sessions with responses
  excludedIncompatible: number;   // mapped questions excluded by the response-model gate
  directExcluded: number;         // approved direct-to-competency mappings (scoring-ineligible)
  descriptiveMean: number | null; // 1–5, DESCRIPTIVE not a validated score
  coverageTier: CoverageTier;
  assessmentVersion: string | null;
  mappingVersion: number | null;
  validationStatus: string;       // always exploratory
  updatedAt: string | null;
}

const EMPTY_SUMMARY: CompetencyLiveSummary = {
  mappedQuestions: 0, mappedIndicators: 0, contributingSessions: 0, excludedIncompatible: 0,
  directExcluded: 0, descriptiveMean: null, coverageTier: "no_coverage",
  assessmentVersion: null, mappingVersion: null, validationStatus: LIVE_VALIDATION_STATUS, updatedAt: null,
};

/** Descriptive summary of live responses mapped to a competency. Applies the
 *  response-model compatibility gate (competency-phase items only; scoring-eligible
 *  only) BEFORE aggregating. Never presented as a validated score. */
export async function getCompetencyLiveSummary(code: string): Promise<CompetencyLiveSummary> {
  try {
    const s = getSupabaseAdminClient();
    const { data: mapRows } = await s
      .from("live_question_map")
      .select("question_id, behavior_id, weight, mapping_kind, scoring_eligible, version_no")
      .eq("competency_id", code)
      .eq("status", "approved")
      .is("effective_to", null);
    const approved = (mapRows ?? []) as Array<Record<string, unknown>>;
    if (approved.length === 0) return { ...EMPTY_SUMMARY };

    const directExcluded = approved.filter((r) => r.mapping_kind === "competency_direct").length;

    // Response-model compatibility: only competency-phase (not risk) questions.
    const questions = await listSnapshotQuestions();
    const measureByQ = new Map(questions.map((q) => [q.id, q.measure_type]));

    const compatible = approved.filter((r) => r.scoring_eligible === true && measureByQ.get(String(r.question_id)) === "competency");
    const excludedIncompatible = new Set(approved.map((r) => String(r.question_id))).size - new Set(compatible.map((r) => String(r.question_id))).size;

    const weightByQuestion = new Map<string, number>();
    for (const r of compatible) weightByQuestion.set(String(r.question_id), Number(r.weight) || 1);
    const questionIds = [...weightByQuestion.keys()];
    const mappedIndicators = new Set(compatible.map((r) => r.behavior_id).filter(Boolean)).size;
    const mappingVersion = approved.reduce((m, r) => Math.max(m, Number(r.version_no) || 0), 0) || null;

    let descriptiveMean: number | null = null;
    let contributingSessions = 0;
    let updatedAt: string | null = null;
    if (questionIds.length) {
      const { data: resp } = await s.from("quiz_responses").select("session_id, question_id, scored_value, created_at").in("question_id", questionIds).limit(20000);
      const rows = (resp ?? []) as Array<Record<string, unknown>>;
      // Weighted mean per session, then average across sessions.
      const perSession = new Map<string, { wsum: number; w: number }>();
      for (const r of rows) {
        const sid = String(r.session_id);
        const val = Number(r.scored_value);
        if (Number.isNaN(val)) continue;
        const w = weightByQuestion.get(String(r.question_id)) ?? 1;
        const acc = perSession.get(sid) ?? { wsum: 0, w: 0 };
        acc.wsum += w * val; acc.w += w;
        perSession.set(sid, acc);
        const ts = String(r.created_at ?? "");
        if (ts && (!updatedAt || ts > updatedAt)) updatedAt = ts;
      }
      const sessionMeans = [...perSession.values()].filter((a) => a.w > 0).map((a) => a.wsum / a.w);
      contributingSessions = sessionMeans.length;
      if (sessionMeans.length) descriptiveMean = Math.round((sessionMeans.reduce((a, b) => a + b, 0) / sessionMeans.length) * 100) / 100;
    }

    const { label } = await activeAssessmentVersion(s);
    const mappedQuestions = questionIds.length;
    return {
      mappedQuestions, mappedIndicators, contributingSessions, excludedIncompatible, directExcluded,
      descriptiveMean, coverageTier: coverageTier(mappedQuestions),
      assessmentVersion: label, mappingVersion, validationStatus: LIVE_VALIDATION_STATUS, updatedAt,
    };
  } catch {
    return { ...EMPTY_SUMMARY };
  }
}

/** How many of the 47 questions have a current approved mapping. */
export async function mappingCoverage(): Promise<{ mapped: number; total: number }> {
  try {
    const rows = await getQuestionMapRows();
    return { mapped: rows.filter((r) => r.current).length, total: rows.length };
  } catch {
    return { mapped: 0, total: 0 };
  }
}
