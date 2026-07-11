import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwnerFinance } from "@/lib/adminApi";
import { tierLabel } from "@/lib/academy";
import type { FinanceSummary } from "@/lib/finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE = new Set(["active", "past_due"]);

export async function GET(request: Request) {
  const auth = await requireOwnerFinance();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const lm = url.searchParams.get("livemode") === "true";
  const now = new Date();
  const to = url.searchParams.get("to") ? new Date(url.searchParams.get("to")!) : now;
  const from = url.searchParams.get("from")
    ? new Date(url.searchParams.get("from")!)
    : new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));
  const span = to.getTime() - from.getTime();
  const priorFrom = new Date(from.getTime() - span);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  const s = getSupabaseAdminClient();
  const [txRes, subRes, chgRes, failRes, dispRes] = await Promise.all([
    s.from("stripe_transactions").select("*").eq("livemode", lm).limit(10000),
    s.from("stripe_subscriptions").select("*").eq("livemode", lm).limit(10000),
    s.from("subscription_changes").select("*").eq("livemode", lm).gte("created_at", priorFrom.toISOString()).lte("created_at", to.toISOString()),
    s.from("finance_failed_payments").select("*").eq("livemode", lm).gte("created", from.toISOString()).lte("created", to.toISOString()),
    s.from("stripe_disputes").select("*").eq("livemode", lm).gte("created", from.toISOString()).lte("created", to.toISOString()),
  ]);

  type Tx = { created: string | null; type: string | null; billing_type: string | null; tier: string | null; email: string | null; amount_gross: number; fee: number; amount_net: number; currency: string | null; balance_transaction_id: string; synced_at: string | null };
  const tx = (txRes.data ?? []) as Tx[];
  const subs = (subRes.data ?? []) as Record<string, unknown>[];
  const changes = (chgRes.data ?? []) as { change_type: string; created_at: string }[];

  const inWin = (t: Tx, a: Date, b: Date) => t.created && Date.parse(t.created) >= a.getTime() && Date.parse(t.created) < b.getTime();
  const sum = (arr: Tx[], f: (t: Tx) => number) => arr.reduce((n, t) => n + f(t), 0);
  const windowMetrics = (a: Date, b: Date) => {
    const w = tx.filter((t) => inWin(t, a, b));
    return {
      gross: sum(w.filter((t) => t.type === "charge"), (t) => t.amount_gross),
      fees: sum(w, (t) => t.fee),
      refunds: -sum(w.filter((t) => t.type === "refund"), (t) => t.amount_gross),
      net: sum(w, (t) => t.amount_net),
      oneTime: sum(w.filter((t) => t.type === "charge" && t.billing_type === "one_time"), (t) => t.amount_gross),
    };
  };
  const cur = windowMetrics(from, to);
  const prev = windowMetrics(priorFrom, from);
  const changeCount = (type: string, a: Date, b: Date) =>
    changes.filter((c) => c.change_type === type && Date.parse(c.created_at) >= a.getTime() && Date.parse(c.created_at) < b.getTime()).length;

  // Subscriptions / MRR
  const num = (r: Record<string, unknown>, k: string) => Number(r[k] ?? 0);
  const str = (r: Record<string, unknown>, k: string) => (r[k] as string) ?? null;
  const active = subs.filter((r) => ACTIVE.has(str(r, "status") ?? ""));
  const mrr = active.reduce((n, r) => n + num(r, "mrr_amount"), 0);
  const committedMrr = subs
    .filter((r) => str(r, "status") === "active" && !r["cancel_at_period_end"])
    .reduce((n, r) => n + num(r, "mrr_amount"), 0);

  const tierMap = new Map<string, { count: number; mrr: number }>();
  for (const r of active) {
    const t = str(r, "tier") ?? "unknown";
    const e = tierMap.get(t) ?? { count: 0, mrr: 0 };
    e.count += 1; e.mrr += num(r, "mrr_amount");
    tierMap.set(t, e);
  }

  // Revenue by product (current range charges grouped by tier + billing_type)
  const prodMap = new Map<string, { tier: string; amount: number; billing_type: string }>();
  for (const t of tx.filter((t) => t.type === "charge" && inWin(t, from, to))) {
    const key = `${t.tier ?? "unknown"}|${t.billing_type ?? "recurring"}`;
    const e = prodMap.get(key) ?? { tier: t.tier ?? "unknown", amount: 0, billing_type: t.billing_type ?? "recurring" };
    e.amount += t.amount_gross;
    prodMap.set(key, e);
  }

  const lastSyncedAt = tx.reduce<string | null>((m, t) => (t.synced_at && (!m || t.synced_at > m) ? t.synced_at : m), null);
  const currency = tx.find((t) => t.currency)?.currency ?? "usd";

  // Revenue over time — bucket the range (daily ≤62d, weekly ≤370d, else monthly).
  const spanDays = Math.max(1, Math.ceil(span / 86400000));
  const gran: "day" | "week" | "month" = spanDays <= 62 ? "day" : spanDays <= 370 ? "week" : "month";
  const keyOf = (d: Date) => {
    if (gran === "day") return d.toISOString().slice(0, 10);
    if (gran === "week") { const w = new Date(d); w.setUTCDate(w.getUTCDate() - w.getUTCDay()); return w.toISOString().slice(0, 10); }
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  };
  const labelOf = (k: string) => gran === "month"
    ? new Date(k + "-01T00:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    : new Date(k + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const buckets = new Map<string, { gross: number; net: number }>();
  for (let d = new Date(from); d <= to; ) {
    buckets.set(keyOf(d), { gross: 0, net: 0 });
    if (gran === "day") d.setUTCDate(d.getUTCDate() + 1);
    else if (gran === "week") d.setUTCDate(d.getUTCDate() + 7);
    else d.setUTCMonth(d.getUTCMonth() + 1);
  }
  for (const t of tx.filter((t) => inWin(t, from, to))) {
    const b = buckets.get(keyOf(new Date(t.created!)));
    if (!b) continue;
    if (t.type === "charge") b.gross += t.amount_gross;
    b.net += t.amount_net;
  }
  const timeseries = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => ({ date: k, label: labelOf(k), gross: v.gross, net: v.net }));

  const summary: FinanceSummary = {
    livemode: lm,
    range: { from: from.toISOString(), to: to.toISOString() },
    currency,
    gross: { current: cur.gross, previous: prev.gross },
    fees: { current: cur.fees, previous: prev.fees },
    refunds: { current: cur.refunds, previous: prev.refunds },
    net: { current: cur.net, previous: prev.net },
    oneTime: { current: cur.oneTime, previous: prev.oneTime },
    mrr,
    committedMrr,
    arr: mrr * 12,
    revenueThisMonth: sum(tx.filter((t) => t.type === "charge" && inWin(t, monthStart, now)), (t) => t.amount_gross),
    revenueThisYear: sum(tx.filter((t) => t.type === "charge" && inWin(t, yearStart, now)), (t) => t.amount_gross),
    activeSubs: subs.filter((r) => str(r, "status") === "active").length,
    trialingSubs: subs.filter((r) => str(r, "status") === "trialing").length,
    pastDueSubs: subs.filter((r) => str(r, "status") === "past_due").length,
    monthlySubs: active.filter((r) => str(r, "interval") === "month").length,
    annualSubs: active.filter((r) => str(r, "interval") === "year").length,
    byTier: [...tierMap.entries()].map(([tier, v]) => ({ tier, label: tierLabel(tier), count: v.count, mrr: v.mrr })),
    newSubs: { current: changeCount("new", from, to), previous: changeCount("new", priorFrom, from) },
    cancellations: { current: changeCount("canceled", from, to), previous: changeCount("canceled", priorFrom, from) },
    upgrades: changeCount("upgrade", from, to),
    downgrades: changeCount("downgrade", from, to),
    failedPayments: (failRes.data ?? []).length,
    disputes: { count: (dispRes.data ?? []).length, amount: (dispRes.data ?? []).reduce((n: number, d: { amount?: number }) => n + (d.amount ?? 0), 0) },
    byProduct: [...prodMap.values()].map((p) => ({ tier: p.tier, label: tierLabel(p.tier), amount: p.amount, billing_type: p.billing_type })),
    timeseries,
    recentTransactions: [...tx].sort((a, b) => (b.created ?? "").localeCompare(a.created ?? "")).slice(0, 20).map((t) => ({
      balance_transaction_id: t.balance_transaction_id, created: t.created, type: t.type, billing_type: t.billing_type,
      tier: t.tier, email: t.email, amount_gross: t.amount_gross, fee: t.fee, amount_net: t.amount_net, currency: t.currency,
    })),
    lastSyncedAt,
    reconciliation: null,
  };

  return NextResponse.json(summary);
}
