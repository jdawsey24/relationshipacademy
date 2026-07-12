// Client-safe types + constants for the Assessment Studio (Phase B). No server
// imports — safe in client components. Reuses the governance status vocabulary
// from lib/studio.ts. Server reads live in lib/studioAssessmentData.ts.

import type { StudioStatus } from "@/lib/studio";
export type { StudioStatus } from "@/lib/studio";
export { STATUS_LABELS } from "@/lib/studio";

export const DOMAIN_SLUGS = [
  "communication",
  "trust",
  "emotional_intimacy",
  "conflict_management",
  "role_functioning", // canonical (workbook name); live site still says "Relational Functioning"
  "physical_intimacy",
] as const;

export const PHASE_SLUGS = ["exploration", "exclusivity", "expansion", "expiration", "recovery", "renewal"] as const;

export function domainLabel(slug: string): string {
  return slug
    ? slug.split("_").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ")
    : "";
}

export interface Assessment {
  assessment_id: string;
  name: string;
  audience: string | null;
  purpose: string | null;
  delivery_mode: string | null;
  estimated_items: string | null;
  estimated_time: string | null;
  primary_outputs: string | null;
  scoring_level: string | null;
  current_stage: string | null;
  launch_priority: string | null;
  requires_partner_data: string | null;
  requires_clinician_data: string | null;
  notes: string | null;
  status: StudioStatus;
  updated_by: string | null;
  updated_at: string;
}

export interface AssessmentItem {
  item_id: string;
  assessment_id: string | null;
  competency_id: string | null;
  competency: string | null;
  domain: string | null;
  phase: string | null;
  behavior_id: string | null;
  behavioral_indicator: string | null;
  item_family: string | null;
  item_type: string | null;
  candidate_number: string | null;
  item_text: string | null;
  consumer_item_text: string | null;
  professional_item_text: string | null;
  response_model: string | null;
  reverse_scored: boolean;
  evidence_strength: string | null;
  face_validity_notes: string | null;
  audience: string | null;
  reading_level: string | null;
  scoring_direction: string | null;
  status: StudioStatus;
  provenance?: string;
  updated_by: string | null;
  updated_at: string;
}

export interface ResponseModel {
  response_model_id: string;
  name: string;
  use_case: string | null;
  response_options: string[];
  numeric_coding: (string | number)[];
  scoring_direction: string | null;
  missing_handling: string | null;
  consumer_labeling: string | null;
  professional_notes: string | null;
  status: StudioStatus;
}

export interface ScoringRule {
  scoring_rule_id: string;
  assessment_id: string | null;
  score_name: string | null;
  score_type: string | null;
  level: string | null;
  input_entity: string | null;
  input_ids: string | null;
  formula_logic: string | null;
  min_valid_responses: string | null;
  missing_data_rule: string | null;
  direction: string | null;
  display_to_consumer: string | null;
  validation_status: string | null;
  cut_points_status: string | null;
  cut_points: unknown[];
  version: string | null;
  notes: string | null;
  status: StudioStatus;
}

export interface InterpretationRule {
  interpretation_rule_id: string;
  assessment_id: string | null;
  rule_name: string | null;
  trigger_type: string | null;
  trigger_inputs: string | null;
  rule_logic: string | null;
  interpretation_category: string | null;
  consumer_interpretation: string | null;
  professional_interpretation: string | null;
  priority: string | null;
  suppression_conditions: string | null;
  safety_escalation: string | null;
  validation_status: string | null;
  notes: string | null;
  status: StudioStatus;
}

export interface ResultsTemplate {
  template_section_id: string;
  assessment_id: string | null;
  section_order: number | null;
  section_name: string | null;
  audience: string | null;
  display_condition: string | null;
  required_inputs: string | null;
  consumer_heading: string | null;
  consumer_copy_template: string | null;
  professional_notes: string | null;
  cta: string | null;
  notes: string | null;
  status: StudioStatus;
}

export interface RecommendationMapping {
  mapping_id: string;
  assessment_id: string | null;
  trigger_type: string | null;
  trigger_value: string | null;
  competency_id: string | null;
  structural_context: string | null;
  phase_context: string | null;
  priority: string | null;
  recommendation_type: string | null;
  recommendation_id: string | null;
  recommendation_name: string | null;
  consumer_rationale: string | null;
  professional_rationale: string | null;
  trigger_metric: string | null;
  trigger_comparator: string | null;
  trigger_threshold: string | null;
  suppression_logic: string | null;
  escalation_logic: string | null;
  audience: string | null;
  status: StudioStatus;
}

// The tables the sub-editors expose, with their PK column + label. Drives the
// generic list/edit APIs + UI so we don't hand-write six near-identical routes.
export const ASSESSMENT_TABLES = {
  "response-models": { table: "studio_response_models", pk: "response_model_id", label: "Response Models" },
  "scoring-rules": { table: "studio_scoring_rules", pk: "scoring_rule_id", label: "Scoring Rules" },
  "interpretation-rules": { table: "studio_interpretation_rules", pk: "interpretation_rule_id", label: "Interpretation Rules" },
  "results-templates": { table: "studio_results_templates", pk: "template_section_id", label: "Results Templates" },
  "recommendation-mappings": { table: "studio_recommendation_mappings", pk: "mapping_id", label: "Recommendation Mappings" },
} as const;

export type AssessmentTableKey = keyof typeof ASSESSMENT_TABLES;

export function isAssessmentTableKey(k: string): k is AssessmentTableKey {
  return k in ASSESSMENT_TABLES;
}

// Approving/publishing/retiring is owner-only (matches Phase A). Editors may set
// draft/in_review.
export const OWNER_ONLY_STATUSES: StudioStatus[] = ["approved", "published", "retired"];
