import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { rev3Play } from "../content/playbook/moving-beyond-rejection-rev3-copy";
import type { Screen } from "../lib/playbook/contentSchema";

const RD = C.plays.find((p) => p.playId === "read-and-decide")!;
const WM = C.plays.find((p) => p.playId === "what-it-actually-means")!;
const sorts = (screens: Screen[]) => screens.filter((s): s is Extract<Screen, { kind: "scenarioSort" }> => s.kind === "scenarioSort");

test("v0 content is untouched by the Rev 3 copy transform", () => {
  // original still has its literature screen and its original Shift wording
  assert.ok(RD.screens.some((s) => s.kind === "literature"), "v0 keeps the literature screen");
  const v0Shift = RD.screens.find((s) => s.kind === "shift") as Extract<Screen, { kind: "shift" }>;
  assert.match(v0Shift.body[0], /an unclear signal can turn into a whole story/i, "v0 Shift copy unchanged");
});

test("rev3Play extracts literature and tightens the Shift copy (Rev 3 path only)", () => {
  const r = rev3Play(RD);
  assert.ok(!r.screens.some((s) => s.kind === "literature"), "no literature screen on the Rev 3 path");
  const shift = r.screens.find((s) => s.kind === "shift") as Extract<Screen, { kind: "shift" }>;
  assert.match(shift.body[0], /one unclear signal can turn into a whole story/i, "Rev 3 Shift tightened");
});

test("structure/logic is preserved — only wording changes", () => {
  const v0 = sorts(RD.screens);
  const r = sorts(rev3Play(RD).screens);
  assert.equal(r.length, v0.length, "same scenario sorts");
  for (let i = 0; i < r.length; i++) {
    assert.deepEqual(r[i].items.map((it) => it.id), v0[i].items.map((it) => it.id), "item ids unchanged");
    assert.deepEqual(r[i].items.map((it) => it.correctBucket), v0[i].items.map((it) => it.correctBucket), "correctBucket unchanged");
    assert.deepEqual(r[i].buckets, v0[i].buckets, "buckets unchanged");
  }
  // Rule Builder action options unchanged
  const rb0 = RD.screens.find((s): s is Extract<Screen, { kind: "ruleBuilder" }> => s.kind === "ruleBuilder")!;
  const rbR = rev3Play(RD).screens.find((s): s is Extract<Screen, { kind: "ruleBuilder" }> => s.kind === "ruleBuilder")!;
  assert.deepEqual(rbR.actions, rb0.actions, "rule actions unchanged");
});

test("Rule Builder guardrail is unmistakable (own behaviour, not control/chase/deadline)", () => {
  const rb = rev3Play(RD).screens.find((s): s is Extract<Screen, { kind: "ruleBuilder" }> => s.kind === "ruleBuilder")!;
  const g = rb.controlCheck.toLowerCase();
  assert.ok(g.includes("what you do"), "frames it as the user's own behaviour");
  assert.ok(g.includes("not a way to control"), "not controlling the other person");
  assert.ok(g.includes("chase"), "not making them chase");
  assert.ok(g.includes("deadline"), "not an artificial deadline");
});

test("WM keeps the real-pattern vs global-verdict distinction (a pattern is never called imaginary)", () => {
  const r = rev3Play(WM);
  const patternSort = sorts(r.screens).find((s) => s.buckets.some((b) => /observation to keep/i.test(b.label)))!;
  assert.ok(patternSort, "the real-pattern sort is present");
  assert.ok(patternSort.buckets.some((b) => /verdict to drop/i.test(b.label)), "verdict-to-drop bucket kept");
  assert.match(patternSort.prompt, /we won't tell you it's imaginary/i, "the pattern is explicitly not dismissed as imaginary");
  assert.match(patternSort.note ?? "", /a real pattern is worth looking at/i, "pattern is real and worth examining");
});

test("WM keeps the emotion beat's 'this can still hurt' and mental-health signpost", () => {
  const r = rev3Play(WM);
  const beat = r.screens.find((s): s is Extract<Screen, { kind: "emotionBeat" }> => s.kind === "emotionBeat")!;
  assert.match(beat.body.join(" "), /this can still hurt/i);
  assert.match(r.supportSignposts?.[0]?.body ?? "", /mental health professional/i, "safety signpost preserved");
});
