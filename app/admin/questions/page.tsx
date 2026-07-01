"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface QRow {
  id: string;
  domain: string;
  phase: string;
  question_text: string;
  item_type: string;
  score_direction: string;
  in_snapshot: boolean;
  in_profile: boolean;
  active: boolean;
}

export default function QuestionsPage() {
  const [rows, setRows] = useState<QRow[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/questions")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, []);

  const domains = useMemo(() => Array.from(new Set((rows ?? []).map((r) => r.domain))).sort(), [rows]);
  const phases = useMemo(() => Array.from(new Set((rows ?? []).map((r) => r.phase))).sort(), [rows]);

  const filtered = useMemo(() => {
    let out = rows ?? [];
    const q = search.trim().toLowerCase();
    if (q) out = out.filter((r) => r.question_text.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    if (domainFilter) out = out.filter((r) => r.domain === domainFilter);
    if (phaseFilter) out = out.filter((r) => r.phase === phaseFilter);
    if (activeFilter) out = out.filter((r) => (activeFilter === "active" ? r.active : !r.active));
    return out;
  }, [rows, search, domainFilter, phaseFilter, activeFilter]);

  const counts = useMemo(() => {
    const all = rows ?? [];
    return { total: all.length, active: all.filter((r) => r.active).length, snap: all.filter((r) => r.in_snapshot).length };
  }, [rows]);

  async function toggle(id: string, field: "active" | "in_snapshot" | "in_profile", value: boolean) {
    // optimistic
    setRows((prev) => prev && prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    const res = await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) {
      // revert on failure
      setRows((prev) => prev && prev.map((r) => (r.id === id ? { ...r, [field]: !value } : r)));
    }
  }

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-midnight-navy">Questions</h1>
      </div>
      {rows && (
        <p className="mb-5 text-sm text-charcoal/60">
          {counts.total} questions / {counts.active} active / {counts.snap} in Snapshot
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search text or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 min-w-[200px] flex-1 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
        />
        <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy">
          <option value="">All domains</option>
          {domains.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy">
          <option value="">All phases</option>
          {phases.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load questions. Please refresh.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}

      {rows && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">ID</th>
                <th className="px-3 py-2 font-semibold">Domain</th>
                <th className="px-3 py-2 font-semibold">Phase</th>
                <th className="px-3 py-2 font-semibold">Question</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Dir</th>
                <th className="px-3 py-2 text-center font-semibold">Snap</th>
                <th className="px-3 py-2 text-center font-semibold">Prof</th>
                <th className="px-3 py-2 text-center font-semibold">Active</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={i % 2 === 1 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.domain}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.phase}</td>
                  <td className="max-w-xs px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="text-left hover:text-midnight-navy"
                      title="Click to expand"
                    >
                      {expanded === r.id ? r.question_text : truncate(r.question_text, 60)}
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.item_type}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.score_direction}</td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={r.in_snapshot} onChange={(e) => toggle(r.id, "in_snapshot", e.target.checked)} className="accent-midnight-navy" /></td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={r.in_profile} onChange={(e) => toggle(r.id, "in_profile", e.target.checked)} className="accent-midnight-navy" /></td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={r.active} onChange={(e) => toggle(r.id, "active", e.target.checked)} className="accent-midnight-navy" /></td>
                  <td className="px-3 py-2"><Link href={`/admin/questions/${r.id}`} className="font-medium text-midnight-navy hover:underline">Edit</Link></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-8 text-center text-charcoal/60">No questions match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
