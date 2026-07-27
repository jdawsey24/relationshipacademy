// Shared runtime types for the Playbook engine (client + server safe: no imports
// that pull server-only modules).

import type { PlaybookProgress, PlayStateValue, StoredOutput, SavedPlayCard } from "@/lib/playbook/contentSchema";

export type { PlaybookProgress, PlayStateValue, StoredOutput, SavedPlayCard };

/** Raw DB row shape (jsonb columns come back loosely typed). */
export interface PlaybookProgressRow {
  playbook_key: string;
  playbook_version: number;
  recognized: string[] | null;
  play_states: Record<string, PlayStateValue> | null;
  outputs: Record<string, StoredOutput> | null;
  my_plays: SavedPlayCard[] | null;
}

/** Layer-A crisis screen result surfaced to the client (metadata only, no raw text). */
export interface CrisisScreenResult {
  interrupt: boolean;
  heading: string | null;
  message: string | null;
  resources: { label: string; value: string }[];
}
