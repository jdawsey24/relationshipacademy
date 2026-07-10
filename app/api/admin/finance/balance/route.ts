import { NextResponse } from "next/server";
import { requireOwnerFinance } from "@/lib/adminApi";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import type { BalanceInfo } from "@/lib/finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Current balance + upcoming payout are inherently "right now" values, so they
// are read live from Stripe (server-side) and cached ~60s per instance.
let cache: { at: number; data: BalanceInfo } | null = null;
const TTL = 60_000;

export async function GET() {
  const auth = await requireOwnerFinance();
  if (auth instanceof NextResponse) return auth;
  if (!stripeConfigured()) return NextResponse.json({ error: "Billing not configured." }, { status: 503 });

  if (cache && Date.now() - cache.at < TTL) return NextResponse.json(cache.data);

  try {
    const stripe = getStripe();
    const bal = await stripe.balance.retrieve();
    const payouts = await stripe.payouts.list({ limit: 1 });
    const latest = payouts.data[0];
    const upcoming = latest && (latest.status === "pending" || latest.status === "in_transit")
      ? { amount: latest.amount, currency: latest.currency, arrival_date: latest.arrival_date ? new Date(latest.arrival_date * 1000).toISOString() : null }
      : null;
    const data: BalanceInfo = {
      available: bal.available.map((a) => ({ amount: a.amount, currency: a.currency })),
      pending: bal.pending.map((a) => ({ amount: a.amount, currency: a.currency })),
      upcomingPayout: upcoming,
      fetchedAt: new Date().toISOString(),
    };
    cache = { at: Date.now(), data };
    return NextResponse.json(data);
  } catch (e) {
    console.error("[finance/balance]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not read balance." }, { status: 502 });
  }
}
