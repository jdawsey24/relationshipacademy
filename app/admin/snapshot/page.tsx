"use client";

import { useEffect, useState } from "react";
import type { SnapshotAnalytics } from "@/lib/snapshot/analytics";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-midnight-navy">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-charcoal/55">{sub}</p>}
    </div>
  );
}

function Bar({ pct, tone = "navy" }: { pct: number; tone?: "navy" | "coral" }) {
  const color = tone === "coral" ? "#D9777D" : "#1C3557";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-gray">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

export default function SnapshotAnalyticsPage() {
  const [a, setA] = useState<SnapshotAnalytics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/snapshot/analytics")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setA)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-coral-rose">Failed to load Snapshot analytics.</p>;
  if (!a) return <p className="text-sm text-charcoal/60">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-midnight-navy">Snapshot Analytics</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Thin-signal &amp; content-gap data for the Relationship Snapshot&trade;. <span className="text-charcoal/45">Low-confidence is a backend-only flag — respondents never see it.</span>
      </p>

      {!a.hasData ? (
        <div className="mt-6 rounded-xl border border-dashed border-light-gray bg-white p-8 text-center text-sm text-charcoal/55">
          No completed Snapshots yet. This fills in as people take the quiz.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Completed" value={String(a.overall.completed)} />
            <Stat label="Converted" value={String(a.overall.converted)} sub={`${a.overall.conversionPct}% of completed`} />
            <Stat label="Low-confidence" value={`${a.overall.lowConfidencePct}%`} sub=">40% neutral answers" />
            <Stat label="Conversion" value={`${a.overall.conversionPct}%`} sub="email captured" />
          </div>

          {/* Per-marker table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-light-gray bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-light-gray text-left text-xs uppercase tracking-wide text-charcoal/50">
                  <th className="px-4 py-3 font-semibold">Marker</th>
                  <th className="px-4 py-3 font-semibold">Completed</th>
                  <th className="px-4 py-3 font-semibold">Avg neutral</th>
                  <th className="px-4 py-3 font-semibold">Low-confidence</th>
                  <th className="px-4 py-3 font-semibold">Conversion</th>
                  <th className="px-4 py-3 font-semibold">Tied</th>
                </tr>
              </thead>
              <tbody>
                {a.perMarker.map((m) => (
                  <tr key={m.id} className="border-b border-light-gray/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-midnight-navy">{m.display}</td>
                    <td className="px-4 py-3 text-charcoal/75">{m.completed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2"><span className="w-10 text-charcoal/75">{m.avgNeutralPct}%</span><div className="w-24"><Bar pct={m.avgNeutralPct} /></div></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2"><span className="w-10 text-charcoal/75">{m.lowConfidencePct}%</span><div className="w-24"><Bar pct={m.lowConfidencePct} tone="coral" /></div></div>
                    </td>
                    <td className="px-4 py-3 text-charcoal/75">{m.conversionPct}%</td>
                    <td className="px-4 py-3 text-charcoal/75">{m.tiedPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Neutral hotspots */}
            <div className="rounded-xl border border-light-gray bg-white p-5">
              <p className="text-sm font-semibold text-midnight-navy">Neutral hotspots</p>
              <p className="mt-0.5 text-xs text-charcoal/55">Questions people most often answer &ldquo;None of these fit&rdquo; — statements to revisit for these clusters.</p>
              <div className="mt-4 space-y-3">
                {a.hotspots.length === 0 ? (
                  <p className="text-sm text-charcoal/55">Not enough answers yet.</p>
                ) : a.hotspots.map((h) => (
                  <div key={`${h.marker}-${h.questionOrder}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-charcoal">{h.markerDisplay} · Q{h.questionOrder}</span>
                      <span className="shrink-0 text-sm font-semibold text-coral-rose">{h.neutralPct}%</span>
                    </div>
                    <div className="mt-1"><Bar pct={h.neutralPct} tone="coral" /></div>
                    <p className="mt-1 text-xs text-charcoal/50">{h.clusters.join(" · ")} <span className="text-charcoal/35">({h.answers} answers)</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary cluster distribution */}
            <div className="rounded-xl border border-light-gray bg-white p-5">
              <p className="text-sm font-semibold text-midnight-navy">Result distribution</p>
              <p className="mt-0.5 text-xs text-charcoal/55">Which primary cluster people land on.</p>
              <div className="mt-4 space-y-2.5">
                {a.primaryClusters.slice(0, 12).map((c) => {
                  const top = a.primaryClusters[0]?.count || 1;
                  return (
                    <div key={c.clusterId} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 truncate text-xs text-charcoal/75" title={c.name}>{c.name}</span>
                      <div className="flex-1"><Bar pct={(c.count / top) * 100} /></div>
                      <span className="w-6 shrink-0 text-right text-xs text-charcoal/60">{c.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
