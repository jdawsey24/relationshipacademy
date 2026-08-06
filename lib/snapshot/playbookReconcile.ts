import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured, stripeIsLive } from "@/lib/stripe";
import { livemodeMatches, refundIsFull } from "@/lib/companion/entitlementReliability";
import { grantPlaybookFromStripeSession, revokePlaybookByStripeRef, countActiveGrantsByStripeRef } from "@/lib/snapshot/playbookGrants";
import { resolveOrCreatePurchaser } from "@/lib/snapshot/purchaseAccount";

// Reconciliation safety net for Playbooks. Stripe is authoritative for money;
// this finds places where our access state disagrees with it, in BOTH directions:
//
//   MISSING  — paid, but no active entitlement (webhook lost / retries exhausted /
//              guest account provisioning failed). The customer paid and has nothing.
//   STALE    — refunded or charged back, but access is still active. We gave the
//              money back and they kept the product.
//
// The second direction is the one the Companion's reconciler doesn't cover, and
// it's why this exists: revocation now happens in a webhook, and a webhook that
// silently fails leaves no trace anywhere a human looks.
//
// Read-only by default. `repair: true` grants the missing and revokes the stale.
// Idempotent — safe to run repeatedly. Never manufactures a purchase: it only
// acts where Stripe confirms the state, in the CURRENT environment (livemode).

export interface PlaybookDiscrepancy {
  session: string;
  kind: "missing_grant" | "stale_access";
  cluster_id: number | null;
  email: string | null;
  reason: string;
  repaired: boolean;
  error?: string;
}

export interface PlaybookReconcileReport {
  window_hours: number;
  livemode: boolean;
  paid_sessions: number;
  missing_grants: number;
  stale_access: number;
  repaired: number;
  still_failing: number;
  discrepancies: PlaybookDiscrepancy[];
}

interface PaidPlaybookSession {
  id: string;
  clusterId: number;
  userId: string | null;
  email: string | null;
  customerId: string | null;
}

/** PAID Playbook checkout sessions in the window, environment-matched. */
async function paidPlaybookSessions(windowHours: number): Promise<PaidPlaybookSession[]> {
  const stripe = getStripe();
  const since = Math.floor(Date.now() / 1000) - windowHours * 3600;
  const keyLive = stripeIsLive();
  const out: PaidPlaybookSession[] = [];
  for await (const s of stripe.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
    if (s.metadata?.product_key !== "playbook") continue;
    if (s.payment_status !== "paid" && s.payment_status !== "no_payment_required") continue;
    if (!livemodeMatches(keyLive, s.livemode)) continue;
    const clusterId = Number(s.metadata?.cluster_id);
    if (!Number.isInteger(clusterId)) continue;
    out.push({
      id: s.id,
      clusterId,
      userId: s.metadata?.user_id ?? null,
      email: s.customer_details?.email ?? s.customer_email ?? null,
      customerId: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
    });
  }
  return out;
}

/** Session ids that currently hold an ACTIVE playbook entitlement. */
async function activeRefs(): Promise<Set<string>> {
  const s = getSupabaseAdminClient();
  const { data } = await s
    .from("playbook_entitlements")
    .select("stripe_ref")
    .eq("status", "active")
    .not("stripe_ref", "is", null);
  return new Set(
    ((data ?? []) as { stripe_ref: string | null }[]).map((r) => r.stripe_ref).filter((x): x is string => !!x)
  );
}

/**
 * Sessions whose money came back in the window — full refunds and lost/open
 * disputes. Keyed by REFUND time, not purchase time, so a refund of an old
 * purchase is still caught.
 */
async function moneyReturnedSessions(windowHours: number): Promise<{ session: string; reason: string; email: string | null }[]> {
  const stripe = getStripe();
  const since = Math.floor(Date.now() / 1000) - windowHours * 3600;
  const keyLive = stripeIsLive();
  const out: { session: string; reason: string; email: string | null }[] = [];

  const sessionForPi = async (pi: string | null) => {
    if (!pi) return null;
    const found = await stripe.checkout.sessions.list({ payment_intent: pi, limit: 1 });
    const s = found.data[0];
    return s && s.metadata?.product_key === "playbook" ? s : null;
  };

  for await (const refund of stripe.refunds.list({ created: { gte: since }, limit: 100 })) {
    // (Refund objects carry no livemode field — the API key already scopes the
    // list to one mode, and the session lookup below is scoped the same way.)
    if (refund.status !== "succeeded") continue;
    const pi = typeof refund.payment_intent === "string" ? refund.payment_intent : refund.payment_intent?.id ?? null;
    const session = await sessionForPi(pi);
    if (!session) continue;
    // Partial refunds deliberately keep access (goodwill adjustments).
    const chargeId = typeof refund.charge === "string" ? refund.charge : refund.charge?.id ?? null;
    if (!chargeId) continue;
    const charge = await stripe.charges.retrieve(chargeId);
    if (!refundIsFull(charge.amount_refunded, charge.amount)) continue;
    out.push({ session: session.id, reason: "full refund", email: session.customer_details?.email ?? null });
  }

  for await (const dispute of stripe.disputes.list({ created: { gte: since }, limit: 100 })) {
    if (!livemodeMatches(keyLive, dispute.livemode)) continue;
    if (dispute.status === "won" || dispute.status === "warning_closed") continue; // we kept the money
    const pi = typeof dispute.payment_intent === "string" ? dispute.payment_intent : dispute.payment_intent?.id ?? null;
    const session = await sessionForPi(pi);
    if (!session) continue;
    out.push({ session: session.id, reason: `dispute (${dispute.status})`, email: session.customer_details?.email ?? null });
  }

  return out;
}

export async function reconcilePlaybookEntitlements(
  opts: { windowHours?: number; repair?: boolean } = {}
): Promise<PlaybookReconcileReport> {
  const window_hours = opts.windowHours ?? 72;
  const base: PlaybookReconcileReport = {
    window_hours, livemode: stripeConfigured() ? stripeIsLive() : false,
    paid_sessions: 0, missing_grants: 0, stale_access: 0, repaired: 0, still_failing: 0, discrepancies: [],
  };
  if (!stripeConfigured()) return base;

  const [paid, active, returned] = await Promise.all([
    paidPlaybookSessions(window_hours),
    activeRefs(),
    moneyReturnedSessions(window_hours),
  ]);
  base.paid_sessions = paid.length;

  // Ignore anything whose money came back — that's the other list's business.
  const returnedIds = new Set(returned.map((r) => r.session));

  // --- Direction 1: paid, but no active entitlement -------------------------
  for (const s of paid) {
    if (active.has(s.id) || returnedIds.has(s.id)) continue;
    const d: PlaybookDiscrepancy = {
      session: s.id, kind: "missing_grant", cluster_id: s.clusterId, email: s.email,
      reason: s.userId ? "paid, no active grant" : "paid guest, no active grant (account may not exist)",
      repaired: false,
    };
    if (opts.repair) {
      // A guest session has no user_id — resolve or create the account exactly
      // as the webhook would, so the grant has somewhere to attach.
      let userId = s.userId;
      if (!userId) {
        const provisioned = await resolveOrCreatePurchaser(s.email);
        userId = provisioned.userId;
        if (!userId) d.error = provisioned.error ?? "could not provision an account";
      }
      if (userId) {
        await grantPlaybookFromStripeSession({ userId, clusterId: s.clusterId, customerId: s.customerId, ref: s.id });
        d.repaired = (await countActiveGrantsByStripeRef(s.id)) > 0;
        if (!d.repaired) d.error = d.error ?? "grant did not persist";
      }
    }
    base.discrepancies.push(d);
    base.missing_grants++;
  }

  // --- Direction 2: money returned, but access still active -----------------
  for (const r of returned) {
    if (!active.has(r.session)) continue; // already revoked correctly
    const d: PlaybookDiscrepancy = {
      session: r.session, kind: "stale_access", cluster_id: null, email: r.email,
      reason: `${r.reason} but access still active`, repaired: false,
    };
    if (opts.repair) {
      await revokePlaybookByStripeRef(r.session, "reconcile: money returned");
      const stillActive = await countActiveGrantsByStripeRef(r.session);
      d.repaired = stillActive === 0;
      if (!d.repaired) d.error = stillActive < 0 ? "could not verify revocation" : `${stillActive} grant(s) still active`;
    }
    base.discrepancies.push(d);
    base.stale_access++;
  }

  base.repaired = base.discrepancies.filter((d) => d.repaired).length;
  base.still_failing = opts.repair ? base.discrepancies.filter((d) => !d.repaired).length : 0;
  return base;
}
