"use client";

import { useEffect, useMemo, useState } from "react";

interface AuditRow {
  id: string;
  actor: string | null;
  action: string;
  target: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditPage() {
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [ready, setReady] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setRows(d.rows); setReady(d.ready !== false); })
      .catch(() => setError(true));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows ?? [];
    return (rows ?? []).filter((r) =>
      [r.actor, r.action, r.target, JSON.stringify(r.metadata)]
        .some((v) => (v ?? "").toString().toLowerCase().includes(q))
    );
  }, [rows, search]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Audit Log</h1>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
        Append-only record of administrator actions. Newest first (latest 300).
      </p>

      {rows && rows.length > 0 && (
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search actor, action, or target…"
          className="mb-4 h-10 w-full max-w-md rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
        />
      )}

      {error && <p className="text-sm text-coral-rose">Failed to load the audit log.</p>}
      {!error && !ready && rows && rows.length === 0 && (
        <p className="text-sm text-charcoal/60">The audit_log table isn&apos;t set up yet. Run the 0008_audit_log migration.</p>
      )}
      {!error && ready && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {!error && ready && rows && rows.length === 0 && (
        <p className="text-sm text-charcoal/60">No admin actions recorded yet.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
              <th className="px-3 py-2 font-semibold">When</th>
              <th className="px-3 py-2 font-semibold">Actor</th>
              <th className="px-3 py-2 font-semibold">Action</th>
              <th className="px-3 py-2 font-semibold">Target</th>
              <th className="px-3 py-2 font-semibold">Details</th>
            </tr></thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 whitespace-nowrap text-charcoal/70">{fmt(r.created_at)}</td>
                  <td className="px-3 py-2">{r.actor || "—"}</td>
                  <td className="px-3 py-2"><span className="rounded bg-midnight-navy/10 px-2 py-0.5 font-ui text-[12px] text-midnight-navy">{r.action}</span></td>
                  <td className="px-3 py-2 max-w-[220px] truncate" title={r.target ?? ""}>{r.target || "—"}</td>
                  <td className="px-3 py-2 font-ui text-[12px] text-charcoal/60">
                    {r.metadata && Object.keys(r.metadata).length > 0 ? JSON.stringify(r.metadata) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
