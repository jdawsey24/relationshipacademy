// Typed content schema for the interactive Playbook (R1 keys + R2 versioning).
// Content is authored as git-versioned TS modules (no DB authoring, no LLM at runtime).
// The universal engine reads THIS interface; per-cluster content is authored into it.

export interface PlaybookContent {
  playbookKey: string; // R1 stable key (marketing slug)
  playbookVersion: number; // R2
  displayName: string; // consumer-facing name, e.g. "Moving Beyond Rejection"
  opening: OpeningContent;
  recognitionCards: RecognitionCard[];
  plays: Play[];

  // ---- Rev 3 authored objects (all OPTIONAL/additive; unused by v0 delivery) ----
  // Present only for playbooks authored to the Rev 3 five-object model. v0 content
  // (the deployed two-Play prototype) omits these and is unaffected.
  literature?: LiteratureEntry[];
  simulations?: Simulation[];
  missions?: Mission[];
  useReviews?: UseReview[];
  statementMap?: StatementMapping[];
}

export interface OpeningContent {
  title: string;
  body: string[];
  manifestations?: string[];
  cta: string;
}

export type RecognitionRole = "route" | "validate" | "signpost";

export interface RecognitionCard {
  id: string;
  role: RecognitionRole;
  pathwayPlayId: string | null; // routes to a play_id (role='route'), else null
  headline: string;
  explanation?: string;
  secondaryExamples?: string[]; // "This might also sound like…" expander
  validationCopy?: string; // role='validate'|'signpost'
}

// ---- Screens (discriminated union) --------------------------------------------

export interface SortBucket {
  id: string;
  label: string;
}
export interface SortItem {
  id: string;
  text: string;
  /** If set, placing the item in another bucket triggers a single gentle correction. */
  correctBucket?: string;
  correction?: string;
}
export interface EvidenceQuestion {
  prompt: string;
  options: string[];
}
export interface OwnTurnField {
  id: string;
  label: string;
  input: "text" | "chips";
  placeholder?: string;
  suggestions?: string[];
}

export type Screen =
  | { kind: "shift"; body: string[] }
  | { kind: "literature"; l1: string; l2?: string; l2Heading?: string }
  | { kind: "learn"; body: string[] }
  | {
      kind: "scenarioSort";
      prompt: string;
      situation: string;
      thought?: string;
      note?: string; // teaching beat shown after sorting
      buckets: SortBucket[];
      items: SortItem[];
      evidenceQuestion?: EvidenceQuestion;
    }
  | { kind: "ownTurn"; intro?: string; fields: OwnTurnField[] }
  | {
      kind: "sufficiency";
      prompt: string;
      enoughLabel: string;
      needMoreLabel: string;
      needMoreIntro?: string;
      needToKnowLabel: string;
      observableLabel: string;
    }
  | {
      kind: "ruleBuilder";
      intro?: string;
      conditionLabel: string;
      thenLabel: string;
      actions: string[];
      controlCheck: string;
    }
  | { kind: "sentenceBuilder"; label: string; helper?: string }
  | { kind: "emotionBeat"; body: string[] }
  | { kind: "output"; heading: string; body?: string }
  | { kind: "portable"; heading: string; steps: string[] }
  | { kind: "realWorldUse"; useWhen: string; doThis: string; safetyNote?: string };

// ---- Play ---------------------------------------------------------------------

export type PlayStateValue = "available" | "explored" | "in_my_plays" | "used";

export interface MyPlaysTemplate {
  when: string;
  move: string;
  lookingFor: string;
  watchOut: string;
  remember: string;
}

/** Narrow, per-Play editor for the corrective-learning "Update" loop (not a general editor). */
export interface OutputEditorField {
  id: string; // payload key
  label: string;
  input: "text" | "rule";
  placeholder?: string;
  actions?: string[]; // input="rule"
  controlCheck?: string; // input="rule"
}
export interface OutputEditor {
  heading: string;
  fields: OutputEditorField[];
}

export interface Fidelity {
  correct: string;
  misuse: string[];
  notMeaning: string;
}

export interface PlaySupportSignpost {
  id: string;
  heading: string;
  body: string;
}

export interface PlayRouting {
  toPlayId: string;
  label: string; // consumer CTA for the pattern-branch route
}

export interface Play {
  playId: string; // R1 stable id
  playVersion: number; // R2
  outputSchemaVersion: number; // R2
  name: string;
  positioning: string;
  recognitionGate: { prompt: string };
  screens: Screen[];
  portable: string[];
  myPlaysTemplate: MyPlaysTemplate;
  fidelity: Fidelity;
  /** Play-specific support/signpost logic (R4 Layer B) — distinct from crisis detection. */
  supportSignposts?: PlaySupportSignpost[];
  /** Optional cross-Play route (e.g. T1a pattern branch → Read & Decide). */
  routing?: PlayRouting;
  /** Narrow editor reopened by the "Update" corrective-learning loop. */
  outputEditor?: OutputEditor;
}

// ---- Persisted shapes (R2 version-stamped) ------------------------------------

/** A stored executable output — payload is Play-specific; the wrapper is universal. */
export interface StoredOutput {
  output_schema_version: number;
  play_version: number;
  payload: Record<string, unknown>;
}

export interface SavedPlayCard {
  play_id: string;
  play_version: number;
  name: string;
  when: string;
  move: string;
  lookingFor: string;
  watchOut: string;
  remember: string;
  /** The user's own key output (derived from the Play's outputEditor), shown in My Plays. */
  userLine?: string;
}

export interface PlaybookProgress {
  playbook_key: string;
  playbook_version: number;
  recognized: string[];
  play_states: Record<string, PlayStateValue>;
  outputs: Record<string, StoredOutput>;
  my_plays: SavedPlayCard[];

  // ---- Rev 3 separated, individually-versioned current-state objects ----
  // (Rev 3.1 decision 3: separated state objects, NOT one catch-all; each
  // extractable to a sibling table later without changing identity/IDs.)
  // All OPTIONAL/additive; absent on v0 rows (read as undefined).
  literature_state?: LiteratureState;
  simulation_state?: SimulationState;
  practice_state?: PracticeState;
  use_review_state?: UseReviewState;
  change_path_state?: ChangePathState;
}

export function emptyProgress(playbookKey: string, playbookVersion: number): PlaybookProgress {
  return {
    playbook_key: playbookKey,
    playbook_version: playbookVersion,
    recognized: [],
    play_states: {},
    outputs: {},
    my_plays: [],
  };
}

// =============================================================================
// Rev 3 content objects + current-state objects (additive; see
// docs/playbook-architecture-rev3.md). Authored as git-versioned TS, no LLM at
// runtime. Nothing here is wired into the v0 delivery path; the Rev 3 engine
// (built in later steps, behind the feature flag) reads these interfaces.
// =============================================================================

/** Signature interaction primitives (§6.1). The engine renders by kind. */
export type InteractionKind =
  | "evidenceTimeline" // Read It, Then Decide
  | "conclusionNarrowing" // What It Actually Means
  | "scenarioSort"
  | "ruleBuilder"
  | "sentenceBuilder"
  | "communicationRehearsal" // future (not built)
  | "investmentView"; // future (not built)

// ---- Understand: literature (§5) ----------------------------------------------

export type LiteratureScope = "cluster" | "play" | "jit";
export interface LiteratureBlock {
  heading?: string;
  body: string[];
}
export interface LiteratureEntry {
  id: string;
  version: number;
  scope: LiteratureScope;
  title: string;
  body: LiteratureBlock[];
  playId?: string; // scope="play"
  anchor?: string; // scope="jit": what surfaces it
  related?: string[]; // navigable cross-links
}

// ---- Experience: deterministic simulation (§6) --------------------------------

/** Persisted process-level fidelity signals — evidence-anchored, never "changed my mind". */
export type SimFidelitySignal = "evidence_reconsidered" | "interpretation_revised_when_warranted";
export type SimProcessTag = "held_uncertainty" | "jumped_to_conclusion" | "sought_evidence";

export type CaptureField =
  | { kind: "choice"; options: string[] } // bounded — preferred
  | { kind: "shortText"; maxLen: number; purpose: string };

export interface SimOption {
  id: string;
  label: string; // a plausible choice — NEVER "the correct one"
  feedback: string[]; // educational, mechanism-focused (no outcome, no score)
  processTag?: SimProcessTag;
}

export type SimNode =
  | { id: string; kind: "moment"; body: string[] }
  | { id: string; kind: "capture"; prompt: string; field: CaptureField }
  | { id: string; kind: "decision"; prompt: string; options: SimOption[] }
  | { id: string; kind: "reveal"; body: string[] }
  | { id: string; kind: "reconsider"; prompt: string; signals: SimFidelitySignal[] }
  | { id: string; kind: "teach"; body: string[]; toPlayId: string };

export interface Simulation {
  id: string;
  version: number;
  simulationSchemaVersion: number;
  playId: string;
  signature: InteractionKind;
  nodes: SimNode[];
}

// ---- Practice: missions (§7) --------------------------------------------------

export type MissionState = "assigned" | "attempted" | "reviewed" | "advanced";
export interface MissionRung {
  id: string;
  instruction: string;
}
export interface Mission {
  id: string;
  version: number;
  playId: string;
  instruction: string;
  linkToOperation: string;
  suitability?: string; // safety/appropriateness boundary
  progression?: MissionRung[]; // progressive Developmental Application — NOT levels
}

// ---- Integrate: structured use-review (§8) ------------------------------------

export interface StructuredPrompt {
  label: string;
  options: string[]; // bounded choices
}
export interface UseReview {
  id: string;
  version: number;
  playId: string;
  didDifferently: StructuredPrompt;
  performedOperation: StructuredPrompt; // yes / partly / no (Technique Fidelity)
  becameClearer: StructuredPrompt;
  stuckWhere: StructuredPrompt;
  // stillFits (keep|update) is captured at runtime, reusing the v0 Keep/Update loop.
}

// ---- 101-statement content map (§5.1) -----------------------------------------

export type StatementFunction =
  | "recognition"
  | "cluster_literature"
  | "faq_literature"
  | "play_literature"
  | "jit_teaching"
  | "simulation_cue"
  | "play_routing"
  | "support_signpost"
  | "context_normalization"
  | "none";
export interface StatementMapping {
  statementId: string;
  text: string;
  functions: StatementFunction[]; // one or more
  targets?: string[]; // ids of the objects it feeds
}

// ---- Separated, individually-versioned current-state objects (§10.1) ----------
// Minimal Step-1 shells; later steps populate fields as each layer is built.

export interface LiteratureState {
  version: number;
  read?: string[]; // entry ids opened where useful (content engagement, NOT a change signal)
}
export interface SimulationState {
  version: number;
  /** Per-simulation resume + evidence-anchored fidelity signals (never "changed my mind"). */
  runs?: Record<string, { completed?: boolean; nodeId?: string; signals?: SimFidelitySignal[] }>;
}
export interface PracticeState {
  version: number;
  missions?: Record<string, { state: MissionState; rungId?: string }>;
}
export interface UseReviewState {
  version: number;
  /** Last structured review per play; Keep/Update is a tool-review signal, NOT Transfer. */
  reviews?: Record<string, { performed?: "yes" | "partly" | "no"; stuck?: string; kept?: boolean; updated?: boolean }>;
}
export interface ChangePathState {
  version: number;
  currentFocus?: string; // operation/application focus id
  priorFocus?: string;
}
