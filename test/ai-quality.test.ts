import { test } from "node:test";
import assert from "node:assert/strict";
import { runDeterministicItemChecks, runDeterministicContentChecks } from "../lib/ai/quality";

function find(findings: ReturnType<typeof runDeterministicItemChecks>, type: string) {
  return findings.find((f) => f.check_type === type)!;
}

test("clean, indicator-linked item passes the core checks", () => {
  const f = runDeterministicItemChecks({
    item_text: "I ask questions to understand the other person.",
    reverse_candidate: false,
    behavioral_indicator_id: "BI-000001",
  });
  assert.equal(find(f, "missing_source_links").passed, true);
  assert.equal(find(f, "double_negative").passed, true);
  assert.equal(find(f, "length").passed, true);
  assert.equal(find(f, "moralizing").passed, true);
});

test("missing behavioral-indicator link is a critical failure", () => {
  const f = runDeterministicItemChecks({ item_text: "I listen.", reverse_candidate: false, behavioral_indicator_id: null });
  const c = find(f, "missing_source_links");
  assert.equal(c.passed, false);
  assert.equal(c.severity, "critical");
});

test("double negative is flagged high", () => {
  const f = runDeterministicItemChecks({ item_text: "I do not never avoid hard talks.", reverse_candidate: false, behavioral_indicator_id: "BI-1" });
  const c = find(f, "double_negative");
  assert.equal(c.passed, false);
  assert.equal(c.severity, "high");
});

test("excessive length is flagged", () => {
  const long = "I always try to make sure that in every single conversation we ever have I carefully ask many thoughtful questions about everything.";
  const f = runDeterministicItemChecks({ item_text: long, reverse_candidate: false, behavioral_indicator_id: "BI-1" });
  assert.equal(find(f, "length").passed, false);
});

test("moralizing language is flagged", () => {
  const f = runDeterministicItemChecks({ item_text: "A good partner should always agree.", reverse_candidate: false, behavioral_indicator_id: "BI-1" });
  assert.equal(find(f, "moralizing").passed, false);
});

test("jargon is flagged for consumer wording", () => {
  const f = runDeterministicItemChecks({ item_text: "I show high competency in dyadic differentiation.", reverse_candidate: false, behavioral_indicator_id: "BI-1" });
  assert.equal(find(f, "jargon").passed, false);
});

test("content: worksheet without a next step / sources is flagged", () => {
  const f = runDeterministicContentChecks("worksheet", { instructions: "Do the thing.", introduction: "Intro." }, false);
  assert.equal(f.find((x) => x.check_type === "missing_source_links")!.passed, false);
  assert.equal(f.find((x) => x.check_type === "has_next_step")!.passed, false);
});

test("content: complete worksheet with sources passes core checks", () => {
  const f = runDeterministicContentChecks("worksheet", { instructions: "Ask one question a day.", introduction: "This helps you get curious.", next_step: "Try it tomorrow." }, true);
  assert.equal(f.find((x) => x.check_type === "missing_source_links")!.passed, true);
  assert.equal(f.find((x) => x.check_type === "has_next_step")!.passed, true);
  assert.equal(f.find((x) => x.check_type === "has_instructions")!.passed, true);
});

test("content: lesson requires learning objectives", () => {
  const none = runDeterministicContentChecks("lesson", { overview: "x" }, true);
  assert.equal(none.find((x) => x.check_type === "has_objectives")!.passed, false);
  const withObj = runDeterministicContentChecks("lesson", { learning_objectives: ["Explain curiosity"] }, true);
  assert.equal(withObj.find((x) => x.check_type === "has_objectives")!.passed, true);
});
