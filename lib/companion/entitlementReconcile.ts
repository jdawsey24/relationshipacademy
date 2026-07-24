import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured, stripeIsLive } from "@/lib/stripe";
import { grantFromStripeSession } from "@/lib/companion/entitlementGrants";
import { reconcileDiff, livemodeMatches, type PaidSession } from "@/lib/companion/entitlementReliability";

// Reconciliation safety net: Stripe is authoritative for payment. Find PAID
// Companion checkout sessions that have no active entitlement (paid-but-ungranted
// — e.g. Stripe exhausted webhook retries) and repair them. Read-only report OR
// repair. Never manufactures a purchase locally; only grants where Stripe confirms
// a paid Companion session in the CURRENT environment (livemode-matched).

export interface ReconcileReport {
  window_hours: number;
  paid_sessions: number;
  already_entitled: number;
  discrepancies: number;        // paid but ungranted
  repaired: number;             // successfully granted this run
  still_failing: number;
  refs_repaired: string[];
  refs_still_failing: string[];
}

/** Pull PAID Companion checkout sessions from Stripe in the window (env-matched). */
async function paidCompanionSessions(windowHours: number): Promise<PaidSession[]> {
  const stripe = getStripe();
  const since = Math.floor(Date.now() / 1000) - windowHours * 3600;
  const out: PaidSession[] = [];
  const keyLive = stripeIsLive();
  for await (const s of stripe.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
    if (s.metadata?.product_key !== "companion") continue;
    if (s.payment_status !== "paid" && s.payment_status !== "no_payment_required") continue;
    if (!livemodeMatches(keyLive, s.livemode)) continue;   // env separation
    const userId = s.metadata?.user_id;
    if (!userId) continue;
    const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
    const paymentIntentId = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null;
    out.push({ ref: s.id, userId, customerId, paymentIntentId });
  }
  return out;
}

async function activeEntitlementRefs(): Promise<Set<string>> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_entitlements").select("stripe_ref").eq("status", "active").not("stripe_ref", "is", null);
  return new Set(((data ?? []) as { stripe_ref: string | null }[]).map((r) => r.stripe_ref).filter((x): x is string => !!x));
}

/** Compute discrepancies (paid-but-ungranted). Read-only when repair=false. */
export async function reconcileCompanionEntitlements(opts: { windowHours?: number; repair?: boolean } = {}): Promise<ReconcileReport> {
  const window_hours = opts.windowHours ?? 72;
  if (!stripeConfigured()) {
    return { window_hours, paid_sessions: 0, already_entitled: 0, discrepancies: 0, repaired: 0, still_failing: 0, refs_repaired: [], refs_still_failing: [] };
  }
  const [paid, activeRefs] = await Promise.all([paidCompanionSessions(window_hours), activeEntitlementRefs()]);
  const missing = reconcileDiff(paid, activeRefs);

  const refs_repaired: string[] = [];
  const refs_still_failing: string[] = [];
  if (opts.repair) {
    for (const m of missing) {
      const keyLive = stripeIsLive();
      const result = await grantFromStripeSession({ userId: m.userId, customerId: m.customerId, ref: m.ref, paymentIntentId: m.paymentIntentId ?? null, livemode: keyLive });
      if (result === "failed") refs_still_failing.push(m.ref); else refs_repaired.push(m.ref);
    }
  }
  return {
    window_hours,
    paid_sessions: paid.length,
    already_entitled: paid.length - missing.length,
    discrepancies: missing.length,
    repaired: refs_repaired.length,
    still_failing: refs_still_failing.length,
    refs_repaired,
    refs_still_failing: opts.repair ? refs_still_failing : missing.map((m) => m.ref),
  };
}
