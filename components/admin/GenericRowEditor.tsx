"use client";

import { useState } from "react";
import { STATUS_LABELS, type StudioStatus } from "@/lib/studio";

// Reusable modal that edits an arbitrary Studio row: renders each column as a
// field (jsonb/object columns as JSON text), a status dropdown, and PATCHes to
// `${apiBase}/${id}`. Used by the Learning Library browser. Owner-only status
// transitions are enforced server-side (guardForBody).
type Row = Record<string, unknown>;
const CONTROL = ["created_at", "updated_at", "updated_by"];
const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function GenericRowEditor({
  apiBase, pk, row, canWrite, onClose, onSaved,
}: { apiBase: string; pk: string; row: Row; canWrite: boolean; onClose: () => void; onSaved: () => void }) {
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
        try { payload[k] = vals[k].trim() ? JSON.parse(vals[k]) : {}; }
        catch { setErr(`"${k}" is not valid JSON.`); setBusy(false); return; }
      } else {
        payload[k] = vals[k] === "" ? null : vals[k];
      }
    }
    const res = await fetch(`${apiBase}/${encodeURIComponent(String(row[pk]))}`, {
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
                <textarea disabled={!canWrite} value={vals[k]} onChange={(e) => setVals((s) => ({ ...s, [k]: e.target.value }))} rows={jsonKeys.has(k) ? 5 : 2} className={`${INP} mt-1 w-full ${jsonKeys.has(k) ? "font-mono text-[12px]" : ""}`} />
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
