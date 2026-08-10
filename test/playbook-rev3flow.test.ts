import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/finding-love-that-feels-mutual";
import { simulationForPlay, playLiterature, screensWithoutLiterature } from "../lib/playbook/rev3Flow";
import { recordSimulationComplete } from "../lib/playbook/progressActions";
import { emptyProgress } from "../lib/playbook/contentSchema";

const RD = C.plays.find((p) => p.playId === "read-and-decide")!;
const WM = C.plays.find((p) => p.playId === "what-it-actually-means")!;

test("each built Play has a simulation to follow", () => {
  assert.equal(simulationForPlay(C, "read-and-decide")?.signature, "evidenceTimeline");
  assert.equal(simulationForPlay(C, "what-it-actually-means")?.signature, "conclusionNarrowing");
  assert.equal(simulationForPlay(C, "not-a-play"), undefined);
});

test("literature is extracted: the Rev 3 Play drops the in-Play literature screen; v0 content is untouched", () => {
  assert.ok(RD.screens.some((s) => s.kind === "literature"), "v0 Play still carries its literature screen");
  const rev3Screens = screensWithoutLiterature(RD);
  assert.ok(!rev3Screens.some((s) => s.kind === "literature"), "Rev 3 Play has no literature screen");
  assert.equal(rev3Screens.length, RD.screens.length - 1, "exactly one screen removed");
  // the shared content object is not mutated
  assert.ok(RD.screens.some((s) => s.kind === "literature"), "original screens unchanged after filtering");
});

test("play-scope literature resolves for each Play (the extracted education)", () => {
  assert.deepEqual(playLiterature(C, "read-and-decide").map((e) => e.id), ["lit-play-rd"]);
  assert.deepEqual(playLiterature(C, "what-it-actually-means").map((e) => e.id), ["lit-play-wm"]);
});

test("recordSimulationComplete writes minimal functional state (additive, version-stamped)", () => {
  const p0 = emptyProgress("finding-love-that-feels-mutual", 1);
  const fid = { signature: "evidenceTimeline", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" } as const;
  const p1 = recordSimulationComplete(p0, "sim-rd-shorter-texts", fid);
  assert.equal(p1.simulation_state?.version, 1);
  assert.deepEqual(p1.simulation_state?.runs?.["sim-rd-shorter-texts"], { completed: true, fidelity: fid });
  // additive — untouched elsewhere, and other runs preserved on a second write
  assert.deepEqual(p1.recognized, []);
  const p2 = recordSimulationComplete(p1, "sim-wm-not-a-match", { signature: "conclusionNarrowing", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
  assert.ok(p2.simulation_state?.runs?.["sim-rd-shorter-texts"]?.completed, "prior run preserved");
  assert.ok(p2.simulation_state?.runs?.["sim-wm-not-a-match"]?.completed);
});
