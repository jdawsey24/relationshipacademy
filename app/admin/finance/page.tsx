"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import { formatMoney, type FinanceSummary, type BalanceInfo, type DeltaMetric } from "@/lib/finance";

// Chart palette — validated categorical (blue/aqua/yellow/violet), fixed order
// by tier; sequential blue for the single-series revenue trend; status green/red
// for deltas. (Brand navy/plum/sage failed the CVD checks as series colors.)
const SERIES = "#2a78d6";
const TIER_COLOR: Record<string, string> = { academy: "#2a78d6", academy_plus: "#1baf7a", professional: "#eda100", unknown: "#4a3aa7" };
const GOOD = "#0ca30c", BAD = "#d03b3b", WARN = "#b26a00";
const tierColor = (t: string) => TIER_COLOR[t] ?? "#4a3aa7";

function startOfMonth() { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString(); }
function startOfYear() { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).toISOString(); }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString(); }

function deltaBits(d: DeltaMetric): { text: string; up: boolean | null } {
  if (!d.previous) return { text: d.current ? "new" : "—", up: d.current ? true : null };
  const p = ((d.current - d.previous) / Math.abs(d.previous)) * 100;
  return { text: `${p >= 0 ? "▲" : "▼"} ${Math.abs(p).toFixed(0)}% vs prior`, up: p >= 0 };
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
    const res = await fetch(`/api/admin/finance/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&livemode=${livemode}`);
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
  const tierData = (sum?.byTier ?? []).filter((t) => t.count > 0).map((t) => ({ name: t.label, tier: t.tier, value: t.count, mrr: t.mrr }));
  const intervalData = sum ? [{ name: "Monthly", value: sum.monthlySubs }, { name: "Annual", value: sum.annualSubs }].filter((d) => d.value > 0) : [];
  const productData = (sum?.byProduct ?? []).map((p) => ({ name: p.label, tier: p.tier, amount: p.amount / 100 }));

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
      <p className="mb-5 text-sm text-charcoal/60">Stripe is the source of record; this is a synchronized report{sum?.lastSyncedAt ? ` · last synced ${new Date(sum.lastSyncedAt).toLocaleString()}` : " · not synced yet"}.</p>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {([["This month", startOfMonth()], ["This year", startOfYear()], ["Last 30 days", daysAgo(30)], ["Last 90 days", daysAgo(90)]] as [string, string][]).map(([label, f]) => (
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

          {/* Hero numbers */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Hero label="Net revenue" value={formatMoney(sum.net.current, cur)} delta={deltaBits(sum.net)} accent="#1C3557" />
            <Hero label="MRR" value={formatMoney(sum.mrr, cur)} sub={`Committed ${formatMoney(sum.committedMrr, cur)}`} accent={SERIES} />
            <Hero label="ARR" value={formatMoney(sum.arr, cur)} accent="#1baf7a" />
            <Hero label="Active subscribers" value={String(sum.activeSubs)} sub={`${sum.monthlySubs} monthly · ${sum.annualSubs} annual`} accent="#7B5878" />
          </div>

          {/* Revenue over time */}
          <div className="rounded-xl border border-light-gray bg-white p-5">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-midnight-navy">Net revenue over time</h2>
              <span className="text-xs text-charcoal/40">Gross {formatMoney(sum.gross.current, cur)} · Net {formatMoney(sum.net.current, cur)}</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={sum.timeseries.map((d) => ({ label: d.label, net: d.net / 100 }))} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SERIES} stopOpacity={0.28} /><stop offset="100%" stopColor={SERIES} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8a86" }} minTickGap={24} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8a8a86" }} tickFormatter={(v) => `$${v.toLocaleString()}`} axisLine={false} tickLine={false} width={64} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Net"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }} />
                <Area type="monotone" dataKey="net" stroke={SERIES} strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donuts + product bar */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Donut title="Subscribers by tier" data={tierData} colorByTier total={sum.activeSubs} totalLabel="subscribers" empty="No active subscriptions." />
            <Donut title="Monthly vs annual" data={intervalData} colors={[SERIES, "#1baf7a"]} total={sum.activeSubs} totalLabel="active" empty="No active subscriptions." />
            <div className="rounded-xl border border-light-gray bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-midnight-navy">MRR by product</h2>
              {tierData.length === 0 ? <p className="text-sm text-charcoal/50">No active subscriptions.</p> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart layout="vertical" data={tierData.map((t) => ({ name: t.name, tier: t.tier, mrr: t.mrr / 100 }))} margin={{ left: 8, right: 40 }}>
                    <XAxis type="number" hide /><YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#333" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}/mo`, "MRR"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }} />
                    <Bar dataKey="mrr" radius={[0, 4, 4, 0]} barSize={22}>
                      {tierData.map((t) => <Cell key={t.tier} fill={tierColor(t.tier)} />)}
                      <LabelList dataKey="mrr" position="right" formatter={(v) => `$${Number(v).toLocaleString()}`} style={{ fontSize: 11, fill: "#666" }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Revenue breakdown tiles */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tile label="Gross revenue" value={formatMoney(sum.gross.current, cur)} delta={deltaBits(sum.gross)} />
            <Tile label="Stripe fees" value={formatMoney(sum.fees.current, cur)} />
            <Tile label="Refunds" value={formatMoney(sum.refunds.current, cur)} />
            <Tile label="One-time (range)" value={formatMoney(sum.oneTime.current, cur)} />
          </div>

          {/* Lifecycle */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Tile label="New subs" value={String(sum.newSubs.current)} delta={deltaBits(sum.newSubs)} />
            <Tile label="Cancellations" value={String(sum.cancellations.current)} />
            <Tile label="Upgrades" value={String(sum.upgrades)} />
            <Tile label="Downgrades" value={String(sum.downgrades)} />
            <Tile label="Past due" value={String(sum.pastDueSubs)} warn={sum.pastDueSubs > 0} />
            <Tile label="Failed / disputes" value={`${sum.failedPayments} / ${sum.disputes.count}`} warn={sum.failedPayments > 0 || sum.disputes.count > 0} />
          </div>

          {/* Balance + recent */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-light-gray bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-midnight-navy">Stripe balance &amp; payouts</h2>
              {!bal ? <p className="text-sm text-charcoal/50">Loading…</p> : (
                <div className="space-y-2 text-sm">
                  {bal.available.map((a, i) => <div key={i} className="flex justify-between"><span className="text-charcoal/60">Available</span><span className="text-lg font-semibold text-midnight-navy">{formatMoney(a.amount, a.currency)}</span></div>)}
                  {bal.pending.map((a, i) => <div key={i} className="flex justify-between"><span className="text-charcoal/60">Pending</span><span className="text-charcoal/80">{formatMoney(a.amount, a.currency)}</span></div>)}
                  <div className="flex justify-between border-t border-light-gray pt-2"><span className="text-charcoal/60">Upcoming payout</span><span className="text-charcoal/80">{bal.upcomingPayout ? formatMoney(bal.upcomingPayout.amount, bal.upcomingPayout.currency) : "—"}</span></div>
                  <p className="pt-1 text-xs text-charcoal/40">Live from Stripe · cached ~60s</p>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-light-gray bg-white p-5 lg:col-span-2">
              <h2 className="mb-3 text-sm font-semibold text-midnight-navy">Recent transactions</h2>
              {sum.recentTransactions.length === 0 ? <p className="text-sm text-charcoal/50">No transactions in this mode yet. Run a backfill below to import history.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-light-gray text-xs uppercase text-charcoal/40"><tr><th className="py-2 pr-4 font-medium">Date</th><th className="py-2 pr-4 font-medium">Type</th><th className="py-2 pr-4 font-medium">Tier</th><th className="py-2 pr-4 text-right font-medium">Gross</th><th className="py-2 text-right font-medium">Net</th></tr></thead>
                    <tbody>
                      {sum.recentTransactions.slice(0, 8).map((t) => (
                        <tr key={t.balance_transaction_id} className="border-b border-light-gray/60">
                          <td className="py-2 pr-4 text-charcoal/70">{t.created ? new Date(t.created).toLocaleDateString() : "—"}</td>
                          <td className="py-2 pr-4"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: t.type === "refund" ? BAD : tierColor(t.tier ?? "unknown") }} />{t.type}{t.billing_type ? ` · ${t.billing_type}` : ""}</span></td>
                          <td className="py-2 pr-4">{t.tier ?? "—"}</td>
                          <td className="py-2 pr-4 text-right">{formatMoney(t.amount_gross, t.currency ?? cur)}</td>
                          <td className="py-2 text-right font-medium text-midnight-navy">{formatMoney(t.amount_net, t.currency ?? cur)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Backfill */}
          <div className="rounded-xl border border-light-gray bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-midnight-navy">Sync from Stripe (backfill)</h2>
              <label className="flex items-center gap-2 text-sm text-charcoal/70"><input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} /> Dry run (count only)</label>
            </div>
            <p className="mt-1 text-sm text-charcoal/60">Imports historical Stripe data (paginated &amp; resumable). Runs against the active key mode ({livemode ? "live" : "test"}).</p>
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

function Hero({ label, value, sub, delta, accent }: { label: string; value: string; sub?: string; delta?: { text: string; up: boolean | null }; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-light-gray bg-white p-5">
      <span className="absolute inset-y-0 left-0 w-1" style={{ background: accent }} />
      <p className="text-xs uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-midnight-navy">{value}</p>
      {delta && <p className="mt-1 text-xs" style={{ color: delta.up === null ? "#999" : delta.up ? GOOD : BAD }}>{delta.text}</p>}
      {sub && <p className="mt-0.5 text-xs text-charcoal/50">{sub}</p>}
    </div>
  );
}

function Tile({ label, value, delta, warn }: { label: string; value: string; delta?: { text: string; up: boolean | null }; warn?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${warn ? "border-amber-300 bg-amber-50/40" : "border-light-gray bg-white"}`}>
      <p className="text-xs uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className="mt-1 text-lg font-semibold" style={{ color: warn ? WARN : "#1C3557" }}>{value}</p>
      {delta && <p className="mt-0.5 text-xs" style={{ color: delta.up === null ? "#999" : delta.up ? GOOD : BAD }}>{delta.text}</p>}
    </div>
  );
}

function Donut({ title, data, colors, colorByTier, total, totalLabel, empty }: {
  title: string; data: { name: string; value: number; tier?: string }[]; colors?: string[]; colorByTier?: boolean; total: number; totalLabel: string; empty: string;
}) {
  const color = (d: { tier?: string }, i: number) => colorByTier ? tierColor(d.tier ?? "unknown") : (colors ?? ["#2a78d6", "#1baf7a", "#eda100"])[i % 3];
  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <h2 className="mb-2 text-sm font-semibold text-midnight-navy">{title}</h2>
      {data.length === 0 ? <p className="text-sm text-charcoal/50">{empty}</p> : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="#fcfcfb" strokeWidth={2}>
                {data.map((d, i) => <Cell key={i} fill={color(d, i)} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }} />
              <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 top-[76px] text-center">
            <p className="text-xl font-semibold text-midnight-navy">{total}</p>
            <p className="text-[11px] text-charcoal/50">{totalLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
