"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudioTabs from "@/components/admin/StudioTabs";
import AssessmentNav from "@/components/admin/AssessmentNav";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { ASSESSMENT_TABLES, STATUS_LABELS, isAssessmentTableKey, type StudioStatus } from "@/lib/studioAssessment";

type Row = Record<string, unknown>;
const CONTROL = ["created_at", "updated_at", "updated_by"];
const LABEL_KEYS = ["name", "score_name", "rule_name", "section_name", "recommendation_name", "value"];
const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function AssessmentSubEditorPage() {
  const params = useParams<{ table: string }>();
  const key = params.table;
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);

  const valid = isAssessmentTableKey(key);
  const cfg = valid ? ASSESSMENT_TABLES[key] : null;

  const load = useCallback(() => {
    if (!valid) return;
    fetch(`/api/admin/studio/assessment/${key}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, [key, valid]);
  useEffect(() => { load(); }, [load]);

  if (!valid || !cfg) {
    return <div><StudioTabs /><AssessmentNav /><p className="text-sm text-coral-rose">Unknown section.</p></div>;
  }

  function labelFor(r: Row): string {
    for (const k of LABEL_KEYS) if (r[k]) return String(r[k]);
    return "—";
  }

  async function del(id: string) {
    if (!window.confirm("Delete this record?")) return;
    const res = await fetch(`/api/admin/studio/assessment/${key}/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) { setMsg("Deleted."); load(); } else { const d = await res.json().catch(() => ({})); setMsg(d.error ?? "Failed."); }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">{cfg.label}. Edit and govern — approving/publishing is owner-only.</p>
      <StudioTabs />
      <AssessmentNav />

      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {error && <p className="text-sm text-coral-rose">Failed to load. Run migration 0018 + the importer.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No records yet.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">ID</th>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={String(r[cfg.pk])} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 font-mono text-[12px] text-charcoal/60">{String(r[cfg.pk])}</td>
                  <td className="px-3 py-2 font-medium">{labelFor(r)}</td>
                  <td className="px-3 py-2"><StudioStatusBadge status={String(r.status ?? "draft")} /></td>
                  <td className="px-3 py-2">
                    <button onClick={() => setEditing(r)} className="font-medium text-midnight-navy hover:underline">{canWrite ? "Edit" : "View"}</button>
                    {isOwner && <button onClick={() => del(String(r[cfg.pk]))} className="ml-3 text-coral-rose hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <RowEditor tableKey={key} pk={cfg.pk} row={editing} canWrite={canWrite} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function RowEditor({ tableKey, pk, row, canWrite, onClose, onSaved }: { tableKey: string; pk: string; row: Row; canWrite: boolean; onClose: () => void; onSaved: () => void }) {
  // Editable string form of each field; jsonb/object fields shown as JSON text.
  const initial: Record<string, string> = {};
  const jsonKeys = new Set<string>();
  for (const [k, v] of Object.entries(row)) {
    if (k === pk || CONTROL.includes(k)) continue;
    if (v !== null && typeof v === "object") { initial[k] = JSON.stringify(v, null, 1); jsonKeys.add(k); }
    else initial[k] = v == null ? "" : String(v);
  }
  const [vals, setVals] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const keys = Object.keys(initial);

  async function save() {
    setBusy(true); setErr(null);
    const payload: Record<string, unknown> = {};
    for (const k of keys) {
      if (jsonKeys.has(k)) {
        try { payload[k] = vals[k].trim() ? JSON.parse(vals[k]) : []; }
        catch { setErr(`"${k}" is not valid JSON.`); setBusy(false); return; }
      } else if (k === "section_order") {
        payload[k] = vals[k] === "" ? null : Number(vals[k]);
      } else {
        payload[k] = vals[k] === "" ? null : vals[k];
      }
    }
    const res = await fetch(`/api/admin/studio/assessment/${tableKey}/${encodeURIComponent(String(row[pk]))}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Failed."); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 font-mono text-sm font-semibold text-midnight-navy">{String(row[pk])}</h3>
        <div className="space-y-3">
          {keys.map((k) => (
            <label key={k} className="block text-sm font-medium text-charcoal">
              {k.replace(/_/g, " ")}
              {k === "status" ? (
                <select disabled={!canWrite} value={vals[k]} onChange={(e) => setVals((s) => ({ ...s, [k]: e.target.value }))} className={`${INP} mt-1 w-full`}>
                  {(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              ) : (vals[k].length > 60 || jsonKeys.has(k)) ? (
                <textarea disabled={!canWrite} value={vals[k]} onChange={(e) => setVals((s) => ({ ...s, [k]: e.target.value }))} rows={jsonKeys.has(k) ? 4 : 2} className={`${INP} mt-1 w-full ${jsonKeys.has(k) ? "font-mono text-[12px]" : ""}`} />
              ) : (
                <input disabled={!canWrite} value={vals[k]} onChange={(e) => setVals((s) => ({ ...s, [k]: e.target.value }))} className={`${INP} mt-1 w-full`} />
              )}
            </label>
          ))}
        </div>
        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Close</button>
          {canWrite && <button onClick={save} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>}
        </div>
      </div>
    </div>
  );
}
