import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { MBR_MISSIONS } from "../content/playbook/moving-beyond-rejection-missions";
import { missionForPlay } from "../lib/playbook/rev3Flow";
import { currentInstruction, nextRung } from "../lib/playbook/mission";
import { recordMissionSelected, recordMissionAttempted, advanceMissionRung } from "../lib/playbook/progressActions";
import { emptyProgress } from "../lib/playbook/contentSchema";

const builtPlayIds = new Set(C.plays.map((p) => p.playId));
const RD = MBR_MISSIONS.find((m) => m.playId === "read-and-decide")!;

test("each built Play has a behaviorally-specific mission tied to its operation", () => {
  assert.equal(MBR_MISSIONS.length, 2);
  for (const m of MBR_MISSIONS) {
    assert.ok(builtPlayIds.has(m.playId), `${m.id} targets a built play`);
    assert.ok(m.instruction.trim().length > 20, `${m.id} instruction is specific`);
    assert.ok(m.linkToOperation.trim().length > 0, `${m.id} links to the operation`);
    assert.ok(m.suitability && m.suitability.length > 0, `${m.id} has a suitability boundary`);
  }
  assert.equal(missionForPlay(C, "read-and-decide")?.id, RD.id);
});

test("NO gamification anywhere in mission content", () => {
  const banned = /(level\b|xp\b|streak|badge|rank\b|leaderboard|points?\b|\d+%|score)/i;
  for (const m of MBR_MISSIONS) {
    const text = [m.instruction, m.linkToOperation, m.suitability ?? "", ...(m.progression ?? []).map((r) => r.instruction)].join(" ");
    assert.ok(!banned.test(text), `${m.id}: gamification language present`);
  }
});

test("missions never prompt partner surveillance/monitoring", () => {
  const banned = /(track (them|him|her)|monitor|check their|spy|their phone|read their|surveil|keep tabs)/i;
  for (const m of MBR_MISSIONS) {
    assert.ok(!banned.test(m.instruction + " " + m.linkToOperation), `${m.id}: partner-monitoring language`);
  }
});

test("progression is a next-stretch, not a level; resolves correctly", () => {
  assert.equal(currentInstruction(RD), RD.instruction, "base instruction with no rung");
  const n = nextRung(RD);
  assert.ok(n, "a next stretch exists");
  assert.equal(currentInstruction(RD, n!.id), n!.instruction, "rung instruction resolves");
  assert.equal(nextRung(RD, n!.id), undefined, "no further stretch after the last rung");
});

test("mission state reducers are additive and version-stamped", () => {
  const p0 = emptyProgress("moving-beyond-rejection", 1);
  const p1 = recordMissionSelected(p0, RD.id);
  assert.equal(p1.practice_state?.version, 1);
  assert.equal(p1.practice_state?.missions?.[RD.id]?.state, "assigned");
  const p2 = recordMissionAttempted(p1, RD.id);
  assert.equal(p2.practice_state?.missions?.[RD.id]?.state, "attempted");
  const rung = nextRung(RD)!;
  const p3 = advanceMissionRung(p2, RD.id, rung.id);
  assert.equal(p3.practice_state?.missions?.[RD.id]?.state, "advanced");
  assert.equal(p3.practice_state?.missions?.[RD.id]?.rungId, rung.id);
  // additive — other state untouched
  assert.deepEqual(p3.recognized, []);
});
