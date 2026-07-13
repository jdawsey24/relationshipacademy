// Client-safe types + constants for the AI Authoring Studio. No server imports.

export const GENERATION_TYPES = ["assessment_item", "worksheet", "lesson", "item_review", "content_review"] as const;
export type GenerationType = (typeof GENERATION_TYPES)[number];

// The seven assessment item types from the spec.
export const ITEM_TYPES = [
  "Direct behavior-frequency",
  "Alternate wording",
  "Reverse-scored candidate",
  "Phase-anchored item",
  "Scenario item",
  "Partner-report item",
  "Clinician-observation item",
] as const;

export const RESPONSE_MODELS = [
  { id: "RM-FREQ-001", label: "Five-Point Frequency" },
  { id: "RM-PHASE-001", label: "Phase-Anchored Option" },
  { id: "RM-OBS-001", label: "Clinician Observation" },
] as const;

export const PERSPECTIVES = ["Self", "Partner", "Clinician"] as const;
export const TIME_FRAMES = ["General", "Past week", "Past month", "Currently"] as const;
export const READING_LEVELS = ["Grade 3", "Grade 5", "Grade 8", "Professional"] as const;

// AI drafts use the governance statuses + "rejected" (spec).
export const AI_STATUSES = ["draft", "in_review", "changes_requested", "approved", "published", "rejected", "retired"] as const;
export type AiStatus = (typeof AI_STATUSES)[number];

export const AI_STATUS_LABELS: Record<AiStatus, string> = {
  draft: "Draft", in_review: "In review", changes_requested: "Changes requested",
  approved: "Approved", published: "Published", rejected: "Rejected", retired: "Retired",
};

// Only the owner may move a draft to these (enforced server-side).
export const OWNER_ONLY_AI_STATUSES: AiStatus[] = ["approved", "published", "rejected", "retired"];

export const SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export type Severity = (typeof SEVERITIES)[number];

export interface ItemDraft {
  id: string;
  generation_request_id: string | null;
  assessment_id: string | null;
  competency_id: string | null;
  behavioral_indicator_id: string | null;
  incomplete_indicator_id: string | null;
  item_type: string | null;
  item_text: string | null;
  response_model_id: string | null;
  perspective: string | null;
  time_frame: string | null;
  reverse_candidate: boolean;
  phase_mapping: string | null;
  structural_context_filter: string | null;
  reading_level: string | null;
  face_validity_rationale: string | null;
  evidence_strength: string | null;
  source_ids: string[];
  provider: string | null;
  model: string | null;
  quality_status: string;
  status: AiStatus;
  reviewer_id: string | null;
  reviewer_notes: string | null;
  permanent_item_id: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QualityCheck {
  id: string;
  draft_type: string;
  draft_id: string;
  check_type: string;
  severity: string | null;
  passed: boolean;
  finding: string | null;
  recommendation: string | null;
  created_at: string;
}

export interface DuplicateMatch {
  source: "approved" | "draft";
  id: string;
  text: string;
  similarity: number; // 0..1
}

export interface GenerationRequest {
  id: string;
  user_id: string | null;
  generation_type: string;
  provider: string | null;
  model: string | null;
  status: string;
  parameters: Record<string, unknown>;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface PromptTemplate {
  id: string;
  name: string;
  generation_type: string;
  system_instruction: string;
  user_template: string;
  required_source_fields: string[];
  output_schema: Record<string, unknown>;
  version: number;
  status: string;
  created_by: string | null;
  approved_by: string | null;
  updated_at: string;
}

export interface AiSettings {
  id: string;
  provider: string;
  model: string;
  enabled_generation_types: string[];
  output_limit: number;
  timeout_seconds: number;
  retry_limit: number;
  daily_cost_limit_usd: number;
  monthly_cost_limit_usd: number;
  kill_switch_active: boolean;
  updated_by: string | null;
  updated_at: string;
}

// Rough USD/token cost estimate (Opus-class) for the usage dashboard. Approximate.
export function estimateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens / 1_000_000) * 15 + (outputTokens / 1_000_000) * 75;
}
