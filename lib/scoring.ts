// Pure scoring functions for the Relationship Life Cycle™ assessment.
//
// These functions contain NO database or network access. They take plain data
// (responses + reference tables) and return computed results, so they can be
// unit-tested in isolation. The API route (app/api/score/route.ts) is
// responsible for loading reference data from Supabase and persisting results.

import type {
  AlignmentResult,
  AlignmentStatus,
  CompetencyPhase,
  CompetencyPhaseScore,
  Domain,
  DomainScore,
  ExpirationRiskResult,
  Question,
  ResultLevel,
  RiskLevel,
  ScoreDirection,
  ScoreRequestResponse,
  StructuralPhaseSlug,
} from "@/types/assessment";

export const EXPIRATION_RISK_SLUG = "expiration_risk";
export const EXPIRATION_STRUCTURAL_SLUG = "expiration";

/**
 * Congruence threshold on the 1–5 competency scale. A competency score for the
 * self-selected phase at or above this value (Strength / Healthy Development) is
 * Congruent; below it (Growth Opportunity / Needs Attention) is Incongruent.
 */
export const CONGRUENCE_SCORE_THRESHOLD = 3.25;

/** Structural phases that map to a competency phase for alignment. */
const COMPETENCY_STRUCTURAL_SLUGS: ReadonlySet<string> = new Set([
  "exploration",
  "exclusivity",
  "expansion",
]);

/**
 * Step 1 — scored value for a single item.
 * forward: scored = raw
 * reverse: scored = 6 - raw
 */
export function scoreItem(
  rawResponse: number,
  direction: ScoreDirection
): number {
  return direction === "reverse" ? 6 - rawResponse : rawResponse;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

/**
 * Resolve a score against a set of threshold bands. A band matches when
 * score_min <= score <= score_max. The score is rounded to 2 decimals first so
 * a raw average like 2.495 lands cleanly in a band defined to 2 decimals (the
 * bands have 0.01 gaps, e.g. [.., 2.49] then [2.50, ..]). Returns the matching
 * band, or null if none match.
 */
function resolveBand<T extends { score_min: number; score_max: number }>(
  score: number,
  bands: T[]
): T | null {
  const rounded = Math.round(score * 100) / 100;
  for (const band of bands) {
    if (rounded >= band.score_min && rounded <= band.score_max) {
      return band;
    }
  }
  return null;
}

/** Build a lookup of scored values keyed by question id (after Step 1). */
function buildScoredByQuestion(
  responses: ScoreRequestResponse[],
  questionsById: Map<string, Question>
): Map<string, number> {
  const scored = new Map<string, number>();
  for (const r of responses) {
    const q = questionsById.get(r.question_id);
    if (!q) continue; // ignore responses to unknown questions
    scored.set(r.question_id, scoreItem(r.raw_response, q.score_direction));
  }
  return scored;
}

/**
 * Step 2 — domain averages. One row per domain that has at least one answered
 * item.
 */
export function computeDomainScores(
  responses: ScoreRequestResponse[],
  questions: Question[],
  domains: Domain[],
  resultLevels: ResultLevel[]
): DomainScore[] {
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const scoredByQuestion = buildScoredByQuestion(responses, questionsById);
  const domainsById = new Map(domains.map((d) => [d.id, d]));

  const valuesByDomain = new Map<string, number[]>();
  for (const r of responses) {
    const q = questionsById.get(r.question_id);
    if (!q) continue;
    const scored = scoredByQuestion.get(r.question_id);
    if (scored === undefined) continue;
    const bucket = valuesByDomain.get(q.domain_id) ?? [];
    bucket.push(scored);
    valuesByDomain.set(q.domain_id, bucket);
  }

  const out: DomainScore[] = [];
  for (const [domainId, values] of valuesByDomain) {
    const avg = average(values);
    const band = resolveBand(avg, resultLevels);
    out.push({
      domain_id: domainId,
      domain_slug: domainsById.get(domainId)?.slug,
      average_score: avg,
      result_level_id: band ? band.id : null,
    });
  }
  return out;
}

/**
 * Step 3 — competency phase averages. ONLY phases with measure_type =
 * 'competency' (Exploration, Exclusivity, Expansion). Expiration risk is
 * handled separately in Step 4 and must never be merged here.
 */
export function computeCompetencyPhaseScores(
  responses: ScoreRequestResponse[],
  questions: Question[],
  competencyPhases: CompetencyPhase[],
  resultLevels: ResultLevel[]
): CompetencyPhaseScore[] {
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const scoredByQuestion = buildScoredByQuestion(responses, questionsById);
  const phasesById = new Map(competencyPhases.map((p) => [p.id, p]));

  const valuesByPhase = new Map<string, number[]>();
  for (const r of responses) {
    const q = questionsById.get(r.question_id);
    if (!q) continue;
    const phase = phasesById.get(q.competency_phase_id);
    if (!phase || phase.measure_type !== "competency") continue;
    const scored = scoredByQuestion.get(r.question_id);
    if (scored === undefined) continue;
    const bucket = valuesByPhase.get(phase.id) ?? [];
    bucket.push(scored);
    valuesByPhase.set(phase.id, bucket);
  }

  const out: CompetencyPhaseScore[] = [];
  for (const [phaseId, values] of valuesByPhase) {
    const avg = average(values);
    const band = resolveBand(avg, resultLevels);
    out.push({
      competency_phase_id: phaseId,
      phase_slug: phasesById.get(phaseId)?.slug ?? "",
      average_score: avg,
      result_level_id: band ? band.id : null,
    });
  }
  return out;
}

/**
 * Step 4 — Expiration risk score. SEPARATE from Step 3. Groups responses whose
 * competency phase slug = 'expiration_risk'. Items are already reverse-scored
 * in the item bank where appropriate; HIGH score = LOW deterioration. Do not
 * invert again. Returns null if there are no expiration-risk items answered.
 */
export function computeExpirationRisk(
  responses: ScoreRequestResponse[],
  questions: Question[],
  competencyPhases: CompetencyPhase[],
  riskLevels: RiskLevel[]
): ExpirationRiskResult | null {
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const scoredByQuestion = buildScoredByQuestion(responses, questionsById);
  const phasesById = new Map(competencyPhases.map((p) => [p.id, p]));

  const values: number[] = [];
  for (const r of responses) {
    const q = questionsById.get(r.question_id);
    if (!q) continue;
    const phase = phasesById.get(q.competency_phase_id);
    if (!phase || phase.slug !== EXPIRATION_RISK_SLUG) continue;
    const scored = scoredByQuestion.get(r.question_id);
    if (scored === undefined) continue;
    values.push(scored);
  }

  if (values.length === 0) return null;

  const avg = average(values);
  const band = resolveBand(avg, riskLevels);
  return {
    average_score: avg,
    risk_level_id: band ? band.id : null,
    risk_level: band?.risk_level ?? null,
  };
}

/** Title-case a phase slug for display, e.g. "exclusivity" -> "Exclusivity". */
function phaseLabel(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Step 5 — Alignment (congruence) result.
 *
 * This is a THRESHOLD CHECK ON A SINGLE SCORE, not a comparison of two numbers.
 * The respondent self-selects a structural phase; we look up their competency
 * score for that SAME phase and test it against CONGRUENCE_SCORE_THRESHOLD
 * (3.25). At or above => Congruent (Strength / Healthy Development); below =>
 * Incongruent (Growth Opportunity / Needs Attention).
 *
 * For structural phase 'expiration': returns null — there is no alignment
 * result; the operative result is expiration_risk_results.
 */
export function computeAlignment(
  structuralPhaseSlug: StructuralPhaseSlug,
  competencyPhaseScores: CompetencyPhaseScore[],
  threshold: number = CONGRUENCE_SCORE_THRESHOLD
): AlignmentResult | null {
  if (structuralPhaseSlug === EXPIRATION_STRUCTURAL_SLUG) return null;
  if (!COMPETENCY_STRUCTURAL_SLUGS.has(structuralPhaseSlug)) return null;

  const match = competencyPhaseScores.find(
    (s) => s.phase_slug === structuralPhaseSlug
  );
  if (!match) return null;

  const competencyAverage = match.average_score;
  const status: AlignmentStatus =
    competencyAverage >= threshold ? "Congruent" : "Incongruent";

  const label = phaseLabel(structuralPhaseSlug);
  const interpretationText =
    status === "Congruent"
      ? `You see your relationship in the ${label} phase, and your competency there (${competencyAverage.toFixed(
          2
        )}) reflects genuine strength — your self-perception and your skills are aligned.`
      : `You see your relationship in the ${label} phase, but your competency there (${competencyAverage.toFixed(
          2
        )}) points to room for growth — an opportunity to build the skills that phase asks for.`;

  return {
    structural_phase: structuralPhaseSlug,
    matching_competency_phase_id: match.competency_phase_id,
    competency_average: competencyAverage,
    alignment_status: status,
    interpretation_text: interpretationText,
  };
}
