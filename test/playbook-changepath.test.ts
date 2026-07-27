import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { changePath, playStage } from "../lib/playbook/changePath";
import { emptyProgress, type PlaybookProgress } from "../lib/playbook/contentSchema";

const RD = "read-and-decide";
const base = () => emptyProgress("moving-beyond-rejection", 1);

// Trait / etiology / forbidden-inference constructions that must NEVER appear in a next-step
// line. (Bare pronouns like "when you're ready" are fine; the ban targets trait CLAIMS.)
const TRAIT = /attachment|anxious|avoidant|overthink|personality|diagnos|\btrait\b|fear of|good at|bad at|mastered|\bexpert\b|unlovable|broken|you tend to|you always|you never|you are (an?|too|very|really)|you're (an?|too|very|really)/i;

test("stage is derived ONLY from functional interaction state, and progresses monotonically", () => {
  let p = base();
  assert.equal(playStage(C, p, RD), "unrecognized");
  p = { ...p, recognized: ["rec-evidence"] };
  assert.equal(playStage(C, p, RD), "recognized");
  p = { ...p, simulation_state: { version: 1, runs: { "sim-rd-shorter-texts": { completed: true } } } };
  assert.equal(playStage(C, p, RD), "in_progress");
  p = { ...p, outputs: { [RD]: { output_schema_version: 1, play_version: 1, payload: {} } } };
  assert.equal(playStage(C, p, RD), "practiced_in_app");
  p = { ...p, practice_state: { version: 1, missions: { "mission-rd-read-before-react": { state: "attempted" } } } };
  assert.equal(playStage(C, p, RD), "attempted");
  p = { ...p, use_review_state: { version: 1, reviews: { [RD]: { performed: "partly" } } } };
  assert.equal(playStage(C, p, RD), "reviewed");
});

test("next-step is context-bound and observation-not-trait at every stage", () => {
  const progresses: PlaybookProgress[] = [
    { ...base(), recognized: ["rec-evidence"] },
    { ...base(), recognized: ["rec-evidence"], simulation_state: { version: 1, runs: { "sim-rd-shorter-texts": { completed: true } } } },
    { ...base(), recognized: ["rec-evidence"], outputs: { [RD]: { output_schema_version: 1, play_version: 1, payload: {} } } },
    { ...base(), practice_state: { version: 1, missions: { "mission-rd-read-before-react": { state: "attempted" } } } },
    { ...base(), use_review_state: { version: 1, reviews: { [RD]: { performed: "yes" } } } },
  ];
  for (const p of progresses) {
    const step = changePath(C, p).nextStep ?? "";
    assert.ok(!TRAIT.test(step), `trait/forbidden language: "${step}"`);
    assert.ok(!/you (must|should|need to)\b/i.test(step), `no prescriptive verdict: "${step}"`);
  }
});

test("Pattern A: reviewed + partly + stuck-on-acting → points at the acting step (not a trait)", () => {
  const p: PlaybookProgress = { ...base(), use_review_state: { version: 1, reviews: { [RD]: { performed: "partly", stuck: "Acting on what I already saw" } } } };
  const cp = changePath(C, p);
  assert.equal(cp.focusPlayId, RD);
  assert.match(cp.nextStep ?? "", /deciding what to do with that information/i);
  assert.ok(!TRAIT.test(cp.nextStep ?? ""));
});

test("BOUNDARY: reading literature never advances a stage or changes the next-step claim", () => {
  const p1: PlaybookProgress = { ...base(), recognized: ["rec-evidence"] };
  const p2: PlaybookProgress = { ...p1, literature_state: { version: 1, read: ["lit-play-rd", "lit-what-is-dfc"] } };
  assert.equal(playStage(C, p2, RD), "recognized", "reading did not advance the stage");
  assert.deepEqual(changePath(C, p2), changePath(C, p1), "reading did not change the recommendation claim");
});

test("BOUNDARY: absence of an attempt is an invitation, never inability/avoidance/a verdict", () => {
  assert.equal(changePath(C, base()).nextStep, null, "nothing done yet → no verdict");
  const recognized: PlaybookProgress = { ...base(), recognized: ["rec-evidence"] };
  const step = changePath(C, recognized).nextStep ?? "";
  assert.match(step, /a good place to start/i, "an invitation");
  assert.ok(!/can't|cannot|avoid|unable|not ready/i.test(step));
});

test("BOUNDARY: Keep/Update (tool review) alone never produces a transfer/mastery claim", () => {
  const p: PlaybookProgress = { ...base(), use_review_state: { version: 1, reviews: { [RD]: { performed: "partly", kept: true } } } };
  const step = changePath(C, p).nextStep ?? "";
  assert.ok(!/transfer|mastered|you've mastered|got it down|expert/i.test(step));
});

test("focus is the furthest-along INCOMPLETE recognized area; declared focus is respected", () => {
  // RD practiced-in-app, WM only recognized → focus RD (furthest incomplete)
  const p: PlaybookProgress = {
    ...base(),
    recognized: ["rec-evidence", "rec-self-meaning"],
    outputs: { [RD]: { output_schema_version: 1, play_version: 1, payload: {} } },
  };
  assert.equal(changePath(C, p).focusPlayId, RD);
  // a declared focus that is still active wins
  const declared: PlaybookProgress = { ...p, change_path_state: { version: 1, currentFocus: "what-it-actually-means" } };
  assert.equal(changePath(C, declared).focusPlayId, "what-it-actually-means");
});
