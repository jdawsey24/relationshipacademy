// Server-side sanitization of incoming progress (unit-testable, no request coupling).
// user_id / playbook_key / playbook_version are AUTHORITATIVE from the server, never
// trusted from the client. Functional data only; outputs version-stamped.

import { emptyProgress, type PlaybookProgress, type PlayStateValue, type StoredOutput, type SavedPlayCard } from "@/lib/playbook/contentSchema";

const STATES: PlayStateValue[] = ["available", "explored", "in_my_plays", "used"];

export function sanitizeStates(v: unknown): Record<string, PlayStateValue> {
  const out: Record<string, PlayStateValue> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === "string" && (STATES as string[]).includes(val)) out[k] = val as PlayStateValue;
    }
  }
  return out;
}

export function sanitizeOutputs(v: unknown): Record<string, StoredOutput> {
  const out: Record<string, StoredOutput> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const o = val as Partial<StoredOutput> | null;
      if (o && typeof o === "object" && o.payload && typeof o.payload === "object") {
        out[k] = {
          output_schema_version: Number(o.output_schema_version) || 1,
          play_version: Number(o.play_version) || 1,
          payload: o.payload as Record<string, unknown>,
        };
      }
    }
  }
  return out;
}

export function sanitizeMyPlays(v: unknown): SavedPlayCard[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((c): c is SavedPlayCard => Boolean(c) && typeof c === "object" && typeof (c as SavedPlayCard).play_id === "string")
    .slice(0, 50)
    .map((c) => ({
      play_id: String(c.play_id),
      play_version: Number(c.play_version) || 1,
      name: String(c.name ?? ""),
      when: String(c.when ?? ""),
      move: String(c.move ?? ""),
      lookingFor: String(c.lookingFor ?? ""),
      watchOut: String(c.watchOut ?? ""),
      remember: String(c.remember ?? ""),
    }));
}

/** Build a safe PlaybookProgress from untrusted client input + authoritative server key/version. */
export function sanitizeIncomingProgress(
  body: unknown,
  playbookKey: string,
  playbookVersion: number,
): PlaybookProgress {
  const b = (body ?? {}) as Partial<PlaybookProgress>;
  return {
    ...emptyProgress(playbookKey, playbookVersion),
    recognized: Array.isArray(b.recognized) ? b.recognized.filter((x): x is string => typeof x === "string").slice(0, 100) : [],
    play_states: sanitizeStates(b.play_states),
    outputs: sanitizeOutputs(b.outputs),
    my_plays: sanitizeMyPlays(b.my_plays),
  };
}
