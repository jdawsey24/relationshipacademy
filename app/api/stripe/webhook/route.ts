import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook. NOT behind the member middleware (it's /api/stripe, unmatched)
// and Stripe authenticates it via the signature header, not a session. Drives
// profiles.membership_tier off subscription state.

// Statuses that grant access (tier stays); anything else downgrades to free.
const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

async function setTierByCustomer(
  customerId: string,
  fields: { membership_tier?: string; subscription_status?: string; stripe_subscription_id?: string | null }
) {
  const admin = getSupabaseAdminClient();
  await admin
    .from("profiles")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("stripe_customer_id", customerId);
}

export async function POST(request: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    // Not fully configured yet — acknowledge so Stripe doesn't retry endlessly.
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

  try {
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
        await setTierByCustomer(customerId, {
          membership_tier: tier,
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await setTierByCustomer(customerId, {
          membership_tier: "free",
          subscription_status: "canceled",
          stripe_subscription_id: null,
        });
        break;
      }
      default:
        break; // ignore other events
    }
  } catch (e) {
    console.error("[stripe/webhook] handler error:", e instanceof Error ? e.message : e);
    // 500 → Stripe retries. Safe because handlers are idempotent.
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
