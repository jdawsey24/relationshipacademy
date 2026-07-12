"use client";

import { useCallback, useEffect, useState } from "react";
import StudioTabs from "@/components/admin/StudioTabs";
import AssessmentNav from "@/components/admin/AssessmentNav";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { REC_TRIGGER_TYPES, type ResultRecommendation } from "@/lib/studioAssets";
import { STATUS_LABELS, type StudioStatus } from "@/lib/studio";

const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";
const emptyRec = (): Partial<ResultRecommendation> => ({ trigger_type: "Domain Low", trigger_value: "", recommendation_text: "", next_step: "", status: "draft" });

export default function ResultRecommendationsPage() {
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";
  const [rows, setRows] = useState<ResultRecommendation[] | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<ResultRecommendation> | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/studio/result-recommendations")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function importLive() {
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/studio/result-recommendations/sync", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(`Imported ${d.added} live recommendation(s).`); load();
  }

  async function publish() {
    if (!window.confirm("Publish to LIVE?\n\nThis replaces what the public assessment results page shows with your APPROVED/PUBLISHED recommendations. Real assessment-takers will see this immediately.")) return;
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/studio/result-recommendations/publish", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(`Published ${d.published} recommendation(s) to live.`); load();
  }

  async function del(id: string) {
    if (!window.confirm("Delete this recommendation? (Does not affect live until you publish.)")) return;
    const res = await fetch(`/api/admin/studio/result-recommendations/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg("Deleted."); load(); } else { const d = await res.json().catch(() => ({})); setMsg(d.error ?? "Failed."); }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Result Recommendations — the “What’s Next” block on the live assessment results page.</p>
      <StudioTabs />
      <AssessmentNav />

      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        This is the <strong>live consumer surface</strong>. Edits here are drafts; only <strong>Publish to live</strong> (owner) changes what real assessment-takers see. Supported triggers: {REC_TRIGGER_TYPES.map((t) => t.value).join(", ")}.
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {canWrite && <button onClick={() => setEditing(emptyRec())} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white">New recommendation</button>}
        {canWrite && <button onClick={importLive} disabled={busy} className="rounded-md border border-midnight-navy px-3 py-1.5 text-sm text-midnight-navy disabled:opacity-50">Import from live</button>}
        {isOwner && <button onClick={publish} disabled={busy} className="rounded-md bg-sage-green px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">Publish to live</button>}
      </div>

      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {error && <p className="text-sm text-coral-rose">Failed to load. If the table isn&apos;t set up yet, run migration 0020_studio_assets.sql.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No recommendations yet. Click “Import from live” to pull in what&apos;s currently on the results page, or add a new one.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Trigger</th>
                <th className="px-3 py-2 font-semibold">Recommendation</th>
                <th className="px-3 py-2 font-semibold">Next step</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 whitespace-nowrap"><span className="font-medium">{r.trigger_type}</span><span className="block text-[11px] text-charcoal/50">{r.trigger_value}</span></td>
                  <td className="px-3 py-2 text-charcoal/70">{r.recommendation_text}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.next_step}</td>
                  <td className="px-3 py-2"><StudioStatusBadge status={r.status} /></td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button onClick={() => setEditing(r)} className="font-medium text-midnight-navy hover:underline">{canWrite ? "Edit" : "View"}</button>
                    {isOwner && <button onClick={() => del(r.id)} className="ml-3 text-coral-rose hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <RecEditor draft={editing} canWrite={canWrite} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function RecEditor({ draft, canWrite, onClose, onSaved }: { draft: Partial<ResultRecommendation>; canWrite: boolean; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Partial<ResultRecommendation>>(draft);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isNew = !draft.id;
  const set = (k: keyof ResultRecommendation, v: unknown) => setD((p) => ({ ...p, [k]: v }));
  const hint = REC_TRIGGER_TYPES.find((t) => t.value === d.trigger_type)?.hint;

  async function save() {
    if (!d.trigger_type || !d.trigger_value?.trim()) { setErr("Trigger type and value are required."); return; }
    setBusy(true); setErr(null);
    const res = await fetch(isNew ? "/api/admin/studio/result-recommendations" : `/api/admin/studio/result-recommendations/${d.id}`, {
      method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger_type: d.trigger_type, trigger_value: d.trigger_value, recommendation_text: d.recommendation_text, next_step: d.next_step, notes: d.notes, status: d.status }),
    });
    const r = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(r.error ?? "Failed."); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 text-lg font-semibold text-midnight-navy">{isNew ? "New recommendation" : "Edit recommendation"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-charcoal">Trigger type
            <select disabled={!canWrite} value={d.trigger_type ?? ""} onChange={(e) => set("trigger_type", e.target.value)} className={`${INP} mt-1 w-full`}>
              {REC_TRIGGER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Trigger value<input disabled={!canWrite} value={d.trigger_value ?? ""} onChange={(e) => set("trigger_value", e.target.value)} className={`${INP} mt-1 w-full`} /></label>
        </div>
        {hint && <p className="mt-1 text-xs text-charcoal/50">{hint}</p>}
        <label className="mt-3 block text-sm font-medium text-charcoal">Recommendation text<textarea disabled={!canWrite} value={d.recommendation_text ?? ""} onChange={(e) => set("recommendation_text", e.target.value)} rows={2} className={`${INP} mt-1 w-full`} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Next step<textarea disabled={!canWrite} value={d.next_step ?? ""} onChange={(e) => set("next_step", e.target.value)} rows={2} className={`${INP} mt-1 w-full`} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Status
          <select disabled={!canWrite} value={d.status ?? "draft"} onChange={(e) => set("status", e.target.value as StudioStatus)} className={`${INP} mt-1 w-full`}>
            {(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </label>
        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Cancel</button>
          {canWrite && <button onClick={save} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>}
        </div>
      </div>
    </div>
  );
}
