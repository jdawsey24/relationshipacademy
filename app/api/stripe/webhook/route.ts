import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured, stripeIsLive } from "@/lib/stripe";
import { livemodeMatches, shouldRetry, type GrantResult } from "@/lib/companion/entitlementReliability";
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
  if (event.type !== "checkout.session.completed") return "not_applicable";
  const s = event.data.object as Stripe.Checkout.Session;
  if (s.metadata?.product_key !== "companion") return "not_applicable";
  // Stripe stays authoritative for payment: only grant on a PAID session.
  if (s.payment_status && s.payment_status !== "paid" && s.payment_status !== "no_payment_required") return "not_applicable";
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
  if (event.type !== "checkout.session.completed") return;
  const s = event.data.object as Stripe.Checkout.Session;
  if (s.metadata?.product_key !== "playbook") return;
  const clusterId = Number(s.metadata?.cluster_id);
  if (!Number.isInteger(clusterId)) return;
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
