"use client";

import { useCallback, useEffect, useState } from "react";
import AiStudioNav from "@/components/admin/AiStudioNav";
import AiStatusBadge from "@/components/admin/AiStatusBadge";
import type { ItemDraft, QualityCheck, DuplicateMatch } from "@/lib/ai/types";

const VIEWS = [["queue", "Open"], ["approved", "Approved"], ["rejected", "Rejected"], ["history", "All"]] as const;

export default function AiReviewQueuePage() {
  const [view, setView] = useState<string>("queue");
  const [rows, setRows] = useState<ItemDraft[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/ai/drafts?view=${view}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else { setRows(j.rows); setErr(null); } })
      .catch(() => setErr("Failed to load."));
  }, [view]);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <AiStudioNav />
      <div className="mb-3 flex gap-1.5">
        {VIEWS.map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 text-sm ${view === v ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>{label}</button>
        ))}
      </div>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err} (Owner + MFA required; run migration 0022 if the tables aren&apos;t set up.)</p>}
      {!err && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No drafts in this view.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Item</th>
                <th className="px-3 py-2 font-semibold">Competency</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Quality</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2"><button onClick={() => setOpen(r.id)} className="text-left font-medium text-midnight-navy hover:underline">{r.item_text}</button>{r.permanent_item_id && <span className="ml-1 font-mono text-[11px] text-sage-green">{r.permanent_item_id}</span>}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.competency_id}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.item_type}{r.reverse_candidate ? " ↺" : ""}</td>
                  <td className="px-3 py-2"><QualityDot status={r.quality_status} /></td>
                  <td className="px-3 py-2"><AiStatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <DraftDrawer id={open} onClose={() => setOpen(null)} onChanged={(m) => { setMsg(m); load(); }} />}
    </div>
  );
}

function QualityDot({ status }: { status: string }) {
  const map: Record<string, string> = { passed: "text-sage-green", review: "text-amber-600", flagged: "text-coral-rose", pending: "text-charcoal/40" };
  return <span className={`text-xs font-semibold uppercase ${map[status] ?? "text-charcoal/40"}`}>{status}</span>;
}

function DraftDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: (msg: string) => void }) {
  const [data, setData] = useState<{ draft: ItemDraft; checks: QualityCheck[]; sources: { source_entity_type: string; source_entity_id: string }[]; duplicates: DuplicateMatch[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/ai/drafts/${id}`).then((r) => r.json()).then(setData).catch(() => setErr("Failed to load."));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function act(action: string, needsNote?: boolean) {
    let notes: string | null = null;
    if (needsNote) notes = window.prompt(action === "reject" ? "Reason for rejecting:" : "Notes:") ?? "";
    if (action === "approve" && !window.confirm("Approve this item? It will get a permanent Item ID and enter the Item Bank.")) return;
    setBusy(true); setErr(null);
    const res = await fetch(`/api/admin/ai/drafts/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, notes }) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Failed."); return; }
    onChanged(action === "approve" ? `Approved → ${d.permanent_item_id} added to the Item Bank.` : `Marked ${action.replace(/_/g, " ")}.`);
    onClose();
  }

  async function aiReview() {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/admin/ai/drafts/${id}/review`, { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "AI review failed."); return; }
    load();
  }

  const draft = data?.draft;
  const failed = (data?.checks ?? []).filter((c) => !c.passed);
  const passed = (data?.checks ?? []).filter((c) => c.passed);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-midnight-navy">Review item draft</h2>
          <button onClick={onClose} className="text-sm text-charcoal/50 hover:text-midnight-navy">Close ✕</button>
        </div>
        {!data && <p className="text-sm text-charcoal/60">Loading…</p>}
        {draft && (
          <>
            <div className="mb-3 flex items-center gap-2"><AiStatusBadge status={draft.status} /><span className="text-xs text-charcoal/50">{draft.item_type}{draft.reverse_candidate ? " · reverse" : ""} · {draft.competency_id}</span></div>
            <p className="rounded-md border border-light-gray bg-light-gray/40 p-3 text-[15px] text-charcoal">{draft.item_text}</p>
            {draft.face_validity_rationale && <p className="mt-2 text-xs text-charcoal/60"><strong>Rationale:</strong> {draft.face_validity_rationale}</p>}
            <p className="mt-1 text-xs text-charcoal/50">Traces to: {draft.behavioral_indicator_id ?? "—"} · response model {draft.response_model_id} · reading {draft.reading_level}</p>

            <section className="mt-4">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Quality checks</h3>
              {failed.length === 0 && passed.length === 0 && <p className="text-sm text-charcoal/50">No checks yet.</p>}
              {failed.map((c) => (
                <div key={c.id} className="mt-1 rounded border-l-2 border-coral-rose bg-coral-rose/5 px-2 py-1 text-xs">
                  <span className="font-semibold uppercase text-coral-rose">{c.severity} · {c.check_type}</span> — {c.finding} <span className="text-charcoal/60">→ {c.recommendation}</span>
                </div>
              ))}
              {passed.length > 0 && <p className="mt-2 text-xs text-sage-green">{passed.length} check(s) passed.</p>}
              <button onClick={aiReview} disabled={busy} className="mt-2 rounded-md border border-dusty-plum px-3 py-1 text-xs font-medium text-dusty-plum disabled:opacity-50">Run AI quality review</button>
            </section>

            {data.duplicates.length > 0 && (
              <section className="mt-4">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Possible duplicates</h3>
                {data.duplicates.map((d, i) => (
                  <div key={i} className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900"><span className="font-semibold">{Math.round(d.similarity * 100)}%</span> ({d.source}) — {d.text}</div>
                ))}
              </section>
            )}

            <section className="mt-4">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Sources</h3>
              <p className="text-xs text-charcoal/60">{(data.sources ?? []).map((s) => s.source_entity_id).filter(Boolean).join(", ") || "—"}</p>
            </section>

            {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}

            {["draft", "in_review", "changes_requested"].includes(draft.status) && (
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => act("approve")} disabled={busy} className="rounded-md bg-sage-green px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Approve → Item Bank</button>
                <button onClick={() => act("request_changes", true)} disabled={busy} className="rounded-md border border-midnight-navy px-3 py-2 text-sm text-midnight-navy disabled:opacity-50">Request changes</button>
                <button onClick={() => act("reject", true)} disabled={busy} className="rounded-md border border-coral-rose px-3 py-2 text-sm text-coral-rose disabled:opacity-50">Reject</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
