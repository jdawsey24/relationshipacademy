import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured, stripeIsLive } from "@/lib/stripe";
import { livemodeMatches, shouldRetry, type GrantResult } from "@/lib/companion/entitlementReliability";
import { CHECKOUT_GRANT_EVENTS, isPaidSession } from "@/lib/stripeCheckoutEvents";
import {
  claimEvent, markEventProcessed, markEventFailed,
  recordCharge, recordRefund, upsertSubscription, upsertPayout, upsertDispute,
  upsertFailedPayment, recordSubscriptionChange, getStoredSubscription, reclassifyCustomerCharges,
} from "@/lib/stripeFinance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook. Two independent concerns:
//   1) ACCESS — flip profiles.membership_tier (existing, must never break).
//   2) FINANCE — sync the reporting layer via a status machine (idempotent,
//      retry-safe). Runs after access; a finance failure returns 500 so Stripe
//      retries (access is idempotent). Finance no-ops safely if migration 0016
//      hasn't run (claimEvent returns "skip").

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

// ---- 1) Access: tier flip (unchanged) ----
async function setTierByCustomer(
  customerId: string,
  fields: { membership_tier?: string; subscription_status?: string; stripe_subscription_id?: string | null }
) {
  const admin = getSupabaseAdminClient();
  await admin.from("profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("stripe_customer_id", customerId);
}

async function applyTierFlip(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
      const tier = s.metadata?.tier;
      if (customerId && tier) {
        await setTierByCustomer(customerId, {
          membership_tier: tier,
          subscription_status: "active",
          stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : null,
        });
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const priceTier = sub.items.data[0]?.price?.metadata?.tier ?? sub.metadata?.tier ?? "free";
      const tier = ACTIVE_STATUSES.has(sub.status) ? priceTier : "free";
      await setTierByCustomer(customerId, { membership_tier: tier, subscription_status: sub.status, stripe_subscription_id: sub.id });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      await setTierByCustomer(customerId, { membership_tier: "free", subscription_status: "canceled", stripe_subscription_id: null });
      break;
    }
    default:
      break;
  }
}

// ---- 1b) Relationship Companion grant ----
// One-time purchase completes -> write a companion_entitlements row. Keyed by
// metadata.product_key === "companion" so it never touches Academy purchases.
// Returns a GrantResult; "failed" tells the webhook to signal Stripe to retry.
// "not_applicable" = not a Companion purchase (or paid Stripe not confirmed).
async function applyCompanionGrant(event: Stripe.Event): Promise<GrantResult> {
  if (!CHECKOUT_GRANT_EVENTS.has(event.type)) return "not_applicable";
  const s = event.data.object as Stripe.Checkout.Session;
  if (s.metadata?.product_key !== "companion") return "not_applicable";
  // Stripe stays authoritative for payment: only grant on a PAID session. A
  // delayed method lands here twice — "unpaid" on completed (skip), then "paid"
  // on async_payment_succeeded (grant).
  if (!isPaidSession(s)) {
    console.log(`[stripe/webhook] companion grant deferred: session ${s.id} is ${s.payment_status} (awaiting settlement)`);
    return "not_applicable";
  }
  const userId = s.metadata?.user_id;
  if (!userId) return "not_applicable";
  // Environment separation: a test-mode event must never grant in a live env.
  if (!livemodeMatches(stripeIsLive(), event.livemode)) {
    console.warn(`[stripe/webhook] companion grant skipped: livemode mismatch (key live=${stripeIsLive()}, event live=${event.livemode})`);
    return "not_applicable";
  }
  const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
  const paymentIntentId = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null;
  const { grantFromStripeSession } = await import("@/lib/companion/entitlementGrants");
  const result = await grantFromStripeSession({ userId, customerId, ref: s.id, paymentIntentId, livemode: event.livemode });
  // Send the access email once, only on a fresh grant (not on idempotent replays).
  if (result === "granted") {
    const email = s.customer_details?.email ?? s.customer_email ?? null;
    if (email) {
      const { sendCompanionAccessEmail } = await import("@/lib/companion/email");
      const origin = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
      await sendCompanionAccessEmail(email, `${origin}/companion/welcome?purchase=success`);
    }
  }
  return result;
}

// ---- 1b-ii) Companion refund / dispute lifecycle ----
// Precise revocation/suspension/restoration keyed by payment_intent. Companion-only
// (checked via local match, else the PI's product_key). Livemode-guarded. Returns
// true on a real failure so the webhook can ask Stripe to retry.
async function isCompanionPaymentIntent(pi: string | null): Promise<boolean> {
  if (!pi) return false;
  const admin = getSupabaseAdminClient();
  const { data } = await admin.from("companion_entitlements").select("id").eq("payment_intent_id", pi).maybeSingle();
  if (data) return true;                                   // fast path: local match
  try { const p = await getStripe().paymentIntents.retrieve(pi); return p.metadata?.product_key === "companion"; }
  catch { return false; }
}

async function applyCompanionRefund(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "charge.refunded") return false;
  const charge = event.data.object as Stripe.Charge;
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id ?? null;
  if (!livemodeMatches(stripeIsLive(), event.livemode)) return false;
  if (!(await isCompanionPaymentIntent(pi)) || !pi) return false;
  const { applyLifecycleByPaymentIntent, recordPartialRefund } = await import("@/lib/companion/entitlementLifecycle");
  const { refundIsFull } = await import("@/lib/companion/entitlementReliability");
  if (refundIsFull(charge.amount_refunded, charge.amount)) {
    const r = await applyLifecycleByPaymentIntent(pi, "full_refund", { reason: "charge.refunded (full)", stripeEventId: event.id, livemode: event.livemode });
    return r === "failed";
  }
  await recordPartialRefund(pi, charge.amount_refunded, event.id, event.livemode);   // audit only, keeps access
  return false;
}

async function applyCompanionDispute(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "charge.dispute.created" && event.type !== "charge.dispute.closed") return false;
  const d = event.data.object as Stripe.Dispute;
  const pi = typeof d.payment_intent === "string" ? d.payment_intent : d.payment_intent?.id ?? null;
  if (!livemodeMatches(stripeIsLive(), event.livemode)) return false;
  if (!(await isCompanionPaymentIntent(pi)) || !pi) return false;
  const { applyLifecycleByPaymentIntent } = await import("@/lib/companion/entitlementLifecycle");
  const { disputeClosedAction } = await import("@/lib/companion/entitlementReliability");
  const action = event.type === "charge.dispute.created" ? "dispute_open" : disputeClosedAction(d.status);
  if (!action) return false;   // non-terminal dispute update
  const r = await applyLifecycleByPaymentIntent(pi, action, { reason: `${event.type} (${d.status})`, stripeEventId: event.id, livemode: event.livemode });
  return r === "failed";
}

// ---- 1c) Relationship Playbook grant ----
// One-time playbook purchase completes -> write a playbook_entitlements row.
// Keyed by metadata.product_key === "playbook"; cluster_id says which playbook.
async function applyPlaybookGrant(event: Stripe.Event) {
  if (!CHECKOUT_GRANT_EVENTS.has(event.type)) return;
  const s = event.data.object as Stripe.Checkout.Session;
  if (s.metadata?.product_key !== "playbook") return;
  const clusterId = Number(s.metadata?.cluster_id);
  if (!Number.isInteger(clusterId)) return;
  // Stripe stays authoritative for payment. Without this a delayed-notification
  // method (Klarna, bank debit) would hand over the Playbook on the "unpaid"
  // completed event, before the money settled.
  if (!isPaidSession(s)) {
    console.log(`[stripe/webhook] playbook grant deferred: session ${s.id} is ${s.payment_status} (awaiting settlement)`);
    return;
  }
  const buyerEmail = s.customer_details?.email ?? null;

  // Who owns this purchase?
  //   • Signed-in buyer  -> metadata.user_id, set at checkout (unchanged behaviour).
  //   • GUEST buyer      -> no user_id; resolve-or-create the account from the email
  //     they paid with (owner decision 2026-08-04: pay first, then create the
  //     account, and the Playbook is already there). If that email already has an
  //     account, the purchase attaches to it rather than making a second one.
  let userId: string | null = s.metadata?.user_id ?? null;
  let accountWasCreated = false;
  if (!userId) {
    const { resolveOrCreatePurchaser } = await import("@/lib/snapshot/purchaseAccount");
    const provisioned = await resolveOrCreatePurchaser(buyerEmail);
    userId = provisioned.userId;
    accountWasCreated = provisioned.created;
    if (!userId) {
      // Money took, access not granted — the one failure that must be loud, since
      // it needs a human to place the entitlement by hand.
      console.error(
        `[stripe/webhook] PLAYBOOK GRANT ORPHANED — paid session ${s.id} (${buyerEmail ?? "no email"}), ` +
          `cluster ${clusterId}: ${provisioned.error ?? "could not provision an account"}`
      );
      return;
    }
  }

  const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
  const { grantPlaybookFromStripeSession } = await import("@/lib/snapshot/playbookGrants");
  await grantPlaybookFromStripeSession({ userId, clusterId, customerId, ref: s.id });

  // The buyer may have added the Companion as an upsell in the same checkout.
  const { applyCompanionCrossSell } = await import("@/lib/companion/crossSell");
  await applyCompanionCrossSell(s, userId, event.livemode);

  // Post-purchase side effects (resilient — must never fail the grant):
  // 1) exit the Snapshot nurture immediately (spec: purchasers leave the sequence
  //    the moment they buy) — by the exact quiz session that started checkout
  //    (metadata.session_id) AND by purchaser email + cluster (catalog buys);
  // 2) send the Playbook delivery email (start of the post-purchase flow).
  try {
    const { exitNurtureOnPurchase } = await import("@/lib/snapshot/nurture");
    let accountEmail: string | null = null;
    try {
      const { getSupabaseAdminClient } = await import("@/lib/supabase");
      const { data } = await getSupabaseAdminClient().auth.admin.getUserById(userId);
      accountEmail = data.user?.email ?? null;
    } catch { /* noop */ }
    await exitNurtureOnPurchase({ sessionId: s.metadata?.session_id ?? null, email: buyerEmail, clusterId });
    if (accountEmail && accountEmail.toLowerCase() !== (buyerEmail ?? "").toLowerCase()) {
      await exitNurtureOnPurchase({ email: accountEmail, clusterId });
    }
    const to = accountEmail || buyerEmail;
    if (to) {
      // A guest whose account we just created has no password yet, so the delivery
      // email carries a one-time link to set one — that link IS "creating the
      // account", and the Playbook is already sitting in their library behind it.
      let setPasswordLink: string | null = null;
      if (accountWasCreated) {
        const { generateSetPasswordLink } = await import("@/lib/snapshot/purchaseAccount");
        const site = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
        setPasswordLink = await generateSetPasswordLink(to, `${site}/account/set-password`);
      }
      const { sendPlaybookDeliveryEmail } = await import("@/lib/email/playbookDelivery");
      await sendPlaybookDeliveryEmail({ to, clusterId, setPasswordLink });
    }
  } catch (e) {
    console.error("[stripe/webhook] playbook post-purchase side effects:", e instanceof Error ? e.message : e);
  }
}

// ---- 1c-iii) Playbook refund + chargeback revocation ----
// Until this existed nothing ever revoked a Playbook — `revokePlaybookByStripeRef`
// was defined but never called — so a refunded or charged-back buyer kept the
// product.
//
// Owner policy 2026-08-05: Playbooks are NON-REFUNDABLE. Refunds are therefore
// discretionary exceptions (goodwill, duplicate charge, a chargeback settled
// outside Stripe) rather than a routine window — but when one is issued, access
// goes with the money. Every refund is logged, since each one is an exception.
//
// Matching: refund and dispute events carry a payment_intent, but entitlements
// are keyed by the checkout session id, so we look the session up by
// payment_intent — which works for guest and signed-in purchases alike.
async function playbookSessionForPaymentIntent(pi: string | null): Promise<Stripe.Checkout.Session | null> {
  if (!pi) return null;
  const found = await getStripe().checkout.sessions.list({ payment_intent: pi, limit: 1 });
  const session = found.data[0];
  return session && session.metadata?.product_key === "playbook" ? session : null;
}

async function applyPlaybookRefund(event: Stripe.Event): Promise<void> {
  if (event.type !== "charge.refunded") return;
  if (!livemodeMatches(stripeIsLive(), event.livemode)) return;
  const charge = event.data.object as Stripe.Charge;
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id ?? null;
  const session = await playbookSessionForPaymentIntent(pi);
  if (!session) return; // not a Playbook purchase

  // A PARTIAL refund keeps access (mirrors the Companion's behaviour) — it's
  // usually a goodwill adjustment, not an unwind of the sale.
  const { refundIsFull } = await import("@/lib/companion/entitlementReliability");
  if (!refundIsFull(charge.amount_refunded, charge.amount)) {
    console.log(`[stripe/webhook] partial playbook refund on ${session.id} ($${(charge.amount_refunded / 100).toFixed(2)} of $${(charge.amount / 100).toFixed(2)}) — access kept`);
    return;
  }

  console.log(`[stripe/webhook] discretionary playbook refund (product is non-refundable) on session ${session.id} — revoking access`);
  const { revokePlaybookByStripeRef, countActiveGrantsByStripeRef } = await import("@/lib/snapshot/playbookGrants");
  await revokePlaybookByStripeRef(session.id, "refunded");

  // revokePlaybookByStripeRef is resilient and swallows its errors, so confirm
  // the revocation actually took. A refunded buyer still holding access is the
  // failure that must never pass silently.
  const stillActive = await countActiveGrantsByStripeRef(session.id);
  if (stillActive > 0) {
    console.error(`[stripe/webhook] PLAYBOOK REVOCATION FAILED — ${stillActive} grant(s) still active for refunded session ${session.id} (${session.customer_details?.email ?? "no email"})`);
  } else {
    console.log(`[stripe/webhook] playbook revoked after full refund: session ${session.id}`);
  }
}

// Chargebacks. A dispute pulls the money immediately, before anyone decides who
// was right, so access is pulled at the same moment and restored only if we win
// — the same posture the Companion already takes.
//
//   dispute created        -> revoke, marked as a dispute HOLD
//   closed won / warning   -> restore, but ONLY rows carrying that hold marker
//   closed lost            -> stays revoked, re-marked as lost
async function applyPlaybookDispute(event: Stripe.Event): Promise<void> {
  if (event.type !== "charge.dispute.created" && event.type !== "charge.dispute.closed") return;
  if (!livemodeMatches(stripeIsLive(), event.livemode)) return;
  const d = event.data.object as Stripe.Dispute;
  const pi = typeof d.payment_intent === "string" ? d.payment_intent : d.payment_intent?.id ?? null;
  const session = await playbookSessionForPaymentIntent(pi);
  if (!session) return; // not a Playbook purchase

  const { disputeClosedAction } = await import("@/lib/companion/entitlementReliability");
  const action = event.type === "charge.dispute.created" ? "dispute_open" : disputeClosedAction(d.status);
  if (!action) return; // a non-terminal dispute update — leave things as they are

  const {
    revokePlaybookByStripeRef, restoreDisputedPlaybookByStripeRef,
    countActiveGrantsByStripeRef, PLAYBOOK_DISPUTE_HOLD,
  } = await import("@/lib/snapshot/playbookGrants");

  if (action === "dispute_won") {
    const restored = await restoreDisputedPlaybookByStripeRef(session.id);
    console.log(`[stripe/webhook] playbook dispute WON on session ${session.id} (${d.status}) — restored ${restored} grant(s)`);
    return;
  }

  // dispute_open or dispute_lost — the money is gone either way for now.
  await revokePlaybookByStripeRef(session.id, action === "dispute_open" ? PLAYBOOK_DISPUTE_HOLD : "dispute_lost");
  const stillActive = await countActiveGrantsByStripeRef(session.id);
  if (stillActive > 0) {
    console.error(`[stripe/webhook] PLAYBOOK REVOCATION FAILED after ${event.type} (${d.status}) — ${stillActive} grant(s) still active for session ${session.id}`);
  } else {
    console.log(`[stripe/webhook] playbook access pulled by ${event.type} (${d.status}) on session ${session.id}`);
  }
}

// ---- 2) Finance sync ----
async function handleFinanceEvent(event: Stripe.Event) {
  switch (event.type) {
    case "charge.succeeded": {
      await recordCharge(event.data.object as Stripe.Charge, event.id, event.livemode);
      break;
    }
    case "charge.refunded": {
      await recordRefund(event.data.object as Stripe.Charge, event.id);
      break;
    }
    case "invoice.payment_failed": {
      await upsertFailedPayment(event.data.object as Stripe.Invoice);
      break;
    }
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const { tier, mrr } = await upsertSubscription(sub);
      await reclassifyCustomerCharges(customerId, sub.id);
      await recordSubscriptionChange({ subscription_id: sub.id, change_type: "new", to_tier: tier, from_mrr: 0, to_mrr: mrr, livemode: sub.livemode, event_id: event.id });
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const prev = await getStoredSubscription(sub.id);
      const { tier, mrr } = await upsertSubscription(sub);
      await reclassifyCustomerCharges(customerId, sub.id);
      if (sub.status === "canceled") {
        await recordSubscriptionChange({ subscription_id: sub.id, change_type: "canceled", from_tier: prev?.tier, to_tier: tier, from_mrr: prev?.mrr_amount ?? 0, to_mrr: 0, livemode: sub.livemode, event_id: event.id });
      } else if (prev) {
        if (mrr > prev.mrr_amount) await recordSubscriptionChange({ subscription_id: sub.id, change_type: "upgrade", from_tier: prev.tier, to_tier: tier, from_mrr: prev.mrr_amount, to_mrr: mrr, livemode: sub.livemode, event_id: event.id });
        else if (mrr < prev.mrr_amount) await recordSubscriptionChange({ subscription_id: sub.id, change_type: "downgrade", from_tier: prev.tier, to_tier: tier, from_mrr: prev.mrr_amount, to_mrr: mrr, livemode: sub.livemode, event_id: event.id });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const prev = await getStoredSubscription(sub.id);
      const { tier } = await upsertSubscription(sub);
      await recordSubscriptionChange({ subscription_id: sub.id, change_type: "canceled", from_tier: prev?.tier, to_tier: tier, from_mrr: prev?.mrr_amount ?? 0, to_mrr: 0, livemode: sub.livemode, event_id: event.id });
      break;
    }
    case "payout.paid":
    case "payout.created":
    case "payout.updated": {
      await upsertPayout(event.data.object as Stripe.Payout);
      break;
    }
    case "charge.dispute.created":
    case "charge.dispute.updated":
    case "charge.dispute.closed": {
      await upsertDispute(event.data.object as Stripe.Dispute);
      break;
    }
    default:
      break;
  }
}

export async function POST(request: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("[stripe/webhook] received but STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ received: true, configured: false });
  }

  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig ?? "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("[stripe/webhook] signature verification failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // 1) Access (idempotent). Never let a finance issue block this.
  try {
    await applyTierFlip(event);
  } catch (e) {
    console.error("[stripe/webhook] tier flip error:", e instanceof Error ? e.message : e);
  }

  // 1b) Relationship Companion access — an independent grant, separate from the
  // Academy tier ladder. Idempotent + race-safe (DB unique index on stripe_ref).
  // On FAILURE we must NOT silently 200 — we signal Stripe to retry (mustRetry),
  // because payment succeeded but the entitlement did not persist. The retry is
  // safe: the grant is idempotent, so a re-delivery cannot double-grant.
  let mustRetry = false;
  try {
    if (shouldRetry(await applyCompanionGrant(event))) mustRetry = true;
  } catch (e) {
    console.error("[stripe/webhook] companion grant error:", e instanceof Error ? e.message : e);
    mustRetry = true;
  }

  // 1b-ii) Companion refund + dispute lifecycle (revoke / suspend / restore).
  // Retry-safe: a failure asks Stripe to redeliver; transitions are idempotent.
  try {
    if (await applyCompanionRefund(event)) mustRetry = true;
    if (await applyCompanionDispute(event)) mustRetry = true;
  } catch (e) {
    console.error("[stripe/webhook] companion refund/dispute error:", e instanceof Error ? e.message : e);
    mustRetry = true;
  }

  // 1c) Relationship Playbook access — an independent one-time grant. Idempotent
  // (keyed by the Stripe object id). Never blocks the above.
  try {
    await applyPlaybookGrant(event);
  } catch (e) {
    console.error("[stripe/webhook] playbook grant error:", e instanceof Error ? e.message : e);
  }

  // 1c-iii) Playbook refund / chargeback -> pull access. Never blocks the grants
  // above; a failure here is logged rather than allowed to break a purchase.
  try {
    await applyPlaybookRefund(event);
    await applyPlaybookDispute(event);
  } catch (e) {
    console.error("[stripe/webhook] playbook refund/dispute error:", e instanceof Error ? e.message : e);
  }

  // 1d) A delayed payment (Klarna / bank debit) that never settled. Nothing was
  // granted — the "completed" event was skipped as unpaid — but the buyer thinks
  // they bought something, so make it visible rather than silently dropping it.
  if (event.type === "checkout.session.async_payment_failed") {
    const s = event.data.object as Stripe.Checkout.Session;
    console.warn(
      `[stripe/webhook] ASYNC PAYMENT FAILED for session ${s.id} ` +
        `(${s.customer_details?.email ?? "no email"}, product=${s.metadata?.product_key ?? "-"}) — no access granted`
    );
  }

  // 2) Finance sync (status machine). No-ops safely if the finance tables are absent.
  const claim = await claimEvent(event); // resilient: returns "skip" on any error
  if (claim !== "skip") {
    try {
      await handleFinanceEvent(event);
      await markEventProcessed(event.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[stripe/webhook] finance handler error:", msg);
      await markEventFailed(event.id, msg);
      return NextResponse.json({ error: "Finance handler error." }, { status: 500 }); // Stripe retries
    }
  }

  // A failed Companion grant means paid-but-ungranted — ask Stripe to redeliver.
  // Finance is already idempotent (claimEvent skips a processed event on retry), so
  // returning 500 here re-attempts only the grant, never a double finance write.
  if (mustRetry) return NextResponse.json({ error: "Entitlement grant pending retry." }, { status: 500 });

  return NextResponse.json({ received: true });
}
