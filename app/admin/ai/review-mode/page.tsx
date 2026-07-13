"use client";

import { useEffect, useState } from "react";
import AiStudioNav from "@/components/admin/AiStudioNav";
import { REVIEW_TARGET_TYPES } from "@/lib/ai/contentTypes";

interface Finding {
  category: string; severity: string; finding: string; evidence: string;
  recommended_revision: string; requires_owner_decision: boolean; requires_theoretical_review: boolean;
}
const INP = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm";
const sevClass: Record<string, string> = { critical: "border-coral-rose", high: "border-coral-rose", medium: "border-amber-400", low: "border-light-gray", info: "border-light-gray" };

export default function AiReviewModePage() {
  const [targetType, setTargetType] = useState<string>("worksheet");
  const [assets, setAssets] = useState<{ id: string; label: string }[]>([]);
  const [targetId, setTargetId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[] | null>(null);

  useEffect(() => {
    setAssets([]); setTargetId(""); setFindings(null);
    fetch(`/api/admin/ai/assets?target_type=${targetType}`).then((r) => r.json()).then((d) => setAssets(d.rows ?? [])).catch(() => {});
  }, [targetType]);

  async function run() {
    if (!targetId) { setErr("Pick an asset to review."); return; }
    setBusy(true); setErr(null); setFindings(null);
    const res = await fetch("/api/admin/ai/review-existing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target_type: targetType, target_id: targetId }) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Review failed."); return; }
    setFindings(d.findings ?? []);
  }

  return (
    <div>
      <AiStudioNav />
      <p className="mb-4 max-w-2xl text-sm text-charcoal/60">Review Mode analyzes an <strong>existing</strong> content or assessment record across theory/phase/domain/competency fit, construct overlap, reading level, clarity, boundary, safety, accessibility, redundancy, and brand consistency. It <strong>never applies changes</strong> — it only reports findings for your decision.</p>
      <div className="max-w-2xl grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-charcoal">Asset type<select value={targetType} onChange={(e) => setTargetType(e.target.value)} className={INP}>{REVIEW_TARGET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
        <label className="text-sm font-medium text-charcoal">Asset<select value={targetId} onChange={(e) => setTargetId(e.target.value)} className={INP}><option value="">Select…</option>{assets.map((a) => <option key={a.id} value={a.id}>{a.id} · {a.label.slice(0, 60)}</option>)}</select></label>
      </div>
      {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
      <button onClick={run} disabled={busy || !targetId} className="mt-4 rounded-md bg-dusty-plum px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Reviewing…" : "Run review"}</button>

      {findings && (
        <div className="mt-6 max-w-3xl">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Findings ({findings.length})</h2>
          {findings.length === 0 && <p className="text-sm text-sage-green">No issues found.</p>}
          {findings.map((f, i) => (
            <div key={i} className={`mb-2 rounded-md border-l-4 bg-light-gray/20 p-3 ${sevClass[f.severity] ?? "border-light-gray"}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase text-charcoal">{f.category}</span>
                <span className="rounded bg-light-gray px-1.5 py-0.5 uppercase text-charcoal/60">{f.severity}</span>
                {f.requires_owner_decision && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">owner decision</span>}
                {f.requires_theoretical_review && <span className="rounded bg-dusty-plum/15 px-1.5 py-0.5 text-dusty-plum">theoretical review</span>}
              </div>
              <p className="mt-1 text-sm text-charcoal/80">{f.finding}</p>
              {f.evidence && <p className="mt-1 text-xs text-charcoal/60"><strong>Evidence:</strong> {f.evidence}</p>}
              {f.recommended_revision && <p className="mt-1 text-xs text-charcoal/70"><strong>Recommended:</strong> {f.recommended_revision}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
