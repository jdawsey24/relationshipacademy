import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwnerFinance } from "@/lib/adminApi";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import {
  upsertBalanceTransaction, upsertSubscription, upsertPayout, upsertDispute, type LedgerEnrichment,
} from "@/lib/stripeFinance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Resumable, checkpointed backfill. Each POST processes ONE bounded page (≤100
// objects, a few seconds — safe under function timeouts); the client loops until
// done. Idempotent (upsert by id). dryRun computes counts without writing.
const RESOURCES = new Set(["balance_transactions", "subscriptions", "payouts", "disputes"]);
const PAGE = 100;

type Ref = string | { id?: string } | null | undefined;
const refId = (r: Ref): string | null => (typeof r === "string" ? r : r?.id) ?? null;
interface SourceLike {
  object?: string; id?: string;
  payment_intent?: Ref; invoice?: Ref; customer?: Ref; charge?: Ref;
  billing_details?: { email?: string | null }; receipt_email?: string | null;
  metadata?: Record<string, string>;
}

function enrichFromSource(src: Stripe.BalanceTransaction["source"]): LedgerEnrichment {
  if (!src || typeof src === "string") return {};
  const o = src as unknown as SourceLike;
  if (o.object === "charge") {
    return {
      charge_id: o.id ?? null,
      payment_intent_id: refId(o.payment_intent),
      invoice_id: refId(o.invoice),
      billing_type: o.invoice ? "recurring" : "one_time",
      customer_id: refId(o.customer),
      email: o.billing_details?.email ?? o.receipt_email ?? null,
      tier: o.metadata?.tier ?? null,
    };
  }
  if (o.object === "refund") return { refund_id: o.id ?? null, charge_id: refId(o.charge) };
  if (o.object === "dispute") return { dispute_id: o.id ?? null, charge_id: refId(o.charge) };
  return {};
}

export async function POST(request: Request) {
  const auth = await requireOwnerFinance();
  if (auth instanceof NextResponse) return auth;
  if (!stripeConfigured()) return NextResponse.json({ error: "Billing not configured." }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const resource = String(body.resource ?? "");
  if (!RESOURCES.has(resource)) return NextResponse.json({ error: "Invalid resource." }, { status: 400 });
  const dryRun = body.dryRun === true;
  const livemode = (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_live");

  const s = getSupabaseAdminClient();
  const stripe = getStripe();

  // Resume an existing job or create one.
  let jobId = typeof body.jobId === "string" ? body.jobId : null;
  let cursor: string | null = typeof body.cursor === "string" ? body.cursor : null;
  let processedSoFar = 0;
  if (!jobId) {
    const { data } = await s.from("finance_backfill_jobs")
      .insert({ resource, livemode, status: "running", dry_run: dryRun, started_by: auth.user.email ?? null })
      .select("id").maybeSingle();
    jobId = data?.id ?? null;
    await audit({ actor: auth.user.email ?? null, action: "finance.backfill_start", metadata: { resource, dryRun, livemode } });
  } else {
    const { data } = await s.from("finance_backfill_jobs").select("cursor, processed_count").eq("id", jobId).maybeSingle();
    cursor = cursor ?? (data?.cursor ?? null);
    processedSoFar = data?.processed_count ?? 0;
  }

  try {
    const params: Stripe.PaginationParams & Record<string, unknown> = { limit: PAGE };
    if (cursor) params.starting_after = cursor;

    let items: { id: string }[] = [];
    let hasMore = false;

    if (resource === "balance_transactions") {
      const list = await stripe.balanceTransactions.list({ ...params, expand: ["data.source"] });
      items = list.data; hasMore = list.has_more;
      if (!dryRun) for (const bt of list.data) await upsertBalanceTransaction(bt, { ...enrichFromSource(bt.source), event_id: null });
    } else if (resource === "subscriptions") {
      const list = await stripe.subscriptions.list({ ...params, status: "all", expand: ["data.items.data.price"] });
      items = list.data; hasMore = list.has_more;
      if (!dryRun) for (const sub of list.data) await upsertSubscription(sub);
    } else if (resource === "payouts") {
      const list = await stripe.payouts.list(params);
      items = list.data; hasMore = list.has_more;
      if (!dryRun) for (const p of list.data) await upsertPayout(p);
    } else {
      const list = await stripe.disputes.list(params);
      items = list.data; hasMore = list.has_more;
      if (!dryRun) for (const d of list.data) await upsertDispute(d);
    }

    const newCursor = items.length ? items[items.length - 1].id : cursor;
    const processed = processedSoFar + items.length;

    if (hasMore) {
      await s.from("finance_backfill_jobs").update({ cursor: newCursor, processed_count: processed, updated_at: new Date().toISOString() }).eq("id", jobId);
      return NextResponse.json({ done: false, jobId, cursor: newCursor, processed });
    }

    // Complete → minimal reconciliation (count check).
    const { count } = await s.from(resource === "balance_transactions" ? "stripe_transactions" : resource === "subscriptions" ? "stripe_subscriptions" : resource === "payouts" ? "stripe_payouts" : "stripe_disputes")
      .select("*", { count: "exact", head: true }).eq("livemode", livemode);
    const reconciliation = { resource, processed, stored: count ?? null, dryRun, status: dryRun ? "dry_run" : "ok" };
    await s.from("finance_backfill_jobs").update({ status: "completed", cursor: newCursor, processed_count: processed, reconciliation, updated_at: new Date().toISOString() }).eq("id", jobId);
    await audit({ actor: auth.user.email ?? null, action: "finance.backfill_complete", target: jobId ?? undefined, metadata: reconciliation });
    return NextResponse.json({ done: true, jobId, processed, reconciliation });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[finance/backfill]", msg);
    if (jobId) await s.from("finance_backfill_jobs").update({ status: "failed", last_error: msg.slice(0, 800), updated_at: new Date().toISOString() }).eq("id", jobId);
    return NextResponse.json({ error: "Backfill page failed.", jobId }, { status: 502 });
  }
}
