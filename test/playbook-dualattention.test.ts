import { test } from "node:test";
import assert from "node:assert/strict";
import { ITR_SIMULATION, ITR_PLAY_ID } from "../content/playbook/is-this-right-for-you";
import { aggregateFidelity, resolveRevealContent, validateSimulation } from "../lib/playbook/simulation";
import type { SimNode } from "../lib/playbook/contentSchema";
import { validateEvent } from "../lib/playbook/events";

const revealNode = ITR_SIMULATION.nodes.find((n): n is Extract<SimNode, { kind: "reveal" }> => n.kind === "reveal")!;

// ---- fidelity aggregation (data-driven from per-option `signal` tags) ----------

test("dualAttention fidelity: held-both + a fit read → both signals demonstrated", () => {
  const f = aggregateFidelity(ITR_SIMULATION, { "itr-d1": "fit", "itr-d2": "fit", "itr-r1": "both" });
  assert.equal(f.signature, "dualAttention");
  assert.ok(f.signature === "dualAttention");
  assert.equal(f.fit_information_kept_in_view, "demonstrated");
  assert.equal(f.evaluator_stance_held, "demonstrated");
});

test("dualAttention fidelity: a fit read but the reconsider collapses → stance NOT demonstrated", () => {
  const f = aggregateFidelity(ITR_SIMULATION, { "itr-d1": "fit", "itr-r1": "mostly-them" });
  assert.ok(f.signature === "dualAttention");
  assert.equal(f.fit_information_kept_in_view, "demonstrated");
  assert.equal(f.evaluator_stance_held, "not_demonstrated");
});

test("dualAttention fidelity: 'both' without any fit read → stance NOT demonstrated (needs fit kept)", () => {
  const f = aggregateFidelity(ITR_SIMULATION, { "itr-d1": "interest", "itr-d2": "dismiss", "itr-r1": "both" });
  assert.ok(f.signature === "dualAttention");
  assert.equal(f.fit_information_kept_in_view, "not_demonstrated");
  assert.equal(f.evaluator_stance_held, "not_demonstrated");
});

test("dualAttention fidelity: no fit read anywhere → both not_demonstrated", () => {
  const f = aggregateFidelity(ITR_SIMULATION, { "itr-d1": "interest", "itr-d2": "smooth", "itr-r1": "mostly-them" });
  assert.ok(f.signature === "dualAttention");
  assert.equal(f.fit_information_kept_in_view, "not_demonstrated");
  assert.equal(f.evaluator_stance_held, "not_demonstrated");
});

// ---- computed reveal (mirror reports OBSERVED CHOICES, not measured attention) --

test("reveal computedSummary → 'both' when the reader held both streams", () => {
  const rv = resolveRevealContent(revealNode, ITR_SIMULATION, { "itr-d1": "fit", "itr-r1": "both" });
  assert.match(rv.summary ?? "", /held both streams/i);
  assert.ok(rv.paragraphs.length > 0, "static fact recap preserved");
});

test("reveal computedSummary → 'evaluation active' when a fit read was kept but not the explicit both", () => {
  const rv = resolveRevealContent(revealNode, ITR_SIMULATION, { "itr-d2": "fit", "itr-r1": "mostly-them" });
  assert.match(rv.summary ?? "", /kept your own evaluation active/i);
});

test("reveal computedSummary → 'interest' when choices leaned toward their interest", () => {
  const rv = resolveRevealContent(revealNode, ITR_SIMULATION, { "itr-d1": "interest", "itr-r1": "mostly-them" });
  assert.match(rv.summary ?? "", /leaned mostly toward whether they were interested/i);
});

// ---- graph validity + handoff + event payload ---------------------------------

test("the dualAttention simulation is a valid graph handing off to its Play", () => {
  const errs = validateSimulation(ITR_SIMULATION, new Set([ITR_PLAY_ID]));
  assert.deepEqual(errs, [], "sim errors: " + errs.join("; "));
  const teach = ITR_SIMULATION.nodes.find((n) => n.kind === "teach");
  assert.ok(teach && teach.kind === "teach" && teach.toPlayId === ITR_PLAY_ID);
});

test("the signature-tagged dualAttention completion payload passes the event registry", () => {
  const f = aggregateFidelity(ITR_SIMULATION, { "itr-d1": "fit", "itr-r1": "both" });
  const r = validateEvent({
    action_id: "a-1", playbook_key: "moving-beyond-rejection", playbook_version: 1,
    object_type: "simulation", object_id: ITR_SIMULATION.id, object_version: 1,
    event_type: "simulation_completed", payload: f,
  });
  assert.deepEqual(r, { ok: true, schema_version: 3 });
});
