import { getSupabaseAdminClient } from "@/lib/supabase";
import { COMPANION_PRODUCT_KEY } from "@/lib/companion";
import { trackCompanionEvent } from "@/lib/companion/analytics";
import { classifyInsertError, type GrantResult } from "@/lib/companion/entitlementReliability";

// Server-only. Grant/resolve Companion access. Independent of the Academy tier
// ladder; a grant is a companion_entitlements ROW. Idempotency + race-safety come
// from the DB unique index on stripe_ref (migration 0049), NOT a read-then-write.
// Every Stripe-driven grant also records a companion_grant_attempts row so failed
// grants are retryable + reconcilable + observable.

export type GrantSource = "one_time_purchase" | "bundle" | "academy_inclusion" | "promotional" | "manual_grant" | "subscription";

export interface GrantInput {
  userId: string;
  source: GrantSource;
  stripeCustomerId?: string | null;
  stripeRef?: string | null;      // checkout session / charge / subscription id — idempotency key
  expiresAt?: string | null;      // null = perpetual (one-time purchase)
  grantedBy?: string | null;      // admin actor for manual grants
  notes?: string | null;
  livemode?: boolean | null;
}

/**
 * Idempotent + race-safe grant. Inserts the entitlement; a unique-violation on
 * stripe_ref means a concurrent/duplicate delivery already granted it (success).
 * Returns a GrantResult so the caller (webhook) can decide whether to retry.
 */
export async function grantCompanion(input: GrantInput): Promise<GrantResult> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_entitlements").insert({
    user_id: input.userId, source: input.source, product_key: COMPANION_PRODUCT_KEY,
    stripe_customer_id: input.stripeCustomerId ?? null, stripe_ref: input.stripeRef ?? null,
    status: "active", expires_at: input.expiresAt ?? null, granted_by: input.grantedBy ?? null, notes: input.notes ?? null,
  });
  const kind = classifyInsertError(error);
  if (kind === "duplicate") return "already_granted";
  if (kind === "error") { console.error(`[entitlement] grant insert failed ref=${input.stripeRef ?? "-"}: ${error?.message}`); return "failed"; }
  // Success — best-effort analytics (never flips the result).
  try { await trackCompanionEvent(input.userId, "entitlement_unlocked", { source: input.source }); } catch { /* non-fatal */ }
  return "granted";
}

/** Record/advance a grant attempt (state machine + observability). Never throws. */
export async function recordGrantAttempt(
  ref: string, fields: { userId?: string | null; status: string; error?: string | null; livemode?: boolean | null; bumpAttempt?: boolean }
): Promise<void> {
  const s = getSupabaseAdminClient();
  try {
    const { data: prev } = await s.from("companion_grant_attempts").select("attempts").eq("stripe_ref", ref).maybeSingle();
    const attempts = ((prev as { attempts?: number } | null)?.attempts ?? 0) + (fields.bumpAttempt ? 1 : 0);
    await s.from("companion_grant_attempts").upsert({
      stripe_ref: ref, user_id: fields.userId ?? null, product_key: COMPANION_PRODUCT_KEY,
      status: fields.status, attempts,
      last_error: fields.error ? String(fields.error).slice(0, 300) : null,
      livemode: fields.livemode ?? null, updated_at: new Date().toISOString(),
    }, { onConflict: "stripe_ref" });
  } catch (e) { console.error(`[entitlement] attempt log failed ref=${ref}:`, e instanceof Error ? e.message : e); }
}

/**
 * Grant from a completed Stripe checkout session (called by the webhook). Records
 * the attempt lifecycle so a failure is retryable (webhook returns non-2xx) and
 * reconcilable. Returns the GrantResult.
 */
export async function grantFromStripeSession(opts: { userId: string; customerId: string | null; ref: string; livemode: boolean }): Promise<GrantResult> {
  await recordGrantAttempt(opts.ref, { userId: opts.userId, status: "processing", livemode: opts.livemode, bumpAttempt: true });
  const result = await grantCompanion({ userId: opts.userId, source: "one_time_purchase", stripeCustomerId: opts.customerId, stripeRef: opts.ref, expiresAt: null, livemode: opts.livemode });
  await recordGrantAttempt(opts.ref, {
    userId: opts.userId, livemode: opts.livemode,
    status: result === "failed" ? "failed" : "succeeded",
    error: result === "failed" ? "grant insert failed" : null,
  });
  return result;
}

/** Revoke (e.g. refund/chargeback) — mark grants for a Stripe ref canceled. */
export async function revokeByStripeRef(ref: string): Promise<void> {
  const s = getSupabaseAdminClient();
  try { await s.from("companion_entitlements").update({ status: "canceled", updated_at: new Date().toISOString() }).eq("stripe_ref", ref); } catch { /* resilient */ }
}
