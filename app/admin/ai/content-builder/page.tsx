"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AiStudioNav from "@/components/admin/AiStudioNav";
import { AUDIENCES } from "@/lib/studio";
import { CONTENT_ASSET_TYPES, CONTENT_TYPE_LABELS, CONTENT_FORMS, type ContentAssetType } from "@/lib/ai/contentTypes";

const INP = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";

function initParams(type: ContentAssetType): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  for (const f of CONTENT_FORMS[type]) p[f.key] = f.kind === "checkbox" ? false : (f.default ?? (f.options?.[0] ?? ""));
  return p;
}

export default function AiContentBuilderPage() {
  const [type, setType] = useState<ContentAssetType>("worksheet");
  const [comps, setComps] = useState<{ id: string; name: string }[]>([]);
  const [competency, setCompetency] = useState("");
  const [audience, setAudience] = useState("consumer");
  const [instructions, setInstructions] = useState("");
  const [includePractices, setIncludePractices] = useState(true);
  const [params, setParams] = useState<Record<string, unknown>>(() => initParams("worksheet"));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<{ draft_id: string | null; validation_status: string } | null>(null);

  useEffect(() => { fetch("/api/admin/studio/assessment/items/meta").then((r) => r.json()).then((d) => setComps(d.competencies ?? [])).catch(() => {}); }, []);
  const fields = useMemo(() => CONTENT_FORMS[type], [type]);
  function pickType(t: ContentAssetType) { setType(t); setParams(initParams(t)); setResult(null); setErr(null); }
  const setP = (k: string, v: unknown) => setParams((p) => ({ ...p, [k]: v }));

  async function generate() {
    if (!competency) { setErr("Select a competency — grounding is required."); return; }
    setBusy(true); setErr(null); setResult(null);
    const res = await fetch("/api/admin/ai/generate/content", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset_type: type, competency_id: competency, includePractices, parameters: { ...params, audience, instructions } }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Generation failed."); return; }
    setResult(d);
  }

  return (
    <div>
      <AiStudioNav />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CONTENT_ASSET_TYPES.map((t) => (
          <button key={t} onClick={() => pickType(t)} className={`rounded-md px-3 py-1.5 text-sm ${type === t ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>{CONTENT_TYPE_LABELS[t]}</button>
        ))}
      </div>

      <div className="max-w-2xl">
        <p className="mb-3 rounded-md bg-dusty-plum/10 px-3 py-2 text-xs text-dusty-plum">Grounded in the selected competency; lands as a <strong>Draft</strong> in the Review Queue → Content. Approve to add a permanent record to the Content Library.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-charcoal sm:col-span-2">Competency<select value={competency} onChange={(e) => setCompetency(e.target.value)} className={INP}><option value="">Select…</option>{comps.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}</select></label>
          <label className="text-sm font-medium text-charcoal">Audience<select value={audience} onChange={(e) => setAudience(e.target.value)} className={INP}>{AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select></label>
          {fields.map((f) => (
            f.kind === "checkbox" ? (
              <label key={f.key} className="flex items-center gap-2 pt-6 text-sm font-medium text-charcoal"><input type="checkbox" checked={!!params[f.key]} onChange={(e) => setP(f.key, e.target.checked)} /> {f.label}</label>
            ) : f.kind === "select" ? (
              <label key={f.key} className="text-sm font-medium text-charcoal">{f.label}<select value={String(params[f.key] ?? "")} onChange={(e) => setP(f.key, e.target.value)} className={INP}>{f.options!.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
            ) : (
              <label key={f.key} className="text-sm font-medium text-charcoal">{f.label}<input value={String(params[f.key] ?? "")} onChange={(e) => setP(f.key, e.target.value)} className={INP} /></label>
            )
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={includePractices} onChange={(e) => setIncludePractices(e.target.checked)} /> Include related practices as reference</label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Instructions <span className="font-normal text-charcoal/50">(optional)</span><input value={instructions} onChange={(e) => setInstructions(e.target.value)} className={INP} /></label>

        {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
        {result && (
          <div className="mt-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">
            {result.validation_status === "valid" ? <>Draft created. <Link href="/admin/ai/review?type=content" className="font-semibold underline">Review it →</Link></> : <>The model returned an invalid response — no draft was created (logged in Generation History).</>}
          </div>
        )}
        <button onClick={generate} disabled={busy || !competency} className="mt-4 rounded-md bg-dusty-plum px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Generating…" : `Generate ${CONTENT_TYPE_LABELS[type].toLowerCase()} draft`}</button>
      </div>
    </div>
  );
}
