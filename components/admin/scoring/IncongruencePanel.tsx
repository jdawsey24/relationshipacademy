"use client";

import { useCallback, useEffect, useState } from "react";
import { STRUCTURAL_MARKERS } from "@/lib/studioScoring";
import { DOMAIN_SLUGS, PHASE_SLUGS } from "@/lib/studioAssessment";
import { useAdminRole } from "@/components/admin/RoleContext";

const INP = "rounded-md border border-light-gray px-2 py-1 text-sm";
type Rule = { id: string; rule_name: string | null; structural_context: string | null; compared_phase: string | null; condition_config: { level?: string; entity?: string; comparator?: string; threshold?: number }; severity: string | null; consumer_language: string | null; validation_status: string };

export default function IncongruencePanel() {
  const isOwner = useAdminRole() === "owner";
  const [rows, setRows] = useState<Rule[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [f, setF] = useState({ rule_name: "", structural_context: "*", level: "phase", entity: "exploration", comparator: ">=", threshold: "4", severity: "info", consumer_language: "" });
  const load = useCallback(() => { fetch("/api/admin/studio/scoring/incongruence").then((r) => r.json()).then((d) => setRows(d.rows ?? [])).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!f.consumer_language.trim()) { setMsg("Consumer language is required."); return; }
    const res = await fetch("/api/admin/studio/scoring/incongruence", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rule_name: f.rule_name, structural_context: f.structural_context, compared_phase: f.entity, condition_config: { level: f.level, entity: f.entity, comparator: f.comparator, threshold: Number(f.threshold) }, severity: f.severity, consumer_language: f.consumer_language }),
    });
    if (res.ok) { setMsg("Rule added (provisional)."); setF((x) => ({ ...x, rule_name: "", consumer_language: "" })); load(); }
  }
  async function del(id: string) { if (!confirm("Delete rule?")) return; const res = await fetch(`/api/admin/studio/scoring/incongruence/${id}`, { method: "DELETE" }); if (res.ok) load(); }

  return (
    <div>
      <p className="mb-3 text-sm text-charcoal/60">Developmental incongruence rules are <strong>rule-based, descriptive flags</strong> (not diagnostic), versioned and provisional. AI cannot create or modify them.</p>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      <div className="mb-4 rounded-md border border-light-gray p-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="text-xs text-charcoal/70">Name<input value={f.rule_name} onChange={(e) => setF((x) => ({ ...x, rule_name: e.target.value }))} className={`${INP} mt-0.5 w-full`} /></label>
          <label className="text-xs text-charcoal/70">Structural context<select value={f.structural_context} onChange={(e) => setF((x) => ({ ...x, structural_context: e.target.value }))} className={`${INP} mt-0.5 w-full`}><option value="*">Any</option>{STRUCTURAL_MARKERS.map((m) => <option key={m}>{m}</option>)}</select></label>
          <label className="text-xs text-charcoal/70">Severity<select value={f.severity} onChange={(e) => setF((x) => ({ ...x, severity: e.target.value }))} className={`${INP} mt-0.5 w-full`}>{["info", "low", "medium", "high"].map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-xs text-charcoal/70">Level<select value={f.level} onChange={(e) => setF((x) => ({ ...x, level: e.target.value }))} className={`${INP} mt-0.5 w-full`}><option value="phase">phase</option><option value="domain">domain</option></select></label>
          <label className="text-xs text-charcoal/70">Entity<select value={f.entity} onChange={(e) => setF((x) => ({ ...x, entity: e.target.value }))} className={`${INP} mt-0.5 w-full`}>{(f.level === "phase" ? PHASE_SLUGS : DOMAIN_SLUGS).map((p) => <option key={p}>{p}</option>)}</select></label>
          <label className="text-xs text-charcoal/70">Condition<div className="mt-0.5 flex gap-1"><select value={f.comparator} onChange={(e) => setF((x) => ({ ...x, comparator: e.target.value }))} className={INP}>{[">=", ">", "<=", "<"].map((c) => <option key={c}>{c}</option>)}</select><input value={f.threshold} onChange={(e) => setF((x) => ({ ...x, threshold: e.target.value }))} className={`${INP} w-16`} /></div></label>
        </div>
        <label className="mt-2 block text-xs text-charcoal/70">Consumer language (descriptive)<input value={f.consumer_language} onChange={(e) => setF((x) => ({ ...x, consumer_language: e.target.value }))} className={`${INP} mt-0.5 w-full`} /></label>
        <button onClick={add} className="mt-2 rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white">Add rule</button>
      </div>

      {!rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows?.length === 0 && <p className="text-sm text-charcoal/60">No incongruence rules yet.</p>}
      {rows?.map((r) => (
        <div key={r.id} className="mb-2 rounded-md border border-light-gray p-2 text-sm">
          <span className="font-medium">{r.rule_name || "(unnamed)"}</span> <span className="text-charcoal/50">· {r.structural_context} · {r.condition_config?.level} {r.condition_config?.entity} {r.condition_config?.comparator} {r.condition_config?.threshold} · {r.severity}</span>
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] uppercase text-amber-800">{r.validation_status}</span>
          <span className="block text-xs text-charcoal/70">{r.consumer_language}</span>
          {isOwner && <button onClick={() => del(r.id)} className="mt-1 text-xs text-coral-rose hover:underline">Delete</button>}
        </div>
      ))}
    </div>
  );
}
