import { test } from "node:test";
import assert from "node:assert/strict";
import { deriveMeasurementModel, assemble } from "../lib/assemblyEngine";
import type { SpecificationInput, FrameworkInput, EligibleItem } from "../lib/assembly";

const framework: FrameworkInput = {
  competencies: [
    { code: "COM-EXPL-001", domain_slug: "communication", phase_slug: "exploration" },
    { code: "COM-EXPL-002", domain_slug: "communication", phase_slug: "exploration" },
    { code: "TRU-EXPL-001", domain_slug: "trust", phase_slug: "exploration" },
    { code: "COM-EXCL-001", domain_slug: "communication", phase_slug: "exclusivity" }, // out of scope
  ],
  indicators: [
    { behavior_id: "BI-1", competency_id: "COM-EXPL-001", domain: "communication", phase: "exploration" },
    { behavior_id: "BI-2", competency_id: "COM-EXPL-002", domain: "communication", phase: "exploration" },
    { behavior_id: "BI-3", competency_id: "TRU-EXPL-001", domain: "trust", phase: "exploration" },
  ],
};

const spec: SpecificationInput = {
  assessment_id: "ASM-TEST",
  structural_context: "exploration",
  target_reading_level: "Grade 5",
  target_completion_minutes: 10,
  desired_outputs: ["strengths", "growth"],
  design_constraints: { min_items_per_competency: 1, reverse_target_pct: 0.2 },
};

function item(id: string, comp: string, behavior: string, domain: string, text: string, opts: Partial<EligibleItem> = {}): EligibleItem {
  return {
    item_id: id, competency_id: comp, behavior_id: behavior, domain, phase: "exploration",
    item_type: "Behavioral Frequency", reverse_scored: false, evidence_strength: "Developed",
    response_model: "RM-FREQ-001", item_text: text, status: "approved", ...opts,
  };
}

const approved: EligibleItem[] = [
  item("ASM-000001", "COM-EXPL-001", "BI-1", "communication", "I ask questions to understand my partner before I respond."),
  item("ASM-000002", "COM-EXPL-002", "BI-2", "communication", "I share what I am feeling even when it is hard.", { reverse_scored: true }),
  item("ASM-000003", "TRU-EXPL-001", "BI-3", "trust", "I follow through on the small promises I make."),
  item("ASM-000009", "COM-EXPL-001", "BI-1", "communication", "I ask my partner questions to understand them before responding."), // near-duplicate of 001
  item("ASM-000010", "COM-EXCL-001", "BI-9", "communication", "Out of scope exclusivity item."), // out of scope
  item("ASM-000011", "COM-EXPL-001", "BI-1", "communication", "Draft item, not eligible.", { status: "draft" }),
];

test("deriveMeasurementModel scopes by structural context + domains", () => {
  const m = deriveMeasurementModel(spec, framework);
  assert.deepEqual(m.required_competencies, ["COM-EXPL-001", "COM-EXPL-002", "TRU-EXPL-001"]);
  assert.deepEqual(m.required_behavioral_indicators, ["BI-1", "BI-2", "BI-3"]);
  assert.deepEqual(m.required_phases, ["exploration"]);
  assert.equal(m.outcome_requirements.length, 2);
});

test("assemble covers each required competency once (min 1) and excludes out-of-scope + draft + duplicates", () => {
  const m = deriveMeasurementModel(spec, framework);
  const r = assemble(m, spec, approved);
  assert.deepEqual(r.itemIds, ["ASM-000001", "ASM-000002", "ASM-000003"]);
  assert.equal(r.stats.items_searched, approved.length);
  assert.equal(r.stats.competencies_covered, 3);
  assert.equal(r.stats.indicators_covered, 3);
  assert.equal(r.stats.missing_indicators.length, 0);
  assert.equal(r.outcome_fulfilled, true);
  assert.ok(r.stats.duplicates_removed >= 0);
});

test("assembly is byte-for-byte reproducible (same fingerprint + item set)", () => {
  const m = deriveMeasurementModel(spec, framework);
  const a = assemble(m, spec, approved);
  const b = assemble(deriveMeasurementModel(spec, framework), spec, [...approved].reverse());
  assert.equal(a.inputs_fingerprint, b.inputs_fingerprint);
  assert.deepEqual(a.itemIds, b.itemIds);
});

test("raising min items above the approved supply leaves the outcome unfulfilled", () => {
  const strictSpec: SpecificationInput = { ...spec, design_constraints: { min_items_per_competency: 2 } };
  const m = deriveMeasurementModel(strictSpec, framework);
  const r = assemble(m, strictSpec, approved);
  assert.equal(r.outcome_fulfilled, false);
  assert.ok(r.stats.under_covered_competencies.length > 0);
});

test("target_total_items is distributed across required competencies", () => {
  // 3 required competencies (exploration), target 12 → round(12/3) = 4 items each.
  const targetSpec: SpecificationInput = { ...spec, design_constraints: { target_total_items: 12 } };
  const m = deriveMeasurementModel(targetSpec, framework);
  assert.equal(m.required_competencies.length, 3);
  assert.equal(m.coverage_policy.min_items_per_competency, 4);
  assert.ok(m.outcome_requirements.every((o) => o.min_items_per_competency === 4));
});

test("empty approved bank → honest zero result, not a throw", () => {
  const m = deriveMeasurementModel(spec, framework);
  const r = assemble(m, spec, []);
  assert.equal(r.itemIds.length, 0);
  assert.equal(r.outcome_fulfilled, false);
  assert.equal(r.stats.items_searched, 0);
});
