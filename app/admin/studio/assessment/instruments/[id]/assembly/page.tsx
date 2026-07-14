"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import InstrumentSubNav from "@/components/admin/InstrumentSubNav";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { OUTPUT_LABELS } from "@/lib/assembly";

interface OutcomeFul { output: string; label: string; fulfilled: boolean; unmet_competencies: string[] }
interface Stats {
  strategy: string;
  items_searched: number; items_selected: number; competencies_required: number; competencies_covered: number;
  indicators_required: number; indicators_covered: number; cells_total: number; cells_covered: number;
  domains_covered: string[]; phases_covered: string[];
  duplicates_removed: number; reverse_pct: number; phase_anchored_pct: number; mean_reading_grade: number | null;
  estimated_minutes: number; under_covered_competencies: string[]; missing_indicators: string[];
}
interface Run { id: string; engine_version: string; inputs_fingerprint: string; outcome_fulfilled: boolean; stats: Stats; report_markdown: string | null; status: string; model_version: number | null; created_at: string }
interface Membership { item_id: string; position: number; selection_reason: string | null; status: string; item_text?: string | null }

export default function AssemblyPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [runs, setRuns] = useState<Run[] | null>(null);
  const [membership, setMembership] = useState<Membership[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeFul[] | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/studio/assessment/assembly?assessment_id=${encodeURIComponent(id)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setRuns(d.runs ?? []); setMembership(d.membership ?? []); })
      .catch(() => setError(true));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function run() {
    setBusy(true); setMsg(null); setOutcomes(null);
    const res = await fetch("/api/admin/studio/assessment/assembly", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assessment_id: id }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setOutcomes(d.result?.outcomeFulfillment ?? []);
    setMsg("Assembly complete — review the report below, then approve."); load();
  }
  async function approve(rid: string) {
    const res = await fetch(`/api/admin/studio/assessment/assembly/${rid}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve" }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg("Assembly approved — this is now the assembled instrument."); load();
  }

  const latest = runs?.[0] ?? null;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <StudioNav />
      <AssessmentNav />
      <Link href="/admin/studio/assessment" className="text-sm text-midnight-navy hover:underline">← All instruments</Link>
      <h2 className="mb-3 mt-2 text-xl font-semibold text-midnight-navy">{id} <span className="text-sm font-normal text-charcoal/50">· Assembly</span></h2>
      <InstrumentSubNav id={id} />

      <p className="mb-4 max-w-3xl text-sm text-charcoal/70">The engine <strong>deterministically</strong> assembles the smallest, highest-quality set of <strong>approved</strong> items that satisfies the Measurement Model. Same Model + same approved bank → the identical instrument, every time.</p>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {error && <p className="text-sm text-coral-rose">Failed to load. If the assembly tables aren&apos;t set up yet, run migration 0028.</p>}

      <div className="mb-5">
        {canWrite && <button onClick={run} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Assembling…" : "Assemble from approved bank"}</button>}
      </div>

      {latest && (
        <section className={`mb-6 rounded-lg border p-4 ${latest.outcome_fulfilled ? "border-sage-green/40 bg-sage-green/5" : "border-amber-300 bg-amber-50/50"}`}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-midnight-navy">Assembly report {latest.status === "approved" && <span className="ml-1 rounded bg-sage-green/20 px-1.5 py-0.5 text-[10px] uppercase text-sage-green">approved</span>}</h3>
            {isOwner && latest.status === "draft" && <button onClick={() => approve(latest.id)} className="rounded-md border border-sage-green px-3 py-1 text-xs font-medium text-sage-green hover:bg-sage-green/5">Approve assembly</button>}
          </div>

          {/* Purpose fulfilment FIRST */}
          <div className="mb-3 rounded-md bg-white/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/60">Purpose fulfilment</div>
            <p className={`mt-1 text-sm font-medium ${latest.outcome_fulfilled ? "text-sage-green" : "text-amber-800"}`}>
              {latest.outcome_fulfilled ? "✓ Fully satisfies its Measurement Model." : "⚠ Does not yet satisfy its Measurement Model."}
            </p>
            {(outcomes ?? []).length > 0 && (
              <ul className="mt-1 space-y-0.5 text-sm">
                {(outcomes ?? []).map((o) => (
                  <li key={o.output} className={o.fulfilled ? "text-charcoal/80" : "text-amber-800"}>
                    {o.fulfilled ? "✓" : "⚠"} {o.label}{!o.fulfilled && o.unmet_competencies.length ? ` — needs: ${o.unmet_competencies.join(", ")}` : ""}
                  </li>
                ))}
              </ul>
            )}
            {latest.stats.under_covered_competencies.length > 0 && (
              <p className="mt-2 text-xs text-amber-800">
                Under-represented: {latest.stats.under_covered_competencies.join(", ")}.{" "}
                <Link href="/admin/ai/assessment-builder" className="underline">Generate items to fill gaps →</Link> (routed through the Review Queue)
              </p>
            )}
          </div>

          {/* Technical stats SECOND */}
          <div className="mb-2 text-[11px] uppercase tracking-wide text-charcoal/50">Strategy: <span className="font-semibold text-dusty-plum">{latest.stats.strategy}</span></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Searched" value={latest.stats.items_searched} />
            <Stat label="Selected" value={latest.stats.items_selected} />
            {latest.stats.strategy === "screening"
              ? <Stat label="Cells covered" value={`${latest.stats.cells_covered}/${latest.stats.cells_total}`} />
              : <Stat label="Competencies" value={`${latest.stats.competencies_covered}/${latest.stats.competencies_required}`} />}
            {latest.stats.strategy === "comprehensive"
              ? <Stat label="Indicators" value={`${latest.stats.indicators_covered}/${latest.stats.indicators_required}`} />
              : <Stat label="Competencies sampled" value={latest.stats.competencies_covered} />}
            <Stat label="Reverse %" value={`${Math.round(latest.stats.reverse_pct * 100)}%`} />
            <Stat label="Phase-anchored %" value={`${Math.round(latest.stats.phase_anchored_pct * 100)}%`} />
            <Stat label="Reading grade" value={latest.stats.mean_reading_grade ?? "—"} />
            <Stat label="Est. minutes" value={latest.stats.estimated_minutes} />
          </div>
          <p className="mt-2 text-[11px] text-charcoal/45">Duplicates removed: {latest.stats.duplicates_removed} · Engine {latest.engine_version} · model v{latest.model_version ?? "—"} · fingerprint {latest.inputs_fingerprint}</p>
        </section>
      )}

      {/* Membership (the assembled set) */}
      <h3 className="mb-2 text-sm font-semibold text-midnight-navy">Assembled items {membership.length > 0 && <span className="font-normal text-charcoal/50">({membership.length})</span>}</h3>
      {membership.length === 0 ? (
        <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">No items assembled yet. Approve a Measurement Model, ensure the bank has approved items, then run the assembly.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
              <th className="px-3 py-2 font-semibold">#</th><th className="px-3 py-2 font-semibold">Item</th><th className="px-3 py-2 font-semibold">Covers</th>
            </tr></thead>
            <tbody>
              {membership.map((m, i) => (
                <tr key={m.item_id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 text-charcoal/50">{m.position}</td>
                  <td className="px-3 py-2"><span className="text-charcoal/90">{m.item_text ?? "—"}</span><span className="block text-[11px] text-charcoal/40">{m.item_id}</span></td>
                  <td className="px-3 py-2 text-[11px] text-charcoal/55">{m.selection_reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-md border border-light-gray bg-white px-3 py-2"><div className="text-base font-semibold text-midnight-navy">{value}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">{label}</div></div>;
}
