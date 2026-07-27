import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { MBR_SIMULATIONS } from "../content/playbook/moving-beyond-rejection-simulations";
import { MBR_LITERATURE } from "../content/playbook/moving-beyond-rejection-literature";
import { validateSimulation, aggregateFidelity, nextNodeId, pathBefore, nodeMap, terminalPlayIds, completionPayload } from "../lib/playbook/simulation";
import type { Simulation } from "../lib/playbook/contentSchema";

const approved = new Set(C.plays.map((p) => p.playId));
const RD = MBR_SIMULATIONS.find((s) => s.signature === "evidenceTimeline")!;
const WM = MBR_SIMULATIONS.find((s) => s.signature === "conclusionNarrowing")!;

test("both authored simulations validate cleanly", () => {
  for (const sim of MBR_SIMULATIONS) {
    assert.deepEqual(validateSimulation(sim, approved), [], `${sim.id} invalid: ${validateSimulation(sim, approved).join("; ")}`);
    assert.deepEqual(terminalPlayIds(sim), [sim.playId]);
  }
});

test("validation catches malformed graphs", () => {
  const n = (o: object) => o as Simulation["nodes"][number];
  const mk = (over: Partial<Simulation>): Simulation => ({ id: "x", version: 1, simulationSchemaVersion: 1, playId: "read-and-decide", signature: "evidenceTimeline", startNodeId: "a", nodes: [], ...over });

  assert.ok(validateSimulation(mk({ startNodeId: "missing", nodes: [n({ id: "a", kind: "teach", body: ["x"], toPlayId: "read-and-decide" })] }), approved).some((e) => /does not exist/.test(e)));
  // dangling next
  assert.ok(validateSimulation(mk({ nodes: [n({ id: "a", kind: "moment", body: ["x"], next: "ghost" })] }), approved).some((e) => /unknown next/.test(e)));
  // cycle
  assert.ok(validateSimulation(mk({ nodes: [n({ id: "a", kind: "moment", body: ["x"], next: "b" }), n({ id: "b", kind: "moment", body: ["y"], next: "a" })] }), approved).some((e) => /cycle/.test(e)));
  // unreachable
  assert.ok(validateSimulation(mk({ nodes: [n({ id: "a", kind: "teach", body: ["x"], toPlayId: "read-and-decide" }), n({ id: "orphan", kind: "moment", body: ["y"], next: "a" })] }), approved).some((e) => /unreachable/.test(e)));
  // non-teach terminal (dead-end)
  assert.ok(validateSimulation(mk({ nodes: [n({ id: "a", kind: "moment", body: ["x"] })] }), approved).some((e) => /dead-ends|not a teach/.test(e)));
  // unapproved play handoff
  assert.ok(validateSimulation(mk({ nodes: [n({ id: "a", kind: "teach", body: ["x"], toPlayId: "ghost-play" })] }), approved).some((e) => /unapproved play/.test(e)));
  // bad fidelity state
  const badFid = mk({ nodes: [
    n({ id: "a", kind: "reconsider", prompt: "?", options: [{ id: "o", label: "l", next: "t", fidelity: { evidence_reconsidered: "nope", interpretation_response_appropriate: "demonstrated" } }] }),
    n({ id: "t", kind: "teach", body: ["x"], toPlayId: "read-and-decide" }),
  ] });
  assert.ok(validateSimulation(badFid as unknown as Simulation, approved).some((e) => /invalid fidelity/.test(e)));
});

test("fidelity aggregation is explicit-state and revision-agnostic", () => {
  // RD: revising is appropriate, AND holding-open is appropriate (evidence-responsive)
  assert.deepEqual(aggregateFidelity(RD, { rc1: "revise" }), { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
  assert.deepEqual(aggregateFidelity(RD, { rc1: "hold-open" }), { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
  // RD: ignoring the concrete plan is weighed-but-not-appropriate
  assert.deepEqual(aggregateFidelity(RD, { rc1: "keep" }), { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" });
  // WM: narrowing appropriate; holding the global verdict is NOT (context differs from RD)
  assert.deepEqual(aggregateFidelity(WM, { rc1: "narrow" }), { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
  assert.deepEqual(aggregateFidelity(WM, { rc1: "hold-big" }), { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" });
  // unexercised → not_applicable, not a false "positive"
  assert.deepEqual(aggregateFidelity(RD, {}), { evidence_reconsidered: "not_applicable", interpretation_response_appropriate: "not_applicable" });
});

test("completionPayload conforms to the event registry (states only)", () => {
  const p = completionPayload(aggregateFidelity(RD, { rc1: "keep" }));
  assert.deepEqual(Object.keys(p).sort(), ["evidence_reconsidered", "interpretation_response_appropriate"]);
});

test("graph routing includes teaching branches that rejoin the main path", () => {
  // RD 'keep' routes to the note branch, which rejoins the teach handoff
  const rc1 = nodeMap(RD).get("rc1")!;
  assert.equal(nextNodeId(rc1, "keep"), "note-keep");
  assert.equal(nextNodeId(rc1, "revise"), "t1");
  assert.equal((nodeMap(RD).get("note-keep") as { next?: string }).next, "t1");
  // WM 'identity'/'forever' jump to a teaching note that rejoins the reveal
  const d1 = nodeMap(WM).get("d1")!;
  assert.equal(nextNodeId(d1, "identity"), "note-jump");
  assert.equal(nextNodeId(d1, "small"), "r1");
});

test("pathBefore reconstructs the taken path (resume-safe)", () => {
  const path = pathBefore(RD, "rc1", { c1: "I'm not sure yet", c2: "Wait and watch a bit" }).map((n) => n.id);
  assert.deepEqual(path, ["m1", "m2", "c1", "c2", "r1"]);
});

test("NON-SCORING: no option carries score/correct/outcome keys", () => {
  const forbidden = ["score", "isCorrect", "correct", "outcome", "points", "right"];
  for (const sim of MBR_SIMULATIONS) {
    for (const nd of sim.nodes) {
      const opts = nd.kind === "decision" || nd.kind === "reconsider" ? nd.options : [];
      for (const o of opts) for (const k of Object.keys(o)) assert.ok(!forbidden.includes(k), `${sim.id}/${nd.id}: forbidden key ${k}`);
    }
  }
});

test("reveal labels are authored/contextual (not a global 'New evidence')", () => {
  const rdReveal = RD.nodes.find((n) => n.kind === "reveal") as { label?: string };
  const wmReveal = WM.nodes.find((n) => n.kind === "reveal") as { label?: string };
  assert.equal(rdReveal.label, "New evidence");
  assert.match(wmReveal.label ?? "", /what this actually establishes/i);
});

test("JIT literature hooks reference real literature ids (never inlined)", () => {
  const litIds = new Set(MBR_LITERATURE.map((e) => e.id));
  const hooks = MBR_SIMULATIONS.flatMap((s) => s.nodes).map((n) => n.jitLiteratureId).filter(Boolean) as string[];
  assert.ok(hooks.length >= 2, "simulations reference JIT literature");
  for (const id of hooks) assert.ok(litIds.has(id), `unknown JIT literature ${id}`);
});

test("content module exposes the Experience layer", () => {
  assert.equal(C.simulations?.length, 2);
});
