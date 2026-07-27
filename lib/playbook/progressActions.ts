// Pure progress reducers (unit-testable, no React). ExperienceShell applies these
// through useProgress().update(). Functional data only; version-stamped (R2).

import type { FidelityOutcome, MissionReport, MissionState, Play, PlaybookProgress, SavedPlayCard } from "@/lib/playbook/contentSchema";
import { deriveUserLine } from "@/lib/playbook/outputSummary";

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

/** Record a completed simulation run into the separated simulation_state (Rev 3; additive).
 *  Functional/minimal: completion flag + the explicit fidelity outcome only. */
export function recordSimulationComplete(p: PlaybookProgress, simId: string, fidelity: FidelityOutcome): PlaybookProgress {
  const prev = p.simulation_state ?? { version: 1 };
  const runs = { ...(prev.runs ?? {}) };
  runs[simId] = { ...(runs[simId] ?? {}), completed: true, fidelity };
  return { ...p, simulation_state: { version: prev.version ?? 1, runs } };
}

// ---- Practice / mission state (Rev 3 Step 6; additive, functional-only) ----------
// Factual states only; no developmental claim is encoded here. Progression is NOT
// advanced here — that decision belongs to Use Review + Change Path (Steps 7/8).

/** The reader picked up the mission → it becomes the ONE current practice focus (state selected).
 *  Never downgrades an already attempted/reviewed mission. */
export function recordMissionSelected(p: PlaybookProgress, missionId: string): PlaybookProgress {
  const prev = p.practice_state ?? { version: 1 };
  const missions = { ...(prev.missions ?? {}) };
  const cur = missions[missionId];
  const state: MissionState = cur?.state === "attempted" || cur?.state === "reviewed" ? cur.state : "selected";
  missions[missionId] = { ...(cur ?? {}), state };
  return { ...p, practice_state: { version: prev.version ?? 1, currentMissionId: missionId, missions } };
}

/** The reader reports what happened. `attempted` advances the state (an Attempt — NOT
 *  success/fidelity). The non-attempt outcomes (no_opportunity / opportunity_not_taken /
 *  unsuitable) are recorded factually and DO NOT advance the state or count as failure.
 *  `stretchEligible` records only that an authored next stretch exists after a reported
 *  attempt — eligibility for consideration, never a recommendation. */
export function recordMissionReport(
  p: PlaybookProgress,
  missionId: string,
  report: MissionReport,
  opts: { stretchEligible?: boolean } = {},
): PlaybookProgress {
  const prev = p.practice_state ?? { version: 1 };
  const missions = { ...(prev.missions ?? {}) };
  const cur = missions[missionId] ?? { state: "selected" as MissionState };
  const state: MissionState = report === "attempted" ? "attempted" : cur.state;
  missions[missionId] = {
    ...cur,
    state,
    lastReport: report,
    ...(opts.stretchEligible !== undefined ? { stretchEligible: opts.stretchEligible } : {}),
  };
  return { ...p, practice_state: { version: prev.version ?? 1, currentMissionId: prev.currentMissionId, missions } };
}

function cardFor(play: Play, payload: Record<string, unknown>): SavedPlayCard {
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
    userLine: deriveUserLine(play, payload),
  };
}

/**
 * Save (or re-save via Update) a play's executable output: version-stamp it, set
 * state, and upsert its My Plays card so an updated output's userLine propagates.
 * `keepState` preserves an existing terminal state (e.g. "used") on Update.
 */
export function recordOutput(
  p: PlaybookProgress,
  play: Play,
  payload: Record<string, unknown>,
  keepState = false,
): PlaybookProgress {
  const card = cardFor(play, payload);
  const exists = p.my_plays.some((c) => c.play_id === play.playId);
  const priorState = p.play_states[play.playId];
  const nextState = keepState && priorState ? priorState : "in_my_plays";
  return {
    ...p,
    play_states: { ...p.play_states, [play.playId]: nextState },
    outputs: {
      ...p.outputs,
      [play.playId]: {
        output_schema_version: play.outputSchemaVersion,
        play_version: play.playVersion,
        payload,
      },
    },
    my_plays: exists ? p.my_plays.map((c) => (c.play_id === play.playId ? card : c)) : [...p.my_plays, card],
  };
}
