import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import type { Screen } from "../lib/playbook/contentSchema";

const RD = C.plays.find((p) => p.playId === "read-and-decide")!;
const WM = C.plays.find((p) => p.playId === "what-it-actually-means")!;
const textOf = (p: unknown = C) => JSON.stringify(p).toLowerCase();

test("success is never defined by a relationship outcome (fidelity is technique-based)", () => {
  for (const play of C.plays) {
    const f = (play.fidelity.correct + " " + play.fidelity.notMeaning).toLowerCase();
    for (const outcome of ["got chosen", "texted back", "stayed together", "found a partner", "they commit", "the date went well"]) {
      assert.ok(!f.includes(outcome), `${play.playId} fidelity must not equate success with "${outcome}"`);
    }
  }
});

test("Read It, Then Decide uses a congruence principle, not 'actions always beat words'", () => {
  const sorts = RD.screens.filter((s): s is Extract<Screen, { kind: "scenarioSort" }> => s.kind === "scenarioSort");
  const notes = sorts.map((s) => (s.note ?? "").toLowerCase()).join(" ");
  assert.ok(notes.includes("mismatch") || notes.includes("line up"), "teaches congruence/mismatch");
  assert.ok(!textOf(RD).includes("actions are usually the clearer signal"), "no 'actions > words' absolute");
  assert.ok(!textOf(RD).includes("actions speak louder"), "no 'actions speak louder' cliché");
});

test("investment/decision language is user-choice, never scorekeeping or mirroring", () => {
  const rb = RD.screens.find((s): s is Extract<Screen, { kind: "ruleBuilder" }> => s.kind === "ruleBuilder")!;
  const actions = rb.actions.join(" | ").toLowerCase();
  // the ACTIONS the user can pick must never prescribe dating-game behavior
  for (const banned of ["mirror", "match their", "text back in", "stop texting first", "pull back", "give less", "make them chase", "count"]) {
    assert.ok(!actions.includes(banned), `no dating-game phrasing in the action options: ${banned}`);
  }
  // scorekeeping may appear ONLY to disclaim it — never as an instruction
  assert.ok(textOf(RD).includes("isn't suspicion or scorekeeping"), "RD explicitly disclaims scorekeeping");
  assert.ok(!textOf(RD).includes("tit-for-tat"), "no tit-for-tat framing");
});

test("What It Actually Means does not become positive thinking; flags 'their loss' as an error", () => {
  const f = WM.fidelity;
  assert.match(f.notMeaning, /not positive thinking|positive thinking/i);
  assert.ok(f.misuse.some((m) => /their loss/i.test(m)), "'their loss' listed as a misapplication, not a goal");
});

test("the user can remain sad/disappointed and still complete T1a (feeling ≠ failure)", () => {
  assert.ok(WM.screens.some((s) => s.kind === "emotionBeat"), "T1a has an emotion-acknowledgment beat");
  const beat = WM.screens.find((s): s is Extract<Screen, { kind: "emotionBeat" }> => s.kind === "emotionBeat")!;
  assert.ok(beat.body.join(" ").toLowerCase().includes("can still hurt"), "keeps the hurt");
  assert.match(WM.fidelity.correct, /doesn't require you to feel better|does not require you to feel better/i);
});

test("T1a pattern branch preserves the observed pattern and routes without inventing a cause", () => {
  assert.equal(WM.routing?.toPlayId, "read-and-decide");
  // the pattern scenario keeps the recurrence as an observation to KEEP (not a verdict)
  const patternSort = WM.screens.find(
    (s): s is Extract<Screen, { kind: "scenarioSort" }> => s.kind === "scenarioSort" && /became less available/i.test(s.situation),
  )!;
  assert.ok(patternSort.buckets.some((b) => /observation to keep/i.test(b.label)), "recurrence preserved as an observation");
  assert.ok(patternSort.buckets.some((b) => /verdict to drop/i.test(b.label)), "global verdict is what gets dropped");
});
