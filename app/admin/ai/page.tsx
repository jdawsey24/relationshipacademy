"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AiStudioNav from "@/components/admin/AiStudioNav";

interface Dash {
  totals: { requests: number; cost_all: number; cost_today: number; tokens: number };
  byType: Record<string, number>;
  pipeline: Record<string, number>;
  limits: { daily: number; monthly: number; kill_switch: boolean };
  recent: { id: string; generation_type: string; status: string; cost_usd: number | null; created_at: string }[];
}

export default function AiDashboardPage() {
  const [d, setD] = useState<Dash | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/ai/dashboard")
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed to load."); else setD(j); })
      .catch(() => setErr("Failed to load."));
  }, []);

  return (
    <div>
      <AiStudioNav />
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err} (The AI Studio requires an owner account with MFA. If the tables aren&apos;t set up yet, run migration 0022_ai_studio.sql.)</p>}
      {!err && !d && <p className="text-sm text-charcoal/60">Loading…</p>}
      {d && (
        <>
          {d.limits.kill_switch && <p className="mb-4 rounded-md border border-coral-rose bg-coral-rose/10 px-4 py-2.5 text-sm font-semibold text-coral-rose">Kill switch is ON — AI generation is paused. Turn it off in AI Settings.</p>}
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Generations" value={String(d.totals.requests)} />
            <Stat label="Cost (today)" value={`$${d.totals.cost_today.toFixed(2)}`} sub={`limit $${d.limits.daily}`} />
            <Stat label="Cost (all-time)" value={`$${d.totals.cost_all.toFixed(2)}`} />
            <Stat label="Tokens" value={d.totals.tokens.toLocaleString()} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-md border border-light-gray p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Draft pipeline</h2>
              <ul className="space-y-1 text-sm">
                {Object.keys(d.pipeline).length === 0 && <li className="text-charcoal/50">No drafts yet.</li>}
                {Object.entries(d.pipeline).map(([k, v]) => (
                  <li key={k} className="flex justify-between"><span className="capitalize">{k.replace("_", " ")}</span><span className="font-medium">{v}</span></li>
                ))}
              </ul>
              <Link href="/admin/ai/review" className="mt-3 inline-block text-sm font-medium text-midnight-navy hover:underline">Open Review Queue →</Link>
            </section>
            <section className="rounded-md border border-light-gray p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Recent generations</h2>
              <ul className="space-y-1 text-sm">
                {d.recent.length === 0 && <li className="text-charcoal/50">None yet.</li>}
                {d.recent.slice(0, 8).map((r) => (
                  <li key={r.id} className="flex justify-between gap-2">
                    <span>{r.generation_type} <span className="text-charcoal/40">· {r.status}</span></span>
                    <span className="text-charcoal/50">{new Date(r.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-light-gray p-4">
      <div className="text-xs uppercase tracking-wide text-charcoal/50">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-midnight-navy">{value}</div>
      {sub && <div className="text-xs text-charcoal/40">{sub}</div>}
    </div>
  );
}
