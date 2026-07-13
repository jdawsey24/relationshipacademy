"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import InstrumentSubNav from "@/components/admin/InstrumentSubNav";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { OUTPUT_LABELS } from "@/lib/assembly";

interface OutcomeReq { output: string; required_competencies: string[]; min_items_per_competency: number }
interface ModelRow {
  id: string; version_no: number; status: string;
  required_competencies: string[]; required_behavioral_indicators: string[];
  required_domains: string[]; required_phases: string[]; outcome_requirements: OutcomeReq[];
  coverage_policy: { min_items_per_competency: number; reverse_target_pct: number | null; phase_anchored_target_pct: number | null };
  approved_by?: string | null;
}
interface SpecRow { name: string; structural_context: string | null; desired_outputs: string[] }

export default function MeasurementModelPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [current, setCurrent] = useState<ModelRow | null>(null);
  const [draft, setDraft] = useState<ModelRow | null>(null);
  const [history, setHistory] = useState(0);
  const [spec, setSpec] = useState<SpecRow | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/studio/assessment/measurement-model?assessment_id=${encodeURIComponent(id)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setCurrent(d.model?.current ?? null); setDraft(d.model?.draft ?? null); setHistory(d.model?.history ?? 0); setSpec(d.spec ?? null); })
      .catch(() => setError(true));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function generate() {
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/studio/assessment/measurement-model", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assessment_id: id }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg("Derived a draft Measurement Model — review, then approve it."); load();
  }
  async function approve(mid: string) {
    const res = await fetch(`/api/admin/studio/assessment/measurement-model/${mid}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve" }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg("Measurement Model approved."); load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <StudioNav />
      <AssessmentNav />
      <Link href="/admin/studio/assessment" className="text-sm text-midnight-navy hover:underline">← All instruments</Link>
      <h2 className="mb-3 mt-2 text-xl font-semibold text-midnight-navy">{spec?.name ?? id} <span className="text-sm font-normal text-charcoal/50">· Measurement Model</span></h2>
      <InstrumentSubNav id={id} />

      <p className="mb-4 max-w-3xl text-sm text-charcoal/70">The <strong>scientific blueprint</strong>: the competencies, behavioral indicators, domains, and phases that must be represented for this assessment to validly support its intended outcomes. Derived from the Specification — it does not select items.</p>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {error && <p className="text-sm text-coral-rose">Failed to load. If the assembly tables aren&apos;t set up yet, run migration 0028.</p>}

      <div className="mb-4 flex items-center gap-3">
        {canWrite && <button onClick={generate} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Deriving…" : "Generate from Specification"}</button>}
        {!spec?.desired_outputs?.length && <span className="text-xs text-amber-700">Define desired outputs in the Specification first.</span>}
        {history > 0 && <span className="text-xs text-charcoal/40">{history} superseded version(s) in history</span>}
      </div>

      {draft && <ModelCard title={`Draft · v${draft.version_no}`} model={draft} onApprove={isOwner ? () => approve(draft.id) : undefined} accent />}
      {current && <ModelCard title={`Approved · v${current.version_no}`} model={current} approvedBy={current.approved_by} />}
      {!draft && !current && <p className="text-sm text-charcoal/55">No Measurement Model yet. Generate one from the Specification above.</p>}
    </div>
  );
}

function ModelCard({ title, model, onApprove, approvedBy, accent }: { title: string; model: ModelRow; onApprove?: () => void; approvedBy?: string | null; accent?: boolean }) {
  return (
    <section className={`mb-4 rounded-lg border p-4 ${accent ? "border-midnight-navy/30 bg-midnight-navy/5" : "border-light-gray"}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-midnight-navy">{title}</h3>
        {onApprove && <button onClick={onApprove} className="rounded-md border border-sage-green px-3 py-1 text-xs font-medium text-sage-green hover:bg-sage-green/5">Approve</button>}
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-4">
        <Stat label="Competencies" value={model.required_competencies.length} />
        <Stat label="Behavioral indicators" value={model.required_behavioral_indicators.length} />
        <Stat label="Domains" value={model.required_domains.length} />
        <Stat label="Phases" value={model.required_phases.length} />
      </div>
      <p className="mt-2 rounded bg-midnight-navy/5 px-2 py-1 text-xs text-charcoal/70">
        <span className="font-semibold">Estimated total length:</span> {model.required_competencies.length} competencies × {model.coverage_policy.min_items_per_competency} item(s) each ≈ <span className="font-semibold">{model.required_competencies.length * model.coverage_policy.min_items_per_competency} items</span>.
      </p>
      <div className="mt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">Evidence required per outcome</div>
        <ul className="mt-1 space-y-1 text-sm text-charcoal/80">
          {model.outcome_requirements.map((o) => (
            <li key={o.output}><span className="font-medium">{OUTPUT_LABELS[o.output] ?? o.output}:</span> {o.required_competencies.length} competencies × ≥{o.min_items_per_competency} item(s)</li>
          ))}
          {model.outcome_requirements.length === 0 && <li className="text-charcoal/50">No outcomes defined.</li>}
        </ul>
      </div>
      <p className="mt-2 text-[11px] text-charcoal/45">Domains: {model.required_domains.join(", ") || "—"} · Phases: {model.required_phases.join(", ") || "—"}{approvedBy ? ` · approved by ${approvedBy}` : ""}</p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-md border border-light-gray px-3 py-2"><div className="text-lg font-semibold text-midnight-navy">{value}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">{label}</div></div>;
}
