import { test } from "node:test";
import assert from "node:assert/strict";
import { MBR_SIMULATIONS } from "../content/playbook/moving-beyond-rejection-simulations";
import { aggregateFidelity } from "../lib/playbook/simulation";
import type { Simulation } from "../lib/playbook/contentSchema";

// Approved Step-4 guardrails (regression-locked).

const RD = MBR_SIMULATIONS.find((s) => s.signature === "evidenceTimeline")!;
const WM = MBR_SIMULATIONS.find((s) => s.signature === "conclusionNarrowing")!;

test("G1: fidelity is authored per-scenario, never hardcoded by signature", () => {
  // Same behavioural concept ("hold the read") — OPPOSITE fidelity across scenarios,
  // because the appropriateness depends on THAT scenario's evidence, not the signature.
  const rdHold = aggregateFidelity(RD, { rc1: "hold-open" }).interpretation_response_appropriate;
  const wmHoldVerdict = aggregateFidelity(WM, { rc1: "still-wrong" }).interpretation_response_appropriate;
  assert.equal(rdHold, "demonstrated", "holding an open read is evidence-appropriate in RD (ambiguity remains)");
  assert.equal(wmHoldVerdict, "not_demonstrated", "holding the global verdict is not appropriate in WM");
  assert.notEqual(rdHold, wmHoldVerdict, "fidelity of 'hold' is not fixed by signature — it depends on the scenario's evidence");
});

test("G2: JIT literature exposure never contributes to fidelity (it is not an input)", () => {
  // aggregateFidelity depends solely on reconsider selections. The presence/opening of a
  // JIT hook cannot change the outcome — there is no literature parameter to influence it.
  const withJitNodes = RD.nodes.some((n) => n.jitLiteratureId);
  assert.ok(withJitNodes, "RD references JIT literature");
  const a = aggregateFidelity(RD, { rc1: "revise" });
  const b = aggregateFidelity(RD, { rc1: "revise" });
  assert.deepEqual(a, b, "fidelity is a pure function of reconsider selections only");
  // and the completion dimensions never include a literature/engagement key
  assert.deepEqual(Object.keys(a).sort(), ["evidence_reconsidered", "interpretation_response_appropriate"]);
});

test("G3: process tags stay narrowly behavioural/operational (no trait/etiology language)", () => {
  const allowed = new Set(["held_uncertainty", "jumped_to_conclusion", "sought_evidence", "bounded_to_evidence"]);
  const banned = /(attachment|anxious|avoidant|personality|trait|diagnos|etiolog|disorder|insecure|abandon)/i;
  for (const sim of MBR_SIMULATIONS as Simulation[]) {
    for (const n of sim.nodes) {
      if (n.kind !== "decision") continue;
      for (const o of n.options) {
        if (o.processTag) {
          assert.ok(allowed.has(o.processTag), `${sim.id}/${n.id}/${o.id}: unexpected process tag ${o.processTag}`);
          assert.ok(!banned.test(o.processTag), `${sim.id}/${n.id}/${o.id}: trait-like process tag`);
        }
      }
    }
  }
});

test("no-cycle graph constraint retained for this version (engine not generalized)", () => {
  // Sanity: the two shipped simulations are acyclic DAGs terminating in a teach handoff
  // (full validation is covered in playbook-simulation.test.ts; this pins the version intent).
  for (const sim of MBR_SIMULATIONS) {
    assert.ok(sim.nodes.some((n) => n.kind === "teach"), `${sim.id} terminates in a teach handoff`);
  }
});
