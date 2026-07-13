"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AiStudioNav from "@/components/admin/AiStudioNav";
import { ITEM_TYPES, RESPONSE_MODELS, PERSPECTIVES, TIME_FRAMES, READING_LEVELS } from "@/lib/ai/types";
import { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel } from "@/lib/studioAssessment";
import { AUDIENCES } from "@/lib/studio";

const INP = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";
const STRUCTURAL = ["exploration", "exclusivity", "expansion", "expiration"];

export default function AssessmentBuilderPage() {
  const [comps, setComps] = useState<{ id: string; name: string }[]>([]);
  const [f, setF] = useState({
    competency_id: "", audience: "consumer", structural_context: "", phase: "", domain: "",
    item_type: ITEM_TYPES[0] as string, response_model: "RM-FREQ-001", perspective: "Self",
    time_frame: "General", reading_level: "Grade 5", count: 8,
    reverse_allowed: true, phase_anchored_allowed: false, includeIncomplete: false, includeApprovedItems: true,
    instructions: "",
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ request_id: string; draft_ids: string[]; validation_status: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch("/api/admin/studio/assessment/items/meta").then((r) => r.json()).then((d) => setComps(d.competencies ?? [])).catch(() => {});
  }, []);

  async function generate() {
    if (!f.competency_id) { setErr("Select a competency — grounding is required."); return; }
    setBusy(true); setErr(null); setResult(null);
    const res = await fetch("/api/admin/ai/generate/assessment-item", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        competency_id: f.competency_id, count: f.count,
        includeIncomplete: f.includeIncomplete, includeApprovedItems: f.includeApprovedItems,
        parameters: {
          audience: f.audience, structural_context: f.structural_context, phase: f.phase, domain: f.domain,
          item_type: f.item_type, response_model: f.response_model, perspective: f.perspective,
          time_frame: f.time_frame, reading_level: f.reading_level,
          reverse_allowed: f.reverse_allowed, phase_anchored_allowed: f.phase_anchored_allowed,
          instructions: f.instructions,
        },
      }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Generation failed."); return; }
    setResult(d);
  }

  return (
    <div>
      <AiStudioNav />
      <div className="max-w-3xl">
        <p className="mb-4 rounded-md bg-dusty-plum/10 px-3 py-2 text-xs text-dusty-plum">Generated items land as <strong>Drafts in the Review Queue</strong> — grounded in the selected competency and its behavioral indicators, checked for quality, and never added to the Item Bank until you approve them.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-charcoal sm:col-span-2">Competency (source grounding)
            <select value={f.competency_id} onChange={(e) => set("competency_id", e.target.value)} className={INP}>
              <option value="">Select…</option>
              {comps.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-charcoal">Audience
            <select value={f.audience} onChange={(e) => set("audience", e.target.value)} className={INP}>{AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Item type
            <select value={f.item_type} onChange={(e) => set("item_type", e.target.value)} className={INP}>{ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Response model
            <select value={f.response_model} onChange={(e) => set("response_model", e.target.value)} className={INP}>{RESPONSE_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Perspective
            <select value={f.perspective} onChange={(e) => set("perspective", e.target.value)} className={INP}>{PERSPECTIVES.map((p) => <option key={p} value={p}>{p}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Time frame
            <select value={f.time_frame} onChange={(e) => set("time_frame", e.target.value)} className={INP}>{TIME_FRAMES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Reading level
            <select value={f.reading_level} onChange={(e) => set("reading_level", e.target.value)} className={INP}>{READING_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Structural context
            <select value={f.structural_context} onChange={(e) => set("structural_context", e.target.value)} className={INP}><option value="">Any</option>{STRUCTURAL.map((p) => <option key={p} value={p}>{domainLabel(p)}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Phase
            <select value={f.phase} onChange={(e) => set("phase", e.target.value)} className={INP}><option value="">—</option>{PHASE_SLUGS.map((p) => <option key={p} value={p}>{domainLabel(p)}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Domain
            <select value={f.domain} onChange={(e) => set("domain", e.target.value)} className={INP}><option value="">—</option>{DOMAIN_SLUGS.map((x) => <option key={x} value={x}>{domainLabel(x)}</option>)}</select>
          </label>
          <label className="text-sm font-medium text-charcoal">Number of candidates
            <input type="number" min={1} max={20} value={f.count} onChange={(e) => set("count", Number(e.target.value))} className={INP} />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.reverse_allowed} onChange={(e) => set("reverse_allowed", e.target.checked)} /> Allow reverse candidates</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.phase_anchored_allowed} onChange={(e) => set("phase_anchored_allowed", e.target.checked)} /> Allow phase-anchored items</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.includeIncomplete} onChange={(e) => set("includeIncomplete", e.target.checked)} /> Include incomplete indicators</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.includeApprovedItems} onChange={(e) => set("includeApprovedItems", e.target.checked)} /> Include existing approved items (avoid duplicates)</label>
        </div>

        <label className="mt-3 block text-sm font-medium text-charcoal">Authoring instructions <span className="font-normal text-charcoal/50">(optional)</span>
          <textarea value={f.instructions} onChange={(e) => set("instructions", e.target.value)} rows={2} className={INP} placeholder="e.g. Focus on early-dating contexts; keep neutral about relationship structure." />
        </label>

        {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
        {result && (
          <div className="mt-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">
            {result.validation_status === "valid"
              ? <>Generated {result.draft_ids.length} draft item(s). <Link href="/admin/ai/review" className="font-semibold underline">Review them →</Link></>
              : <>The model returned an invalid response — no drafts were created (this is logged in Generation History).</>}
          </div>
        )}
        <div className="mt-4">
          <button onClick={generate} disabled={busy} className="rounded-md bg-dusty-plum px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Generating…" : "Generate drafts"}</button>
        </div>
      </div>
    </div>
  );
}
