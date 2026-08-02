"use client";

import { useEffect, useState } from "react";
import type { SnapshotLead, SessionDetail } from "@/lib/snapshot/leads";

// In-app view of Snapshot leads (converted sessions with a captured email). Gives
// visibility independent of GoHighLevel, which was previously the only window.
// Each row drills into exactly how that person answered (the "Answers" panel).
export function SnapshotLeadsView() {
  const [leads, setLeads] = useState<SnapshotLead[] | null>(null);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

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
                <th className="px-4 py-2.5 font-medium">Details</th>
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
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <button onClick={() => setOpenId(l.sessionId)} className="font-medium text-midnight-navy hover:underline">Answers</button>
                    <a href={l.resultsUrl} target="_blank" rel="noopener noreferrer" className="ml-3 text-charcoal/55 hover:underline">Results ↗</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openId && <AnswersDrawer sessionId={openId} fmt={fmt} onClose={() => setOpenId(null)} />}
    </div>
  );
}

// Slide-over panel: exactly how this respondent answered, question by question.
function AnswersDrawer({ sessionId, fmt, onClose }: { sessionId: string; fmt: (iso: string | null) => string; onClose: () => void }) {
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/admin/snapshot/session/${sessionId}`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => { if (alive) setDetail(d as SessionDetail); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [sessionId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/40" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-midnight-navy">How they answered</h2>
          <button onClick={onClose} className="rounded-md p-1 text-charcoal/50 hover:bg-charcoal/5" aria-label="Close">✕</button>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-coral-rose">Failed to load this session.</p>
        ) : !detail ? (
          <p className="mt-6 text-sm text-charcoal/60">Loading…</p>
        ) : (
          <>
            <div className="mt-4 rounded-lg border border-charcoal/10 bg-charcoal/[0.02] p-4 text-sm">
              <p className="text-charcoal"><span className="text-charcoal/55">Email:</span> {detail.email ?? "—"}</p>
              <p className="mt-1 text-charcoal"><span className="text-charcoal/55">Situation:</span> {detail.assessment}</p>
              <p className="mt-1 text-charcoal"><span className="text-charcoal/55">Result:</span> {detail.primaryCluster || "—"}
                {detail.secondaryCluster && <span className="text-charcoal/55"> (also: {detail.secondaryCluster})</span>}
                {detail.lowConfidence && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-amber-700">low conf.</span>}
                {detail.tied && <span className="ml-2 rounded bg-charcoal/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-charcoal/60">tied</span>}
              </p>
              <p className="mt-1 text-charcoal/55">Captured {fmt(detail.convertedAt)}</p>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-charcoal/50">Answers ({detail.answers.length})</p>
            <ol className="mt-3 space-y-3">
              {detail.answers.map((ans) => (
                <li key={ans.questionOrder} className="border-b border-charcoal/10 pb-3 last:border-0">
                  <div className="flex gap-2.5">
                    <span className="shrink-0 text-xs font-semibold text-charcoal/40">Q{ans.questionOrder}</span>
                    {ans.isNeutral ? (
                      <span className="text-sm italic text-charcoal/45">None of these fit</span>
                    ) : (
                      <div>
                        <p className="text-sm text-charcoal">{ans.statement}</p>
                        {ans.cluster && <p className="mt-0.5 text-xs text-charcoal/50">→ {ans.cluster}</p>}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <a href={detail.resultsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm text-midnight-navy hover:underline">
              Open the consumer results page ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}
