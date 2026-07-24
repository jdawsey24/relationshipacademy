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

export interface PaidSession { ref: string; userId: string; customerId: string | null }

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
