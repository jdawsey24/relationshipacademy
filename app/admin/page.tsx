"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Dashboard {
  completions: { today: number; week: number; all: number };
  newLeadsWeek: number;
  speakingWeek: number;
  professionalTotal: number;
  insights: {
    topPhase: { name: string; count: number } | null;
    phaseDistribution: { name: string; count: number }[];
    lowestDomain: { name: string; avg: number } | null;
    alignment: { congruent: number; incongruent: number };
  };
  recent: {
    completions: { name: string; email: string; phase: string; when: string | null }[];
    contacts: { name: string; email: string; inquiry_type: string; when: string | null }[];
    speaking: { name: string; email: string; when: string | null }[];
  };
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Metric({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-midnight-navy">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-charcoal/50">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [d, setD] = useState<Dashboard | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setD)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-coral-rose">Failed to load dashboard.</p>;
  if (!d) return <p className="text-sm text-charcoal/60">Loading…</p>;

  const alignTotal = d.insights.alignment.congruent + d.insights.alignment.incongruent;
  const congruentPct = alignTotal ? Math.round((d.insights.alignment.congruent / alignTotal) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-midnight-navy">Dashboard</h1>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Completions (today)" value={d.completions.today} />
        <Metric label="Completions (this week)" value={d.completions.week} />
        <Metric label="Completions (all time)" value={d.completions.all} />
        <Metric label="New leads (this week)" value={d.newLeadsWeek} />
        <Metric label="Speaking inquiries (week)" value={d.speakingWeek} />
        <Metric label="Professional interest" value={d.professionalTotal} sub="all time" />
      </div>

      {/* Framework insights */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Framework insights</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-light-gray bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-charcoal/50">Most selected stage</p>
          <p className="mt-1 text-lg font-semibold text-midnight-navy">{d.insights.topPhase?.name ?? "—"}</p>
          <p className="text-xs text-charcoal/50">{d.insights.topPhase ? `${d.insights.topPhase.count} respondents` : "No data yet"}</p>
        </div>
        <div className="rounded-xl border border-light-gray bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-charcoal/50">Most common growth area</p>
          <p className="mt-1 text-lg font-semibold text-midnight-navy">{d.insights.lowestDomain?.name ?? "—"}</p>
          <p className="text-xs text-charcoal/50">{d.insights.lowestDomain ? `avg ${d.insights.lowestDomain.avg.toFixed(2)}` : "No data yet"}</p>
        </div>
        <div className="rounded-xl border border-light-gray bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-charcoal/50">Alignment</p>
          <p className="mt-1 text-lg font-semibold text-midnight-navy">{alignTotal ? `${congruentPct}% Congruent` : "—"}</p>
          <p className="text-xs text-charcoal/50">{alignTotal ? `${d.insights.alignment.congruent} congruent · ${d.insights.alignment.incongruent} incongruent` : "No data yet"}</p>
        </div>
      </div>

      {/* Recent activity */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Recent activity</h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-3">
        <RecentCard title="Latest completions" empty="No completions yet"
          rows={d.recent.completions.map((r) => ({ a: r.name || r.email || "—", b: r.phase, c: fmt(r.when) }))} />
        <RecentCard title="Recent contact forms" empty="No contact submissions"
          rows={d.recent.contacts.map((r) => ({ a: r.name || r.email || "—", b: r.inquiry_type, c: fmt(r.when) }))} />
        <RecentCard title="Recent speaking inquiries" empty="No speaking inquiries"
          rows={d.recent.speaking.map((r) => ({ a: r.name || r.email || "—", b: "", c: fmt(r.when) }))} />
      </div>

      {/* Quick actions */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Quick actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link href="/admin/crm" className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90">View leads</Link>
        <Link href="/admin/analytics" className="rounded-md border border-light-gray px-4 py-2 text-sm font-medium text-charcoal hover:border-midnight-navy">View analytics</Link>
        <Link href="/admin/questions" className="rounded-md border border-light-gray px-4 py-2 text-sm font-medium text-charcoal hover:border-midnight-navy">Manage questions</Link>
      </div>
    </div>
  );
}

function RecentCard({ title, rows, empty }: { title: string; rows: { a: string; b: string; c: string }[]; empty: string }) {
  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <p className="text-sm font-semibold text-midnight-navy">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal/50">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-light-gray">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-2 py-2 text-sm">
              <span className="truncate text-charcoal">{r.a}</span>
              <span className="shrink-0 text-xs text-charcoal/50">{r.b ? `${r.b} · ` : ""}{r.c}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
