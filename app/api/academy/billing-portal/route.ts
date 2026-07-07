import { NextResponse } from "next/server";
import { requireMember } from "@/lib/academyAuth";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates a Stripe Billing Portal session so the member can manage/cancel their
// subscription and update payment methods. Returns the portal URL.
export async function POST(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Billing isn't available yet." }, { status: 503 });
  }
  const customerId = member.profile.stripe_customer_id;
  if (!customerId) {
    return NextResponse.json({ error: "No billing account yet." }, { status: 400 });
  }

  const origin = request.headers.get("origin") || "https://relationshiplc.com";
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/academy/account`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[academy/billing-portal]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 502 });
  }
}
