import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { changePath, operationSignals } from "../lib/playbook/changePath";
import { emptyProgress, type PlaybookProgress } from "../lib/playbook/contentSchema";

const RD = "read-and-decide";
const WM = "what-it-actually-means";
const RD_M = "mission-rd-read-before-react";
const WM_M = "mission-wm-narrowest-true-thing";
const base = () => emptyProgress("moving-beyond-rejection", 1);
const out = { output_schema_version: 1, play_version: 1, payload: {} };
const TRAIT = /attachment|anxious|avoidant|overthink|personality|diagnos|\btrait\b|fear of|good at|bad at|mastered|\bexpert\b|unlovable|broken|you are (an?|too|very|really)|you're (an?|too|very|really)/i;

// helpers to build focused fixtures
const recognizeRD = (p: PlaybookProgress): PlaybookProgress => ({ ...p, recognized: [...(p.recognized ?? []), "rec-evidence"] });
const reviewedRD = (performed: "yes" | "partly" | "no", stuck?: string, attemptCount = 1): PlaybookProgress => ({
  ...base(),
  practice_state: { version: 1, missions: { [RD_M]: { state: "reviewed", attemptCount } } },
  use_review_state: { version: 1, reviews: { [RD]: [{ performed, ...(stuck ? { stuck } : {}) }] } },
});
const selectedRD = (lastReport?: "no_opportunity" | "opportunity_not_taken" | "unsuitable"): PlaybookProgress => ({
  ...base(),
  practice_state: { version: 1, currentMissionId: RD_M, missions: { [RD_M]: { state: "selected", ...(lastReport ? { lastReport } : {}) } } },
});

// ---- Item 1: composable, not a global ladder ---------------------------------

test("signals are independent (composable) — not a single ordered stage", () => {
  // saved output with NO other play state
  const s1 = operationSignals(C, { ...base(), outputs: { [RD]: out } }, RD);
  assert.equal(s1.savedOutput, true);
  assert.equal(s1.inAppOperationAttempted, true);
  assert.equal(s1.missionSelected, false);
  assert.equal(s1.missionReviewed, false);
  // reviewed without the earlier simulation exposure recorded
  const s2 = operationSignals(C, reviewedRD("yes"), RD);
  assert.equal(s2.missionReviewed, true);
  assert.equal(s2.simulationExposed, false, "review does not require the sim signal");
});

test("'reviewed' is not 'more developed' than 'attempted'; review never auto-advances", () => {
  // RD reviewed (recent_exploration tier 2) vs WM mission attempted-not-reviewed (pending_review tier 3)
  const p: PlaybookProgress = {
    ...reviewedRD("yes"),
    practice_state: { version: 1, missions: { [RD_M]: { state: "reviewed", attemptCount: 1 }, [WM_M]: { state: "attempted" } } },
  };
  const cp = changePath(C, p);
  assert.equal(cp.focusPlayId, WM, "the pending review outranks the already-reviewed op");
  // and a lone reviewed op does not jump the reader to a different play automatically
  const solo = changePath(C, reviewedRD("yes"));
  assert.equal(solo.focusPlayId, RD, "focus stays the reviewed op — no auto-progression to another play");
});

// ---- Item 2: route from Use-Review CONTENTS ----------------------------------

test("routing differs by review contents (three materially different recommendations)", () => {
  const acting = changePath(C, reviewedRD("yes", "Acting on what I already saw")).nextStep ?? "";
  const readingGap = changePath(C, reviewedRD("no", "Reading it — telling saw-it from guessing")).nextStep ?? "";
  const feelingButClose = changePath(C, reviewedRD("yes", "The feeling got loud")).nextStep ?? "";

  assert.match(acting, /deciding what to do with that information/i, "closely + stuck acting → the acting step");
  assert.match(readingGap, /separating what you saw from what you're guessing/i, "not really + stuck reading → re-practice the read");
  assert.match(feelingButClose, /doesn't undo the work|keep using it/i, "feeling loud but performed closely → forward, not backward");

  assert.notEqual(acting, readingGap);
  assert.notEqual(acting, feelingButClose);
  assert.notEqual(readingGap, feelingButClose);
  // remaining discomfort + demonstrated fidelity never routes backward:
  assert.doesNotMatch(feelingButClose, /run another round|rehearse|start over/i);
});

// ---- Item 3: Transfer distinct from first Attempt ----------------------------

test("first real-world attempt vs accumulating Transfer evidence are distinguished", () => {
  const first = changePath(C, reviewedRD("yes", undefined, 1)).nextStep ?? "";
  const transfer = changePath(C, reviewedRD("yes", undefined, 2)).nextStep ?? "";
  assert.match(first, /take it into the next situation/i, "one attempt = first Attempt, not Transfer");
  assert.match(transfer, /more than one real situation/i, "≥2 attempts = accumulating use in another context");
  assert.notEqual(first, transfer);
});

test("BOUNDARY: Transfer informs a stretch but never a mastery/trait claim", () => {
  const transfer = changePath(C, reviewedRD("yes", undefined, 3)).nextStep ?? "";
  assert.ok(!TRAIT.test(transfer), `trait/mastery language: "${transfer}"`);
  assert.ok(!/mastered|you've got it down|expert|you are (good|great)/i.test(transfer));
});

// ---- Item 4: non-attempt outcomes handled distinctly -------------------------

test("non-attempt outcomes are distinct and no-fault (never inability/avoidance)", () => {
  const none = changePath(C, selectedRD("no_opportunity")).nextStep ?? "";
  const notTaken = changePath(C, selectedRD("opportunity_not_taken")).nextStep ?? "";
  const unsuitable = changePath(C, selectedRD("unsuitable")).nextStep ?? "";

  assert.match(none, /completely fine|whenever a moment/i, "no opportunity = neutral");
  assert.match(notTaken, /rehearse it once more/i, "not taken = invitation to rehearse");
  assert.match(unsuitable, /the skill working/i, "unsuitable = respect the decision");
  assert.notEqual(none, notTaken);
  assert.notEqual(notTaken, unsuitable);

  for (const s of [none, notTaken, unsuitable]) {
    assert.ok(!/can't|cannot|unable|you avoid|not ready|failed/i.test(s), `inability/failure language: "${s}"`);
  }
  // unsuitable must NOT tell the user to just repeat the same practice
  assert.doesNotMatch(unsuitable, /try (it )?again|run it again|repeat/i);
  assert.equal(changePath(C, selectedRD("unsuitable")).surfaced[0]?.kind, "explore");
});

// ---- Item 5: literature engagement influences literature surfacing only ------

test("BOUNDARY: literature engagement changes surfacing only — never the next-step claim or focus", () => {
  const p1 = recognizeRD(base());
  const p2: PlaybookProgress = { ...p1, literature_state: { version: 1, read: ["lit-play-rd"] } };
  const cp1 = changePath(C, p1);
  const cp2 = changePath(C, p2);
  assert.equal(cp1.nextStep, cp2.nextStep, "reading did not change the recommendation");
  assert.equal(cp1.focusPlayId, cp2.focusPlayId, "reading did not change the focus");
  // but it may steer WHICH literature is surfaced (avoid the already-read one)
  const understand = cp2.surfaced.find((s) => s.kind === "understand");
  assert.ok(understand?.literatureId && understand.literatureId !== "lit-play-rd", "surfaces a different, unread read");
});

// ---- Item 6: frozen focus priority -------------------------------------------

test("focus priority is frozen: declared > active mission > pending review > exploration > recognition", () => {
  // declared wins over an otherwise-higher inferred tier
  const declared: PlaybookProgress = {
    ...base(),
    recognized: ["rec-self-meaning"],
    practice_state: { version: 1, missions: { [WM_M]: { state: "selected" } } }, // WM active mission (tier 4)
    change_path_state: { version: 1, currentFocus: RD },
    // give RD some engagement so it's a valid declared focus
    outputs: { [RD]: out },
  };
  assert.equal(changePath(C, declared).focusPlayId, RD, "explicit selection outranks inferred relevance");

  // active mission (RD) > pending review (WM)
  const p2: PlaybookProgress = { ...base(), practice_state: { version: 1, missions: { [RD_M]: { state: "selected" }, [WM_M]: { state: "attempted" } } } };
  assert.equal(changePath(C, p2).focusReason, "active_mission");
  assert.equal(changePath(C, p2).focusPlayId, RD);

  // pending review (RD) > recent exploration (WM)
  const p3: PlaybookProgress = { ...base(), practice_state: { version: 1, missions: { [RD_M]: { state: "attempted" } } }, outputs: { [WM]: out } };
  assert.equal(changePath(C, p3).focusPlayId, RD);
  assert.equal(changePath(C, p3).focusReason, "pending_review");

  // recent exploration (RD saved) > recognition (WM recognized)
  const p4: PlaybookProgress = { ...base(), recognized: ["rec-self-meaning"], outputs: { [RD]: out } };
  assert.equal(changePath(C, p4).focusPlayId, RD);
  assert.equal(changePath(C, p4).focusReason, "recent_exploration");
});

// ---- Item 7: non-authoritative phrasing --------------------------------------

test("recommendations are non-authoritative and Explore is always available", () => {
  const scenarios: PlaybookProgress[] = [
    recognizeRD(base()),
    { ...base(), outputs: { [RD]: out } },
    { ...base(), practice_state: { version: 1, missions: { [RD_M]: { state: "attempted" } } } },
    reviewedRD("partly", "Acting on what I already saw"),
    reviewedRD("yes", undefined, 2),
  ];
  for (const p of scenarios) {
    const cp = changePath(C, p);
    const s = cp.nextStep ?? "";
    assert.ok(!/\byou must\b|\byou should\b|\byou need to\b|the single|the correct next|the only/i.test(s), `authoritative: "${s}"`);
    assert.ok(cp.surfaced.some((x) => x.kind === "explore"), "Explore another area is always offered");
    assert.ok(!TRAIT.test(s), `trait language: "${s}"`);
  }
});

// ---- Item 8: fail-soft state handling ----------------------------------------

test("fail-soft: stale / incomplete / obsolete state never crashes or infers negatively", () => {
  // saved output with NO play_state (incomplete but recoverable)
  const incomplete: PlaybookProgress = { ...base(), outputs: { [RD]: out } };
  const ci = changePath(C, incomplete);
  assert.equal(ci.focusPlayId, RD);
  assert.match(ci.nextStep ?? "", /take it into real life/i, "does not tell the reader to start over");

  // historic/v0-style output (odd versions) still counts as saved work
  const historic: PlaybookProgress = { ...base(), outputs: { [RD]: { output_schema_version: 99, play_version: 42, payload: { legacy: true } } } };
  assert.equal(operationSignals(C, historic, RD).savedOutput, true, "historic output is not discarded");

  // obsolete content references + missing focus + unknown keys — must not throw
  const obsoleteRaw: Record<string, unknown> = {
    ...base(),
    practice_state: { version: 1, currentMissionId: "ghost-mission", missions: { "ghost-mission": { state: "attempted" } } },
    use_review_state: { version: 1, reviews: { "ghost-play": { performed: "yes" } } },
    change_path_state: { version: 1, currentFocus: "ghost-play" },
    simulation_state: { version: 1, runs: { "ghost-sim": { completed: true } } },
    mystery: { mood: "sad" }, // an unknown extra field the orchestrator must ignore
  };
  const obsolete = obsoleteRaw as unknown as PlaybookProgress;
  assert.doesNotThrow(() => changePath(C, obsolete));
  const co = changePath(C, obsolete);
  assert.ok(co.focusPlayId === null || C.plays.some((p) => p.playId === co.focusPlayId), "focus is a real play or null");
});
