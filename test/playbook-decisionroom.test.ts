import { test } from "node:test";
import assert from "node:assert/strict";
import { RGU_SIMULATION, RGU_PLAY_ID } from "../content/playbook/rest-or-giving-up";
import { aggregateFidelity, resolveRevealContent, validateSimulation } from "../lib/playbook/simulation";
import type { SimNode } from "../lib/playbook/contentSchema";
import { validateEvent } from "../lib/playbook/events";

const revealNode = RGU_SIMULATION.nodes.find((n): n is Extract<SimNode, { kind: "reveal" }> => n.kind === "reveal")!;

// ---- fidelity: intentional stance (incl. pause) + forever-conclusion distinction ----

test("decisionRoom: a bounded read + a stance → intentional + distinguished; stance captured", () => {
  const f = aggregateFidelity(RGU_SIMULATION, { "rgu-c1": "rest", "rgu-c2": "rest" });
  assert.ok(f.signature === "decisionRoom");
  assert.equal(f.intentional_stance_selected, "demonstrated");
  assert.equal(f.discouragement_distinguished_from_conclusion, "demonstrated"); // never picked the forever read
  assert.equal(f.chosen_stance, "rest");
});

test("decisionRoom: pause_decision is a legitimate intentional stance (not a non-answer)", () => {
  const f = aggregateFidelity(RGU_SIMULATION, { "rgu-c1": "discouraged", "rgu-c2": "pause" });
  assert.ok(f.signature === "decisionRoom");
  assert.equal(f.intentional_stance_selected, "demonstrated");
  assert.equal(f.chosen_stance, "pause_decision");
});

test("decisionRoom: forever read but distinguished at the reconsider → distinguished demonstrated", () => {
  const f = aggregateFidelity(RGU_SIMULATION, { "rgu-c1": "forever", "rgu-r1": "decide-now", "rgu-c2": "not-now" });
  assert.ok(f.signature === "decisionRoom");
  assert.equal(f.discouragement_distinguished_from_conclusion, "demonstrated");
  assert.equal(f.chosen_stance, "not_now");
});

test("decisionRoom: re-asserting the forever framing → distinguished NOT demonstrated (non-punitive)", () => {
  const f = aggregateFidelity(RGU_SIMULATION, { "rgu-c1": "forever", "rgu-r1": "hold-forever", "rgu-c2": "later" });
  assert.ok(f.signature === "decisionRoom");
  assert.equal(f.discouragement_distinguished_from_conclusion, "not_demonstrated");
  assert.equal(f.intentional_stance_selected, "demonstrated", "still chose a stance for now");
  assert.equal(f.chosen_stance, "return_later");
});

test("decisionRoom: no stance chosen yet → not a false positive; defaults to pause", () => {
  const f = aggregateFidelity(RGU_SIMULATION, { "rgu-c1": "rest" });
  assert.ok(f.signature === "decisionRoom");
  assert.equal(f.intentional_stance_selected, "not_demonstrated");
  assert.equal(f.chosen_stance, "pause_decision");
});

// ---- reveal: the stance summary is the chosen, revisitable stance -----------------

test("reveal stance summary reflects the chosen stance (rest)", () => {
  const rv = resolveRevealContent(revealNode, RGU_SIMULATION, { "rgu-c2": "rest" });
  assert.match(rv.summary ?? "", /setting dating down for a while/i);
  assert.ok(rv.paragraphs.length > 0, "revisitable framing preserved");
});

test("reveal stance summary reflects the chosen stance (pause)", () => {
  const rv = resolveRevealContent(revealNode, RGU_SIMULATION, { "rgu-c2": "pause" });
  assert.match(rv.summary ?? "", /letting a low moment settle/i);
});

// ---- graph validity + handoff + event payload -----------------------------------

test("the decisionRoom simulation is a valid graph handing off to its Play", () => {
  const errs = validateSimulation(RGU_SIMULATION, new Set([RGU_PLAY_ID]));
  assert.deepEqual(errs, [], "sim errors: " + errs.join("; "));
});

test("the decisionRoom completion payload (incl. chosen_stance) passes the event registry", () => {
  const f = aggregateFidelity(RGU_SIMULATION, { "rgu-c1": "forever", "rgu-r1": "decide-now", "rgu-c2": "rest" });
  const r = validateEvent({
    action_id: "a-1", playbook_key: "moving-beyond-rejection", playbook_version: 1,
    object_type: "simulation", object_id: RGU_SIMULATION.id, object_version: 1,
    event_type: "simulation_completed", payload: f,
  });
  assert.deepEqual(r, { ok: true, schema_version: 3 });
});
