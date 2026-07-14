"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import InstrumentSubNav from "@/components/admin/InstrumentSubNav";
import { STRUCTURAL_MARKERS, FREQUENCY_SCALE } from "@/lib/studioScoring";

const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";
type ScopeItem = { item_id: string; item_text: string; reverse_scored: boolean };

interface SimResult {
  attempt_id: string | null;
  scores: { scoreResults: { score_level: string; entity_id: string; raw_score: number; transformed_score: number; valid_response_count: number; confidence_status: string; rule_version: string | null; band?: { label: string } | null }[] };
  findings: { finding_type: string; finding_key: string; consumer_summary: string }[];
  recommendations: { recommendation_mapping_id: string; asset_id: string | null; rank: number; suppression_status: string; suppression_reason: string | null }[];
  consumerReport: { section_name: string; heading: string; body: string }[];
}

// Sandbox — run the APPROVED assembled instrument through the deterministic
// scoring engine, entirely OFF the live consumer path (persists as a simulation
// attempt, provisional cut-points). This is where an owner tests what an assembled
// instrument actually produces before any publish step.
export default function SandboxPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [name, setName] = useState<string>(id);
  const [items, setItems] = useState<ScopeItem[] | null>(null);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [structural, setStructural] = useState<string>("Dating");
  const [transition, setTransition] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SimResult | null>(null);
  const [view, setView] = useState<"participant" | "developer">("participant");

  const load = useCallback(() => {
    fetch("/api/admin/studio/assessment/assessments").then((r) => r.json())
      .then((d) => { const a = (d.rows ?? []).find((x: { assessment_id: string; name: string }) => x.assessment_id === id); if (a) setName(a.name); }).catch(() => {});
    fetch(`/api/admin/studio/scoring/scope-items?type=assessment&id=${encodeURIComponent(id)}`)
      .then((r) => r.json()).then((d) => setItems(d.rows ?? [])).catch(() => setItems([]));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  function fill(v: number) { if (items) setResponses(Object.fromEntries(items.map((i) => [i.item_id, v]))); }
  function randomize() { if (items) setResponses(Object.fromEntries(items.map((i) => [i.item_id, 1 + Math.floor(Math.random() * 5)]))); }

  async function run() {
    setBusy(true); setErr(null); setResult(null);
    const res = await fetch("/api/admin/studio/scoring/simulate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope: { type: "assessment", id }, structuralContext: structural, acknowledgedTransition: transition || null, responses }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Simulation failed."); return; }
    setResult(d);
  }

  const answered = Object.keys(responses).length;
  const byType = (t: string) => result?.findings.filter((f) => f.finding_type === t) ?? [];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Sandbox — run the approved assembled instrument through the deterministic engine. Off the live path; provisional.</p>
      <StudioNav />
      <AssessmentNav />
      <Link href="/admin/studio/assessment" className="text-sm text-midnight-navy hover:underline">← All instruments</Link>
      <h2 className="mb-3 mt-1 text-xl font-semibold text-midnight-navy">{name} <span className="text-sm font-normal text-charcoal/50">· Sandbox</span></h2>
      <InstrumentSubNav id={id} />

      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <strong>Provisional — never scores real users.</strong> This runs the deterministic engine on the approved assembled item set using owner-authored (provisional) cut-points, entirely off the live Snapshot path.
      </div>

      {items === null && <p className="text-sm text-charcoal/60">Loading…</p>}
      {items !== null && items.length === 0 && (
        <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">
          No approved assembled item set for this instrument yet. Build and approve an assembly on the{" "}
          <Link href={`/admin/studio/assessment/instruments/${encodeURIComponent(id)}/assembly`} className="text-midnight-navy hover:underline">Assembly</Link> tab first.
        </p>
      )}

      {items && items.length > 0 && (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-charcoal">Structural context <span className="font-normal text-charcoal/50">(respondent self-selects)</span>
              <select value={structural} onChange={(e) => setStructural(e.target.value)} className={`${INP} mt-1 w-full`}>{STRUCTURAL_MARKERS.map((m) => <option key={m} value={m}>{m}</option>)}</select>
            </label>
            <label className="text-sm font-medium text-charcoal">Acknowledged transition <span className="font-normal text-charcoal/50">(optional)</span>
              <input value={transition} onChange={(e) => setTransition(e.target.value)} placeholder="e.g. separating" className={`${INP} mt-1 w-full`} />
            </label>
          </div>

          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-charcoal/60">Quick fill:</span>
            {FREQUENCY_SCALE.map((f) => <button key={f.value} onClick={() => fill(f.value)} className="rounded border border-light-gray px-2 py-0.5 hover:bg-light-gray">{f.label}</button>)}
            <button onClick={randomize} className="rounded border border-light-gray px-2 py-0.5 hover:bg-light-gray">Randomize</button>
            <span className="ml-auto text-charcoal/50">{answered}/{items.length} answered · {items.length} items in this instrument</span>
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-md border border-light-gray p-2">
            {items.map((it) => (
              <div key={it.item_id} className="flex items-center gap-2 text-sm">
                <select value={responses[it.item_id] ?? ""} onChange={(e) => setResponses((r) => ({ ...r, [it.item_id]: Number(e.target.value) }))} className="rounded border border-light-gray px-1 py-0.5 text-xs">
                  <option value="">—</option>{FREQUENCY_SCALE.map((f) => <option key={f.value} value={f.value}>{f.value}</option>)}
                </select>
                <span className="flex-1 truncate text-charcoal/80">{it.item_text}{it.reverse_scored && <span className="ml-1 text-[10px] uppercase text-dusty-plum">rev</span>}</span>
              </div>
            ))}
          </div>

          {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
          <button onClick={run} disabled={busy || answered === 0} className="mt-4 rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Scoring…" : "Run in sandbox"}</button>
        </>
      )}

      {result && (
        <div className="mt-6">
          <div className="mb-4 inline-flex overflow-hidden rounded-md border border-light-gray text-sm">
            <button onClick={() => setView("participant")} className={`px-4 py-1.5 ${view === "participant" ? "bg-midnight-navy text-white" : "text-charcoal/70 hover:bg-light-gray"}`}>Participant view</button>
            <button onClick={() => setView("developer")} className={`px-4 py-1.5 ${view === "developer" ? "bg-midnight-navy text-white" : "text-charcoal/70 hover:bg-light-gray"}`}>Developer view</button>
          </div>

          {view === "participant" && (
            <div className="space-y-4">
              {result.consumerReport.length === 0 ? (
                <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">
                  No results templates authored for this instrument yet. Add consumer copy in{" "}
                  <Link href="/admin/studio/assessment/results-templates" className="text-midnight-navy hover:underline">Results Templates</Link> and it will render here as the participant sees it.
                </p>
              ) : (
                <div className="max-w-2xl space-y-5 rounded-lg border border-light-gray bg-white p-6">
                  <p className="text-xs uppercase tracking-wide text-charcoal/40">Your Relationship Snapshot™ · sample result</p>
                  {result.consumerReport.map((sec, i) => (
                    <div key={i}>
                      {sec.heading && <h3 className="text-lg font-semibold text-midnight-navy">{sec.heading}</h3>}
                      {sec.body && <p className="mt-1 font-body text-[15px] leading-relaxed text-charcoal/90">{sec.body}</p>}
                    </div>
                  ))}
                  <p className="border-t border-light-gray pt-3 text-[11px] text-charcoal/40">Consumer copy is drawn from your authored Results Templates. Provisional — sample data, not a real result.</p>
                </div>
              )}
            </div>
          )}

          {view === "developer" && (
          <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal/70">Primary outputs (provisional)</h3>
          <Output label="Structural context">{byType("structural_context")[0]?.finding_key ?? structural}</Output>
          <Output label="Phase alignment">{byType("phase_alignment")[0]?.consumer_summary ?? "—"}</Output>
          <Output label="Domain functioning">{byType("domain_functioning").map((f) => f.consumer_summary).join("  ·  ") || "—"}</Output>
          <Output label="Top-two strengths">{byType("strength").map((f) => f.finding_key).join(", ") || "—"}</Output>
          <Output label="Priority growth area">{byType("growth_priority")[0]?.finding_key ?? "—"}</Output>
          {byType("incongruence").length > 0 && <Output label="Developmental incongruence">{byType("incongruence").map((f) => f.consumer_summary).join("  ·  ")}</Output>}
          {byType("expiration_risk").length > 0 && <Output label="Expiration flag">{byType("expiration_risk").map((f) => `${f.finding_key}: ${f.consumer_summary}`).join("  ·  ")}</Output>}
          <Output label="Next developmental step">{byType("next_step")[0]?.consumer_summary ?? "— (no published recommendation matched)"}</Output>

          <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Traceability — score results</h3>
          <div className="overflow-x-auto rounded-md border border-light-gray">
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-light-gray text-left uppercase text-charcoal"><th className="px-2 py-1">Level</th><th className="px-2 py-1">Entity</th><th className="px-2 py-1">Raw</th><th className="px-2 py-1">Transformed</th><th className="px-2 py-1">n</th><th className="px-2 py-1">Band</th><th className="px-2 py-1">Confidence</th><th className="px-2 py-1">Rule ver</th></tr></thead>
              <tbody>
                {result.scores.scoreResults.map((r, i) => (
                  <tr key={i} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                    <td className="px-2 py-1">{r.score_level}</td><td className="px-2 py-1">{r.entity_id}</td><td className="px-2 py-1">{r.raw_score}</td><td className="px-2 py-1">{r.transformed_score}</td><td className="px-2 py-1">{r.valid_response_count}</td><td className="px-2 py-1">{r.band?.label ?? "—"}</td><td className="px-2 py-1">{r.confidence_status}</td><td className="px-2 py-1">{r.rule_version ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.recommendations.length > 0 && (
            <>
              <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Recommendation results</h3>
              <ul className="text-sm">{result.recommendations.map((r, i) => <li key={i} className={r.suppression_status === "suppressed" ? "text-charcoal/40" : "text-charcoal/80"}>#{r.rank} {r.asset_id ?? r.recommendation_mapping_id} — {r.suppression_status}{r.suppression_reason ? ` (${r.suppression_reason})` : ""}</li>)}</ul>
            </>
          )}
          {result.attempt_id && <p className="text-xs text-charcoal/40">Attempt {result.attempt_id} (persisted for traceability — simulation only)</p>}
          </div>
          )}
        </div>
      )}
    </div>
  );
}

function Output({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-md border border-light-gray p-3"><div className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</div><div className="mt-0.5 text-sm text-charcoal/80">{children}</div></div>;
}
