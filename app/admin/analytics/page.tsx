"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

interface Analytics {
  completionsOverTime: { label: string; count: number }[];
  phaseDistribution: { name: string; count: number }[];
  domainAverages: { name: string; avg: number }[];
  alignment: { name: string; count: number }[];
  riskDistribution: { name: string; count: number }[];
  leadSources: { name: string; count: number }[];
  totalSessions: number;
}

const NAVY = "#1C3557";
const PIE_COLORS = ["#8A9D8F", "#D9777D", "#6B7C97", "#C9A96E", "#9E3B38", "#7B5878"];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-midnight-navy">{title}</p>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const [a, setA] = useState<Analytics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setA)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-coral-rose">Failed to load analytics.</p>;
  if (!a) return <p className="text-sm text-charcoal/60">Loading…</p>;

  const tick = { fontSize: 12, fill: "#333333" };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-midnight-navy">Analytics</h1>
      <p className="mt-1 text-sm text-charcoal/60">{a.totalSessions} total assessment completions</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Completions over time (last 8 weeks)">
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={a.completionsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="label" tick={tick} />
                <YAxis allowDecimals={false} tick={tick} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={NAVY} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Phase distribution">
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.phaseDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="name" tick={{ ...tick, fontSize: 10 }} interval={0} />
                <YAxis allowDecimals={false} tick={tick} />
                <Tooltip />
                <Bar dataKey="count" fill={NAVY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Domain averages (1–5)">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={a.domainAverages} margin={{ top: 5, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis type="number" domain={[0, 5]} tick={tick} />
                <YAxis type="category" dataKey="name" tick={{ ...tick, fontSize: 11 }} width={110} />
                <Tooltip />
                <Bar dataKey="avg" fill="#8A9D8F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Lead sources">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.leadSources} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="name" tick={{ ...tick, fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={tick} />
                <Tooltip />
                <Bar dataKey="count" fill="#6B7C97" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Alignment distribution">
          <DonutChart data={a.alignment} />
        </Panel>

        <Panel title="Risk distribution">
          <DonutChart data={a.riskDistribution} />
        </Panel>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { name: string; count: number }[] }) {
  const total = data.reduce((n, d) => n + d.count, 0);
  if (total === 0) return <p className="text-sm text-charcoal/50">No data yet.</p>;
  return (
    <div style={{ height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d, i) => (
          <span key={d.name} className="flex items-center gap-1.5 text-xs text-charcoal">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
            {d.name} ({d.count})
          </span>
        ))}
      </div>
    </div>
  );
}
