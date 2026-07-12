"use client";

import { useCallback, useEffect, useState } from "react";
import StudioTabs from "@/components/admin/StudioTabs";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { AUDIENCES, type KbCompetency } from "@/lib/studio";

const KINDS = ["phase", "domain", "competency"];
const emptyDraft = (): Partial<KbCompetency> => ({
  name: "", kind: "competency", code: "", phase_slug: "", domain_slug: "", competency_phase_slug: "",
  definition: "", developmental_task: "", healthy_markers: [], common_challenges: [], growth_indicators: [],
  audiences: ["consumer"], status: "active", source_ref: "", notes: "", sort_order: 0,
});

export default function KbBrowserPage() {
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";
  const [rows, setRows] = useState<KbCompetency[] | null>(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState({ kind: "", status: "" });
  const [editing, setEditing] = useState<Partial<KbCompetency> | null>(null);

  const load = useCallback(() => {
    const qs = new URLSearchParams();
    if (filter.kind) qs.set("kind", filter.kind);
    if (filter.status) qs.set("status", filter.status);
    fetch(`/api/admin/studio/kb?${qs.toString()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  async function del(id: string) {
    if (!window.confirm("Delete this competency? Retiring it (status → retired) is usually safer.")) return;
    const res = await fetch(`/api/admin/studio/kb/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">The RLC Knowledge Base — the source of truth. Only <strong>active</strong> records are eligible source material for AI drafts.</p>
      <StudioTabs />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={filter.kind} onChange={(e) => setFilter((f) => ({ ...f, kind: e.target.value }))} className="rounded-md border border-light-gray px-2 py-1.5 text-sm">
          <option value="">All kinds</option>
          {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))} className="rounded-md border border-light-gray px-2 py-1.5 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="retired">Retired</option>
        </select>
        {canWrite && <button onClick={() => setEditing(emptyDraft())} className="ml-auto rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-midnight-navy/90">New competency</button>}
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load. If the Studio tables aren&apos;t set up yet, run migration 0017_studio.sql.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No competencies match.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Kind</th>
                <th className="px-3 py-2 font-semibold">Scope</th>
                <th className="px-3 py-2 font-semibold">Audiences</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 font-medium">{r.name}{r.code && <span className="ml-1 text-xs text-charcoal/40">{r.code}</span>}</td>
                  <td className="px-3 py-2 capitalize">{r.kind}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.phase_slug || r.domain_slug || r.competency_phase_slug || "—"}</td>
                  <td className="px-3 py-2 text-charcoal/60">{(r.audiences ?? []).join(", ") || "—"}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${r.status === "active" ? "bg-sage-green/20 text-sage-green" : "bg-light-gray text-charcoal/50"}`}>{r.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    {canWrite && <button onClick={() => setEditing(r)} className="font-medium text-midnight-navy hover:underline">Edit</button>}
                    {isOwner && <button onClick={() => del(r.id!)} className="ml-3 text-coral-rose hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <KbEditor draft={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function listToText(v: string[] | undefined) { return (v ?? []).join("\n"); }
function textToList(t: string) { return t.split("\n").map((x) => x.trim()).filter(Boolean); }

function KbEditor({ draft, onClose, onSaved }: { draft: Partial<KbCompetency>; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Partial<KbCompetency>>(draft);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isNew = !draft.id;
  const set = (k: keyof KbCompetency, v: unknown) => setD((p) => ({ ...p, [k]: v }));

  async function save() {
    if (!d.name?.trim()) { setErr("Name is required."); return; }
    setBusy(true); setErr(null);
    const payload = { ...d };
    const res = await fetch(isNew ? "/api/admin/studio/kb" : `/api/admin/studio/kb/${d.id}`, {
      method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        <h3 className="mb-3 text-lg font-semibold text-midnight-navy">{isNew ? "New competency" : "Edit competency"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-charcoal">Name<input value={d.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inp} /></label>
          <label className="block text-sm font-medium text-charcoal">Kind
            <select value={d.kind ?? "competency"} onChange={(e) => set("kind", e.target.value)} className={inp}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
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
