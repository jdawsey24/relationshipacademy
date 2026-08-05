import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { readJsonBody, isUuid } from "@/lib/apiSecurity";
import { PLAYBOOK_PRICE_LOOKUP_KEY, PLAYBOOK_PRODUCT_KEY, hasPlaybook } from "@/lib/snapshot/playbooks";
import { isAddonEntitlementId } from "@/lib/playbook/keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * EMBEDDED checkout session — same purchase as /api/playbooks/checkout, but
 * `ui_mode: "embedded_page"`, so Stripe renders inside the sales page instead of
 * redirecting away. Returns { client_secret } for <EmbeddedCheckout/>.
 *
 * Creating a session does NOT charge anyone — the card is only captured when the
 * embedded form is submitted, and the existing webhook (product_key "playbook")
 * remains the single source of truth for granting access.
 *
 * Still requires a signed-in member: entitlements attach to a user_id. Guest
 * checkout (pay first, account provisioned from the Stripe email afterwards) is
 * approved but NOT built yet — it needs the webhook to create/find the account,
 * which must be verified before real money depends on it.
 */
export async function POST(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;
  if (!stripeConfigured()) return NextResponse.json({ error: "Purchasing isn't available yet." }, { status: 503 });

  const body = await readJsonBody(request).catch(() => null);
  const clusterId = Number((body as { cluster_id?: unknown } | null)?.cluster_id);
  if (!Number.isInteger(clusterId) || !hasPlaybook(clusterId)) {
    return NextResponse.json({ error: "No playbook for that selection." }, { status: 400 });
  }
  const rawSession = (body as { session_id?: unknown } | null)?.session_id;
  const quizSessionId = typeof rawSession === "string" && isUuid(rawSession) ? rawSession : null;

  const stripe = getStripe();
  const origin = request.headers.get("origin") || "https://relationshiplc.com";
  const admin = getSupabaseAdminClient();

  try {
    const prices = await stripe.prices.list({ lookup_keys: [PLAYBOOK_PRICE_LOOKUP_KEY], active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) return NextResponse.json({ error: "Playbooks aren't available for purchase yet." }, { status: 400 });

    // Reuse the shared Stripe customer on the profile (never mint a second), and
    // self-heal an id that doesn't exist in this Stripe mode.
    let customerId = member.profile.stripe_customer_id ?? null;
    if (customerId) {
      try {
        const existing = await stripe.customers.retrieve(customerId);
        if ((existing as { deleted?: boolean }).deleted) customerId = null;
      } catch { customerId = null; }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.user.email ?? undefined,
        name: member.profile.full_name ?? undefined,
        metadata: { user_id: member.user.id },
      });
      customerId = customer.id;
      await admin.from("profiles").upsert({ id: member.user.id, stripe_customer_id: customerId }, { onConflict: "id" });
    }

    const meta: Record<string, string> = {
      user_id: member.user.id,
      product_key: PLAYBOOK_PRODUCT_KEY,
      billing_type: "one_time",
      cluster_id: String(clusterId),
    };
    if (quizSessionId) meta.session_id = quizSessionId;

    const params: NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]> = {
      // NOTE: this SDK/API version renames the modes — "embedded_page", not "embedded".
      ui_mode: "embedded_page",
      mode: "payment",
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      return_url: `${origin}/playbooks/purchase-complete?session_id={CHECKOUT_SESSION_ID}`,
      metadata: meta,
      payment_intent_data: { metadata: meta },
    };

    const addonCoupon = process.env.STRIPE_ADDON_COUPON_ID;
    if (isAddonEntitlementId(clusterId) && addonCoupon) params.discounts = [{ coupon: addonCoupon }];
    else params.allow_promotion_codes = true;

    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ client_secret: session.client_secret });
  } catch (e) {
    console.error("[playbooks/checkout-session]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
