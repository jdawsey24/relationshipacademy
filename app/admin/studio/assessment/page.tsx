"use client";

import { useEffect, useState } from "react";
import StudioTabs from "@/components/admin/StudioTabs";
import AssessmentNav from "@/components/admin/AssessmentNav";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useCanWrite } from "@/components/admin/RoleContext";
import { OWNER_ONLY_STATUSES, type Assessment } from "@/lib/studioAssessment";

export default function AssessmentInstrumentsPage() {
  const canWrite = useCanWrite();
  const [rows, setRows] = useState<Assessment[] | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/studio/assessment/assessments")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }
  useEffect(load, []);

  async function setStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/studio/assessment/assessments/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg("Saved."); load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Author and govern the assessment architecture. Nothing here affects the live assessment until an explicit publish step.</p>
      <StudioTabs />
      <AssessmentNav />

      {msg && <div className="mb-4 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {error && <p className="text-sm text-coral-rose">Failed to load. If the assessment tables aren&apos;t set up yet, run migration 0018_studio_assessment.sql and the importer.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No instruments yet. Run the importer to load them from the workbook.</p>}

      {rows && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((a) => (
            <div key={a.assessment_id} className="rounded-md border border-light-gray p-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-midnight-navy">{a.name}</h2>
                <StudioStatusBadge status={a.status} />
                <span className="text-xs text-charcoal/40">{a.assessment_id}</span>
                {a.current_stage && <span className="rounded bg-light-gray px-2 py-0.5 text-[11px] text-charcoal/60">{a.current_stage}</span>}
              </div>
              {a.purpose && <p className="mt-1 text-sm text-charcoal/70">{a.purpose}</p>}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-charcoal/60">
                {a.audience && <span><strong>Audience:</strong> {a.audience}</span>}
                {a.delivery_mode && <span><strong>Delivery:</strong> {a.delivery_mode}</span>}
                {a.estimated_items && <span><strong>Items:</strong> {a.estimated_items}</span>}
                {a.scoring_level && <span><strong>Scoring:</strong> {a.scoring_level}</span>}
              </div>
              {canWrite && (
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs text-charcoal/60">Status</label>
                  <select
                    value={a.status}
                    onChange={(e) => setStatus(a.assessment_id, e.target.value)}
                    className="rounded-md border border-light-gray px-2 py-1 text-sm"
                  >
                    {["draft", "in_review", "approved", "published", "retired"].map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}{OWNER_ONLY_STATUSES.includes(s as never) ? " (owner)" : ""}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
