"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AiGenerateModal from "@/components/admin/AiGenerateModal";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useCanWrite } from "@/components/admin/RoleContext";
import type { AssessmentItem } from "@/lib/studioAssessment";

// Assessment tab — this competency's item bank plus a Blueprint Coverage summary
// that makes assessment sufficiency obvious at a glance. Items are read here;
// deep editing stays in the Item Bank (one click, pre-filtered). AI item
// generation is embedded and pre-scoped to this competency.
export default function CompetencyAssessmentPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code);
  const canWrite = useCanWrite();

  const [items, setItems] = useState<AssessmentItem[] | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showGen, setShowGen] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/studio/assessment/items?competency_id=${encodeURIComponent(code)}&pageSize=200`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setItems(d.rows ?? []))
      .catch(() => setError(true));
  }, [code]);
  useEffect(() => { load(); }, [load]);

  const coverage = useMemo(() => {
    const list = items ?? [];
    const approved = list.filter((i) => i.status === "approved").length;
    const draft = list.filter((i) => i.status === "draft").length;
    const assigned = list.filter((i) => i.assessment_id).length;
    const reverse = list.filter((i) => i.reverse_scored).length;
    const phaseAnchored = list.filter((i) => i.phase).length;
    // Duplicate coverage: items whose text (normalized) appears more than once.
    const seen = new Map<string, number>();
    for (const i of list) { const k = (i.item_text ?? "").trim().toLowerCase(); if (k) seen.set(k, (seen.get(k) ?? 0) + 1); }
    const duplicates = [...seen.values()].filter((n) => n > 1).reduce((a, n) => a + n, 0);
    return { total: list.length, approved, draft, assigned, reverse, phaseAnchored, duplicates };
  }, [items]);

  if (error) return <p className="text-sm text-coral-rose">Failed to load items. If the Studio tables aren&apos;t set up yet, run migration 0018.</p>;

  const Stat = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
    <div className="rounded-md border border-light-gray px-3 py-2">
      <div className="text-lg font-semibold text-midnight-navy">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-charcoal/50">{label}</div>
      {hint && <div className="mt-0.5 text-[10px] text-charcoal/40">{hint}</div>}
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-sm text-charcoal/70">The assessment item bank for this competency, with a coverage summary. New items generate here and land as Drafts for review.</p>
        {canWrite && <button onClick={() => setShowGen(true)} className="shrink-0 rounded-md border border-dusty-plum px-3 py-1.5 text-sm font-medium text-dusty-plum hover:bg-dusty-plum/5">Generate items with AI</button>}
      </div>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}

      {/* Blueprint Coverage */}
      <h3 className="mb-2 text-sm font-semibold text-midnight-navy">Blueprint Coverage</h3>
      <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Candidate items" value={coverage.total} />
        <Stat label="Approved" value={coverage.approved} />
        <Stat label="Assigned" value={coverage.assigned} hint="on an instrument" />
        <Stat label="Reverse-scored" value={coverage.reverse} />
        <Stat label="Phase-anchored" value={coverage.phaseAnchored} />
        <Stat label="Duplicates" value={coverage.duplicates} hint="identical text" />
      </div>
      <p className="mb-6 text-xs text-charcoal/50">
        Blueprint requirement per competency is <span className="font-medium">not yet established</span> in the item architecture, so a target coverage % isn&apos;t computed. Once requirements are set, missing-item counts will appear here.
      </p>

      {/* Item list */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-midnight-navy">Items {items && <span className="font-normal text-charcoal/50">({items.length})</span>}</h3>
        <Link href={`/admin/studio/assessment/items?competency_id=${encodeURIComponent(code)}`} className="text-xs text-midnight-navy hover:underline">Open in Item Bank →</Link>
      </div>
      {!items ? <p className="text-sm text-charcoal/50">Loading…</p> : items.length === 0 ? (
        <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">No items yet. Generate the first candidates with AI.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Item</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Rev</th>
                <th className="px-3 py-2 font-semibold">Phase</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.item_id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2">
                    <span className="text-charcoal/90">{it.item_text ?? "—"}</span>
                    {it.provenance === "ai_generated" && <span className="ml-1.5 rounded bg-dusty-plum/15 px-1 py-0.5 text-[10px] font-semibold uppercase text-dusty-plum">AI</span>}
                    <span className="block text-[11px] text-charcoal/40">{it.item_id}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-charcoal/60">{it.item_type ?? "—"}</td>
                  <td className="px-3 py-2 text-charcoal/60">{it.reverse_scored ? "✓" : ""}</td>
                  <td className="px-3 py-2 capitalize text-charcoal/60">{it.phase ?? "—"}</td>
                  <td className="px-3 py-2"><StudioStatusBadge status={String(it.status ?? "draft")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showGen && (
        <AiGenerateModal
          title={`Generate assessment items for ${code}`}
          subtitle="Claude drafts candidate items grounded in this competency and its behavioral indicators."
          competencies={[{ id: code, name: code }]}
          defaultCompetencyId={code}
          lockCompetency
          showCount
          onClose={() => setShowGen(false)}
          onGenerate={async (competency_id, count, instructions) => {
            const res = await fetch(`/api/admin/studio/assessment/items/generate`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ competency_id, count, instructions }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) return d.error ?? "Failed.";
            setShowGen(false);
            setMsg(`Generated ${d.count ?? ""} draft item(s) — they appear below. Approve them here or in the Item Bank.`);
            load();
            return null;
          }}
        />
      )}
    </div>
  );
}
