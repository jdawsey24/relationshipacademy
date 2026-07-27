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

/** Parsimonious authored block model (content gate). NOT a course builder — a small,
 *  fixed set of block kinds for substantive-but-readable field-guide entries. */
export type LiteratureBlock =
  | { kind: "paragraph"; heading?: string; body: string[] } // prose; optional section heading (multi-section Core Guides)
  | { kind: "distinction"; label: string; body: string[] } // key distinction / callout
  | { kind: "list"; label?: string; items: string[] } // bullets / "what this can look like"
  | { kind: "example"; body: string[] } // brief relational example
  | { kind: "guardrail"; body: string[] }; // keep-in-mind / guardrail

export interface LiteratureEntry {
  id: string;
  version: number;
  scope: LiteratureScope;
  /** Within cluster scope: "core" = substantive multi-section guide; "question" = focused
   *  answer to a lived-experience question. Omitted for play/jit. */
  depth?: "core" | "question";
  title: string;
  body: LiteratureBlock[];
  playId?: string; // scope="play"
  anchor?: string; // scope="jit": what surfaces it (JIT is surfaced contextually, not browsed by default)
  related?: string[]; // navigable cross-links
}

// ---- Experience: deterministic simulation (§6) --------------------------------

/** Fidelity is recorded as an explicit applicability/performance STATE — never a
 *  positive-only boolean. Revision is not the target: an evidence-responsive user may
 *  appropriately revise OR appropriately hold, depending on the authored evidence. */
export type FidelityState = "demonstrated" | "not_demonstrated" | "not_applicable";
export type FidelityDimension = "evidence_reconsidered" | "interpretation_response_appropriate";

/** GUARDRAIL 3 (approved): process tags are narrowly BEHAVIORAL/OPERATIONAL only.
 *  They describe what the reader did with the evidence in THIS moment — never
 *  personality, attachment style, diagnosis, etiology, or any stable-trait conclusion. */
export type SimProcessTag = "held_uncertainty" | "jumped_to_conclusion" | "sought_evidence" | "bounded_to_evidence";

export type CaptureField =
  | { kind: "choice"; options: string[] } // bounded — preferred
  | { kind: "shortText"; maxLen: number; purpose: string };

/** Authored display role — how a signature chrome should present this node. NEVER
 *  inferred from node order (e.g. "the first moment"); always explicitly authored. */
export type SimDisplayRole = "event" | "expansion" | "narrowing" | "beat" | "evidence";

export interface SimOption {
  id: string;
  label: string; // a plausible choice — NEVER "the correct one"; NO score/outcome fields
  feedback: string[]; // educational, mechanism-focused (no outcome, no score)
  processTag?: SimProcessTag;
  /** Route to a short teaching branch; if omitted, advance to the node's `next`. */
  next?: string;
}

/** A reconsider response. GUARDRAIL 1 (approved): fidelity is authored PER NODE/RESPONSE
 *  from the evidence in THAT specific scenario — never derived from the simulation
 *  signature. "Hold" vs "revise" is not fixed by signature: holding is evidence-appropriate
 *  in RD (ambiguity remains) and not in WM (the global verdict outruns one event).
 *  The engine never treats mere change-of-mind as the target. */
export interface FidelityOutcome {
  evidence_reconsidered: FidelityState;
  interpretation_response_appropriate: FidelityState;
}
export interface ReconsiderOption {
  id: string;
  label: string;
  feedback?: string[];
  next?: string;
  fidelity: FidelityOutcome;
}

/** Nodes form an authored GRAPH (startNodeId + per-node/option `next`), not a linear
 *  array walk. Options may route to short teaching branches that rejoin the main path.
 *  Branching changes what TEACHING/rehearsal the user receives — NEVER what the dating
 *  partner does. `role` drives signature presentation.
 *  GUARDRAIL 2 (approved): `jitLiteratureId` surfaces authored just-in-time literature by
 *  id only (never inlined). Opening it is Exposure / content engagement ONLY — it can never
 *  independently contribute to Technique Fidelity or Transfer (fidelity comes solely from
 *  authored reconsider responses; see aggregateFidelity, which takes no literature input). */
export type SimNodeBase = { id: string; role?: SimDisplayRole; jitLiteratureId?: string };
export type SimNode = SimNodeBase &
  (
    | { kind: "moment"; body: string[]; next?: string }
    | { kind: "note"; body: string[]; next?: string } // short teaching-branch content (rejoins)
    | { kind: "capture"; prompt: string; field: CaptureField; next?: string }
    | { kind: "decision"; prompt: string; options: SimOption[]; next?: string }
    | { kind: "reveal"; body: string[]; label?: string; next?: string } // authored/contextual label
    | { kind: "reconsider"; prompt: string; options: ReconsiderOption[]; next?: string }
    | { kind: "teach"; body: string[]; toPlayId: string } // terminal handoff (no `next`)
  );

export interface Simulation {
  id: string;
  version: number;
  simulationSchemaVersion: number;
  playId: string;
  signature: InteractionKind;
  startNodeId: string;
  nodes: SimNode[];
}

// ---- Practice: missions (§7) --------------------------------------------------

/** Factual mission states — no developmental claim is encoded by moving between them.
 *  (The decision to repeat/adjust/change focus/offer a stretch belongs to Use Review + Change Path.) */
export type MissionState = "selected" | "attempted" | "reviewed";
/** Return outcomes. Step 7 Use Review distinguishes all four; absence of an attempt is
 *  NEVER interpreted as inability or avoidance. */
export type MissionReport = "attempted" | "no_opportunity" | "opportunity_not_taken" | "unsuitable";
export interface MissionRung {
  id: string;
  instruction: string;
}
export interface Mission {
  id: string;
  version: number;
  playId: string;
  title: string;
  instruction: string;
  linkToOperation: string;
  attemptMeaning?: string; // consumer-facing: what counts as trying it
  suitability?: string; // safety/appropriateness boundary
  progression?: MissionRung[]; // authored next stretch(es); CONTENT ORDERING ONLY (see nextRung) — not levels
}

// ---- Integrate: structured use-review (§8) ------------------------------------

export interface StructuredPrompt {
  label: string;
  options: string[]; // bounded choices
  multi?: boolean; // bounded MULTI-select ("choose any that fit") — never a checklist score
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
  // NOT a trigger. Only makes a statement ELIGIBLE for a structured persistence/
  // pervasiveness gate (§4.5); a single mapped statement never surfaces a Layer-B
  // signpost on its own. Ordinary fatigue/loneliness/worry must not carry this.
  | "support_signpost_candidate"
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
/** Resume-ready per-simulation run state. `nodeId` is the resume position; captures/
 *  selections replay the reader's inputs; `fidelity` is the explicit-state outcome. */
export interface SimulationRunState {
  completed?: boolean;
  nodeId?: string;
  captures?: Record<string, string>;
  selections?: Record<string, string>;
  fidelity?: FidelityOutcome;
}
export interface SimulationState {
  version: number;
  runs?: Record<string, SimulationRunState>;
}
export interface MissionRunState {
  state: MissionState;
  rungId?: string; // the current authored rung (content position), stored SEPARATELY from state
  stretchEligible?: boolean; // an authored next stretch exists AND an attempt was reported — ELIGIBILITY only, never a recommendation
  lastReport?: MissionReport;
  /** Count of reported real-world attempts. 1 = first Attempt; ≥2 = accumulating evidence of
   *  use in another authentic context (a Transfer signal). Never a mastery/trait claim. */
  attemptCount?: number;
}
export interface PracticeState {
  version: number;
  currentMissionId?: string; // ONE active real-world practice focus at a time (never accumulate homework)
  missions?: Record<string, MissionRunState>;
}
/** Structured functional signals from a Use Review (§8). Bounded selects only — no
 *  journaling. `performed` is the Technique-Fidelity signal; kept/updated are tool-review
 *  signals (NOT Transfer). These feed Change Path (Step 8). */
export interface UseReviewSignals {
  performed?: "yes" | "partly" | "no"; // Technique-Fidelity signal (single-select)
  didDifferently?: string[]; // bounded multi-select
  becameClearer?: string[]; // bounded multi-select
  stuck?: string; // single-select — a prioritized friction point for Change Path
  // Tool-review signals — tracked SEPARATELY; NONE independently constitutes Transfer.
  kept?: boolean; // tool_retained
  updated?: boolean; // tool_updated
  saved?: boolean; // tool_saved_after_use (no saved Play existed before the review)
}
export interface UseReviewState {
  version: number;
  reviews?: Record<string, UseReviewSignals>;
}
export interface ChangePathState {
  version: number;
  currentFocus?: string; // operation/application focus id
  priorFocus?: string;
}
