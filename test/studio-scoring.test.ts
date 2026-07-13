import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scoreItem, resolveBand, computeScores, deriveFindings, selectRecommendations,
  resolvePhaseOption, compareDomains,
  type ScoreItemDef, type Band, type ScoringRuleDef, type IncongruenceRuleDef, type RecMappingDef,
} from "../lib/studioScoring";

const bands: Band[] = [{ label: "Low", min: 1, max: 2.99 }, { label: "High", min: 3, max: 5 }];
const compRule: ScoringRuleDef = { scoring_rule_id: "SCR-COMP", score_name: "Competency Functioning", level: "Competency", min_valid_responses: 2, cut_points: bands, version: "v1" };
const domRule: ScoringRuleDef = { scoring_rule_id: "SCR-DOM", score_name: "Domain Functioning", level: "Domain", min_valid_responses: 1, cut_points: bands, version: "v1" };

const items: ScoreItemDef[] = [
  { item_id: "i1", competency_id: "C1", domain: "communication", phase: "exploration", reverse_scored: false },
  { item_id: "i2", competency_id: "C1", domain: "communication", phase: "exploration", reverse_scored: true },
  { item_id: "i3", competency_id: "C2", domain: "trust", phase: "exploration", reverse_scored: false },
  { item_id: "i4", competency_id: "C2", domain: "trust", phase: "exploration", reverse_scored: false },
];

test("raw Likert scoring (forward)", () => assert.equal(scoreItem(4, false), 4));
test("approved reverse scoring 6 - raw (only via item flag)", () => { assert.equal(scoreItem(4, true), 2); assert.equal(scoreItem(1, true), 5); });

test("missing responses excluded; min-response suppression", () => {
  const r = computeScores({ items, responses: { i1: 5 }, competencyRule: compRule, domainRule: domRule }); // C1 has 1 answer, min 2
  const c1 = r.scoreResults.find((x) => x.score_level === "competency" && x.entity_id === "C1")!;
  assert.equal(c1.confidence_status, "insufficient");
  assert.equal(r.competencies.find((c) => c.id === "C1"), undefined);
});

test("competency + domain aggregation with reverse", () => {
  // C1: i1=5 fwd, i2=2 rev→4 → 4.5 ; C2: i3=2,i4=4 → 3
  const r = computeScores({ items, responses: { i1: 5, i2: 2, i3: 2, i4: 4 }, competencyRule: compRule, domainRule: domRule });
  assert.equal(r.competencies.find((c) => c.id === "C1")!.score, 4.5);
  assert.equal(r.domains.find((d) => d.id === "communication")!.score, 4.5);
  assert.equal(r.domains.find((d) => d.id === "communication")!.band?.label, "High");
  assert.equal(r.domains.find((d) => d.id === "trust")!.score, 3);
});

test("rule version preserved on score results", () => {
  const r = computeScores({ items, responses: { i1: 5, i2: 5, i3: 3, i4: 3 }, competencyRule: compRule, domainRule: domRule });
  assert.equal(r.scoreResults.find((x) => x.score_level === "competency")!.rule_version, "v1");
});

test("resolveBand inclusive + rounds; null when none", () => {
  assert.equal(resolveBand(2.995, bands)?.label, "High");
  assert.equal(resolveBand(9, bands), null);
});

test("top-two strengths + one growth priority", () => {
  const scores = computeScores({ items: [
    ...items,
    { item_id: "i5", competency_id: "C3", domain: "physical_intimacy", phase: "exploration", reverse_scored: false },
    { item_id: "i6", competency_id: "C3", domain: "physical_intimacy", phase: "exploration", reverse_scored: false },
  ], responses: { i1: 5, i2: 1, i3: 4, i4: 4, i5: 1, i6: 1 }, competencyRule: compRule, domainRule: domRule });
  const f = deriveFindings({ structuralContext: "Dating", scores });
  const strengths = f.filter((x) => x.finding_type === "strength").map((x) => x.finding_key);
  assert.equal(strengths.length, 2);
  assert.ok(strengths.includes("communication") && strengths.includes("trust"));
  assert.equal(f.find((x) => x.finding_type === "growth_priority")!.finding_key, "physical_intimacy");
});

test("structural-context interpretation on phase alignment (later phase not auto-healthier)", () => {
  const scores = computeScores({ items, responses: { i1: 5, i2: 5, i3: 5, i4: 5 }, competencyRule: compRule, domainRule: domRule });
  const f = deriveFindings({ structuralContext: "Married", scores });
  const pa = f.find((x) => x.finding_type === "phase_alignment")!;
  assert.equal(pa.finding_key, "exploration"); // only exploration items present
  assert.match(pa.consumer_summary, /expansion/); // Married expects expansion → flagged as different
});

test("expiration risk vs adaptive Expiration during acknowledged dissolution", () => {
  const expItems: ScoreItemDef[] = [{ item_id: "e1", competency_id: "CE", domain: "trust", phase: "expiration", reverse_scored: false }, { item_id: "e2", competency_id: "CE", domain: "trust", phase: "expiration", reverse_scored: false }];
  const scores = computeScores({ items: expItems, responses: { e1: 5, e2: 5 }, competencyRule: compRule, domainRule: domRule });
  const risk = deriveFindings({ structuralContext: "Married", scores }).find((x) => x.finding_type === "expiration_risk")!;
  assert.equal(risk.finding_key, "risk");
  const adaptive = deriveFindings({ structuralContext: "Married", acknowledgedTransition: "separating", scores }).find((x) => x.finding_type === "expiration_risk")!;
  assert.equal(adaptive.finding_key, "adaptive");
});

test("incongruence-rule execution (structural + phase condition)", () => {
  const scores = computeScores({ items, responses: { i1: 5, i2: 5, i3: 5, i4: 5 }, competencyRule: compRule, domainRule: domRule });
  const rule: IncongruenceRuleDef = { id: "INC1", structural_context: "Married", compared_phase: "exploration", condition_config: { level: "phase", entity: "exploration", comparator: ">=", threshold: 4 }, consumer_language: "High early-phase habits while married." };
  const f = deriveFindings({ structuralContext: "Married", scores, incongruenceRules: [rule] });
  const inc = f.find((x) => x.finding_type === "incongruence");
  assert.ok(inc && inc.finding_key === "INC1");
  // does not fire for a different structural context
  const none = deriveFindings({ structuralContext: "Single", scores, incongruenceRules: [rule] }).find((x) => x.finding_type === "incongruence");
  assert.equal(none, undefined);
});

test("recommendation mapping + publication gating + safety suppression", () => {
  const findings = [{ finding_type: "growth_priority", finding_key: "trust", priority: 20, source_refs: [], consumer_summary: "" }];
  const mappings: RecMappingDef[] = [
    { mapping_id: "M1", trigger_type: "Domain Low", trigger_value: "trust", recommendation_type: "worksheet", recommendation_id: "WS-1", priority: 1, status: "approved" },
    { mapping_id: "M2", trigger_type: "Domain Low", trigger_value: "trust", recommendation_type: "worksheet", recommendation_id: "WS-2", priority: 2, status: "approved", suppression_logic: "safety" },
  ];
  const published = new Set(["worksheet:WS-1"]);
  const { recommendations, nextStep } = selectRecommendations({ findings, mappings, structuralContext: "Dating", isPublished: (t, i) => published.has(`${t}:${i}`) });
  assert.equal(recommendations.find((r) => r.recommendation_mapping_id === "M1")!.suppression_status, "active");
  assert.equal(recommendations.find((r) => r.recommendation_mapping_id === "M2")!.suppression_status, "suppressed"); // safety
  assert.equal(nextStep!.finding_key, "WS-1"); // top active published
});

test("recommendation suppressed when asset not published", () => {
  const findings = [{ finding_type: "growth_priority", finding_key: "trust", priority: 20, source_refs: [], consumer_summary: "" }];
  const mappings: RecMappingDef[] = [{ mapping_id: "M1", trigger_value: "trust", recommendation_type: "worksheet", recommendation_id: "WS-9", status: "approved" }];
  const { recommendations, nextStep } = selectRecommendations({ findings, mappings, structuralContext: "Dating", isPublished: () => false });
  assert.equal(recommendations[0].suppression_status, "suppressed");
  assert.equal(recommendations[0].suppression_reason, "asset not published");
  assert.equal(nextStep, null);
});

test("phase-option mapping resolves explicit response option → phase code", () => {
  const maps = [{ item_id: "p1", response_option_id: "opt-a", phase_code: "exclusivity", score_value: 3 }];
  assert.equal(resolvePhaseOption(maps, "p1", "opt-a", "Dating")?.phase_code, "exclusivity");
  assert.equal(resolvePhaseOption(maps, "p1", "opt-x", "Dating"), null);
});

test("reassessment comparison computes per-domain delta", () => {
  const d = compareDomains([{ id: "trust", score: 2 }], [{ id: "trust", score: 3.5 }]);
  assert.equal(d[0].delta, 1.5);
});

test("engine is deterministic (AI cannot alter scores): same input → same output", () => {
  const a = computeScores({ items, responses: { i1: 5, i2: 2, i3: 2, i4: 4 }, competencyRule: compRule, domainRule: domRule });
  const b = computeScores({ items, responses: { i1: 5, i2: 2, i3: 2, i4: 4 }, competencyRule: compRule, domainRule: domRule });
  assert.deepEqual(a, b);
});
