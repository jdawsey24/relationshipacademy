import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyInsertError, shouldRetry, livemodeMatches, reconcileDiff, PG_UNIQUE_VIOLATION,
  type PaidSession,
} from "../lib/companion/entitlementReliability";

// ---- insert-error classification (idempotency + retryability) ----
test("clean insert → ok (granted)", () => {
  assert.equal(classifyInsertError(null), "ok");
  assert.equal(classifyInsertError(undefined), "ok");
});
test("unique violation → duplicate (already granted, safe under concurrency)", () => {
  assert.equal(classifyInsertError({ code: PG_UNIQUE_VIOLATION }), "duplicate");
  assert.equal(classifyInsertError({ code: "23505" }), "duplicate");
});
test("other DB error → error (retryable failure)", () => {
  assert.equal(classifyInsertError({ code: "08006" }), "error");   // connection failure
  assert.equal(classifyInsertError({ code: null }), "error");
});

// ---- retry decision: only a real failure asks Stripe to retry ----
test("only 'failed' triggers a webhook retry", () => {
  assert.equal(shouldRetry("failed"), true);
  assert.equal(shouldRetry("granted"), false);
  assert.equal(shouldRetry("already_granted"), false);
  assert.equal(shouldRetry("not_applicable"), false);
});

// ---- environment separation ----
test("livemode must match: test event never grants in live env (and vice versa)", () => {
  assert.equal(livemodeMatches(true, true), true);     // live key + live event
  assert.equal(livemodeMatches(false, false), true);   // test key + test event
  assert.equal(livemodeMatches(true, false), false);   // live env, TEST event → no grant
  assert.equal(livemodeMatches(false, true), false);   // test env, LIVE event → no grant
});

// ---- reconciliation diff (paid-but-ungranted) ----
const p = (ref: string, userId = "u1", customerId: string | null = "cus_1"): PaidSession => ({ ref, userId, customerId });
test("reconcileDiff returns only paid sessions with no active entitlement", () => {
  const paid = [p("cs_1"), p("cs_2"), p("cs_3")];
  const active = new Set(["cs_2"]);
  assert.deepEqual(reconcileDiff(paid, active).map((x) => x.ref), ["cs_1", "cs_3"]);
});
test("reconcileDiff: fully-granted → no discrepancies", () => {
  assert.deepEqual(reconcileDiff([p("cs_1")], new Set(["cs_1"])), []);
});
test("reconcileDiff de-dupes input and skips rows missing ref/user", () => {
  const paid = [p("cs_1"), p("cs_1"), { ref: "", userId: "u", customerId: null }, { ref: "cs_x", userId: "", customerId: null }];
  assert.deepEqual(reconcileDiff(paid, new Set()).map((x) => x.ref), ["cs_1"]);
});
