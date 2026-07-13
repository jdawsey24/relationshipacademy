// Client-safe types + constants for the governed Question → Behavioral Indicator
// → Competency mapping layer. No server imports. This is a TRACEABILITY +
// DESCRIPTIVE-ANALYSIS system — NOT validated competency scoring. Server reads
// live in lib/questionMapData.ts.

export type MappingStatus = "draft" | "approved" | "superseded" | "retired";
export type MappingKind = "indicator" | "competency_direct";

export const CONFIDENCE_LEVELS = ["high", "moderate", "low", "tentative"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const MAPPING_STATUS_LABELS: Record<MappingStatus, string> = {
  draft: "Draft",
  approved: "Approved",
  superseded: "Superseded",
  retired: "Retired",
};

// Minimum-evidence coverage tiers. A 47-item Snapshot cannot validly measure all
// 111 competencies; these tiers describe how much DESCRIPTIVE signal exists, never
// psychometric validity.
export type CoverageTier = "no_coverage" | "single_item_signal" | "limited_descriptive" | "multi_item_descriptive";

export const COVERAGE_TIER_LABELS: Record<CoverageTier, string> = {
  no_coverage: "No coverage",
  single_item_signal: "Single-item signal",
  limited_descriptive: "Limited descriptive coverage",
  multi_item_descriptive: "Multiple-item descriptive coverage",
};

export function coverageTier(mappedQuestionCount: number): CoverageTier {
  if (mappedQuestionCount <= 0) return "no_coverage";
  if (mappedQuestionCount === 1) return "single_item_signal";
  if (mappedQuestionCount === 2) return "limited_descriptive";
  return "multi_item_descriptive";
}

// The single validation label used everywhere a competency-level live summary is
// shown. NEVER "Validated live".
export const LIVE_VALIDATION_STATUS = "Exploratory — not psychometrically validated";

export interface SnapshotQuestion {
  id: string;                 // live questions.id (e.g. "C002")
  question_text: string | null;
  domain_slug: string | null;
  phase_slug: string | null;  // competency_phases.slug
  measure_type: string | null; // 'competency' | 'risk' — risk items are response-model-incompatible
}

export interface QuestionMap {
  id: string;
  question_id: string;
  behavior_id: string | null;
  competency_id: string | null;
  mapping_kind: MappingKind;
  exception_reason: string | null;
  scoring_eligible: boolean;
  weight: number;
  rationale: string | null;
  confidence_level: string | null;
  assessment_version_id: string | null;
  status: MappingStatus;
  version_no: number;
  effective_from: string | null;
  effective_to: string | null;
  created_by: string | null;
  reviewed_by: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined for display (not columns):
  indicator_text?: string | null;
  competency_name?: string | null;
}

// A question row for the tool: the question + its current approved mapping + how
// many drafts/history rows exist.
export interface QuestionMapRow {
  question: SnapshotQuestion;
  current: QuestionMap | null;   // approved & effective
  draft: QuestionMap | null;     // an in-progress draft, if any
  historyCount: number;          // superseded/retired rows
}
