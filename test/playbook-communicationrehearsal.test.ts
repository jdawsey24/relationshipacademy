import { test } from "node:test";
import assert from "node:assert/strict";
import { STT_SIMULATION, STT_PLAY_ID } from "../content/playbook/say-the-real-thing";
import { aggregateFidelity, resolveRevealContent, validateSimulation } from "../lib/playbook/simulation";
import type { SimNode } from "../lib/playbook/contentSchema";
import { validateEvent } from "../lib/playbook/events";

const spreadNode = STT_SIMULATION.nodes.find((n): n is Extract<SimNode, { kind: "reveal" }> => n.kind === "reveal" && Boolean(n.reactions))!;
const recapNode = STT_SIMULATION.nodes.find((n): n is Extract<SimNode, { kind: "reveal" }> => n.kind === "reveal" && Boolean(n.computedSummary))!;

// ---- fidelity: clarity vs erasure, a majority over the three moments -------------

test("communicationRehearsal: mostly clear → both signals demonstrated", () => {
  const f = aggregateFidelity(STT_SIMULATION, { "stt-d1": "clear", "stt-d2": "clear", "stt-d3": "agree" });
  assert.ok(f.signature === "communicationRehearsal");
  assert.equal(f.preference_expressed_clearly, "demonstrated");
  assert.equal(f.unnecessary_self_erasure_avoided, "demonstrated");
});

test("communicationRehearsal: buried-in-apology STATES the preference but does NOT avoid erasure", () => {
  const f = aggregateFidelity(STT_SIMULATION, { "stt-d1": "apology", "stt-d2": "apology", "stt-d3": "clear" });
  assert.ok(f.signature === "communicationRehearsal");
  assert.equal(f.preference_expressed_clearly, "demonstrated"); // clear + 2 buried = 3 stated
  assert.equal(f.unnecessary_self_erasure_avoided, "not_demonstrated"); // only 1 clear
});

test("communicationRehearsal: mostly smoothing over → neither demonstrated", () => {
  const f = aggregateFidelity(STT_SIMULATION, { "stt-d1": "agree", "stt-d2": "soften", "stt-d3": "clear" });
  assert.ok(f.signature === "communicationRehearsal");
  assert.equal(f.preference_expressed_clearly, "not_demonstrated"); // only 1 stated
  assert.equal(f.unnecessary_self_erasure_avoided, "not_demonstrated");
});

// ---- reveal: the reaction spread is FIXED (decoupled from the reader's choice) ----

test("the reaction spread shows three labeled hypotheticals, regardless of the reader's phrasing", () => {
  const asClear = resolveRevealContent(spreadNode, STT_SIMULATION, { "stt-d1": "clear" });
  const asErased = resolveRevealContent(spreadNode, STT_SIMULATION, { "stt-d1": "agree" });
  assert.equal(asClear.reactions.length, 3, "three labeled reactions");
  assert.ok(asClear.reactions.every((r) => r.label && r.example), "each has a label + example");
  assert.deepEqual(asClear.reactions, asErased.reactions, "the spread does not depend on what the reader chose");
});

test("the closing recap reflects observed clarity-vs-erasure (not a grade)", () => {
  const clear = resolveRevealContent(recapNode, STT_SIMULATION, { "stt-d1": "clear", "stt-d2": "clear", "stt-d3": "clear" });
  assert.match(clear.summary ?? "", /mostly said the real thing/i);
  const smooth = resolveRevealContent(recapNode, STT_SIMULATION, { "stt-d1": "agree", "stt-d2": "soften", "stt-d3": "agree" });
  assert.match(smooth.summary ?? "", /keeping it smooth/i);
  const mixed = resolveRevealContent(recapNode, STT_SIMULATION, { "stt-d1": "clear", "stt-d2": "agree", "stt-d3": "apology" });
  assert.match(mixed.summary ?? "", /some you said straight/i);
});

// ---- graph validity + handoff + event payload -----------------------------------

test("the communicationRehearsal simulation is a valid graph handing off to its Play", () => {
  const errs = validateSimulation(STT_SIMULATION, new Set([STT_PLAY_ID]));
  assert.deepEqual(errs, [], "sim errors: " + errs.join("; "));
});

test("the communicationRehearsal completion payload passes the event registry", () => {
  const f = aggregateFidelity(STT_SIMULATION, { "stt-d1": "clear", "stt-d2": "clear", "stt-d3": "clear" });
  const r = validateEvent({
    action_id: "a-1", playbook_key: "finding-love-that-feels-mutual", playbook_version: 1,
    object_type: "simulation", object_id: STT_SIMULATION.id, object_version: 1,
    event_type: "simulation_completed", payload: f,
  });
  assert.deepEqual(r, { ok: true, schema_version: 3 });
});
