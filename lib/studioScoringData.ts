import { getSupabaseAdminClient } from "@/lib/supabase";
import { domainLabel } from "@/lib/studioAssessment";
import {
  computeScores, deriveFindings, selectRecommendations,
  type ScoreItemDef, type ScoringRuleDef, type Band, type IncongruenceRuleDef, type RecMappingDef, type FindingRow,
} from "@/lib/studioScoring";

// Consumer-facing report: render the instrument's AUTHORED results templates
// (studio_results_templates: consumer_heading + consumer_copy_template with
// {{placeholders}}), filling placeholders from the engine's findings and resolving
// domain/phase codes to friendly names. This is the participant view — the copy is
// the owner's authored voice, not engine- or model-invented text.
export interface ConsumerSection { section_name: string; heading: string; body: string; }

async function buildConsumerReport(assessmentId: string, findings: FindingRow[], structuralContext: string | null): Promise<ConsumerSection[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data: tpls } = await s.from("studio_results_templates")
      .select("section_name, section_order, consumer_heading, consumer_copy_template")
      .eq("assessment_id", assessmentId).order("section_order");
    if (!tpls || tpls.length === 0) return [];
    const { data: phases } = await s.from("competency_phases").select("slug, consumer_name");
    const phaseConsumer = new Map((phases ?? []).map((p) => [String((p as Record<string, unknown>).slug), String((p as Record<string, unknown>).consumer_name ?? "")]));

    const strengths = findings.filter((f) => f.finding_type === "strength").map((f) => f.finding_key);
    const growth = findings.find((f) => f.finding_type === "growth_priority")?.finding_key;
    const phaseAlign = findings.find((f) => f.finding_type === "phase_alignment")?.finding_key;
    const nextStep = findings.find((f) => f.finding_type === "next_step");
    const rec = nextStep?.finding_key;

    const values: Record<string, string> = {
      structural_context: structuralContext || "your current stage",
      phase_translation: (phaseAlign && (phaseConsumer.get(phaseAlign) || domainLabel(phaseAlign))) || "your current phase",
      strength_1: strengths[0] ? domainLabel(strengths[0]) : "an area of strength",
      strength_2: strengths[1] ? domainLabel(strengths[1]) : "another area of strength",
      growth_area: growth ? domainLabel(growth) : "an area to grow",
      recommendation_name: rec && rec !== "an approved resource" ? rec : "a recommended resource",
    };
    const fill = (t: string) => t.replace(/\{\{\s*([a-z_0-9]+)\s*\}\}/gi, (_m, k: string) => values[k] ?? "").replace(/\s{2,}/g, " ").trim();
    return (tpls as Record<string, unknown>[])
      .map((t) => ({ section_name: String(t.section_name ?? ""), heading: fill(String(t.consumer_heading ?? "")), body: fill(String(t.consumer_copy_template ?? "")) }))
      .filter((x) => x.heading || x.body);
  } catch {
    return [];
  }
}

// Server integration for the deterministic scoring engine. Loads owner-authored
// rules/items, runs the pure engine, and persists a SIMULATION attempt + results.
// Resilient: returns empty structures if migration 0026 is absent.

export interface SimScope { type: "competency" | "domain" | "assessment"; id: string; }

// The approved assembled membership item ids for an instrument (Sandbox scope).
async function assessmentMemberItemIds(s: ReturnType<typeof getSupabaseAdminClient>, assessmentId: string): Promise<string[]> {
  const { data } = await s.from("studio_assessment_membership")
    .select("item_id").eq("assessment_id", assessmentId).eq("status", "approved").eq("source", "assembled").order("position");
  return (data ?? []).map((r) => String((r as Record<string, unknown>).item_id));
}

async function loadItems(scope: SimScope): Promise<ScoreItemDef[]> {
  const s = getSupabaseAdminClient();
  const sel = "item_id, competency_id, domain, phase, reverse_scored";
  if (scope.type === "assessment") {
    const ids = await assessmentMemberItemIds(s, scope.id);
    if (!ids.length) return [];
    const { data } = await s.from("studio_assessment_items").select(sel).in("item_id", ids);
    return ((data ?? []) as ScoreItemDef[]).map((x) => ({ ...x, scale_max: 5 }));
  }
  let q = s.from("studio_assessment_items").select(sel).limit(500);
  q = scope.type === "competency" ? q.eq("competency_id", scope.id) : q.eq("domain", scope.id);
  const { data } = await q;
  return ((data ?? []) as ScoreItemDef[]).map((x) => ({ ...x, scale_max: 5 }));
}

function parseBands(v: unknown): Band[] { return Array.isArray(v) ? (v as Band[]) : []; }

async function loadRuleByLevel(level: string): Promise<ScoringRuleDef | undefined> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("studio_scoring_rules").select("scoring_rule_id, score_name, level, min_valid_responses, cut_points, version, direction").ilike("level", `%${level}%`).limit(1);
  const r = data?.[0] as Record<string, unknown> | undefined;
  if (!r) return undefined;
  return { scoring_rule_id: String(r.scoring_rule_id), score_name: r.score_name as string, level: r.level as string, min_valid_responses: r.min_valid_responses as string, cut_points: parseBands(r.cut_points), version: (r.version as string) ?? "v1", direction: r.direction as string };
}

/** Item ids the item-picker / simulation should offer for a scope. */
export async function scopeItems(scope: SimScope): Promise<{ item_id: string; item_text: string; competency_id: string | null; reverse_scored: boolean }[]> {
  try {
    const s = getSupabaseAdminClient();
    const sel = "item_id, item_text, competency_id, reverse_scored";
    if (scope.type === "assessment") {
      const ids = await assessmentMemberItemIds(s, scope.id);
      if (!ids.length) return [];
      const { data } = await s.from("studio_assessment_items").select(sel).in("item_id", ids);
      const rows = (data ?? []) as { item_id: string; item_text: string; competency_id: string | null; reverse_scored: boolean }[];
      const order = new Map(ids.map((id, i) => [id, i]));
      return rows.sort((a, b) => (order.get(a.item_id) ?? 0) - (order.get(b.item_id) ?? 0));
    }
    let q = s.from("studio_assessment_items").select(sel).limit(60);
    q = scope.type === "competency" ? q.eq("competency_id", scope.id) : q.eq("domain", scope.id);
    const { data } = await q;
    return (data ?? []) as { item_id: string; item_text: string; competency_id: string | null; reverse_scored: boolean }[];
  } catch { return []; }
}

export interface SimResult {
  attempt_id: string | null;
  scores: ReturnType<typeof computeScores>;
  findings: (FindingRow & { id?: string })[];
  recommendations: ReturnType<typeof selectRecommendations>["recommendations"];
  consumerReport: ConsumerSection[];
  provisional: boolean;
}

export async function runSimulation(input: {
  scope: SimScope; structuralContext: string | null; acknowledgedTransition?: string | null;
  responses: Record<string, number>; actor: string | null;
  kind?: string; respondentName?: string | null; respondentEmail?: string | null;
}): Promise<SimResult> {
  const s = getSupabaseAdminClient();
  const [items, competencyRule, domainRule, phaseRule] = await Promise.all([
    loadItems(input.scope), loadRuleByLevel("competency"), loadRuleByLevel("domain"), loadRuleByLevel("phase"),
  ]);
  const scores = computeScores({ items, responses: input.responses, competencyRule, domainRule, phaseRule });

  const { data: incRows } = await s.from("studio_incongruence_rules").select("*").neq("status", "retired");
  const incongruenceRules = (incRows ?? []) as unknown as IncongruenceRuleDef[];
  const findings = deriveFindings({ structuralContext: input.structuralContext, acknowledgedTransition: input.acknowledgedTransition, scores, incongruenceRules });

  const { data: mapRows } = await s.from("studio_recommendation_mappings").select("mapping_id, trigger_type, trigger_value, competency_id, structural_context, phase_context, priority, recommendation_type, recommendation_id, suppression_logic, audience, status");
  const mappings = (mapRows ?? []) as RecMappingDef[];
  const { data: pubRows } = await s.from("publication_mappings").select("source_id").eq("status", "active");
  const published = new Set((pubRows ?? []).map((r) => String((r as { source_id: string }).source_id)));
  const { recommendations, nextStep } = selectRecommendations({ findings, mappings, structuralContext: input.structuralContext, isPublished: (_t, id) => (id ? published.has(id) : false) });
  const allFindings = nextStep ? [...findings, nextStep] : findings;

  // Persist the simulation attempt + traceable results.
  let attemptId: string | null = null;
  try {
    const { data: att } = await s.from("studio_assessment_attempts").insert({
      structural_context: input.structuralContext, acknowledged_transition: input.acknowledgedTransition ?? null,
      assessment_id: input.scope.type === "assessment" ? input.scope.id : null,
      responses: input.responses, kind: input.kind ?? "simulation", created_by: input.actor,
      respondent_name: input.respondentName ?? null, respondent_email: input.respondentEmail ?? null,
    }).select("id").maybeSingle();
    attemptId = (att as { id: string } | null)?.id ?? null;
    if (attemptId) {
      const srRows = scores.scoreResults.map((r) => ({ attempt_id: attemptId, scoring_rule_id: r.scoring_rule_id, score_name: r.score_name, score_level: r.score_level, entity_id: r.entity_id, raw_score: r.raw_score, transformed_score: r.transformed_score, valid_response_count: r.valid_response_count, confidence_status: r.confidence_status, rule_version: r.rule_version }));
      const { data: insertedSr } = await s.from("studio_score_results").insert(srRows).select("id, score_level, entity_id");
      const srMap = new Map<string, string>();
      for (const r of insertedSr ?? []) { const x = r as { id: string; score_level: string; entity_id: string }; srMap.set(`${x.score_level}:${x.entity_id}`, x.id); }

      const fRows = allFindings.map((f) => ({ attempt_id: attemptId, finding_type: f.finding_type, finding_key: f.finding_key, priority: f.priority, source_score_ids: f.source_refs.map((ref) => srMap.get(`${ref.score_level}:${ref.entity_id}`)).filter(Boolean), consumer_summary: f.consumer_summary }));
      const { data: insertedF } = await s.from("studio_assessment_findings").insert(fRows).select("id, finding_type");
      const nextStepId = (insertedF ?? []).find((r) => (r as { finding_type: string }).finding_type === "next_step")?.["id" as keyof object] as string | undefined;

      if (recommendations.length) {
        await s.from("studio_recommendation_results").insert(recommendations.map((r) => ({ attempt_id: attemptId, finding_id: nextStepId ?? null, recommendation_mapping_id: r.recommendation_mapping_id, asset_type: r.asset_type, asset_id: r.asset_id, rank: r.rank, suppression_status: r.suppression_status, suppression_reason: r.suppression_reason })));
      }
      // attach ids to returned findings for UI
      for (const f of allFindings as (FindingRow & { id?: string })[]) {
        const match = (insertedF ?? []).find((r) => (r as { finding_type: string }).finding_type === f.finding_type);
        if (match) (f as { id?: string }).id = (match as { id: string }).id;
      }
    }
  } catch {
    // persistence best-effort; the computed result is still returned
  }

  const consumerReport = input.scope.type === "assessment"
    ? await buildConsumerReport(input.scope.id, allFindings, input.structuralContext)
    : [];

  return { attempt_id: attemptId, scores, findings: allFindings, recommendations, consumerReport, provisional: (input.kind ?? "simulation") !== "live" };
}

// ---------------------------------------------------------------------------
// Live respondent scoring (the parallel published assessment). Same load +
// pure-engine + persist path as runSimulation, but records a real attempt
// (kind='live') with respondent identity. Readiness-gated instruments have
// validated cut-points, so provisional=false.
// ---------------------------------------------------------------------------
export async function runLiveScoring(input: {
  assessmentId: string; structuralContext: string | null; acknowledgedTransition?: string | null;
  responses: Record<string, number>; name: string | null; email: string | null;
}): Promise<SimResult> {
  return runSimulation({
    scope: { type: "assessment", id: input.assessmentId },
    structuralContext: input.structuralContext,
    acknowledgedTransition: input.acknowledgedTransition ?? null,
    responses: input.responses,
    actor: null,
    kind: "live",
    respondentName: input.name,
    respondentEmail: input.email,
  });
}

// Public results for a live attempt: the authored participant report + the
// deterministic outputs, resolved from a persisted attempt id.
export async function getLiveResults(attemptId: string): Promise<{ consumerReport: ConsumerSection[]; findings: unknown[]; scoreResults: unknown[]; recommendations: unknown[]; structuralContext: string | null } | null> {
  const trace = await getAttemptTrace(attemptId);
  if (!trace) return null;
  const attempt = trace.attempt as Record<string, unknown>;
  const assessmentId = String(attempt.assessment_id ?? "");
  const structuralContext = (attempt.structural_context as string) ?? null;
  const consumerReport = assessmentId ? await buildConsumerReport(assessmentId, trace.findings as unknown as FindingRow[], structuralContext) : [];
  return { consumerReport, findings: trace.findings, scoreResults: trace.scoreResults, recommendations: trace.recommendations, structuralContext };
}

// Items for the PUBLIC quiz of an assembled instrument: the approved membership
// in position order, surfacing consumer_item_text (falls back to item_text).
export interface PublicQuizItem { item_id: string; text: string; domain: string | null; phase: string | null; reverse_scored: boolean; }
export async function loadPublicQuizItems(assessmentId: string): Promise<PublicQuizItem[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data: mem } = await s.from("studio_assessment_membership")
      .select("item_id, position").eq("assessment_id", assessmentId).eq("status", "approved").eq("source", "assembled").order("position");
    const order = new Map((mem ?? []).map((r, i) => [String((r as Record<string, unknown>).item_id), (r as Record<string, unknown>).position as number ?? i]));
    const ids = [...order.keys()];
    if (!ids.length) return [];
    const { data } = await s.from("studio_assessment_items")
      .select("item_id, consumer_item_text, item_text, domain, phase, reverse_scored").in("item_id", ids);
    const rows = (data ?? []) as Record<string, unknown>[];
    return rows
      .map((x) => ({
        item_id: String(x.item_id),
        text: String((x.consumer_item_text as string) || (x.item_text as string) || ""),
        domain: (x.domain as string) ?? null,
        phase: (x.phase as string) ?? null,
        reverse_scored: !!x.reverse_scored,
      }))
      .sort((a, b) => (order.get(a.item_id) ?? 0) - (order.get(b.item_id) ?? 0));
  } catch {
    return [];
  }
}

export async function getAttemptTrace(attemptId: string) {
  try {
    const s = getSupabaseAdminClient();
    const { data: attempt } = await s.from("studio_assessment_attempts").select("*").eq("id", attemptId).maybeSingle();
    if (!attempt) return null;
    const [{ data: scoreResults }, { data: findings }, { data: recs }] = await Promise.all([
      s.from("studio_score_results").select("*").eq("attempt_id", attemptId).order("score_level"),
      s.from("studio_assessment_findings").select("*").eq("attempt_id", attemptId).order("priority"),
      s.from("studio_recommendation_results").select("*").eq("attempt_id", attemptId).order("rank"),
    ]);
    return { attempt, scoreResults: scoreResults ?? [], findings: findings ?? [], recommendations: recs ?? [] };
  } catch { return null; }
}
