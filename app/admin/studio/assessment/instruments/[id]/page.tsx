"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import InstrumentSubNav from "@/components/admin/InstrumentSubNav";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { OWNER_ONLY_STATUSES, type Assessment } from "@/lib/studioAssessment";
import { STATUS_LABELS, type StudioStatus } from "@/lib/studio";
import { ASSESSMENT_OUTPUTS, MEASURED_PHASES } from "@/lib/assembly";

const INP = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm disabled:bg-[#F9F9F9] disabled:text-charcoal/50";
const FIELDS: { key: keyof Assessment; label: string; area?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "purpose", label: "Purpose", area: true },
  { key: "audience", label: "Audience" },
  { key: "delivery_mode", label: "Delivery mode" },
  { key: "estimated_items", label: "Estimated items" },
  { key: "estimated_time", label: "Estimated time" },
  { key: "primary_outputs", label: "Primary outputs" },
  { key: "scoring_level", label: "Scoring level" },
  { key: "current_stage", label: "Current stage" },
  { key: "launch_priority", label: "Launch priority" },
  { key: "notes", label: "Notes", area: true },
];

interface Related { scoring: number; interpretation: number; results: number; items: number }

export default function InstrumentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [a, setA] = useState<Assessment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rel, setRel] = useState<Related | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/studio/assessment/assessments")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.rows as Assessment[]).find((x) => x.assessment_id === id);
        if (found) setA(found); else setNotFound(true);
      })
      .catch(() => setNotFound(true));
    // Related counts (small tables — filter client-side; items via server filter).
    Promise.all([
      fetch("/api/admin/studio/assessment/scoring-rules").then((r) => r.json()).catch(() => ({ rows: [] })),
      fetch("/api/admin/studio/assessment/interpretation-rules").then((r) => r.json()).catch(() => ({ rows: [] })),
      fetch("/api/admin/studio/assessment/results-templates").then((r) => r.json()).catch(() => ({ rows: [] })),
      fetch(`/api/admin/studio/assessment/items?assessment_id=${encodeURIComponent(id)}&pageSize=1`).then((r) => r.json()).catch(() => ({ total: 0 })),
    ]).then(([sc, ir, rt, it]) => {
      const count = (rows: { assessment_id?: string }[]) => rows.filter((x) => x.assessment_id === id).length;
      setRel({ scoring: count(sc.rows ?? []), interpretation: count(ir.rows ?? []), results: count(rt.rows ?? []), items: it.total ?? 0 });
    });
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (notFound) return <div><StudioNav /><AssessmentNav /><BackLink /><p className="mt-3 text-sm text-coral-rose">Instrument not found.</p></div>;
  if (!a) return <div><StudioNav /><AssessmentNav /><BackLink /><p className="mt-3 text-sm text-charcoal/60">Loading…</p></div>;

  const set = (k: keyof Assessment, v: string) => setA((p) => (p ? { ...p, [k]: v } : p));
  const setField = (k: keyof Assessment, v: unknown) => setA((p) => (p ? { ...p, [k]: v } : p));
  const dc = (a.design_constraints ?? {}) as Record<string, unknown>;
  const setDc = (k: string, v: unknown) => setField("design_constraints", { ...dc, [k]: v });
  const outputs = a.desired_outputs ?? [];
  const toggleOutput = (val: string) => setField("desired_outputs", outputs.includes(val) ? outputs.filter((o) => o !== val) : [...outputs, val]);

  async function save() {
    if (!a) return;
    setBusy(true); setMsg(null);
    const payload: Record<string, unknown> = { status: a.status };
    for (const f of FIELDS) payload[f.key] = a[f.key] ?? null;
    // Structured Specification (the Assembly Engine's design brief).
    payload.structural_context = a.structural_context ?? null;
    payload.target_reading_level = a.target_reading_level ?? null;
    payload.target_completion_minutes = a.target_completion_minutes ?? null;
    payload.desired_outputs = a.desired_outputs ?? [];
    payload.design_constraints = a.design_constraints ?? {};
    const res = await fetch(`/api/admin/studio/assessment/assessments/${encodeURIComponent(id)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed to save."); return; }
    setMsg("Saved."); load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <StudioNav />
      <AssessmentNav />
      <BackLink />

      <div className="mb-4 mt-2 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-midnight-navy">{a.name}</h2>
        <StudioStatusBadge status={a.status} />
        <span className="font-mono text-xs text-charcoal/40">{a.assessment_id}</span>
      </div>

      <InstrumentSubNav id={id} />

      {msg && <div className="mb-4 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}

      {/* Assessment Specification — outcome-first design brief for the Assembly Engine */}
      <section className="mb-6 rounded-md border border-light-gray p-4">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Assessment Specification</h3>
        <p className="mb-3 text-xs text-charcoal/55">Define <em>what the assessment must accomplish</em>. The Measurement Model derives the required evidence from this — it does not pick items.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-medium text-charcoal">Structural context
            <select disabled={!canWrite} value={a.structural_context ?? ""} onChange={(e) => setField("structural_context", e.target.value || null)} className={INP}>
              <option value="">Any</option>
              {MEASURED_PHASES.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Target reading level
            <input disabled={!canWrite} value={a.target_reading_level ?? ""} onChange={(e) => setField("target_reading_level", e.target.value || null)} placeholder="e.g. Grade 5" className={INP} />
          </label>
          <label className="block text-sm font-medium text-charcoal">Est. completion (min)
            <input disabled={!canWrite} type="number" min={0} value={a.target_completion_minutes ?? ""} onChange={(e) => setField("target_completion_minutes", e.target.value === "" ? null : Number(e.target.value))} className={INP} />
          </label>
          <label className="block text-sm font-medium text-charcoal">Target total length <span className="font-normal text-charcoal/50">(approx. items)</span>
            <input disabled={!canWrite} type="number" min={0} value={(dc.target_total_items as number) ?? ""} onChange={(e) => setDc("target_total_items", e.target.value === "" ? undefined : Number(e.target.value))} placeholder="e.g. 47" className={INP} />
            <span className="mt-0.5 block text-[11px] font-normal text-charcoal/45">The engine spreads this across the competencies your outcomes require.</span>
          </label>
          <label className="block text-sm font-medium text-charcoal">Min items / competency <span className="font-normal text-charcoal/50">(advanced)</span>
            <input disabled={!canWrite || dc.target_total_items != null} type="number" min={1} value={(dc.min_items_per_competency as number) ?? ""} onChange={(e) => setDc("min_items_per_competency", e.target.value === "" ? undefined : (Number(e.target.value) || 1))} placeholder={dc.target_total_items != null ? "auto (from target)" : "1"} className={INP} />
            <span className="mt-0.5 block text-[11px] font-normal text-charcoal/45">{dc.target_total_items != null ? "Ignored while a target total is set." : "Used only if no target total is set."}</span>
          </label>
          <label className="block text-sm font-medium text-charcoal">Reverse-item target %
            <input disabled={!canWrite} type="number" min={0} max={100} value={dc.reverse_target_pct != null ? Math.round(Number(dc.reverse_target_pct) * 100) : ""} onChange={(e) => setDc("reverse_target_pct", e.target.value === "" ? null : Number(e.target.value) / 100)} placeholder="e.g. 17" className={INP} />
          </label>
        </div>
        <div className="mt-3 text-sm font-medium text-charcoal">Desired outputs <span className="font-normal text-charcoal/50">(what the assessment produces)</span></div>
        <div className="mt-1 grid gap-1 sm:grid-cols-2">
          {ASSESSMENT_OUTPUTS.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-charcoal/80">
              <input type="checkbox" disabled={!canWrite} checked={outputs.includes(o.value)} onChange={() => toggleOutput(o.value)} /> {o.label}
            </label>
          ))}
        </div>
        {canWrite && <button onClick={save} disabled={busy} className="mt-4 rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save Specification"}</button>}
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-md border border-light-gray p-4 md:col-span-2">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Instrument details</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className={`block text-sm font-medium text-charcoal ${f.area ? "sm:col-span-2" : ""}`}>
                {f.label}
                {f.area
                  ? <textarea disabled={!canWrite} value={(a[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={2} className={INP} />
                  : <input disabled={!canWrite} value={(a[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} className={INP} />}
              </label>
            ))}
            <label className="block text-sm font-medium text-charcoal">Status
              <select disabled={!canWrite} value={a.status} onChange={(e) => set("status", e.target.value as StudioStatus)} className={INP}>
                {(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}{OWNER_ONLY_STATUSES.includes(s) ? " (owner)" : ""}</option>)}
              </select>
            </label>
          </div>
          {canWrite && <button onClick={save} disabled={busy} className="mt-4 rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>}
        </section>

        <section className="rounded-md border border-light-gray p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Linked content</h3>
          <ul className="space-y-2 text-sm">
            <RelRow label="Scoring rules" count={rel?.scoring} href="/admin/studio/assessment/scoring-rules" />
            <RelRow label="Interpretation rules" count={rel?.interpretation} href="/admin/studio/assessment/interpretation-rules" />
            <RelRow label="Results templates" count={rel?.results} href="/admin/studio/assessment/results-templates" />
            <RelRow label="Items assigned" count={rel?.items} href={`/admin/studio/assessment/items`} />
          </ul>
          <p className="mt-3 text-xs text-charcoal/50">The 1,665-item bank isn&apos;t assigned to a specific instrument yet — items are competency-keyed. Assign items to this instrument in a later step.</p>
          {isOwner && (a.status === "draft" || a.status === "retired") && (
            <p className="mt-3 text-xs text-charcoal/50">Use the Status field to move this instrument through review.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function RelRow({ label, count, href }: { label: string; count?: number; href: string }) {
  return (
    <li className="flex items-center justify-between">
      <Link href={href} className="font-medium text-midnight-navy hover:underline">{label}</Link>
      <span className="rounded-full bg-light-gray px-2 py-0.5 text-xs text-charcoal/70">{count ?? "…"}</span>
    </li>
  );
}

function BackLink() {
  return <Link href="/admin/studio/assessment" className="text-sm text-midnight-navy hover:underline">← All instruments</Link>;
}
