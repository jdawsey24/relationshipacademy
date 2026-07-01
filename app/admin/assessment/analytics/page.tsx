"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AssessmentTabs from "@/components/admin/AssessmentTabs";

interface Analytics {
  phaseDistribution: { name: string; count: number }[];
  domainAverages: { name: string; avg: number }[];
  alignment: { name: string; count: number }[];
  riskDistribution: { name: string; count: number }[];
  totalSessions: number;
}

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-charcoal">{label}</span>
        <span className="font-semibold text-midnight-navy">{suffix ? value.toFixed(2) : value}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-light-gray">
        <div className="h-full rounded-full bg-midnight-navy" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AssessmentAnalyticsPage() {
  const [a, setA] = useState<Analytics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setA)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Assessment</h1>
      <AssessmentTabs />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-midnight-navy">Analytics</h2>
        <Link href="/admin/analytics" className="text-sm text-midnight-navy hover:underline">Full analytics →</Link>
      </div>

      {error && <p className="mt-6 text-sm text-coral-rose">Failed to load analytics.</p>}
      {!error && !a && <p className="mt-6 text-sm text-charcoal/60">Loading…</p>}

      {a && (
        <div className="mt-5 space-y-6">
          <div className="rounded-xl border border-light-gray bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal/50">Total completions</p>
            <p className="mt-1 text-3xl font-semibold text-midnight-navy">{a.totalSessions}</p>
          </div>

          <div className="rounded-xl border border-light-gray bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-midnight-navy">Phase distribution</p>
            <div className="space-y-3">
              {a.phaseDistribution.map((p) => (
                <Bar key={p.name} label={p.name} value={p.count} max={Math.max(1, ...a.phaseDistribution.map((x) => x.count))} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-light-gray bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-midnight-navy">Domain averages (1–5)</p>
            <div className="space-y-3">
              {a.domainAverages.map((d) => (
                <Bar key={d.name} label={d.name} value={d.avg} max={5} suffix="avg" />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-light-gray bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-midnight-navy">Alignment</p>
              {a.alignment.map((x) => (
                <p key={x.name} className="flex justify-between py-0.5 text-sm text-charcoal"><span>{x.name}</span><span className="font-semibold">{x.count}</span></p>
              ))}
            </div>
            <div className="rounded-xl border border-light-gray bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-midnight-navy">Risk distribution</p>
              {a.riskDistribution.length === 0 ? (
                <p className="text-sm text-charcoal/50">No data yet.</p>
              ) : a.riskDistribution.map((x) => (
                <p key={x.name} className="flex justify-between py-0.5 text-sm text-charcoal"><span>{x.name}</span><span className="font-semibold">{x.count}</span></p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
