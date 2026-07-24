import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only low-level ledger helpers for entitlement lifecycle. Kept dependency-
// free (no grant/lifecycle imports) so both can use it without a cycle. All writes
// are METADATA ONLY — never card/payment data (amount_refunded in minor units is
// the only numeric, for partial-refund audit).

export interface EntitlementEvent {
  entitlementId?: string | null;
  paymentIntentId?: string | null;
  eventType: string;                 // grant | full_refund | partial_refund | dispute_* | admin_*
  fromStatus?: string | null;
  toStatus?: string | null;
  reason?: string | null;
  amountRefunded?: number | null;
  stripeEventId?: string | null;     // unique → dedups a redelivered Stripe event
  actor?: string | null;             // admin email for manual actions
  livemode?: boolean | null;
}

/** Append an audit/idempotency event. Returns false if this stripe_event_id was
 *  already recorded (duplicate delivery) — callers can use that to skip re-work. */
export async function recordEntitlementEvent(e: EntitlementEvent): Promise<{ recorded: boolean; duplicate: boolean }> {
  const s = getSupabaseAdminClient();
  try {
    const { error } = await s.from("companion_entitlement_events").insert({
      entitlement_id: e.entitlementId ?? null, payment_intent_id: e.paymentIntentId ?? null,
      event_type: e.eventType, from_status: e.fromStatus ?? null, to_status: e.toStatus ?? null,
      reason: e.reason ?? null, amount_refunded: e.amountRefunded ?? null,
      stripe_event_id: e.stripeEventId ?? null, actor: e.actor ?? null, livemode: e.livemode ?? null,
    });
    if (error) {
      if (error.code === "23505") return { recorded: false, duplicate: true }; // event already processed
      console.error(`[entitlement] event log failed (${e.eventType}):`, error.message);
      return { recorded: false, duplicate: false };
    }
    return { recorded: true, duplicate: false };
  } catch (err) { console.error(`[entitlement] event log threw (${e.eventType}):`, err instanceof Error ? err.message : err); return { recorded: false, duplicate: false }; }
}

/** Remember a payment that must NOT be granted (refund/dispute arrived first). */
export async function recordIneligiblePayment(paymentIntentId: string, reason: string, stripeEventId: string | null, livemode: boolean | null): Promise<void> {
  const s = getSupabaseAdminClient();
  try {
    await s.from("companion_ineligible_payments").upsert(
      { payment_intent_id: paymentIntentId, reason, stripe_event_id: stripeEventId, livemode },
      { onConflict: "payment_intent_id" }
    );
  } catch (e) { console.error(`[entitlement] ineligible log failed pi=${paymentIntentId}:`, e instanceof Error ? e.message : e); }
}

/** Was this payment already refunded/disputed before the grant arrived? */
export async function isPaymentIneligible(paymentIntentId: string | null): Promise<boolean> {
  if (!paymentIntentId) return false;
  const s = getSupabaseAdminClient();
  try {
    const { data } = await s.from("companion_ineligible_payments").select("payment_intent_id").eq("payment_intent_id", paymentIntentId).maybeSingle();
    return !!data;
  } catch { return false; }
}
