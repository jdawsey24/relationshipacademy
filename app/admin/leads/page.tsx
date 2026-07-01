"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface LeadRow {
  session_id: string;
  name: string;
  email: string;
  structural_phase: string;
  quiz_type: string;
  alignment_status: string;
  expiration_risk: string;
  completed_at: string | null;
}

const PAGE_SIZE = 25;

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function toCsv(rows: LeadRow[]): string {
  const header = ["Name", "Email", "Structural Phase", "Alignment", "Expiration Risk", "Completed"];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.name, r.email, r.structural_phase, r.alignment_status, r.expiration_risk, formatDate(r.completed_at)]
      .map((v) => esc(String(v)))
      .join(",")
  );
  return [header.map(esc).join(","), ...lines].join("\n");
}

export default function LeadsPage() {
  const [rows, setRows] = useState<LeadRow[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, []);

  const phases = useMemo(
    () => Array.from(new Set((rows ?? []).map((r) => r.structural_phase))).filter((p) => p !== "—").sort(),
    [rows]
  );
  const types = useMemo(
    () => Array.from(new Set((rows ?? []).map((r) => r.quiz_type))).filter(Boolean).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    let out = rows ?? [];
    const q = search.trim().toLowerCase();
    if (q) out = out.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
    if (phaseFilter) out = out.filter((r) => r.structural_phase === phaseFilter);
    if (typeFilter) out = out.filter((r) => r.quiz_type === typeFilter);
    return out;
  }, [rows, search, phaseFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rlc-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-midnight-navy">Leads</h1>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!rows || filtered.length === 0}
          className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="h-10 min-w-[200px] flex-1 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
        />
        <select
          value={phaseFilter}
          onChange={(e) => { setPhaseFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
        >
          <option value="">All phases</option>
          {phases.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
        >
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load leads. Please refresh.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}

      {rows && (
        <>
          <div className="overflow-x-auto rounded-md border border-light-gray">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 font-semibold">Phase</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Alignment</th>
                  <th className="px-3 py-2 font-semibold">Risk</th>
                  <th className="px-3 py-2 font-semibold">Completed</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => (
                  <tr key={r.session_id} className={i % 2 === 1 ? "bg-[#F9F9F9]" : "bg-white"}>
                    <td className="px-3 py-2">{r.name || "—"}</td>
                    <td className="px-3 py-2">{r.email || "—"}</td>
                    <td className="px-3 py-2">{r.structural_phase}</td>
                    <td className="px-3 py-2 capitalize">{r.quiz_type}</td>
                    <td className="px-3 py-2">{r.alignment_status}</td>
                    <td className="px-3 py-2">{r.expiration_risk}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatDate(r.completed_at)}</td>
                    <td className="px-3 py-2">
                      <Link href={`/admin/leads/${r.session_id}`} className="font-medium text-midnight-navy hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="px-3 py-8 text-center text-charcoal/60">No leads found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-charcoal/70">
            <span>{filtered.length} lead{filtered.length === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-md border border-light-gray px-3 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <span>Page {safePage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-md border border-light-gray px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
