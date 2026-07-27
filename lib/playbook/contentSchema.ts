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
