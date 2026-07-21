import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireCompanionUser } from "@/lib/companionAuth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { COMPANION_PRICE_LOOKUP_KEY, COMPANION_RETURNING_PRICE_LOOKUP_KEY, COMPANION_PRODUCT_KEY } from "@/lib/companion";
import { getReturningEligibility } from "@/lib/companion/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-time Companion purchase. Creates a Stripe Checkout Session (mode: payment)
// and returns its URL. The one-time metadata (product_key/billing_type) lights up
// the webhook grant + the existing finance dashboard with no finance-code changes.
// Inert until Stripe is configured AND the price exists.
export async function POST(request: Request) {
  const cu = await requireCompanionUser();
  if (cu instanceof NextResponse) return cu;
  if (!stripeConfigured()) return NextResponse.json({ error: "Purchasing isn't available yet." }, { status: 503 });

  const stripe = getStripe();
  const origin = request.headers.get("origin") || "https://relationshiplc.com";
  const admin = getSupabaseAdminClient();

  try {
    // Returning customers who already own another paid item (e.g. an active
    // Academy membership) get the discounted price when it exists. Load both
    // lookup keys and pick: discounted-if-eligible-and-present, else base.
    const eligibility = await getReturningEligibility(cu.user.id);
    const wantedKeys = eligibility.qualifies
      ? [COMPANION_RETURNING_PRICE_LOOKUP_KEY, COMPANION_PRICE_LOOKUP_KEY]
      : [COMPANION_PRICE_LOOKUP_KEY];
    const prices = await stripe.prices.list({ lookup_keys: wantedKeys, active: true, limit: 2 });
    const byKey = new Map(prices.data.map((p) => [p.lookup_key, p]));
    const price =
      (eligibility.qualifies ? byKey.get(COMPANION_RETURNING_PRICE_LOOKUP_KEY) : undefined) ??
      byKey.get(COMPANION_PRICE_LOOKUP_KEY);
    if (!price) return NextResponse.json({ error: "Companion isn't available for purchase yet." }, { status: 400 });

    // Reuse the shared Stripe customer on the profile (never mint a second).
    const { data: prof } = await admin.from("profiles").select("stripe_customer_id, full_name").eq("id", cu.user.id).maybeSingle();
    let customerId = (prof as { stripe_customer_id: string | null } | null)?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: cu.user.email ?? undefined, name: (prof as { full_name?: string } | null)?.full_name ?? undefined, metadata: { user_id: cu.user.id } });
      customerId = customer.id;
      await admin.from("profiles").upsert({ id: cu.user.id, stripe_customer_id: customerId }, { onConflict: "id" });
    }

    const returningApplied = price.lookup_key === COMPANION_RETURNING_PRICE_LOOKUP_KEY;
    const meta = { user_id: cu.user.id, product_key: COMPANION_PRODUCT_KEY, billing_type: "one_time", price_tier: returningApplied ? "returning" : "standard" };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/companion/welcome?purchase=success`,
      cancel_url: `${origin}/companion/welcome?purchase=cancelled`,
      metadata: meta,
      payment_intent_data: { metadata: meta }, // so the finance layer classifies it as one_time
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[companion/checkout]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
