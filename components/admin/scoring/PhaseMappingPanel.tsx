"use client";

import { useCallback, useEffect, useState } from "react";
import { STRUCTURAL_MARKERS } from "@/lib/studioScoring";
import { PHASE_SLUGS } from "@/lib/studioAssessment";

const INP = "rounded-md border border-light-gray px-2 py-1 text-sm";
type Row = { id: string; item_id: string; response_option_id: string; phase_code: string; score_value: number | null; structural_context_condition: string | null };

export default function PhaseMappingPanel() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [f, setF] = useState({ item_id: "", response_option_id: "", phase_code: String(PHASE_SLUGS[0]), score_value: "3", structural_context_condition: "*" });
  const load = useCallback(() => { fetch("/api/admin/studio/scoring/phase-mappings").then((r) => r.json()).then((d) => setRows(d.rows ?? [])).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!f.item_id.trim() || !f.response_option_id.trim()) return;
    const res = await fetch("/api/admin/studio/scoring/phase-mappings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, score_value: Number(f.score_value), structural_context_condition: f.structural_context_condition === "*" ? null : f.structural_context_condition }) });
    if (res.ok) { setF((x) => ({ ...x, item_id: "", response_option_id: "" })); load(); }
  }
  async function del(id: string) { const res = await fetch(`/api/admin/studio/scoring/phase-mappings?id=${id}`, { method: "DELETE" }); if (res.ok) load(); }

  return (
    <div>
      <p className="mb-3 text-sm text-charcoal/60">Explicit <strong>response-option → canonical phase code</strong> mappings for phase-anchored items. Stored explicitly; later phases are not automatically healthier.</p>
      <div className="mb-4 flex flex-wrap items-end gap-2 rounded-md border border-light-gray p-3">
        <label className="text-xs text-charcoal/70">Item ID<input value={f.item_id} onChange={(e) => setF((x) => ({ ...x, item_id: e.target.value }))} className={`${INP} mt-0.5 block w-40`} /></label>
        <label className="text-xs text-charcoal/70">Response option<input value={f.response_option_id} onChange={(e) => setF((x) => ({ ...x, response_option_id: e.target.value }))} className={`${INP} mt-0.5 block w-32`} /></label>
        <label className="text-xs text-charcoal/70">Phase code<select value={f.phase_code} onChange={(e) => setF((x) => ({ ...x, phase_code: e.target.value }))} className={`${INP} mt-0.5 block`}>{PHASE_SLUGS.map((p) => <option key={p}>{p}</option>)}</select></label>
        <label className="text-xs text-charcoal/70">Score<input value={f.score_value} onChange={(e) => setF((x) => ({ ...x, score_value: e.target.value }))} className={`${INP} mt-0.5 block w-16`} /></label>
        <label className="text-xs text-charcoal/70">Context<select value={f.structural_context_condition} onChange={(e) => setF((x) => ({ ...x, structural_context_condition: e.target.value }))} className={`${INP} mt-0.5 block`}><option value="*">Any</option>{STRUCTURAL_MARKERS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <button onClick={add} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white">Add</button>
      </div>
      {!rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows?.length === 0 && <p className="text-sm text-charcoal/60">No phase-option mappings yet.</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal"><th className="px-3 py-1">Item</th><th className="px-3 py-1">Option</th><th className="px-3 py-1">Phase</th><th className="px-3 py-1">Score</th><th className="px-3 py-1">Context</th><th className="px-3 py-1"></th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}><td className="px-3 py-1 font-mono text-xs">{r.item_id}</td><td className="px-3 py-1">{r.response_option_id}</td><td className="px-3 py-1">{r.phase_code}</td><td className="px-3 py-1">{r.score_value ?? "—"}</td><td className="px-3 py-1">{r.structural_context_condition ?? "Any"}</td><td className="px-3 py-1"><button onClick={() => del(r.id)} className="text-coral-rose">✕</button></td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
