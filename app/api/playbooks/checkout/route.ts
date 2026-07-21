import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { readJsonBody } from "@/lib/apiSecurity";
import { PLAYBOOK_PRICE_LOOKUP_KEY, PLAYBOOK_PRODUCT_KEY, hasPlaybook } from "@/lib/snapshot/playbooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-time Playbook purchase. Requires a signed-in member (ownership must attach
// to an account so the gated download + the Companion discount can see it).
// Same shared price for every playbook; the specific playbook is the cluster_id
// carried in metadata. Inert until Stripe is configured AND the price exists.
export async function POST(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;
  if (!stripeConfigured()) return NextResponse.json({ error: "Purchasing isn't available yet." }, { status: 503 });

  const body = await readJsonBody(request).catch(() => null);
  const clusterId = Number((body as { cluster_id?: unknown } | null)?.cluster_id);
  if (!Number.isInteger(clusterId) || !hasPlaybook(clusterId)) {
    return NextResponse.json({ error: "No playbook for that selection." }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = request.headers.get("origin") || "https://relationshiplc.com";
  const admin = getSupabaseAdminClient();

  try {
    const prices = await stripe.prices.list({ lookup_keys: [PLAYBOOK_PRICE_LOOKUP_KEY], active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) return NextResponse.json({ error: "Playbooks aren't available for purchase yet." }, { status: 400 });

    // Reuse the shared Stripe customer on the profile (never mint a second).
    let customerId = member.profile.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: member.user.email ?? undefined, name: member.profile.full_name ?? undefined, metadata: { user_id: member.user.id } });
      customerId = customer.id;
      await admin.from("profiles").upsert({ id: member.user.id, stripe_customer_id: customerId }, { onConflict: "id" });
    }

    const meta = { user_id: member.user.id, product_key: PLAYBOOK_PRODUCT_KEY, billing_type: "one_time", cluster_id: String(clusterId) };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/playbooks?purchase=success`,
      cancel_url: `${origin}/snapshot/results/${(body as { session_id?: string } | null)?.session_id ?? ""}`,
      metadata: meta,
      payment_intent_data: { metadata: meta }, // so the finance layer classifies it as one_time
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[playbooks/checkout]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
