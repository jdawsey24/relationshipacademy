import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyInsertError, shouldRetry, livemodeMatches, reconcileDiff, PG_UNIQUE_VIOLATION,
  refundIsFull, disputeClosedAction, nextStatus, hasEffectiveAccess, statusGrantsAccess,
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

// ---- refund full-vs-partial ----
test("refundIsFull: full covers the charge; partial does not", () => {
  assert.equal(refundIsFull(1999, 1999), true);
  assert.equal(refundIsFull(2000, 1999), true);   // cumulative >= amount
  assert.equal(refundIsFull(500, 1999), false);   // partial
  assert.equal(refundIsFull(0, 0), false);
});

// ---- dispute outcome mapping ----
test("disputeClosedAction maps won/lost, ignores non-terminal", () => {
  assert.equal(disputeClosedAction("won"), "dispute_won");
  assert.equal(disputeClosedAction("lost"), "dispute_lost");
  assert.equal(disputeClosedAction("under_review"), null);
});

// ---- state machine (locked policy) ----
test("full refund: active → revoked_refund; idempotent no-op thereafter", () => {
  assert.equal(nextStatus("full_refund", "active"), "revoked_refund");
  assert.equal(nextStatus("full_refund", "revoked_refund"), null);   // redelivery → no-op
});
test("dispute lifecycle: open → suspended; won → active; lost → revoked_dispute", () => {
  assert.equal(nextStatus("dispute_open", "active"), "dispute_suspended");
  assert.equal(nextStatus("dispute_won", "dispute_suspended"), "active");
  assert.equal(nextStatus("dispute_lost", "dispute_suspended"), "revoked_dispute");
  assert.equal(nextStatus("dispute_won", "active"), null);           // nothing to restore
});
test("admin revoke/restore transitions are guarded", () => {
  assert.equal(nextStatus("admin_revoke", "active"), "revoked_admin");
  assert.equal(nextStatus("admin_restore", "revoked_admin"), "active");
  assert.equal(nextStatus("admin_restore", "active"), null);        // already active → no-op
});

// ---- EFFECTIVE ACCESS = any active source (the central principle) ----
const NOW = 1_800_000_000_000;
test("effective access: any one active source grants access", () => {
  assert.equal(hasEffectiveAccess([{ status: "revoked_refund" }, { status: "active" }], NOW), true);
});
test("full refund removes access only when it was the SOLE source", () => {
  assert.equal(hasEffectiveAccess([{ status: "revoked_refund" }], NOW), false);            // sole source refunded → no access
  assert.equal(hasEffectiveAccess([{ status: "revoked_refund" }, { status: "active" }], NOW), true); // other source keeps access
});
test("suspended / revoked sources do not grant access; expired doesn't either", () => {
  assert.equal(hasEffectiveAccess([{ status: "dispute_suspended" }], NOW), false);
  assert.equal(hasEffectiveAccess([{ status: "revoked_dispute" }], NOW), false);
  assert.equal(hasEffectiveAccess([{ status: "active", expires_at: new Date(NOW - 1000).toISOString() }], NOW), false);
  assert.equal(hasEffectiveAccess([{ status: "active", expires_at: null }], NOW), true);
});
test("manual grant (active) independently grants access alongside a revoked purchase", () => {
  assert.equal(hasEffectiveAccess([{ status: "revoked_refund" }, { status: "active" /* manual */ }], NOW), true);
  assert.equal(statusGrantsAccess("active"), true);
  assert.equal(statusGrantsAccess("dispute_suspended"), false);
});
