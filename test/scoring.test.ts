import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scoreItem,
  computeDomainScores,
  computeCompetencyPhaseScores,
  computeExpirationRisk,
  computeAlignment,
} from "../lib/scoring";
import type {
  CompetencyPhase,
  Domain,
  Question,
  ResultLevel,
  RiskLevel,
} from "../types/assessment";

// --- Fixtures ---------------------------------------------------------------

const domains: Domain[] = [
  { id: "d1", slug: "communication" },
  { id: "d2", slug: "trust" },
];

const competencyPhases: CompetencyPhase[] = [
  { id: "p_explore", slug: "exploration", measure_type: "competency" },
  { id: "p_exclus", slug: "exclusivity", measure_type: "competency" },
  { id: "p_expand", slug: "expansion", measure_type: "competency" },
  { id: "p_expire", slug: "expiration_risk", measure_type: "risk" },
];

const questions: Question[] = [
  // exploration / communication
  { id: "C001", score_direction: "forward", domain_id: "d1", competency_phase_id: "p_explore", in_snapshot: true, in_profile: true },
  { id: "C002", score_direction: "reverse", domain_id: "d1", competency_phase_id: "p_explore", in_snapshot: true, in_profile: true },
  // exclusivity / trust
  { id: "C003", score_direction: "forward", domain_id: "d2", competency_phase_id: "p_exclus", in_snapshot: true, in_profile: true },
  { id: "C004", score_direction: "forward", domain_id: "d2", competency_phase_id: "p_exclus", in_snapshot: true, in_profile: true },
  // expansion / communication
  { id: "C005", score_direction: "forward", domain_id: "d1", competency_phase_id: "p_expand", in_snapshot: true, in_profile: true },
  // expiration risk / trust
  { id: "C006", score_direction: "forward", domain_id: "d2", competency_phase_id: "p_expire", in_snapshot: true, in_profile: true },
  { id: "C007", score_direction: "forward", domain_id: "d2", competency_phase_id: "p_expire", in_snapshot: true, in_profile: true },
];

const resultLevels: ResultLevel[] = [
  { id: "rl1", domain_id: null, level: "Needs Attention", title: "Needs Attention", score_min: 1, score_max: 2.49 },
  { id: "rl2", domain_id: null, level: "Growth Opportunity", title: "Growth Opportunity", score_min: 2.5, score_max: 3.24 },
  { id: "rl3", domain_id: null, level: "Healthy Development", title: "Healthy Development", score_min: 3.25, score_max: 3.99 },
  { id: "rl4", domain_id: null, level: "Strength", title: "Strength", score_min: 4, score_max: 5 },
];

const riskLevels: RiskLevel[] = [
  { id: "risk_high", risk_level: "High Risk", title: "High Risk", score_min: 1, score_max: 2.49 },
  { id: "risk_elev", risk_level: "Elevated Risk", title: "Elevated Risk", score_min: 2.5, score_max: 3.24 },
  { id: "risk_some", risk_level: "Some Risk Indicators", title: "Some Risk Indicators", score_min: 3.25, score_max: 3.99 },
  { id: "risk_low", risk_level: "Low Risk", title: "Low Risk", score_min: 4, score_max: 5 },
];

// --- scoreItem --------------------------------------------------------------

test("scoreItem: forward passes raw through", () => {
  assert.equal(scoreItem(4, "forward"), 4);
  assert.equal(scoreItem(1, "forward"), 1);
});

test("scoreItem: reverse maps 6 - raw", () => {
  assert.equal(scoreItem(4, "reverse"), 2);
  assert.equal(scoreItem(1, "reverse"), 5);
  assert.equal(scoreItem(5, "reverse"), 1);
});

// --- domain scores ----------------------------------------------------------

test("computeDomainScores: averages scored values per domain and resolves level", () => {
  // d1: C001 forward 5 -> 5; C002 reverse 2 -> 4; C005 forward 3 -> 3  => avg 4
  // d2: C003 forward 4; C004 forward 2; C006 forward 5; C007 forward 5 => avg 4
  const responses = [
    { question_id: "C001", raw_response: 5 },
    { question_id: "C002", raw_response: 2 },
    { question_id: "C005", raw_response: 3 },
    { question_id: "C003", raw_response: 4 },
    { question_id: "C004", raw_response: 2 },
    { question_id: "C006", raw_response: 5 },
    { question_id: "C007", raw_response: 5 },
  ];
  const scores = computeDomainScores(responses, questions, domains, resultLevels);
  const d1 = scores.find((s) => s.domain_id === "d1")!;
  const d2 = scores.find((s) => s.domain_id === "d2")!;
  assert.equal(d1.average_score, 4);
  assert.equal(d1.result_level_id, "rl4"); // 4 falls in High band
  assert.equal(d2.average_score, 4);
  assert.equal(d2.result_level_id, "rl4");
});

// --- competency phase scores ------------------------------------------------

test("computeCompetencyPhaseScores: excludes risk-type phases", () => {
  const responses = [
    { question_id: "C001", raw_response: 5 }, // explore -> 5
    { question_id: "C002", raw_response: 1 }, // explore reverse -> 5
    { question_id: "C003", raw_response: 4 }, // exclusivity
    { question_id: "C004", raw_response: 4 }, // exclusivity
    { question_id: "C006", raw_response: 1 }, // expiration_risk — must be excluded
  ];
  const scores = computeCompetencyPhaseScores(
    responses,
    questions,
    competencyPhases,
    resultLevels
  );
  const slugs = scores.map((s) => s.phase_slug).sort();
  assert.deepEqual(slugs, ["exclusivity", "exploration"]);
  assert.ok(!slugs.includes("expiration_risk"));
  const explore = scores.find((s) => s.phase_slug === "exploration")!;
  assert.equal(explore.average_score, 5);
});

// --- expiration risk --------------------------------------------------------

test("computeExpirationRisk: averages only expiration_risk items, no re-inversion", () => {
  const responses = [
    { question_id: "C001", raw_response: 5 }, // not risk
    { question_id: "C006", raw_response: 4 }, // risk forward -> 4
    { question_id: "C007", raw_response: 2 }, // risk forward -> 2  => avg 3
  ];
  const result = computeExpirationRisk(
    responses,
    questions,
    competencyPhases,
    riskLevels
  );
  assert.ok(result);
  assert.equal(result!.average_score, 3);
  assert.equal(result!.risk_level_id, "risk_elev"); // 3.0 falls in [2.5, 3.24]
  assert.equal(result!.risk_level, "Elevated Risk");
});

test("computeExpirationRisk: returns null when no risk items answered", () => {
  const responses = [{ question_id: "C001", raw_response: 5 }];
  const result = computeExpirationRisk(
    responses,
    questions,
    competencyPhases,
    riskLevels
  );
  assert.equal(result, null);
});

// --- alignment --------------------------------------------------------------

test("computeAlignment: Congruent when self-selected phase competency >= 3.25", () => {
  const competencyPhaseScores = [
    { competency_phase_id: "p_explore", phase_slug: "exploration", average_score: 2.0, result_level_id: "rl2" },
    { competency_phase_id: "p_exclus", phase_slug: "exclusivity", average_score: 4.0, result_level_id: "rl4" },
  ];
  // Self-selected exclusivity (4.0) is at/above threshold even though it is not
  // the peak — alignment is a single-score threshold check, not a comparison.
  const alignment = computeAlignment("exclusivity", competencyPhaseScores);
  assert.ok(alignment);
  assert.equal(alignment!.alignment_status, "Congruent");
  assert.equal(alignment!.matching_competency_phase_id, "p_exclus");
  assert.equal(alignment!.competency_average, 4.0);
});

test("computeAlignment: boundary 3.25 is Congruent (inclusive)", () => {
  const competencyPhaseScores = [
    { competency_phase_id: "p_exclus", phase_slug: "exclusivity", average_score: 3.25, result_level_id: "rl3" },
  ];
  const alignment = computeAlignment("exclusivity", competencyPhaseScores);
  assert.equal(alignment!.alignment_status, "Congruent");
});

test("computeAlignment: Incongruent when self-selected phase competency < 3.25", () => {
  const competencyPhaseScores = [
    { competency_phase_id: "p_explore", phase_slug: "exploration", average_score: 3.0, result_level_id: "rl3" },
    { competency_phase_id: "p_exclus", phase_slug: "exclusivity", average_score: 4.5, result_level_id: "rl5" },
  ];
  // Self-selected exploration (3.0) is below threshold even though another phase
  // scores higher — the other phase is irrelevant to this check.
  const alignment = computeAlignment("exploration", competencyPhaseScores);
  assert.ok(alignment);
  assert.equal(alignment!.alignment_status, "Incongruent");
  assert.ok(alignment!.interpretation_text.includes("Exploration"));
});

test("computeAlignment: returns null for expiration structural phase", () => {
  const competencyPhaseScores = [
    { competency_phase_id: "p_explore", phase_slug: "exploration", average_score: 4.5, result_level_id: "rl5" },
  ];
  const alignment = computeAlignment("expiration", competencyPhaseScores);
  assert.equal(alignment, null);
});
