"use client";

import { useState } from "react";
import { AUDIENCES, type KbCompetency } from "@/lib/studio";

// Raw editor for a Framework record (kb_competencies). Extracted from the old
// flat Knowledge Base page so it can be reused from the Competency Workspace
// Overview — the Framework is the canonical source of truth, edited in place.

export const KB_KINDS = ["phase", "domain", "competency"];

export const emptyKbDraft = (): Partial<KbCompetency> => ({
  name: "", kind: "competency", code: "", phase_slug: "", domain_slug: "", competency_phase_slug: "",
  definition: "", developmental_task: "", healthy_markers: [], common_challenges: [], growth_indicators: [],
  audiences: ["consumer"], status: "active", source_ref: "", notes: "", sort_order: 0,
});

function listToText(v: string[] | undefined) { return (v ?? []).join("\n"); }
function textToList(t: string) { return t.split("\n").map((x) => x.trim()).filter(Boolean); }

export default function KbRecordEditor({ draft, onClose, onSaved }: { draft: Partial<KbCompetency>; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Partial<KbCompetency>>(draft);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isNew = !draft.id;
  const set = (k: keyof KbCompetency, v: unknown) => setD((p) => ({ ...p, [k]: v }));

  async function save() {
    if (!d.name?.trim()) { setErr("Name is required."); return; }
    setBusy(true); setErr(null);
    const res = await fetch(isNew ? "/api/admin/studio/kb" : `/api/admin/studio/kb/${d.id}`, {
      method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...d }),
    });
    const r = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(r.error ?? "Failed to save."); return; }
    onSaved();
  }

  const inp = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 text-lg font-semibold text-midnight-navy">{isNew ? "New Framework record" : "Edit Framework record"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-charcoal">Name<input value={d.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inp} /></label>
          <label className="block text-sm font-medium text-charcoal">Kind
            <select value={d.kind ?? "competency"} onChange={(e) => set("kind", e.target.value)} className={inp}>{KB_KINDS.map((k) => <option key={k}>{k}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Code<input value={d.code ?? ""} onChange={(e) => set("code", e.target.value)} className={inp} /></label>
          <label className="block text-sm font-medium text-charcoal">Status
            <select value={d.status ?? "active"} onChange={(e) => set("status", e.target.value)} className={inp}><option value="active">Active</option><option value="retired">Retired</option></select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Phase slug<input value={d.phase_slug ?? ""} onChange={(e) => set("phase_slug", e.target.value)} className={inp} /></label>
          <label className="block text-sm font-medium text-charcoal">Domain slug<input value={d.domain_slug ?? ""} onChange={(e) => set("domain_slug", e.target.value)} className={inp} /></label>
        </div>
        <label className="mt-3 block text-sm font-medium text-charcoal">Definition<textarea value={d.definition ?? ""} onChange={(e) => set("definition", e.target.value)} rows={2} className={inp} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Developmental task<input value={d.developmental_task ?? ""} onChange={(e) => set("developmental_task", e.target.value)} className={inp} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Healthy markers <span className="font-normal text-charcoal/50">(one per line)</span><textarea value={listToText(d.healthy_markers)} onChange={(e) => set("healthy_markers", textToList(e.target.value))} rows={2} className={inp} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Common challenges <span className="font-normal text-charcoal/50">(one per line)</span><textarea value={listToText(d.common_challenges)} onChange={(e) => set("common_challenges", textToList(e.target.value))} rows={2} className={inp} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Growth indicators <span className="font-normal text-charcoal/50">(one per line)</span><textarea value={listToText(d.growth_indicators)} onChange={(e) => set("growth_indicators", textToList(e.target.value))} rows={2} className={inp} /></label>
        <div className="mt-3 text-sm font-medium text-charcoal">Audiences</div>
        <div className="mt-1 flex flex-wrap gap-3">
          {AUDIENCES.map((a) => (
            <label key={a.value} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={(d.audiences ?? []).includes(a.value)} onChange={(e) => set("audiences", e.target.checked ? [...(d.audiences ?? []), a.value] : (d.audiences ?? []).filter((x) => x !== a.value))} />
              {a.value}
            </label>
          ))}
        </div>
        <label className="mt-3 block text-sm font-medium text-charcoal">Notes<textarea value={d.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} className={inp} /></label>
        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
