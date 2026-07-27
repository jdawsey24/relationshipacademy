import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { MBR_MISSIONS } from "../content/playbook/moving-beyond-rejection-missions";
import { missionForPlay } from "../lib/playbook/rev3Flow";
import { currentInstruction, nextRung } from "../lib/playbook/mission";
import { recordMissionSelected, recordMissionReport } from "../lib/playbook/progressActions";
import { emptyProgress } from "../lib/playbook/contentSchema";

const builtPlayIds = new Set(C.plays.map((p) => p.playId));
const RD = MBR_MISSIONS.find((m) => m.playId === "read-and-decide")!;

test("each built Play has a titled, behaviorally-specific mission tied to its operation", () => {
  assert.equal(MBR_MISSIONS.length, 2);
  for (const m of MBR_MISSIONS) {
    assert.ok(builtPlayIds.has(m.playId), `${m.id} targets a built play`);
    assert.ok(m.title.trim().length > 0, `${m.id} has a title`);
    assert.ok(m.instruction.trim().length > 20, `${m.id} instruction is specific`);
    assert.ok(m.linkToOperation.trim().length > 0, `${m.id} links to the operation`);
    assert.ok(m.attemptMeaning && m.attemptMeaning.length > 0, `${m.id} says what counts as an attempt`);
    assert.ok(m.suitability && m.suitability.length > 0, `${m.id} has a suitability boundary`);
  }
  assert.equal(missionForPlay(C, "read-and-decide")?.id, RD.id);
});

test("NO gamification anywhere in mission content", () => {
  const banned = /(\blevel\b|\bxp\b|streak|badge|\brank\b|leaderboard|\d+ points|\d+%|\bscore\b)/i;
  for (const m of MBR_MISSIONS) {
    const text = [m.title, m.instruction, m.linkToOperation, m.attemptMeaning ?? "", m.suitability ?? "", ...(m.progression ?? []).map((r) => r.instruction)].join(" ");
    assert.ok(!banned.test(text), `${m.id}: gamification language present`);
  }
});

test("missions never prompt partner surveillance/monitoring", () => {
  const banned = /(track (them|him|her)|monitor|check their|spy|their phone|read their|surveil|keep tabs)/i;
  for (const m of MBR_MISSIONS) {
    assert.ok(!banned.test(m.instruction + " " + m.linkToOperation), `${m.id}: partner-monitoring language`);
  }
});

test("nextRung is content ordering only (answers 'what is the next stretch', not readiness)", () => {
  assert.equal(currentInstruction(RD), RD.instruction, "base instruction with no rung");
  const n = nextRung(RD);
  assert.ok(n, "a next authored stretch exists");
  assert.equal(currentInstruction(RD, n!.id), n!.instruction, "rung instruction resolves");
  assert.equal(nextRung(RD, n!.id), undefined, "no further stretch after the last rung");
});

test("selecting sets ONE current focus (state selected); does not downgrade attempted", () => {
  const p0 = emptyProgress("moving-beyond-rejection", 1);
  const p1 = recordMissionSelected(p0, RD.id);
  assert.equal(p1.practice_state?.currentMissionId, RD.id, "one active focus");
  assert.equal(p1.practice_state?.missions?.[RD.id]?.state, "selected");
  const p2 = recordMissionReport(p1, RD.id, "attempted", { stretchEligible: true });
  const p3 = recordMissionSelected(p2, RD.id);
  assert.equal(p3.practice_state?.missions?.[RD.id]?.state, "attempted", "re-select does not downgrade");
});

test("attempt advances state + records eligibility; non-attempt reports are factual, not failure", () => {
  const p0 = recordMissionSelected(emptyProgress("moving-beyond-rejection", 1), RD.id);
  const attempted = recordMissionReport(p0, RD.id, "attempted", { stretchEligible: true });
  assert.equal(attempted.practice_state?.missions?.[RD.id]?.state, "attempted");
  assert.equal(attempted.practice_state?.missions?.[RD.id]?.lastReport, "attempted");
  assert.equal(attempted.practice_state?.missions?.[RD.id]?.stretchEligible, true, "eligibility recorded, not a recommendation");

  const unsuitable = recordMissionReport(p0, RD.id, "unsuitable");
  assert.equal(unsuitable.practice_state?.missions?.[RD.id]?.state, "selected", "non-attempt does not advance state");
  assert.equal(unsuitable.practice_state?.missions?.[RD.id]?.lastReport, "unsuitable");
  assert.equal(unsuitable.practice_state?.missions?.[RD.id]?.stretchEligible, undefined, "no stretch eligibility without an attempt");

  const noOpp = recordMissionReport(p0, RD.id, "no_opportunity");
  assert.equal(noOpp.practice_state?.missions?.[RD.id]?.state, "selected", "absence of an attempt is not failure");
});
