// Client-safe types + rule maps for the Assessment Assembly Engine. No server
// imports. This models the canonical measurement architecture:
//   Specification (intent) → Measurement Model (required evidence) → Assembly
//   (which approved items satisfy it) → Review.
// The pure derivation + assembly live in lib/assemblyEngine.ts; server glue in
// lib/assemblyData.ts.

// Bump when the deterministic rules change (part of every assembly's audit trail).
export const ENGINE_VERSION = "assembly-1.1.0";

// ---------------------------------------------------------------------------
// Measurement Strategy — declared per Specification; the PRIMARY input that tells
// the engine what LEVEL of measurement an instrument is designed to achieve. The
// same engine + bank produce brief screeners, broad profiles, and exhaustive
// clinical instruments while staying theoretically consistent + reproducible.
// ---------------------------------------------------------------------------
export type MeasurementStrategy = "screening" | "profile" | "comprehensive";

export const MEASUREMENT_STRATEGIES: { value: MeasurementStrategy; label: string; description: string }[] = [
  { value: "screening", label: "Screening", description: "Rapid estimate of overall functioning. Representative sampling across domains × phases — not every competency. Maximize construct coverage + efficiency within a small item budget (e.g. Relationship Snapshot™)." },
  { value: "profile", label: "Profile", description: "Broad competency coverage balancing length + burden. At least one item per competency where the budget allows — sufficient for reliable domain / competency / phase interpretation (e.g. Relationship Profile™)." },
  { value: "comprehensive", label: "Comprehensive", description: "Exhaustive measurement. Every required competency AND behavioral indicator adequately represented before the instrument is complete (e.g. Clinical Assessment™, Couples Profile™)." },
];

export const DEFAULT_STRATEGY: MeasurementStrategy = "comprehensive";

export function strategyLabel(s: string | null | undefined): string {
  return MEASUREMENT_STRATEGIES.find((x) => x.value === s)?.label ?? "Comprehensive";
}

// Assembly tuning constants — transparent + fixed so runs are reproducible.
export const SECONDS_PER_ITEM = 12;      // completion-time estimate
export const DUP_THRESHOLD = 0.6;        // tokenSimilarity above this = redundant
export const READING_TOLERANCE = 1.5;    // FK grades of slack around the target

// ---------------------------------------------------------------------------
// Desired outputs — what the assessment must PRODUCE. These drive the Model.
// ---------------------------------------------------------------------------
export const ASSESSMENT_OUTPUTS = [
  { value: "where_you_are", label: "Where You Are (Structural Context)" },
  { value: "developmental_alignment", label: "Developmental Alignment" },
  { value: "strengths", label: "Top Relational Strengths" },
  { value: "growth", label: "Growth Opportunities" },
  { value: "recommendations", label: "Personalized Recommendations" },
  { value: "resources", label: "Recommended Resources" },
  { value: "readiness", label: "Readiness for the Next Stage" },
] as const;
export type AssessmentOutput = (typeof ASSESSMENT_OUTPUTS)[number]["value"];

export const OUTPUT_LABELS: Record<string, string> =
  Object.fromEntries(ASSESSMENT_OUTPUTS.map((o) => [o.value, o.label]));

// The 4 measured phases the Snapshot/bank cover, in order.
export const MEASURED_PHASES = ["exploration", "exclusivity", "expansion", "expiration"] as const;

/** The next phase (for "readiness"), or null at the end of the measured sequence. */
export function nextPhase(phase: string | null | undefined): string | null {
  const i = (MEASURED_PHASES as readonly string[]).indexOf(phase ?? "");
  return i >= 0 && i < MEASURED_PHASES.length - 1 ? MEASURED_PHASES[i + 1] : null;
}

// ---------------------------------------------------------------------------
// Specification (the machine-usable subset the engine consumes)
// ---------------------------------------------------------------------------
export interface DesignConstraints {
  measurement_strategy?: MeasurementStrategy; // screening | profile | comprehensive
  reverse_target_pct?: number;        // e.g. 0.17
  phase_anchored_target_pct?: number;
  response_model_policy?: string;     // e.g. "single" (one response model) | "any"
  target_total_items?: number;        // item BUDGET (screening/profile) / distributed target (comprehensive)
  min_items_per_competency?: number;  // advanced override; used when no target_total_items
  scope_domains?: string[];           // default: all framework domains
  scope_phases?: string[];            // default: derived from structural_context (+ readiness)
}

export interface SpecificationInput {
  assessment_id: string;
  structural_context: string | null;         // exploration|exclusivity|expansion|expiration|null(any)
  target_reading_level: string | null;       // e.g. "Grade 5"
  target_completion_minutes: number | null;
  desired_outputs: string[];
  design_constraints: DesignConstraints;
}

// ---------------------------------------------------------------------------
// Framework input (competencies + behavioral indicators)
// ---------------------------------------------------------------------------
export interface FrameworkCompetencyLite { code: string; domain_slug: string | null; phase_slug: string | null; }
export interface FrameworkIndicatorLite { behavior_id: string; competency_id: string; domain: string | null; phase: string | null; }
export interface FrameworkInput { competencies: FrameworkCompetencyLite[]; indicators: FrameworkIndicatorLite[]; }

// ---------------------------------------------------------------------------
// Measurement Model (derived evidence requirements)
// ---------------------------------------------------------------------------
export interface OutcomeRequirement {
  output: string;                 // AssessmentOutput
  required_competencies: string[];
  min_items_per_competency: number;
}
export interface CoveragePolicy {
  measurement_strategy: MeasurementStrategy;
  target_total_items: number | null;   // item budget (screening/profile)
  min_items_per_competency: number;    // comprehensive minimum (and profile fallback)
  reverse_target_pct: number | null;
  phase_anchored_target_pct: number | null;
}
export interface MeasurementModel {
  required_competencies: string[];
  required_behavioral_indicators: string[];
  required_domains: string[];
  required_phases: string[];
  outcome_requirements: OutcomeRequirement[];
  coverage_policy: CoveragePolicy;
}

// ---------------------------------------------------------------------------
// Assembly result
// ---------------------------------------------------------------------------
export interface EligibleItem {
  item_id: string;
  competency_id: string | null;
  behavior_id: string | null;
  domain: string | null;
  phase: string | null;
  item_type: string | null;
  reverse_scored: boolean;
  evidence_strength: string | null;
  response_model: string | null;
  item_text: string | null;
  status: string;
}

export interface OutcomeFulfillment {
  output: string;
  label: string;
  fulfilled: boolean;
  unmet_competencies: string[];   // required but under-covered
}

export interface CompetencyCoverage {
  competency_id: string;
  required: number;
  selected: number;
  adequate: boolean;
}

export interface AssemblyStats {
  strategy: MeasurementStrategy;
  items_searched: number;
  items_selected: number;
  competencies_required: number;
  competencies_covered: number;
  indicators_required: number;
  indicators_covered: number;
  cells_total: number;      // domain × phase cells with eligible items (the screening unit)
  cells_covered: number;
  domains_covered: string[];
  phases_covered: string[];
  duplicates_removed: number;
  reverse_pct: number;
  phase_anchored_pct: number;
  mean_reading_grade: number | null;
  estimated_minutes: number;
  competency_coverage: CompetencyCoverage[];
  under_covered_competencies: string[];
  missing_indicators: string[];
}

export interface SelectedItem { item_id: string; position: number; satisfies_competency: string | null; selection_reason: string; }

export interface AssemblyResult {
  itemIds: string[];
  selected: SelectedItem[];
  stats: AssemblyStats;
  outcomeFulfillment: OutcomeFulfillment[];
  outcome_fulfilled: boolean;
  inputs_fingerprint: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse a target reading level like "Grade 5" or "Grade 5.2" → number, else null. */
export function parseTargetGrade(level: string | null | undefined): number | null {
  if (!level) return null;
  const m = level.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

/** Deterministic FNV-1a hash (hex) of a value — stable JSON with sorted keys. No
 *  crypto/Date/random so the engine stays pure + reproducible. */
export function stableHash(value: unknown): string {
  const json = stableStringify(value);
  let h = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function stableStringify(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  const keys = Object.keys(v as Record<string, unknown>).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify((v as Record<string, unknown>)[k])).join(",") + "}";
}
