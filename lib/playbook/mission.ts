// Rev 3 Step 6 — Practice layer pure helpers (no I/O). Progression is an authored
// "next stretch", not a level: `currentInstruction` resolves the active rung's copy,
// `nextRung` finds the following stretch (if any). No mastery is implied by completion.

import type { Mission, MissionRung } from "@/lib/playbook/contentSchema";

/** The instruction the reader is currently practicing (base, or the active rung). */
export function currentInstruction(mission: Mission, rungId?: string): string {
  if (!rungId) return mission.instruction;
  return mission.progression?.find((r) => r.id === rungId)?.instruction ?? mission.instruction;
}

/** CONTENT ORDERING ONLY. Answers "what is the authored next stretch?" — NOT "is this
 *  reader ready for it?". Readiness/recommendation logic lives outside this pure helper
 *  (Use Review + Change Path). Returns undefined if there is no further authored stretch. */
export function nextRung(mission: Mission, rungId?: string): MissionRung | undefined {
  const prog = mission.progression ?? [];
  if (prog.length === 0) return undefined;
  if (!rungId) return prog[0];
  const i = prog.findIndex((r) => r.id === rungId);
  return i >= 0 && i + 1 < prog.length ? prog[i + 1] : undefined;
}
