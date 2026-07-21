import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured } from "@/lib/stripe";
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
async function applyCompanionGrant(event: Stripe.Event) {
  if (event.type !== "checkout.session.completed") return;
  const s = event.data.object as Stripe.Checkout.Session;
  if (s.metadata?.product_key !== "companion") return;
  const userId = s.metadata?.user_id;
  if (!userId) return;
  const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
  const { grantFromStripeSession } = await import("@/lib/companion/entitlementGrants");
  const granted = await grantFromStripeSession({ userId, customerId, ref: s.id });
  if (granted) {
    const email = s.customer_details?.email ?? s.customer_email ?? null;
    if (email) {
      const { sendCompanionAccessEmail } = await import("@/lib/companion/email");
      const origin = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
      await sendCompanionAccessEmail(email, `${origin}/companion/welcome?purchase=success`);
    }
  }
}

// ---- 1c) Relationship Playbook grant ----
// One-time playbook purchase completes -> write a playbook_entitlements row.
// Keyed by metadata.product_key === "playbook"; cluster_id says which playbook.
async function applyPlaybookGrant(event: Stripe.Event) {
  if (event.type !== "checkout.session.completed") return;
  const s = event.data.object as Stripe.Checkout.Session;
  if (s.metadata?.product_key !== "playbook") return;
  const userId = s.metadata?.user_id;
  const clusterId = Number(s.metadata?.cluster_id);
  if (!userId || !Number.isInteger(clusterId)) return;
  const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
  const { grantPlaybookFromStripeSession } = await import("@/lib/snapshot/playbookGrants");
  await grantPlaybookFromStripeSession({ userId, clusterId, customerId, ref: s.id });
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
  // Academy tier ladder. Idempotent (keyed by the Stripe object id). Never blocks
  // the above.
  try {
    await applyCompanionGrant(event);
  } catch (e) {
    console.error("[stripe/webhook] companion grant error:", e instanceof Error ? e.message : e);
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
  if (claim === "skip") return NextResponse.json({ received: true });
  try {
    await handleFinanceEvent(event);
    await markEventProcessed(event.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[stripe/webhook] finance handler error:", msg);
    await markEventFailed(event.id, msg);
    return NextResponse.json({ error: "Finance handler error." }, { status: 500 }); // Stripe retries
  }

  return NextResponse.json({ received: true });
}
