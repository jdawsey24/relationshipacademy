import { test } from "node:test";
import assert from "node:assert/strict";
import { HMP_SIMULATION, HMP_PLAY_ID } from "../content/playbook/how-much-to-put-in";
import { aggregateFidelity, resolveRevealContent, validateSimulation } from "../lib/playbook/simulation";
import type { SimNode } from "../lib/playbook/contentSchema";
import { validateEvent } from "../lib/playbook/events";

const revealNode = HMP_SIMULATION.nodes.find((n): n is Extract<SimNode, { kind: "reveal" }> => n.kind === "reveal")!;

// ---- fidelity: investment tied to evidence + noticing effort-without-evidence ----

test("investmentView: increases only at mutual rounds → evidence-tied; nothing to notice", () => {
  const f = aggregateFidelity(HMP_SIMULATION, { "hmp-d1": "more", "hmp-d2": "keep", "hmp-d3": "more" });
  assert.ok(f.signature === "investmentView");
  assert.equal(f.investment_evidence_tied, "demonstrated");
  assert.equal(f.effort_without_new_evidence_noticed, "demonstrated");
});

test("investmentView: increasing at the lull → NOT evidence-tied", () => {
  const f = aggregateFidelity(HMP_SIMULATION, { "hmp-d2": "more", "hmp-cap2": "nothing" });
  assert.ok(f.signature === "investmentView");
  assert.equal(f.investment_evidence_tied, "not_demonstrated");
  // increased at the lull but NAMED it honestly ('nothing new') → they noticed
  assert.equal(f.effort_without_new_evidence_noticed, "demonstrated");
});

test("investmentView: increasing at the lull AND claiming a signal that wasn't there → not noticed", () => {
  const f = aggregateFidelity(HMP_SIMULATION, { "hmp-d2": "more", "hmp-cap2": "new" });
  assert.ok(f.signature === "investmentView");
  assert.equal(f.investment_evidence_tied, "not_demonstrated");
  assert.equal(f.effort_without_new_evidence_noticed, "not_demonstrated");
});

test("investmentView: easing off at the lull is not an increase (not penalised)", () => {
  const f = aggregateFidelity(HMP_SIMULATION, { "hmp-d2": "less" });
  assert.ok(f.signature === "investmentView");
  assert.equal(f.investment_evidence_tied, "demonstrated");
  assert.equal(f.effort_without_new_evidence_noticed, "demonstrated");
});

// ---- reveal recap: the reader's OWN investment choices, per round ----------------

test("reveal recaps the reader's own investment choices (id → label), per round", () => {
  const rv = resolveRevealContent(revealNode, HMP_SIMULATION, { "hmp-d1": "more", "hmp-d2": "keep", "hmp-d3": "clarify" });
  assert.equal(rv.recap.length, 3, "three rounds recapped");
  assert.match(rv.recap[0].label, /clearly mutual/i);
  assert.match(rv.recap[0].value, /give a little more/i);
  assert.match(rv.recap[1].value, /keep it about where it is/i);
  assert.match(rv.recap[2].value, /clarify/i);
  assert.ok(rv.paragraphs.length > 0, "the independence-restating closing is preserved");
});

test("reveal recap omits rounds the reader hasn't answered (no fabricated choices)", () => {
  const rv = resolveRevealContent(revealNode, HMP_SIMULATION, { "hmp-d1": "keep" });
  assert.equal(rv.recap.length, 1, "only the answered round is recapped");
});

// ---- graph validity + handoff + event payload -----------------------------------

test("the investmentView simulation is a valid graph handing off to its Play", () => {
  const errs = validateSimulation(HMP_SIMULATION, new Set([HMP_PLAY_ID]));
  assert.deepEqual(errs, [], "sim errors: " + errs.join("; "));
});

test("the investmentView completion payload passes the event registry", () => {
  const f = aggregateFidelity(HMP_SIMULATION, { "hmp-d2": "more", "hmp-cap2": "new" });
  const r = validateEvent({
    action_id: "a-1", playbook_key: "moving-beyond-rejection", playbook_version: 1,
    object_type: "simulation", object_id: HMP_SIMULATION.id, object_version: 1,
    event_type: "simulation_completed", payload: f,
  });
  assert.deepEqual(r, { ok: true, schema_version: 3 });
});
