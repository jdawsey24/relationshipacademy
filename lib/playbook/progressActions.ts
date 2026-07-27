// Pure progress reducers (unit-testable, no React). ExperienceShell applies these
// through useProgress().update(). Functional data only; version-stamped (R2).

import type { Play, PlaybookProgress, SavedPlayCard } from "@/lib/playbook/contentSchema";

export function toggleRecognized(p: PlaybookProgress, cardId: string): PlaybookProgress {
  const has = p.recognized.includes(cardId);
  return { ...p, recognized: has ? p.recognized.filter((x) => x !== cardId) : [...p.recognized, cardId] };
}

/** Mark a play explored — but never downgrade an already-saved/used play. */
export function markExplored(p: PlaybookProgress, playId: string): PlaybookProgress {
  const current = p.play_states[playId];
  if (current === "in_my_plays" || current === "used") return p;
  return { ...p, play_states: { ...p.play_states, [playId]: "explored" } };
}

export function markUsed(p: PlaybookProgress, playId: string): PlaybookProgress {
  return { ...p, play_states: { ...p.play_states, [playId]: "used" } };
}

function cardFor(play: Play): SavedPlayCard {
  const t = play.myPlaysTemplate;
  return {
    play_id: play.playId,
    play_version: play.playVersion,
    name: play.name,
    when: t.when,
    move: t.move,
    lookingFor: t.lookingFor,
    watchOut: t.watchOut,
    remember: t.remember,
  };
}

/** Save a play's executable output: version-stamp it, set state, add the My Plays card idempotently. */
export function recordOutput(p: PlaybookProgress, play: Play, payload: Record<string, unknown>): PlaybookProgress {
  return {
    ...p,
    play_states: { ...p.play_states, [play.playId]: "in_my_plays" },
    outputs: {
      ...p.outputs,
      [play.playId]: {
        output_schema_version: play.outputSchemaVersion,
        play_version: play.playVersion,
        payload,
      },
    },
    my_plays: p.my_plays.some((c) => c.play_id === play.playId) ? p.my_plays : [...p.my_plays, cardFor(play)],
  };
}
