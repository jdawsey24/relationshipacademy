"use client";

import { useEffect, useState } from "react";
import AiStudioNav from "@/components/admin/AiStudioNav";
import { GENERATION_TYPES, type AiSettings } from "@/lib/ai/types";

const INP = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function AiSettingsPage() {
  const [s, setS] = useState<AiSettings | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/admin/ai/settings").then((r) => r.json().then((j) => ({ ok: r.ok, j }))).then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else setS(j.settings); }).catch(() => setErr("Failed."));
  }
  useEffect(load, []);
  const set = (k: keyof AiSettings, v: unknown) => setS((p) => (p ? { ...p, [k]: v } : p));

  async function save() {
    if (!s) return;
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/ai/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg("Saved."); load();
  }

  return (
    <div>
      <AiStudioNav />
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err}</p>}
      {!err && !s && <p className="text-sm text-charcoal/60">Loading…</p>}
      {s && (
        <div className="max-w-2xl">
          <div className={`mb-5 rounded-md border p-4 ${s.kill_switch_active ? "border-coral-rose bg-coral-rose/5" : "border-light-gray"}`}>
            <label className="flex items-center justify-between">
              <span><span className="font-semibold text-midnight-navy">Kill switch</span><span className="block text-xs text-charcoal/60">When on, all AI generation is paused immediately.</span></span>
              <input type="checkbox" checked={s.kill_switch_active} onChange={(e) => set("kill_switch_active", e.target.checked)} className="h-5 w-5" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-charcoal">Provider
              <select value={s.provider} onChange={(e) => set("provider", e.target.value)} className={INP}>
                <option value="anthropic">Anthropic</option>
                <option value="openai" disabled>OpenAI (later)</option>
              </select>
            </label>
            <label className="text-sm font-medium text-charcoal">Model<input value={s.model} onChange={(e) => set("model", e.target.value)} className={INP} /></label>
            <label className="text-sm font-medium text-charcoal">Output token limit<input type="number" value={s.output_limit} onChange={(e) => set("output_limit", Number(e.target.value))} className={INP} /></label>
            <label className="text-sm font-medium text-charcoal">Timeout (seconds)<input type="number" value={s.timeout_seconds} onChange={(e) => set("timeout_seconds", Number(e.target.value))} className={INP} /></label>
            <label className="text-sm font-medium text-charcoal">Retry limit<input type="number" value={s.retry_limit} onChange={(e) => set("retry_limit", Number(e.target.value))} className={INP} /></label>
            <label className="text-sm font-medium text-charcoal">Daily cost limit ($)<input type="number" value={s.daily_cost_limit_usd} onChange={(e) => set("daily_cost_limit_usd", Number(e.target.value))} className={INP} /></label>
            <label className="text-sm font-medium text-charcoal">Monthly cost limit ($)<input type="number" value={s.monthly_cost_limit_usd} onChange={(e) => set("monthly_cost_limit_usd", Number(e.target.value))} className={INP} /></label>
          </div>

          <div className="mt-4 text-sm font-medium text-charcoal">Enabled generation types</div>
          <div className="mt-1 flex flex-wrap gap-3">
            {GENERATION_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={s.enabled_generation_types.includes(t)} onChange={(e) => set("enabled_generation_types", e.target.checked ? [...s.enabled_generation_types, t] : s.enabled_generation_types.filter((x) => x !== t))} />
                {t}
              </label>
            ))}
          </div>

          {msg && <p className="mt-3 text-sm text-sage-green">{msg}</p>}
          <button onClick={save} disabled={busy} className="mt-4 rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save settings"}</button>
        </div>
      )}
    </div>
  );
}
