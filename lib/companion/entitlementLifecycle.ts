import { getSupabaseAdminClient } from "@/lib/supabase";
import { TRANSITIONS, type LifecycleAction, type SourceStatus } from "@/lib/companion/entitlementReliability";
import { recordEntitlementEvent, recordIneligiblePayment } from "@/lib/companion/entitlementLedger";
import { grantCompanion } from "@/lib/companion/entitlementGrants";

// Server-only. Applies entitlement-source lifecycle transitions from Stripe events
// (matched PRECISELY by payment_intent — never by customer, so an unrelated user's
// grant can never be touched; manual grants have a null payment_intent and are
// therefore immune). All transitions are guarded (idempotent) + audited.

export type LifecycleResult = "applied" | "noop" | "recorded_ineligible" | "no_match" | "failed";

interface Row { id: string; status: string; source: string }

/** Apply a Stripe-driven lifecycle action to the entitlement(s) for a payment. */
export async function applyLifecycleByPaymentIntent(
  paymentIntentId: string,
  action: Exclude<LifecycleAction, "partial_refund">,
  opts: { reason: string; stripeEventId: string; livemode: boolean }
): Promise<LifecycleResult> {
  if (!paymentIntentId) return "no_match";
  const s = getSupabaseAdminClient();
  const spec = TRANSITIONS[action];
  const eventType = action;

  const { data, error } = await s.from("companion_entitlements")
    .select("id, status, source").eq("payment_intent_id", paymentIntentId);
  if (error) { console.error(`[entitlement] lifecycle read failed pi=${paymentIntentId}:`, error.message); return "failed"; }
  const rows = (data ?? []) as Row[];

  // Out-of-order: a definitive negative (refund / dispute lost) arrived before any
  // grant → remember the payment as ineligible so the later grant is denied.
  if (rows.length === 0) {
    if (action === "full_refund" || action === "dispute_lost") {
      await recordIneligiblePayment(paymentIntentId, action === "full_refund" ? "refunded" : "dispute_lost", opts.stripeEventId, opts.livemode);
      await recordEntitlementEvent({ paymentIntentId, eventType, toStatus: spec.to, reason: `${opts.reason} (no entitlement yet — recorded ineligible)`, stripeEventId: opts.stripeEventId, livemode: opts.livemode });
      return "recorded_ineligible";
    }
    // dispute_open / dispute_won with no entitlement yet: nothing to change (the
    // eventual grant + terminal dispute event will finalize). Audit only.
    await recordEntitlementEvent({ paymentIntentId, eventType, reason: `${opts.reason} (no entitlement)`, stripeEventId: opts.stripeEventId, livemode: opts.livemode });
    return "no_match";
  }

  const toChange = rows.filter((r) => (spec.from as string[]).includes(r.status));
  if (toChange.length === 0) {
    // Already in a terminal/other state → idempotent no-op (e.g. redelivered event).
    await recordEntitlementEvent({ entitlementId: rows[0].id, paymentIntentId, eventType, fromStatus: rows[0].status, toStatus: rows[0].status, reason: `${opts.reason} (no-op)`, stripeEventId: opts.stripeEventId, livemode: opts.livemode });
    return "noop";
  }

  const { error: upErr } = await s.from("companion_entitlements")
    .update({ status: spec.to, updated_at: new Date().toISOString() })
    .eq("payment_intent_id", paymentIntentId).in("status", spec.from as string[]);
  if (upErr) { console.error(`[entitlement] lifecycle update failed pi=${paymentIntentId}:`, upErr.message); return "failed"; }

  for (const r of toChange) {
    await recordEntitlementEvent({ entitlementId: r.id, paymentIntentId, eventType, fromStatus: r.status as SourceStatus, toStatus: spec.to, reason: opts.reason, stripeEventId: opts.stripeEventId, livemode: opts.livemode });
  }
  return "applied";
}

/** Partial refund — audit only, NEVER revokes (policy). */
export async function recordPartialRefund(paymentIntentId: string, amountRefunded: number, stripeEventId: string, livemode: boolean): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_entitlements").select("id").eq("payment_intent_id", paymentIntentId).maybeSingle();
  await recordEntitlementEvent({
    entitlementId: (data as { id?: string } | null)?.id ?? null, paymentIntentId, eventType: "partial_refund",
    reason: "partial refund — access retained (policy)", amountRefunded, stripeEventId, livemode,
  });
}

// ---------------------------------------------------------------------------
// Admin controls — owner-only (gated in the route), require an audit reason.
// Manual grants are a separate source and are NEVER touched by Stripe events.
// ---------------------------------------------------------------------------

export async function adminGrant(userId: string, actor: string, reason: string): Promise<{ ok: boolean; result: string }> {
  const result = await grantCompanion({ userId, source: "manual_grant", grantedBy: actor, notes: reason, expiresAt: null });
  await recordEntitlementEvent({ eventType: "admin_grant", toStatus: "active", reason, actor });
  return { ok: result !== "failed", result };
}

async function adminTransition(entitlementId: string, action: "admin_revoke" | "admin_restore", actor: string, reason: string): Promise<{ ok: boolean; result: LifecycleResult }> {
  const s = getSupabaseAdminClient();
  const spec = TRANSITIONS[action];
  const { data } = await s.from("companion_entitlements").select("id, status").eq("id", entitlementId).maybeSingle();
  const cur = data as { id: string; status: string } | null;
  if (!cur) return { ok: false, result: "no_match" };
  if (!(spec.from as string[]).includes(cur.status)) {
    await recordEntitlementEvent({ entitlementId, eventType: action, fromStatus: cur.status, toStatus: cur.status, reason: `${reason} (no-op)`, actor });
    return { ok: true, result: "noop" };
  }
  const { error } = await s.from("companion_entitlements").update({ status: spec.to, updated_at: new Date().toISOString() }).eq("id", entitlementId).in("status", spec.from as string[]);
  if (error) return { ok: false, result: "failed" };
  await recordEntitlementEvent({ entitlementId, eventType: action, fromStatus: cur.status, toStatus: spec.to, reason, actor });
  return { ok: true, result: "applied" };
}

export const adminRevoke = (id: string, actor: string, reason: string) => adminTransition(id, "admin_revoke", actor, reason);
export const adminRestore = (id: string, actor: string, reason: string) => adminTransition(id, "admin_restore", actor, reason);
