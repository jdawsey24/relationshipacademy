// Pure helpers for Companion entitlement grant reliability (no I/O — unit-tested).
// The DB constraint + these helpers make grants idempotent, race-safe, retryable,
// and reconcilable against Stripe.

export type GrantResult = "granted" | "already_granted" | "not_applicable" | "failed";

/** Postgres unique-violation code — a concurrent/duplicate grant hit the constraint. */
export const PG_UNIQUE_VIOLATION = "23505";

/** Classify a Supabase insert error: a unique violation means "already granted"
 *  (safe under concurrency); any other error is a real, retryable failure. */
export function classifyInsertError(error: { code?: string | null } | null | undefined): "ok" | "duplicate" | "error" {
  if (!error) return "ok";
  if (error.code === PG_UNIQUE_VIOLATION) return "duplicate";
  return "error";
}

/** Only a "failed" outcome should make the webhook signal Stripe to retry.
 *  granted / already_granted / not_applicable are all terminal-success for delivery. */
export function shouldRetry(result: GrantResult): boolean {
  return result === "failed";
}

/** Environment separation: grant only when the event's livemode matches the key's
 *  mode. A test-mode event must never grant in a live environment (and vice versa). */
export function livemodeMatches(keyIsLive: boolean, eventLivemode: boolean): boolean {
  return keyIsLive === eventLivemode;
}

// ---------------------------------------------------------------------------
// Entitlement-source lifecycle state machine (owner-approved policy).
// Only "active" grants EFFECTIVE ACCESS. Effective access = ANY active source
// (computed at the read layer), so revoking one source never removes access when
// another valid source remains.
// ---------------------------------------------------------------------------

export type SourceStatus =
  | "pending" | "active" | "dispute_suspended"
  | "revoked_refund" | "revoked_dispute" | "revoked_admin"
  | "failed" | "superseded" | "canceled" | "expired";

export type LifecycleAction =
  | "full_refund" | "partial_refund"
  | "dispute_open" | "dispute_won" | "dispute_lost"
  | "admin_revoke" | "admin_restore";

// Guarded transitions: `from` states this action may apply to, and the resulting
// `to` state. Applying against any other state is a NO-OP (idempotent) — the DB
// update is scoped to `from`, so a redelivered event matches zero rows the 2nd time.
export const TRANSITIONS: Record<Exclude<LifecycleAction, "partial_refund">, { to: SourceStatus; from: SourceStatus[] }> = {
  full_refund:   { to: "revoked_refund",    from: ["active", "dispute_suspended", "pending"] },
  dispute_open:  { to: "dispute_suspended", from: ["active", "pending"] },
  dispute_won:   { to: "active",            from: ["dispute_suspended"] },
  dispute_lost:  { to: "revoked_dispute",   from: ["dispute_suspended", "active"] },
  admin_revoke:  { to: "revoked_admin",     from: ["active", "dispute_suspended", "pending"] },
  admin_restore: { to: "active",            from: ["revoked_refund", "revoked_dispute", "revoked_admin", "dispute_suspended", "superseded"] },
};

/** Only "active" (and unexpired, checked separately) confers effective access. */
export function statusGrantsAccess(status: string): boolean {
  return status === "active";
}

/** Guarded transition: the resulting status for an action from a given state, or
 *  null if the action does not apply (→ no-op, which makes redelivery idempotent). */
export function nextStatus(action: Exclude<LifecycleAction, "partial_refund">, from: string): SourceStatus | null {
  const spec = TRANSITIONS[action];
  return (spec.from as string[]).includes(from) ? spec.to : null;
}

/** Effective access across ALL of a user's entitlement sources: access iff ANY
 *  source is active (and unexpired). Revoking one source never removes access when
 *  another valid source remains. */
export function hasEffectiveAccess(sources: { status: string; expires_at?: string | null }[], nowMs: number): boolean {
  return sources.some((s) => statusGrantsAccess(s.status) && (s.expires_at == null || new Date(s.expires_at).getTime() > nowMs));
}

/** A refund is FULL when the cumulative refunded amount covers the charge. */
export function refundIsFull(amountRefunded: number, amount: number): boolean {
  return amount > 0 && amountRefunded >= amount;
}

/** Map a closed dispute's Stripe status to an action, or null if not terminal. */
export function disputeClosedAction(status: string): "dispute_won" | "dispute_lost" | null {
  if (status === "won" || status === "warning_closed") return "dispute_won";
  if (status === "lost") return "dispute_lost";
  return null;
}

export interface PaidSession { ref: string; userId: string; customerId: string | null; paymentIntentId?: string | null }

/** Reconciliation diff: which Stripe-paid Companion sessions have NO active
 *  entitlement yet (paid-but-ungranted). Stripe is authoritative for payment. */
export function reconcileDiff(paid: PaidSession[], activeRefs: Set<string>): PaidSession[] {
  const seen = new Set<string>();
  const out: PaidSession[] = [];
  for (const p of paid) {
    if (!p.ref || !p.userId) continue;         // can't grant without both
    if (activeRefs.has(p.ref)) continue;        // already entitled
    if (seen.has(p.ref)) continue;              // de-dupe the input itself
    seen.add(p.ref);
    out.push(p);
  }
  return out;
}
