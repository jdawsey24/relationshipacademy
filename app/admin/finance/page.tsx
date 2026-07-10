"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatMoney, type FinanceSummary, type BalanceInfo, type DeltaMetric } from "@/lib/finance";

const COLORS = ["#1C3557", "#7B5878", "#8A9D8F", "#D9777D", "#6B7C97"];

function startOfMonth() { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString(); }
function startOfYear() { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).toISOString(); }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString(); }

function pct(d: DeltaMetric): string {
  if (!d.previous) return d.current ? "▲ new" : "—";
  const p = ((d.current - d.previous) / Math.abs(d.previous)) * 100;
  return `${p >= 0 ? "▲" : "▼"} ${Math.abs(p).toFixed(0)}%`;
}

export default function FinanceDashboard() {
  const [livemode, setLivemode] = useState(false);
  const [from, setFrom] = useState(startOfMonth());
  const [to, setTo] = useState(new Date().toISOString());
  const [sum, setSum] = useState<FinanceSummary | null>(null);
  const [bal, setBal] = useState<BalanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [backfillMsg, setBackfillMsg] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    const qs = `from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&livemode=${livemode}`;
    const res = await fetch(`/api/admin/finance/summary?${qs}`);
    if (!res.ok) { setErr(res.status === 403 ? "Owner + MFA access required for financial data." : "Failed to load."); setLoading(false); return; }
    setSum(await res.json());
    fetch("/api/admin/finance/balance").then((r) => (r.ok ? r.json() : null)).then(setBal).catch(() => {});
    setLoading(false);
  }, [from, to, livemode]);
  useEffect(() => { load(); }, [load]);

  async function runBackfill(resource: string) {
    setBackfillMsg(`${resource}: starting…`);
    let res = await fetch("/api/admin/finance/backfill", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource, dryRun }) }).then((r) => r.json()).catch(() => null);
    let guard = 0;
    while (res && !res.done && !res.error && guard++ < 2000) {
      setBackfillMsg(`${resource}: ${res.processed} processed…`);
      res = await fetch("/api/admin/finance/backfill", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource, dryRun, jobId: res.jobId, cursor: res.cursor }) }).then((r) => r.json()).catch(() => null);
    }
    setBackfillMsg(res?.error ? `${resource}: error` : `${resource}: done — ${res?.processed ?? 0} processed${dryRun ? " (dry run)" : ""}`);
    if (!dryRun) load();
  }

  const cur = sum?.currency ?? "usd";
  const csvHref = `/api/admin/finance/transactions?format=csv&livemode=${livemode}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-midnight-navy">Finance</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/50">Mode</span>
          <div className="inline-flex rounded-md border border-light-gray p-0.5 text-sm">
            <button onClick={() => setLivemode(false)} className={`rounded px-3 py-1 ${!livemode ? "bg-midnight-navy text-white" : "text-charcoal/60"}`}>Test</button>
            <button onClick={() => setLivemode(true)} className={`rounded px-3 py-1 ${livemode ? "bg-midnight-navy text-white" : "text-charcoal/60"}`}>Live</button>
          </div>
        </div>
      </div>
      <p className="mb-5 text-sm text-charcoal/60">
        Stripe is the source of record; this is a synchronized report{sum?.lastSyncedAt ? ` · last synced ${new Date(sum.lastSyncedAt).toLocaleString()}` : " · not synced yet"}.
      </p>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {[["This month", startOfMonth()], ["This year", startOfYear()], ["Last 30 days", daysAgo(30)], ["Last 90 days", daysAgo(90)]].map(([label, f]) => (
          <button key={label} onClick={() => { setFrom(f); setTo(new Date().toISOString()); }} className={`rounded-full border px-3 py-1 text-sm ${from === f ? "border-midnight-navy bg-midnight-navy/5 text-midnight-navy" : "border-light-gray text-charcoal/60 hover:text-charcoal"}`}>{label}</button>
        ))}
        <input type="date" value={from.slice(0, 10)} onChange={(e) => setFrom(new Date(e.target.value).toISOString())} className="rounded-md border border-light-gray px-2 py-1 text-sm" />
        <span className="text-charcoal/40">→</span>
        <input type="date" value={to.slice(0, 10)} onChange={(e) => setTo(new Date(e.target.value + "T23:59:59Z").toISOString())} className="rounded-md border border-light-gray px-2 py-1 text-sm" />
        <a href={csvHref} className="ml-auto rounded-md border border-light-gray px-3 py-1.5 text-sm text-midnight-navy hover:bg-light-gray/40">Export CSV</a>
      </div>

      {err && <p className="rounded-md bg-coral-rose/10 px-4 py-3 text-sm text-coral-rose">{err}</p>}
      {loading && !sum ? <p className="text-sm text-charcoal/60">Loading…</p> : sum && (
        <div className="space-y-6">
          {livemode && sum.recentTransactions.length === 0 && (
            <p className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">No live data yet — Stripe is in test mode. Switch to Test to see current activity.</p>
          )}

          {/* Revenue KPIs (period + comparison) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Gross revenue" value={formatMoney(sum.gross.current, cur)} delta={pct(sum.gross)} />
            <Kpi label="Stripe fees" value={formatMoney(sum.fees.current, cur)} delta={pct(sum.fees)} />
            <Kpi label="Refunds" value={formatMoney(sum.refunds.current, cur)} delta={pct(sum.refunds)} />
            <Kpi label="Net revenue" value={formatMoney(sum.net.current, cur)} delta={pct(sum.net)} />
          </div>

          {/* Recurring KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="MRR" value={formatMoney(sum.mrr, cur)} sub={`Committed ${formatMoney(sum.committedMrr, cur)}`} />
            <Kpi label="ARR" value={formatMoney(sum.arr, cur)} />
            <Kpi label="Revenue this month" value={formatMoney(sum.revenueThisMonth, cur)} />
            <Kpi label="Revenue this year" value={formatMoney(sum.revenueThisYear, cur)} />
          </div>

          {/* Subscription KPIs */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Kpi label="Active subs" value={String(sum.activeSubs)} />
            <Kpi label="Monthly" value={String(sum.monthlySubs)} />
            <Kpi label="Annual" value={String(sum.annualSubs)} />
            <Kpi label="Trialing" value={String(sum.trialingSubs)} />
            <Kpi label="Past due" value={String(sum.pastDueSubs)} tone={sum.pastDueSubs ? "warn" : undefined} />
            <Kpi label="One-time (range)" value={formatMoney(sum.oneTime.current, cur)} />
          </div>

          {/* Lifecycle */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Kpi label="New subs" value={String(sum.newSubs.current)} delta={pct(sum.newSubs)} />
            <Kpi label="Cancellations" value={String(sum.cancellations.current)} delta={pct(sum.cancellations)} />
            <Kpi label="Upgrades" value={String(sum.upgrades)} />
            <Kpi label="Downgrades" value={String(sum.downgrades)} />
            <Kpi label="Failed payments" value={String(sum.failedPayments)} tone={sum.failedPayments ? "warn" : undefined} />
            <Kpi label="Disputes" value={String(sum.disputes.count)} sub={formatMoney(sum.disputes.amount, cur)} tone={sum.disputes.count ? "warn" : undefined} />
          </div>

          {/* Charts + balance */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-light-gray p-5">
              <h2 className="mb-3 text-sm font-semibold text-midnight-navy">MRR by product</h2>
              {sum.byTier.length === 0 ? <p className="text-sm text-charcoal/50">No active subscriptions.</p> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sum.byTier.map((t) => ({ name: t.label, mrr: t.mrr / 100, count: t.count }))}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `$${Number(v ?? 0).toLocaleString()}`} />
                    <Bar dataKey="mrr" radius={[4, 4, 0, 0]}>{sum.byTier.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-3 space-y-1 text-sm">
                {sum.byTier.map((t) => <div key={t.tier} className="flex justify-between"><span className="text-charcoal/70">{t.label} ({t.count})</span><span className="font-medium text-midnight-navy">{formatMoney(t.mrr, cur)}/mo</span></div>)}
              </div>
            </div>

            <div className="rounded-lg border border-light-gray p-5">
              <h2 className="mb-3 text-sm font-semibold text-midnight-navy">Stripe balance &amp; payouts</h2>
              {!bal ? <p className="text-sm text-charcoal/50">Loading balance…</p> : (
                <div className="space-y-2 text-sm">
                  {bal.available.map((a, i) => <div key={i} className="flex justify-between"><span className="text-charcoal/70">Available</span><span className="font-medium text-midnight-navy">{formatMoney(a.amount, a.currency)}</span></div>)}
                  {bal.pending.map((a, i) => <div key={i} className="flex justify-between"><span className="text-charcoal/70">Pending</span><span className="text-charcoal/80">{formatMoney(a.amount, a.currency)}</span></div>)}
                  <div className="flex justify-between border-t border-light-gray pt-2"><span className="text-charcoal/70">Upcoming payout</span><span className="text-charcoal/80">{bal.upcomingPayout ? `${formatMoney(bal.upcomingPayout.amount, bal.upcomingPayout.currency)}${bal.upcomingPayout.arrival_date ? " · " + new Date(bal.upcomingPayout.arrival_date).toLocaleDateString() : ""}` : "—"}</span></div>
                  <p className="pt-1 text-xs text-charcoal/40">Live from Stripe · cached ~60s</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="rounded-lg border border-light-gray p-5">
            <h2 className="mb-3 text-sm font-semibold text-midnight-navy">Recent transactions</h2>
            {sum.recentTransactions.length === 0 ? <p className="text-sm text-charcoal/50">No transactions in this mode yet. Run a backfill below to import history.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-light-gray text-charcoal/50"><tr>
                    <th className="py-2 pr-4 font-medium">Date</th><th className="py-2 pr-4 font-medium">Type</th><th className="py-2 pr-4 font-medium">Tier</th><th className="py-2 pr-4 font-medium">Email</th><th className="py-2 pr-4 text-right font-medium">Gross</th><th className="py-2 pr-4 text-right font-medium">Fee</th><th className="py-2 text-right font-medium">Net</th>
                  </tr></thead>
                  <tbody>
                    {sum.recentTransactions.map((t) => (
                      <tr key={t.balance_transaction_id} className="border-b border-light-gray/60">
                        <td className="py-2 pr-4 text-charcoal/70">{t.created ? new Date(t.created).toLocaleDateString() : "—"}</td>
                        <td className="py-2 pr-4">{t.type}{t.billing_type ? ` · ${t.billing_type}` : ""}</td>
                        <td className="py-2 pr-4">{t.tier ?? "—"}</td>
                        <td className="py-2 pr-4 text-charcoal/60">{t.email ?? "—"}</td>
                        <td className="py-2 pr-4 text-right">{formatMoney(t.amount_gross, t.currency ?? cur)}</td>
                        <td className="py-2 pr-4 text-right text-charcoal/50">{formatMoney(t.fee, t.currency ?? cur)}</td>
                        <td className="py-2 text-right font-medium text-midnight-navy">{formatMoney(t.amount_net, t.currency ?? cur)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Backfill / sync */}
          <div className="rounded-lg border border-light-gray p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-midnight-navy">Sync from Stripe (backfill)</h2>
              <label className="flex items-center gap-2 text-sm text-charcoal/70"><input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} /> Dry run (count only)</label>
            </div>
            <p className="mt-1 text-sm text-charcoal/60">Imports historical Stripe data into the report (paginated &amp; resumable). Runs against the active key mode ({livemode ? "live" : "test"}).</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["balance_transactions", "subscriptions", "payouts", "disputes"].map((r) => (
                <button key={r} onClick={() => runBackfill(r)} className="rounded-md border border-light-gray px-3 py-1.5 text-sm text-midnight-navy hover:bg-light-gray/40">Sync {r.replace("_", " ")}</button>
              ))}
            </div>
            {backfillMsg && <p className="mt-3 text-sm text-charcoal/70">{backfillMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, delta, sub, tone }: { label: string; value: string; delta?: string; sub?: string; tone?: "warn" }) {
  return (
    <div className={`rounded-lg border p-4 ${tone === "warn" ? "border-amber-300 bg-amber-50/50" : "border-light-gray"}`}>
      <p className="text-xs uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className="mt-1 text-xl font-semibold text-midnight-navy">{value}</p>
      {delta && <p className="mt-0.5 text-xs text-charcoal/50">{delta} vs prior</p>}
      {sub && <p className="mt-0.5 text-xs text-charcoal/50">{sub}</p>}
    </div>
  );
}
