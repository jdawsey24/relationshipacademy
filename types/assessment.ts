// TypeScript types for the Relationship Life Cycle™ assessment domain.
// These mirror the Supabase schema closely enough for the scoring layer to
// stay strongly typed while remaining decoupled from the database client.

export type QuizType = "snapshot" | "profile";

export type ScoreDirection = "forward" | "reverse";

/** competency_phases.measure_type */
export type MeasureType = "competency" | "risk";

/** structural_phases / competency_phases slugs of interest to scoring. */
export type StructuralPhaseSlug =
  | "exploration"
  | "exclusivity"
  | "expansion"
  | "expiration";

export type AlignmentStatus = "Congruent" | "Incongruent";

// --- Reference data (read-only from the API) -------------------------------

export interface Question {
  id: string; // e.g. "C001"
  score_direction: ScoreDirection;
  domain_id: string;
  competency_phase_id: string;
  in_snapshot: boolean;
  in_profile: boolean;
}

export interface Domain {
  id: string;
  slug: string;
  name?: string;
}

export interface CompetencyPhase {
  id: string;
  slug: string;
  measure_type: MeasureType;
  name?: string;
}

export interface StructuralPhase {
  id: string;
  slug: string;
  name?: string;
}

/** A threshold band on the 1–5 competency scale. */
export interface ResultLevel {
  id: string;
  domain_id: string | null; // null = global band (current data is all global)
  level: string; // e.g. "Strength", "Healthy Development"
  title: string;
  score_min: number;
  score_max: number;
}

/** A deterioration-risk band (Expiration only). */
export interface RiskLevel {
  id: string;
  risk_level: string; // e.g. "Low Risk", "Some Risk Indicators"
  title: string;
  score_min: number;
  score_max: number;
}

// --- Request -----------------------------------------------------------------

export interface ScoreRequestResponse {
  question_id: string;
  raw_response: number; // 1–5
}

export interface ScoreRequest {
  session_id: string;
  quiz_type: QuizType;
  name: string;
  email: string;
  relationship_length: string;
  relationship_status_detail: string;
  structural_phase_slug: StructuralPhaseSlug;
  responses: ScoreRequestResponse[];
}

// --- Computed results --------------------------------------------------------

export interface DomainScore {
  domain_id: string;
  domain_slug?: string;
  average_score: number;
  result_level_id: string | null;
}

export interface CompetencyPhaseScore {
  competency_phase_id: string;
  phase_slug: string;
  average_score: number;
  result_level_id: string | null;
}

export interface ExpirationRiskResult {
  average_score: number;
  risk_level_id: string | null;
  risk_level: string | null;
}

export interface AlignmentResult {
  structural_phase: StructuralPhaseSlug;
  matching_competency_phase_id: string;
  competency_average: number; // competency score for the self-selected phase
  alignment_status: AlignmentStatus;
  interpretation_text: string;
}

// --- API response ------------------------------------------------------------

// --- Questions API (GET /api/questions?domain=) -----------------------------

export interface QuizQuestion {
  id: string;
  question_text: string;
}

export interface QuestionsResponse {
  domain: { slug: string; name: string };
  questions: QuizQuestion[];
}

// --- Results API (GET /api/results?session_id=) -----------------------------

export interface DomainResult {
  slug: string;
  name: string;
  average_score: number;
  level: string | null; // e.g. "Strength"
  title: string | null;
  interpretation: string | null;
  recommendation: string | null;
  cta: string | null;
}

export interface CompetencyResult {
  slug: string;
  consumer_name: string;
  average_score: number;
  level: string | null;
  title: string | null;
}

export interface ExpirationRiskResultView {
  average_score: number;
  risk_level: string | null;
  title: string | null;
  interpretation: string | null;
}

export interface AlignmentResultView {
  status: AlignmentStatus;
  interpretation_text: string | null;
}

export interface RecommendationView {
  domain: string;
  recommendation_text: string;
  next_step: string;
}

export interface ResultsResponse {
  session_id: string;
  name: string;
  structural_phase: {
    slug: string;
    name: string;
    consumer_name: string | null;
    defining_feature: string | null;
  };
  is_expiration: boolean;
  alignment: AlignmentResultView | null;
  expiration_risk: ExpirationRiskResultView | null;
  domains: DomainResult[];
  competency_phases: CompetencyResult[];
  recommendations: RecommendationView[];
}

export interface ScoreResponse {
  session_id: string;
  domain_scores: DomainScore[];
  competency_phase_scores: CompetencyPhaseScore[];
  expiration_risk: {
    average_score: number;
    risk_level: string | null;
  } | null;
  alignment: {
    status: AlignmentStatus;
    structural_phase: StructuralPhaseSlug;
  } | null;
  quiz_type: QuizType;
}
