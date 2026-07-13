"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AiStudioNav from "@/components/admin/AiStudioNav";
import { READING_LEVELS } from "@/lib/ai/types";
import { AUDIENCES } from "@/lib/studio";

const INP = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function AiContentBuilderPage() {
  const [tab, setTab] = useState<"worksheet" | "lesson">("worksheet");
  const [comps, setComps] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => { fetch("/api/admin/studio/assessment/items/meta").then((r) => r.json()).then((d) => setComps(d.competencies ?? [])).catch(() => {}); }, []);

  return (
    <div>
      <AiStudioNav />
      <div className="mb-4 flex gap-1.5">
        {(["worksheet", "lesson"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-1.5 text-sm capitalize ${tab === t ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>{t}</button>
        ))}
      </div>
      {tab === "worksheet" ? <WorksheetForm comps={comps} /> : <LessonForm comps={comps} />}
    </div>
  );
}

function Result({ r }: { r: { draft_id: string | null; validation_status: string } | null }) {
  if (!r) return null;
  return (
    <div className="mt-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">
      {r.validation_status === "valid"
        ? <>Draft created. <Link href="/admin/ai/review?type=content" className="font-semibold underline">Review it →</Link></>
        : <>The model returned an invalid response — no draft was created (logged in Generation History).</>}
    </div>
  );
}

function useGenerate() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<{ draft_id: string | null; validation_status: string } | null>(null);
  async function go(body: Record<string, unknown>) {
    setBusy(true); setErr(null); setResult(null);
    const res = await fetch("/api/admin/ai/generate/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Generation failed."); return; }
    setResult(d);
  }
  return { busy, err, result, go };
}

function WorksheetForm({ comps }: { comps: { id: string; name: string }[] }) {
  const [f, setF] = useState({ competency_id: "", audience: "consumer", purpose: "", delivery_setting: "Self-guided", length: "Medium", difficulty: "Beginner", reading_level: "Grade 5", version: "Consumer", facilitator_required: false, access_level: "Academy", includePractices: true });
  const { busy, err, result, go } = useGenerate();
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div className="max-w-2xl">
      <p className="mb-3 rounded-md bg-dusty-plum/10 px-3 py-2 text-xs text-dusty-plum">Worksheets are drafted from the competency (definition, indicators, expected application, barriers, safety) and land as a <strong>Draft</strong> in the Review Queue.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-charcoal sm:col-span-2">Competency<select value={f.competency_id} onChange={(e) => set("competency_id", e.target.value)} className={INP}><option value="">Select…</option>{comps.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Audience<select value={f.audience} onChange={(e) => set("audience", e.target.value)} className={INP}>{AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Delivery setting<select value={f.delivery_setting} onChange={(e) => set("delivery_setting", e.target.value)} className={INP}>{["Self-guided", "Facilitated", "Couples", "Group"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Length<select value={f.length} onChange={(e) => set("length", e.target.value)} className={INP}>{["Short", "Medium", "Long"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Difficulty<select value={f.difficulty} onChange={(e) => set("difficulty", e.target.value)} className={INP}>{["Beginner", "Intermediate", "Advanced"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Reading level<select value={f.reading_level} onChange={(e) => set("reading_level", e.target.value)} className={INP}>{READING_LEVELS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Version<select value={f.version} onChange={(e) => set("version", e.target.value)} className={INP}>{["Consumer", "Professional"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Access level<select value={f.access_level} onChange={(e) => set("access_level", e.target.value)} className={INP}>{["Public", "Academy", "Academy Plus", "Institute"].map((x) => <option key={x}>{x}</option>)}</select></label>
      </div>
      <label className="mt-3 block text-sm font-medium text-charcoal">Purpose <span className="font-normal text-charcoal/50">(optional)</span><input value={f.purpose} onChange={(e) => set("purpose", e.target.value)} className={INP} /></label>
      <div className="mt-3 flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.facilitator_required} onChange={(e) => set("facilitator_required", e.target.checked)} /> Facilitator required</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.includePractices} onChange={(e) => set("includePractices", e.target.checked)} /> Include related practices as reference</label>
      </div>
      {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
      <Result r={result} />
      <button onClick={() => { if (!f.competency_id) return; go({ asset_type: "worksheet", competency_id: f.competency_id, includePractices: f.includePractices, parameters: f }); }} disabled={busy || !f.competency_id} className="mt-4 rounded-md bg-dusty-plum px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Generating…" : "Generate worksheet draft"}</button>
    </div>
  );
}

function LessonForm({ comps }: { comps: { id: string; name: string }[] }) {
  const [f, setF] = useState({ competency_id: "", course: "", audience: "academy", lesson_purpose: "", duration: "20 min", delivery_format: "Self-paced", reading_level: "Grade 8", version: "Consumer", certificate_relevance: "None", includePractices: true });
  const { busy, err, result, go } = useGenerate();
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div className="max-w-2xl">
      <p className="mb-3 rounded-md bg-dusty-plum/10 px-3 py-2 text-xs text-dusty-plum">Lessons are drafted from the competency (definition, purpose, developmental significance) with measurable objectives, and land as a <strong>Draft</strong> in the Review Queue.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-charcoal sm:col-span-2">Competency<select value={f.competency_id} onChange={(e) => set("competency_id", e.target.value)} className={INP}><option value="">Select…</option>{comps.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Course ID <span className="font-normal text-charcoal/50">(optional)</span><input value={f.course} onChange={(e) => set("course", e.target.value)} className={INP} /></label>
        <label className="text-sm font-medium text-charcoal">Audience<select value={f.audience} onChange={(e) => set("audience", e.target.value)} className={INP}>{AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Duration<select value={f.duration} onChange={(e) => set("duration", e.target.value)} className={INP}>{["10 min", "20 min", "30 min", "45 min", "60 min"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Delivery format<select value={f.delivery_format} onChange={(e) => set("delivery_format", e.target.value)} className={INP}>{["Self-paced", "Live", "Video", "Reading"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Reading level<select value={f.reading_level} onChange={(e) => set("reading_level", e.target.value)} className={INP}>{READING_LEVELS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Version<select value={f.version} onChange={(e) => set("version", e.target.value)} className={INP}>{["Consumer", "Professional"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Certificate / CE<select value={f.certificate_relevance} onChange={(e) => set("certificate_relevance", e.target.value)} className={INP}>{["None", "Certificate", "CE"].map((x) => <option key={x}>{x}</option>)}</select></label>
      </div>
      <label className="mt-3 block text-sm font-medium text-charcoal">Lesson purpose <span className="font-normal text-charcoal/50">(optional)</span><input value={f.lesson_purpose} onChange={(e) => set("lesson_purpose", e.target.value)} className={INP} /></label>
      {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
      <Result r={result} />
      <button onClick={() => { if (!f.competency_id) return; go({ asset_type: "lesson", competency_id: f.competency_id, includePractices: f.includePractices, parameters: f }); }} disabled={busy || !f.competency_id} className="mt-4 rounded-md bg-dusty-plum px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Generating…" : "Generate lesson draft"}</button>
    </div>
  );
}
