// Shared runtime types for the Playbook engine (client + server safe: no imports
// that pull server-only modules).

import type {
  PlaybookProgress,
  PlayStateValue,
  StoredOutput,
  SavedPlayCard,
  LiteratureState,
  SimulationState,
  PracticeState,
  UseReviewState,
  ChangePathState,
} from "@/lib/playbook/contentSchema";

export type { PlaybookProgress, PlayStateValue, StoredOutput, SavedPlayCard };

/** Raw DB row shape (jsonb columns come back loosely typed). */
export interface PlaybookProgressRow {
  playbook_key: string;
  playbook_version: number;
  recognized: string[] | null;
  play_states: Record<string, PlayStateValue> | null;
  outputs: Record<string, StoredOutput> | null;
  my_plays: SavedPlayCard[] | null;
  // Rev 3 separated state columns (0053; jsonb, default '{}' — empty on v0 rows).
  literature_state: LiteratureState | null;
  simulation_state: SimulationState | null;
  practice_state: PracticeState | null;
  use_review_state: UseReviewState | null;
  change_path_state: ChangePathState | null;
}

/** Layer-A crisis screen result surfaced to the client (metadata only, no raw text). */
export interface CrisisScreenResult {
  interrupt: boolean;
  heading: string | null;
  message: string | null;
  resources: { label: string; value: string }[];
}
