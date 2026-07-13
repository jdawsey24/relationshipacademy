"use client";

import { useCallback, useEffect, useState } from "react";

const INP = "rounded-md border border-light-gray px-2 py-1 text-sm";
type Band = { label: string; min: number; max: number; interpretation?: string };
type Rule = { scoring_rule_id: string; score_name: string | null; level: string | null; min_valid_responses: string | null; cut_points: Band[]; cut_points_status: string | null; formula_type: string | null };
type Input = { id: string; input_type: string; input_id: string; weight: number; reverse_scored: boolean; required: boolean };

export default function RulesBandsPanel() {
  const [rules, setRules] = useState<Rule[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/studio/scoring/rules").then((r) => r.json().then((j) => ({ ok: r.ok, j }))).then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else setRules(j.rows); }).catch(() => setErr("Failed."));
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <p className="mb-3 text-sm text-charcoal/60">Author the <strong>provisional</strong> cut-points (bands) and inputs the engine uses. Bands: min/max on the 1–5 scale. Nothing is validated until you approve the simulation.</p>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err} (Run migration 0026 if the scoring tables aren&apos;t set up.)</p>}
      {!err && !rules && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rules && rules.length === 0 && <p className="text-sm text-charcoal/60">No scoring rules. Import or create them in the Assessment sub-editors.</p>}
      {rules?.map((r) => (
        <div key={r.scoring_rule_id} className="mb-2 rounded-md border border-light-gray p-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-midnight-navy">{r.score_name ?? r.scoring_rule_id}</span>
            <span className="rounded bg-light-gray px-2 py-0.5 text-[11px] text-charcoal/60">{r.level ?? "—"}</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] uppercase text-amber-800">{r.cut_points_status ?? "provisional"}</span>
            <span className="text-xs text-charcoal/40">{(r.cut_points ?? []).length} band(s)</span>
            <button onClick={() => setOpen(open === r.scoring_rule_id ? null : r.scoring_rule_id)} className="ml-auto text-sm text-midnight-navy hover:underline">{open === r.scoring_rule_id ? "Close" : "Edit bands & inputs"}</button>
          </div>
          {open === r.scoring_rule_id && <RuleEditor rule={r} onSaved={(m) => { setMsg(m); load(); }} />}
        </div>
      ))}
    </div>
  );
}

function RuleEditor({ rule, onSaved }: { rule: Rule; onSaved: (m: string) => void }) {
  const [bands, setBands] = useState<Band[]>(rule.cut_points ?? []);
  const [minValid, setMinValid] = useState(rule.min_valid_responses ?? "1");
  const [formulaType, setFormulaType] = useState(rule.formula_type ?? "mean");
  const [inputs, setInputs] = useState<Input[]>([]);
  const [busy, setBusy] = useState(false);
  const [newInput, setNewInput] = useState({ input_type: "item", input_id: "", weight: "1", reverse_scored: false, required: false });

  const loadInputs = useCallback(() => { fetch(`/api/admin/studio/scoring/rules/${rule.scoring_rule_id}/inputs`).then((r) => r.json()).then((d) => setInputs(d.rows ?? [])).catch(() => {}); }, [rule.scoring_rule_id]);
  useEffect(() => { loadInputs(); }, [loadInputs]);

  const setBand = (i: number, k: keyof Band, v: unknown) => setBands((b) => b.map((x, j) => j === i ? { ...x, [k]: k === "min" || k === "max" ? Number(v) : v } : x));

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/admin/studio/assessment/scoring-rules/${rule.scoring_rule_id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cut_points: bands, min_valid_responses: minValid, formula_type: formulaType, cut_points_status: "provisional" }),
    });
    setBusy(false);
    if (res.ok) onSaved("Bands saved (provisional).");
  }
  async function addInput() {
    if (!newInput.input_id.trim()) return;
    await fetch(`/api/admin/studio/scoring/rules/${rule.scoring_rule_id}/inputs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newInput, weight: Number(newInput.weight) || 1 }) });
    setNewInput({ input_type: "item", input_id: "", weight: "1", reverse_scored: false, required: false }); loadInputs();
  }
  async function delInput(id: string) { await fetch(`/api/admin/studio/scoring/rules/${rule.scoring_rule_id}/inputs?inputId=${id}`, { method: "DELETE" }); loadInputs(); }

  return (
    <div className="mt-3 border-t border-light-gray pt-3">
      <div className="mb-2 flex gap-3 text-sm">
        <label>Formula<select value={formulaType} onChange={(e) => setFormulaType(e.target.value)} className={`${INP} ml-1`}><option value="mean">Unweighted mean</option><option value="weighted_mean">Weighted mean</option><option value="composite">Composite</option></select></label>
        <label>Min valid<input value={minValid} onChange={(e) => setMinValid(e.target.value)} className={`${INP} ml-1 w-16`} /></label>
      </div>
      <div className="text-xs font-semibold uppercase text-charcoal/60">Bands (provisional cut-points)</div>
      {bands.map((b, i) => (
        <div key={i} className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
          <input value={b.label} onChange={(e) => setBand(i, "label", e.target.value)} placeholder="Label" className={`${INP} w-32`} />
          <input type="number" step="0.01" value={b.min} onChange={(e) => setBand(i, "min", e.target.value)} className={`${INP} w-16`} />
          <span className="text-charcoal/40">–</span>
          <input type="number" step="0.01" value={b.max} onChange={(e) => setBand(i, "max", e.target.value)} className={`${INP} w-16`} />
          <input value={b.interpretation ?? ""} onChange={(e) => setBand(i, "interpretation", e.target.value)} placeholder="Interpretation" className={`${INP} min-w-[160px] flex-1`} />
          <button onClick={() => setBands((x) => x.filter((_, j) => j !== i))} className="text-coral-rose">✕</button>
        </div>
      ))}
      <button onClick={() => setBands((b) => [...b, { label: "", min: 1, max: 5 }])} className="mt-1 text-xs text-midnight-navy hover:underline">+ Add band</button>

      <div className="mt-3 text-xs font-semibold uppercase text-charcoal/60">Explicit inputs <span className="font-normal normal-case text-charcoal/40">(optional; reverse-scoring is only applied when approved here or on the item)</span></div>
      {inputs.map((i) => <div key={i.id} className="mt-1 flex items-center gap-2 text-xs"><span>{i.input_type}: {i.input_id} · w{i.weight}{i.reverse_scored ? " · reverse" : ""}{i.required ? " · required" : ""}</span><button onClick={() => delInput(i.id)} className="text-coral-rose">✕</button></div>)}
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
        <select value={newInput.input_type} onChange={(e) => setNewInput((n) => ({ ...n, input_type: e.target.value }))} className={INP}><option value="item">item</option><option value="behavioral_indicator">indicator</option><option value="competency">competency</option><option value="domain">domain</option></select>
        <input value={newInput.input_id} onChange={(e) => setNewInput((n) => ({ ...n, input_id: e.target.value }))} placeholder="input id" className={`${INP} w-32`} />
        <input value={newInput.weight} onChange={(e) => setNewInput((n) => ({ ...n, weight: e.target.value }))} className={`${INP} w-14`} />
        <label className="flex items-center gap-1"><input type="checkbox" checked={newInput.reverse_scored} onChange={(e) => setNewInput((n) => ({ ...n, reverse_scored: e.target.checked }))} />reverse</label>
        <button onClick={addInput} className="rounded border border-midnight-navy px-2 py-0.5 text-midnight-navy">Add input</button>
      </div>

      <button onClick={save} disabled={busy} className="mt-3 rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save bands"}</button>
    </div>
  );
}
