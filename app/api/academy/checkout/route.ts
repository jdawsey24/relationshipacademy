import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { VALID_LOOKUP_KEYS } from "@/lib/stripePlans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates a Stripe Checkout Session (subscription mode) for the signed-in member
// and returns its URL for the browser to redirect to.
export async function POST(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Billing isn't available yet." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request, 2_000)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const lookupKey = typeof body.lookupKey === "string" ? body.lookupKey : "";
  if (!VALID_LOOKUP_KEYS.has(lookupKey)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = request.headers.get("origin") || "https://relationshiplc.com";

  try {
    // Resolve the price by its stable lookup_key.
    const prices = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) return NextResponse.json({ error: "Plan not found." }, { status: 400 });
    const tier = price.metadata?.tier;

    // Reuse or create the member's Stripe customer.
    const admin = getSupabaseAdminClient();
    let customerId = member.profile.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.user.email ?? undefined,
        name: member.profile.full_name ?? undefined,
        metadata: { user_id: member.user.id },
      });
      customerId = customer.id;
      await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", member.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/academy/account?checkout=success`,
      cancel_url: `${origin}/academy/account?checkout=cancelled`,
      metadata: { user_id: member.user.id, tier: tier ?? "" },
      subscription_data: { metadata: { user_id: member.user.id, tier: tier ?? "" } },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[academy/checkout]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
