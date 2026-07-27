import { test } from "node:test";
import assert from "node:assert/strict";
import { highestProcessState, supportsDevelopmentalApplication } from "../lib/playbook/processState";

test("no signals → exposure floor", () => {
  assert.equal(highestProcessState({}), "exposure");
  assert.equal(highestProcessState({ exposure: true }), "exposure");
});

test("attempt and in-app fidelity ladder", () => {
  assert.equal(highestProcessState({ attempt: true }), "attempt");
  assert.equal(highestProcessState({ attempt: true, technique_fidelity: true }), "technique_fidelity");
});

test("tool-review alone never reaches Transfer (adjudication 4)", () => {
  assert.equal(highestProcessState({ tool_reviewed: true, tool_retained: true }), "exposure");
  assert.equal(
    highestProcessState({ attempt: true, technique_fidelity: true, tool_reviewed: true, tool_updated: true }),
    "technique_fidelity",
    "reviewing/updating the saved tool is not Transfer",
  );
});

test("Transfer requires reported real-world enactment", () => {
  assert.equal(highestProcessState({ used_in_another_context: true }), "transfer");
  assert.equal(highestProcessState({ technique_fidelity_in_context: true }), "transfer");
});

test("progression-advance is Transfer ONLY when it follows real-world enactment", () => {
  assert.equal(highestProcessState({ progression_advanced: true }), "exposure", "product progression alone is not Transfer");
  assert.equal(highestProcessState({ progression_advanced: true, used_in_another_context: true }), "transfer");
});

test("Developmental Application needs real-context evidence, not in-app fidelity alone", () => {
  assert.equal(supportsDevelopmentalApplication({ technique_fidelity: true }), false);
  assert.equal(supportsDevelopmentalApplication({ used_in_another_context: true }), true);
  assert.equal(supportsDevelopmentalApplication({ technique_fidelity_in_context: true }), true);
});
