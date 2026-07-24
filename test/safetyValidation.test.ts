import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateTrigger, validateImmediacyTerm, findConflicts, isResourceVerified, verificationError, compileRegexOk,
} from "../lib/companion/safetyValidation";

// ---- Trigger validation (server-side, guardrails 4 + 5) ----
test("valid trigger passes", () => {
  assert.equal(validateTrigger({ pattern: "hit me", risk_category: "ipv", canonical_concept: "physical_assault", match_type: "phrase", severity: 2 }).ok, true);
});
test("invalid severity rejected", () => {
  assert.equal(validateTrigger({ pattern: "x", risk_category: "ipv", canonical_concept: "c", severity: 4 }).ok, false);
  assert.equal(validateTrigger({ pattern: "x", risk_category: "ipv", canonical_concept: "c", severity: 0 }).ok, false);
});
test("invalid category rejected", () => {
  const r = validateTrigger({ pattern: "x", risk_category: "not_a_category", canonical_concept: "c", severity: 2 });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("Risk category")));
});
test("malformed regex rejected", () => {
  const r = validateTrigger({ pattern: "he (choked", risk_category: "ipv", canonical_concept: "c", severity: 3, match_type: "regex" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("compile")));
});
test("valid regex accepted", () => {
  assert.equal(compileRegexOk("said no.{0,30}(kept going|wouldn'?t stop)"), true);
  assert.equal(validateTrigger({ pattern: "a|b", risk_category: "ipv", canonical_concept: "c", severity: 2, match_type: "regex" }).ok, true);
});
test("missing required fields rejected on full create", () => {
  assert.equal(validateTrigger({ pattern: "x" }, true).ok, false);
});
test("partial edit does not require all fields", () => {
  assert.equal(validateTrigger({ severity: 2 }, false).ok, false); // pattern still required
  assert.equal(validateTrigger({ pattern: "x", severity: 2 }, false).ok, true);
});

// ---- Immediacy validation ----
test("valid immediacy term passes", () => {
  assert.equal(validateImmediacyTerm({ pattern: "has a gun", kind: "weapon" }).ok, true);
});
test("invalid immediacy kind rejected", () => {
  assert.equal(validateImmediacyTerm({ pattern: "x", kind: "nope" }).ok, false);
});
test("immediacy blank implies_category allowed", () => {
  assert.equal(validateImmediacyTerm({ pattern: "x", kind: "weapon", implies_category: "" }).ok, true);
  assert.equal(validateImmediacyTerm({ pattern: "x", kind: "weapon", implies_category: "bogus" }).ok, false);
});

// ---- Conflict detection (guardrail 6) ----
const existing = [
  { id: "1", risk_category: "ipv", pattern: "hit me", is_active: true, canonical_concept: "physical_assault" },
  { id: "2", risk_category: "ipv", pattern: "he hit me hard", is_active: true },
  { id: "3", risk_category: "self_harm", pattern: "hit me", is_active: true },
  { id: "4", risk_category: "ipv", pattern: "hit me", is_active: false },
];
test("duplicate active rule warns", () => {
  const w = findConflicts({ risk_category: "ipv", pattern: "hit me" }, existing);
  assert.ok(w.some((x) => x.includes("Duplicate")));
});
test("substring overlap warns", () => {
  const w = findConflicts({ risk_category: "ipv", pattern: "hit me hard and more" }, existing);
  assert.ok(w.some((x) => x.includes("Overlaps")));
});
test("different category does not conflict", () => {
  // 'hit me' exists under self_harm too, but a new harm_to_others rule shouldn't clash with ipv/self_harm
  assert.deepEqual(findConflicts({ risk_category: "harm_to_others", pattern: "hit me" }, existing), []);
});
test("inactive + self rules produce no DUPLICATE warning", () => {
  // Editing id 1 ("hit me"): self is excluded and id 4 (exact dup) is inactive, so
  // neither yields a "Duplicate" warning. (An "Overlaps" from active id 2 is fine.)
  const w = findConflicts({ id: "1", risk_category: "ipv", pattern: "hit me" }, existing);
  assert.ok(!w.some((x) => x.includes("Duplicate")));
});

// ---- Resource verification integrity (guardrail 11) ----
test("resource verified only with full metadata", () => {
  assert.equal(isResourceVerified({ verified_at: "2026-01-01", verified_by: "Owner", source: "gov site" }), true);
  assert.equal(isResourceVerified({ verified_at: "2026-01-01", verified_by: "", source: "x" }), false);
  assert.equal(isResourceVerified({ verified_at: null, verified_by: "Owner", source: "x" }), false);
});
test("verificationError blocks a date without verifier + source", () => {
  assert.ok(verificationError({ verified_at: "2026-01-01" }));
  assert.ok(verificationError({ verified_at: "2026-01-01", verified_by: "Owner" })); // no source
  assert.equal(verificationError({ verified_at: "2026-01-01", verified_by: "Owner", source: "gov" }), null);
  assert.equal(verificationError({ verified_by: "Owner" }), null); // no date → not claimed verified
});
