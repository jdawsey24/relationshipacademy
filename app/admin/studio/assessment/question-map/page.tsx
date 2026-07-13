"use client";

import { useCallback, useEffect, useState } from "react";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { domainLabel, phaseLabel } from "@/lib/studioFramework";
import {
  CONFIDENCE_LEVELS, MAPPING_STATUS_LABELS,
  type MappingStatus, type QuestionMapRow,
} from "@/lib/questionMap";

type Competency = { id: string; name: string; domain: string | null; phase: string | null };
type Indicator = { behavior_id: string; indicator: string };

const STATUS_CLASS: Record<MappingStatus, string> = {
  draft: "bg-light-gray text-charcoal/60",
  approved: "bg-sage-green/20 text-sage-green",
  superseded: "bg-amber-100 text-amber-800",
  retired: "bg-light-gray text-charcoal/40",
};

function StatusBadge({ status }: { status: MappingStatus }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_CLASS[status]}`}>{MAPPING_STATUS_LABELS[status]}</span>;
}

export default function QuestionMapPage() {
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [rows, setRows] = useState<QuestionMapRow[] | null>(null);
  const [coverage, setCoverage] = useState({ mapped: 0, total: 0 });
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<QuestionMapRow | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/studio/assessment/question-map")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setRows(d.rows ?? []); setCoverage(d.coverage ?? { mapped: 0, total: 0 }); })
      .catch(() => setError(true));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function transition(id: string, action: "approve" | "retire") {
    const res = await fetch(`/api/admin/studio/assessment/question-map/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(action === "approve" ? "Mapping approved." : "Mapping retired."); load();
  }
  async function deleteDraft(id: string) {
    if (!window.confirm("Delete this draft mapping?")) return;
    const res = await fetch(`/api/admin/studio/assessment/question-map/${id}`, { method: "DELETE" });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg("Draft deleted."); load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Question Map — governed traceability from each live Snapshot question to the behavioral indicator it reflects (and thus its competency). Descriptive only; <strong>not validated scoring</strong>.</p>
      <StudioNav />
      <AssessmentNav />

      <div className="mb-4 rounded-md border border-midnight-navy/15 bg-midnight-navy/5 px-4 py-2.5 text-sm text-charcoal/75">
        Map each question to the <strong>observable behavioral indicator</strong> it measures — competency, domain, and phase are derived from the indicator. This is a versioned, approved traceability record, not a psychometric claim. A 47-item Snapshot does not validly measure all 111 competencies.
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-md bg-light-gray px-3 py-1.5 text-sm font-medium text-charcoal/70">Coverage: {coverage.mapped} / {coverage.total} questions mapped</div>
        {msg && <span className="text-sm text-sage-green">{msg}</span>}
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load. If the mapping table isn&apos;t set up yet, run migration 0027_live_question_map.sql.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}

      {rows && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Question</th>
                <th className="px-3 py-2 font-semibold">Domain / Phase</th>
                <th className="px-3 py-2 font-semibold">Current mapping</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const isRisk = r.question.measure_type === "risk";
                return (
                  <tr key={r.question.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                    <td className="px-3 py-2 align-top">
                      <span className="font-mono text-[11px] text-charcoal/40">{r.question.id}</span>
                      <span className="block max-w-md text-charcoal/85">{r.question.question_text ?? "—"}</span>
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap text-charcoal/60">
                      {domainLabel(r.question.domain_slug ?? "")}<span className="block text-[11px] text-charcoal/40">{phaseLabel(r.question.phase_slug ?? "")}{isRisk && <span className="ml-1 rounded bg-amber-100 px-1 text-amber-800">risk item</span>}</span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      {r.current ? (
                        <div>
                          <span className="font-medium text-midnight-navy">{r.current.competency_name ?? r.current.competency_id}</span>
                          <span className="block text-[11px] text-charcoal/55">{r.current.mapping_kind === "competency_direct" ? <em>direct (exception; scoring-ineligible)</em> : (r.current.indicator_text ?? r.current.behavior_id)}</span>
                        </div>
                      ) : <span className="text-charcoal/40">Unmapped</span>}
                      {r.draft && <span className="mt-1 inline-block rounded bg-light-gray px-1.5 py-0.5 text-[10px] uppercase text-charcoal/60">draft v{r.draft.version_no} pending</span>}
                      {r.historyCount > 0 && <span className="ml-1 text-[10px] text-charcoal/40">· {r.historyCount} in history</span>}
                    </td>
                    <td className="px-3 py-2 align-top">{r.current ? <StatusBadge status="approved" /> : r.draft ? <StatusBadge status="draft" /> : <span className="text-charcoal/30">—</span>}</td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {canWrite && <button onClick={() => setEditing(r)} className="font-medium text-midnight-navy hover:underline">{r.current || r.draft ? "Edit" : "Map"}</button>}
                      {r.draft && isOwner && <button onClick={() => transition(r.draft!.id, "approve")} className="ml-3 font-medium text-sage-green hover:underline">Approve</button>}
                      {r.draft && canWrite && <button onClick={() => deleteDraft(r.draft!.id)} className="ml-3 text-coral-rose hover:underline">Delete draft</button>}
                      {r.current && isOwner && <button onClick={() => transition(r.current!.id, "retire")} className="ml-3 text-charcoal/50 hover:underline">Retire</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && <MapEditor row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMsg("Draft saved — an owner approves it to make it the current mapping."); load(); }} />}
    </div>
  );
}

function MapEditor({ row, onClose, onSaved }: { row: QuestionMapRow; onClose: () => void; onSaved: () => void }) {
  const seed = row.draft ?? row.current;
  const [kind, setKind] = useState<"indicator" | "competency_direct">(seed?.mapping_kind ?? "indicator");
  const [competencyId, setCompetencyId] = useState(seed?.competency_id ?? "");
  const [behaviorId, setBehaviorId] = useState(seed?.behavior_id ?? "");
  const [rationale, setRationale] = useState(seed?.rationale ?? "");
  const [confidence, setConfidence] = useState(seed?.confidence_level ?? "moderate");
  const [exception, setException] = useState(seed?.exception_reason ?? "");
  const [comps, setComps] = useState<Competency[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/studio/framework/competencies").then((r) => r.json()).then((d) => setComps(d.competencies ?? [])).catch(() => {});
  }, []);
  useEffect(() => {
    if (kind !== "indicator" || !competencyId) { setIndicators([]); return; }
    fetch(`/api/admin/studio/library/behavioral-indicators?competency_id=${encodeURIComponent(competencyId)}&pageSize=200`)
      .then((r) => r.json()).then((d) => setIndicators((d.rows ?? []).map((x: Record<string, unknown>) => ({ behavior_id: String(x.behavior_id), indicator: String(x.indicator ?? "") })))).catch(() => setIndicators([]));
  }, [kind, competencyId]);

  async function save() {
    setErr(null);
    if (!competencyId) { setErr("Select a competency."); return; }
    if (kind === "indicator" && !behaviorId) { setErr("Select a behavioral indicator."); return; }
    if (kind === "competency_direct" && !exception.trim()) { setErr("An exception reason is required to map directly to a competency."); return; }
    setBusy(true);
    const res = await fetch("/api/admin/studio/assessment/question-map", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: row.question.id, mapping_kind: kind,
        behavior_id: kind === "indicator" ? behaviorId : null,
        competency_id: competencyId, exception_reason: kind === "competency_direct" ? exception : null,
        rationale, confidence_level: confidence,
      }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Failed."); return; }
    onSaved();
  }

  const inp = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-lg font-semibold text-midnight-navy">Map question {row.question.id}</h3>
        <p className="mb-3 text-xs text-charcoal/55">{row.question.question_text}</p>

        <div className="mb-3 flex gap-2 text-sm">
          <button onClick={() => setKind("indicator")} className={`rounded-md px-3 py-1.5 ${kind === "indicator" ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70"}`}>Behavioral indicator</button>
          <button onClick={() => setKind("competency_direct")} className={`rounded-md px-3 py-1.5 ${kind === "competency_direct" ? "bg-amber-600 text-white" : "border border-light-gray text-charcoal/70"}`}>Direct to competency</button>
        </div>
        {kind === "competency_direct" && <p className="mb-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">Discouraged. Use only when no behavioral indicator fits. Requires an exception reason and is excluded from future validated scoring.</p>}

        <label className="block text-sm font-medium text-charcoal">Competency
          <select value={competencyId} onChange={(e) => { setCompetencyId(e.target.value); setBehaviorId(""); }} className={inp}>
            <option value="">Select…</option>
            {comps.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
          </select>
        </label>

        {kind === "indicator" && (
          <label className="mt-3 block text-sm font-medium text-charcoal">Behavioral indicator
            <select value={behaviorId} onChange={(e) => setBehaviorId(e.target.value)} disabled={!competencyId} className={inp}>
              <option value="">{competencyId ? "Select…" : "Pick a competency first"}</option>
              {indicators.map((ind) => <option key={ind.behavior_id} value={ind.behavior_id}>{ind.behavior_id} · {ind.indicator}</option>)}
            </select>
          </label>
        )}

        {kind === "competency_direct" && (
          <label className="mt-3 block text-sm font-medium text-charcoal">Exception reason <span className="text-coral-rose">*</span>
            <textarea value={exception} onChange={(e) => setException(e.target.value)} rows={2} placeholder="Why no behavioral indicator represents this question…" className={inp} />
          </label>
        )}

        <label className="mt-3 block text-sm font-medium text-charcoal">Rationale <span className="font-normal text-charcoal/50">(optional)</span>
          <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={2} className={inp} />
        </label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Confidence
          <select value={confidence} onChange={(e) => setConfidence(e.target.value)} className={inp}>
            {CONFIDENCE_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save draft"}</button>
        </div>
      </div>
    </div>
  );
}
