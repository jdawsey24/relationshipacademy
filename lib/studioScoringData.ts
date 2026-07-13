import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  computeScores, deriveFindings, selectRecommendations,
  type ScoreItemDef, type ScoringRuleDef, type Band, type IncongruenceRuleDef, type RecMappingDef, type FindingRow,
} from "@/lib/studioScoring";

// Server integration for the deterministic scoring engine. Loads owner-authored
// rules/items, runs the pure engine, and persists a SIMULATION attempt + results.
// Resilient: returns empty structures if migration 0026 is absent.

export interface SimScope { type: "competency" | "domain"; id: string; }

async function loadItems(scope: SimScope): Promise<ScoreItemDef[]> {
  const s = getSupabaseAdminClient();
  let q = s.from("studio_assessment_items").select("item_id, competency_id, domain, phase, reverse_scored").limit(500);
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
    let q = s.from("studio_assessment_items").select("item_id, item_text, competency_id, reverse_scored").limit(60);
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
  provisional: true;
}

export async function runSimulation(input: {
  scope: SimScope; structuralContext: string | null; acknowledgedTransition?: string | null;
  responses: Record<string, number>; actor: string | null;
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
      responses: input.responses, kind: "simulation", created_by: input.actor,
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

  return { attempt_id: attemptId, scores, findings: allFindings, recommendations, provisional: true };
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
