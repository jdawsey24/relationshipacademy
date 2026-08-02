"use client";

import { useEffect, useState } from "react";
import type { SnapshotLead } from "@/lib/snapshot/leads";

// In-app view of Snapshot leads (converted sessions with a captured email). Gives
// visibility independent of GoHighLevel, which was previously the only window.
export function SnapshotLeadsView() {
  const [leads, setLeads] = useState<SnapshotLead[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/snapshot/leads")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => setLeads(d.leads as SnapshotLead[]))
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-coral-rose">Failed to load Snapshot leads.</p>;
  if (!leads) return <p className="text-sm text-charcoal/60">Loading…</p>;

  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  function exportCsv() {
    const header = ["Email", "Captured", "Situation", "Pattern", "Also relates to", "Low confidence", "Results URL"];
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = (leads ?? []).map((l) =>
      [l.email, l.convertedAt ?? "", l.assessment, l.primaryCluster, l.secondaryCluster, l.lowConfidence ? "yes" : "", l.resultsUrl].map(esc).join(","),
    );
    const blob = new Blob([[header.map(esc).join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "snapshot-leads.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-charcoal/70">
          <span className="font-semibold text-charcoal">{leads.length}</span> lead{leads.length === 1 ? "" : "s"} captured
        </p>
        {leads.length > 0 && (
          <button onClick={exportCsv} className="rounded-md border border-charcoal/20 px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-charcoal/5">
            Export CSV
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-charcoal/60">No Snapshot leads captured yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-charcoal/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal/[0.03] text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-4 py-2.5 font-medium">Email</th>
                <th className="px-4 py-2.5 font-medium">Captured</th>
                <th className="px-4 py-2.5 font-medium">Situation</th>
                <th className="px-4 py-2.5 font-medium">Pattern</th>
                <th className="px-4 py-2.5 font-medium">Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {leads.map((l) => (
                <tr key={l.sessionId} className="hover:bg-charcoal/[0.02]">
                  <td className="px-4 py-2.5 font-medium text-charcoal">
                    <a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-charcoal/70">{fmt(l.convertedAt)}</td>
                  <td className="px-4 py-2.5 text-charcoal/70">{l.assessment}</td>
                  <td className="px-4 py-2.5 text-charcoal/70">
                    {l.primaryCluster}
                    {l.lowConfidence && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-amber-700">low conf.</span>}
                    {l.secondaryCluster && <span className="block text-xs text-charcoal/45">also: {l.secondaryCluster}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <a href={l.resultsUrl} target="_blank" rel="noopener noreferrer" className="text-midnight-navy hover:underline">View →</a>
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
