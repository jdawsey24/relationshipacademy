"use client";

import { useCallback, useEffect, useState } from "react";

// Script Builder — four screens over one brief (owner ruling 8).
//
// The backend runs twelve staged calls; the interface groups them into the four
// decisions a person actually makes: settle the framework, choose the angle,
// write and package, then review. Twelve screens would be twelve times the
// clicking for the same four judgements.
//
// Two hard gates are represented as gates, not steps: nothing can be written
// until the mapping is settled, and no script exists until an angle is chosen.

type Screen = "topic" | "brief" | "scripts" | "review";

const SCREENS: { key: Screen; label: string; sub: string }[] = [
  { key: "topic", label: "1 · Topic & Bridge", sub: "Framework mapping" },
  { key: "brief", label: "2 · Brief & Angles", sub: "Choose the angle" },
  { key: "scripts", label: "3 · Scripts & Packaging", sub: "Write and package" },
  { key: "review", label: "4 · Review & QC", sub: "Check and draft" },
];

interface Brief {
  id: string; topic: string; platform: string; status: string;
  competency_id: string | null; phase_id: string | null; domain_id: string | null;
  developmental_task: string | null; mapping_rationale: string | null;
  observable_pattern: string | null; approved_public_interpretation: string | null;
  mapping_validated: boolean; publication_eligible: boolean;
  target_runtime_seconds: number; script_format: string; tone: string | null;
  content_objective: string | null; cta_destination: string | null;
  primary_keyword: string | null; expert_positioning_level: string; campaign_id: string | null;
  real_talk_intensity: string | null; selected_angle_id: string | null;
  content_series_id: string | null;
  target_audience: string | null;
}
interface Angle {
  id: string; label: string; premise: string; hook: string | null;
  audience_promise: string | null; why_different: string | null;
  risk_notes: string | null; is_selected: boolean;
}
interface Script {
  id: string; reading_level: "grade5" | "higher"; hook: string | null; body: string;
  cta: string | null; word_count: number; estimated_runtime_seconds: number;
  runtime_within_target: boolean;
  edited_by_owner: boolean; edited_by: string | null; generated_body: string | null;
}
interface Pkg {
  on_screen_caption: string | null; post_caption: string | null;
  keywords: string[]; hashtags: string[]; cta_text: string | null; visual_notes: string[];
}
interface Comparison {
  lexical_similarity: number; similarity_threshold: number; similarity_exceeded: boolean;
  owner_override: boolean; override_reason: string | null; equivalence_ok: boolean | null;
  equivalence_notes: string | null; lesson_match: boolean | null; reward_match: boolean | null;
  hook_match: boolean | null; cta_match: boolean | null; stale: boolean;
}
interface Conflict { id: string; conflict_type: string; explanation: string; created_at: string }
interface Finding { category: string; severity: string; message: string; field?: string }
interface QcState { blocked: boolean; blocking: Finding[]; warnings: Finding[]; ungoverned: string[] }

interface Campaign {
  id: string; name: string; target_audience: string | null;
  cta_destination: string | null; primary_keyword: string | null; transformation: string | null;
}
interface Series { id: string; slug: string; name: string; description: string | null }
interface RealTalk {
  intensity: string; complete: boolean;
  uncomfortable_truth: string | null; audience_description: string | null;
  common_misunderstanding: string | null; necessary_nuance: string | null;
  relational_mechanism: string | null; consequence: string | null;
  practical_takeaway: string | null; rlc_foundation: string | null;
  overgeneralization_risk: string | null; reputational_risk_check: string | null;
}
interface Claim {
  id: string; claim_text: string; claim_type: string; verification_status: string;
  sources: { title?: string; url?: string }[]; risk_level: string;
  recheck_at: string | null; verified_by: string | null;
}
interface ClaimReadiness {
  ready: boolean; reviewed: boolean; reasons: string[];
  counts: { total: number; verified: number; unverified: number; disputed: number; withdrawn: number };
}
interface Payload {
  brief: Brief; angles: Angle[]; scripts: Script[];
  package: Pkg | null; comparison: Comparison | null; conflicts: Conflict[];
  campaigns: Campaign[]; series: Series[]; realTalk: RealTalk | null;
  claims: Claim[]; claimReadiness: ClaimReadiness;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ScriptBuilderPage() {
  const [briefs, setBriefs] = useState<{ id: string; topic: string; status: string }[]>([]);
  const [briefId, setBriefId] = useState<string | null>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [screen, setScreen] = useState<Screen>("topic");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [qc, setQc] = useState<{ draftId: string; version: number; qc: QcState } | null>(null);

  const loadList = useCallback(async () => {
    const r = await fetch("/api/admin/content-engine/script-builder/briefs");
    if (r.ok) setBriefs((await r.json()).briefs ?? []);
  }, []);

  const loadBrief = useCallback(async (id: string) => {
    const r = await fetch(`/api/admin/content-engine/script-builder/briefs/${id}`);
    if (!r.ok) { setErr((await r.json()).error ?? "Could not load the brief."); return; }
    setData(await r.json());
  }, []);

  useEffect(() => { void loadList(); }, [loadList]);
  useEffect(() => { if (briefId) void loadBrief(briefId); }, [briefId, loadBrief]);

  async function runStage(stage: string, extra: Record<string, unknown> = {}) {
    if (!briefId) return;
    setBusy(stage); setErr(null); setNotice(null);
    try {
      const r = await fetch(`/api/admin/content-engine/script-builder/briefs/${briefId}/stage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, ...extra }),
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error ?? "The stage failed."); return; }
      if (stage === "qc") setQc(j);
      if (stage === "compare" && j.comparison) {
        setNotice(j.comparison.notes);
      }
      await loadBrief(briefId);
    } finally { setBusy(null); }
  }

  async function saveConfig(patch: Record<string, unknown>) {
    if (!briefId) return;
    setBusy("config"); setErr(null);
    try {
      const r = await fetch(`/api/admin/content-engine/script-builder/briefs/${briefId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch),
      });
      if (!r.ok) setErr((await r.json()).error ?? "Could not save.");
      else await loadBrief(briefId);
    } finally { setBusy(null); }
  }

  const b = data?.brief;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Script Builder</h1>
        <p className="mt-1 text-sm text-slate-600">
          Framework-faithful short-form scripts. Every draft is reviewed by you — nothing publishes automatically.
        </p>
      </header>

      {/* Brief selector */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <label className="text-sm font-medium text-slate-700">Brief</label>
        <select
          className="min-w-[280px] rounded border border-slate-300 px-2 py-1 text-sm"
          value={briefId ?? ""}
          onChange={(e) => { setBriefId(e.target.value || null); setQc(null); }}
        >
          <option value="">Select a content brief…</option>
          {briefs.map((x) => (
            <option key={x.id} value={x.id}>{x.topic} — {x.status.replace(/_/g, " ")}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500">
          Briefs are created from an approved bridge — start one in{" "}
          <a href="/admin/content-engine/intake" className="font-medium text-slate-700 underline">Topic intake</a>.
          A bridge must be strong or moderate with a validated mapping.
        </span>
      </div>

      {err && <Banner tone="error">{err}</Banner>}
      {notice && <Banner tone="info">{notice}</Banner>}

      {data?.conflicts?.length ? (
        <Banner tone="error">
          <strong>Generation stopped on a framework conflict.</strong>{" "}
          {data.conflicts[0].explanation}{" "}
          <em>The engine will not resolve this on its own — it is your decision.</em>
        </Banner>
      ) : null}

      {!b ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Select a brief to begin.
        </p>
      ) : (
        <>
          {/* Screen tabs */}
          <nav className="mb-6 flex gap-1 border-b border-slate-200">
            {SCREENS.map((sc) => (
              <button
                key={sc.key}
                onClick={() => setScreen(sc.key)}
                className={`-mb-px border-b-2 px-4 py-2 text-left text-sm ${
                  screen === sc.key
                    ? "border-slate-900 font-semibold text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="block">{sc.label}</span>
                <span className="block text-xs font-normal text-slate-400">{sc.sub}</span>
              </button>
            ))}
          </nav>

          {/* Standing status — the two things that decide what is possible */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Status ok={b.mapping_validated}
              label={b.mapping_validated ? "Framework mapping validated" : "Mapping not validated"}
              detail={b.mapping_validated
                ? `${b.competency_id} · ${b.phase_id} · ${b.domain_id}`
                : "Nothing can be generated until the full relationship validates."} />
            <Status ok={b.publication_eligible} neutralWhenFalse
              label={b.publication_eligible ? "Approved for public use" : "Not approved for public use"}
              detail={b.publication_eligible
                ? "A recorded approval covers this source, use and audience."
                : "A draft can still be built for review. It cannot be published."}
              href={b.publication_eligible ? undefined : "/admin/content-engine/approvals"}
              hrefLabel="Record an approval" />
            <Status ok={data.claimReadiness.ready}
              label={data.claimReadiness.ready ? "Claims verified" : "Claim review outstanding"}
              detail={data.claimReadiness.ready
                ? `${data.claimReadiness.counts.total} claim(s) recorded and reviewed.`
                : data.claimReadiness.reasons[0] ?? "Not yet reviewed."} />
          </div>

          {screen === "topic" && (
            <>
              <TopicScreen b={b} campaigns={data.campaigns}
                onConfig={saveConfig} busy={busy} />
              <ClaimsPanel
                claims={data.claims} readiness={data.claimReadiness} busy={busy}
                onSave={(p) => runStage("save_claim", p)}
                onDelete={(id) => runStage("delete_claim", { claim_id: id })}
                onReview={() => runStage("review_claims")}
              />
            </>
          )}

          {screen === "brief" && (
            <>
              <SeriesPicker b={b} series={data.series} busy={busy} onConfig={saveConfig} />
              {data.series.find((x) => x.id === b.content_series_id)?.slug === "real_talk" && (
                <RealTalkPanel
                  rt={data.realTalk} busy={busy}
                  onSave={(payload) => runStage("real_talk", payload)}
                />
              )}
              <BriefScreen
                b={b} angles={data.angles} busy={busy}
                onGenerate={() => runStage("angles")}
                onSelect={(id) => runStage("select_angle", { angle_id: id })}
              />
            </>
          )}

          {screen === "scripts" && (
            <ScriptsScreen
              b={b} scripts={data.scripts} pkg={data.package} comparison={data.comparison} busy={busy}
              onConfig={saveConfig}
              onScripts={() => runStage("scripts")}
              onCompare={() => runStage("compare")}
              onOverride={(reason) => runStage("override", { reason })}
              onPackage={() => runStage("package")}
              onEdit={(level, fields) => runStage("edit_script", { reading_level: level, ...fields })}
              onRevert={(level) => runStage("revert_script", { reading_level: level })}
            />
          )}

          {screen === "review" && (
            <ReviewScreen
              scripts={data.scripts} comparison={data.comparison} qc={qc} busy={busy}
              onRun={() => runStage("qc")}
            />
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Banner({ tone, children }: { tone: "error" | "info"; children: React.ReactNode }) {
  const c = tone === "error"
    ? "border-red-300 bg-red-50 text-red-900"
    : "border-sky-300 bg-sky-50 text-sky-900";
  return <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${c}`}>{children}</div>;
}

function Status({ ok, label, detail, neutralWhenFalse, href, hrefLabel }: {
  ok: boolean; label: string; detail: string; neutralWhenFalse?: boolean;
  href?: string; hrefLabel?: string;
}) {
  const c = ok ? "border-emerald-300 bg-emerald-50"
    : neutralWhenFalse ? "border-amber-300 bg-amber-50" : "border-red-300 bg-red-50";
  return (
    <div className={`rounded-lg border px-4 py-3 ${c}`}>
      <p className="text-sm font-semibold text-slate-900">{ok ? "✓ " : "• "}{label}</p>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
      {href && (
        <a href={href} className="mt-1 inline-block text-xs font-medium text-slate-700 underline">
          {hrefLabel ?? "Fix this"} →
        </a>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="border-t border-slate-100 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || <span className="text-slate-400">—</span>}</dd>
    </div>
  );
}

function TopicScreen({ b, campaigns, onConfig, busy }: {
  b: Brief; campaigns: Campaign[];
  onConfig: (p: Record<string, unknown>) => void; busy: string | null;
}) {
  const active = campaigns.find((c) => c.id === b.campaign_id) ?? null;
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Topic &amp; framework mapping</h2>
      <p className="mb-4 text-sm text-slate-600">
        Copied from the approved bridge when this brief was created. It is deliberately not editable here —
        changing a mapping means going back to the bridge, so a script always records what was actually approved.
      </p>
      <dl className="rounded-lg border border-slate-200 bg-white px-4 py-2">
        <Field label="Topic" value={b.topic} />
        <Field label="Competency" value={b.competency_id} />
        <Field label="Phase" value={b.phase_id} />
        <Field label="Domain" value={b.domain_id} />
        <Field label="Developmental task" value={b.developmental_task} />
        <Field label="Why this mapping" value={b.mapping_rationale} />
        <Field label="Observable pattern" value={b.observable_pattern} />
        <Field label="Approved public interpretation" value={b.approved_public_interpretation} />
      </dl>
      {/* The campaign shapes every angle, script and hashtag downstream. Shown
          here because it was previously only discoverable by reading the output
          and noticing who it was addressed to. */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Campaign framing</h3>
          <select
            value={b.campaign_id ?? ""}
            disabled={busy !== null}
            onChange={(e) => onConfig({ campaign_id: e.target.value || null })}
            className="rounded border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">No campaign (defaults cleared)</option>
            {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {active ? (
          <dl className="mt-2">
            <Field label="Target audience" value={active.target_audience} />
            <Field label="CTA destination" value={active.cta_destination} />
            <Field label="Primary keyword" value={active.primary_keyword} />
            <Field label="Transformation" value={active.transformation} />
          </dl>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No campaign attached. Scripts will be written without an audience default.
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Every angle, script, caption and hashtag is written for this audience. Change it here, or clear it,
          if this topic should not carry the campaign framing.
        </p>
      </div>

      {!b.approved_public_interpretation && (
        <Banner tone="info">
          No Consumer Translation is authored for this competency, so there is no approved public
          interpretation to write from. Scripts will be drafted from the framework definition — read them closely.
        </Banner>
      )}
    </section>
  );
}

function BriefScreen({ b, angles, busy, onGenerate, onSelect }: {
  b: Brief; angles: Angle[]; busy: string | null;
  onGenerate: () => void; onSelect: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Angles</h2>
        <button
          onClick={onGenerate}
          disabled={!b.mapping_validated || busy !== null}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {busy === "angles" ? "Generating…" : angles.length ? "Regenerate angles" : "Generate angles"}
        </button>
      </div>
      {!angles.length ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No angles yet. Three to five meaningfully different takes on the same approved mapping.
        </p>
      ) : (
        <ul className="space-y-3">
          {angles.map((a) => (
            <li key={a.id}
              className={`rounded-lg border p-4 ${a.is_selected ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{a.label}</h3>
                  <p className="mt-1 text-sm text-slate-700">{a.premise}</p>
                  {a.hook && <p className="mt-2 text-sm italic text-slate-600">“{a.hook}”</p>}
                  {a.why_different && (
                    <p className="mt-2 text-xs text-slate-500"><strong>Different because:</strong> {a.why_different}</p>
                  )}
                  {a.risk_notes && (
                    <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900">
                      <strong>Risk:</strong> {a.risk_notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onSelect(a.id)}
                  disabled={busy !== null}
                  className={`shrink-0 rounded px-3 py-1.5 text-xs font-medium ${
                    a.is_selected ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"
                  } disabled:opacity-40`}
                >
                  {a.is_selected ? "Selected" : "Select"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ScriptsScreen({ b, scripts, pkg, comparison, busy, onConfig, onScripts, onCompare, onOverride, onPackage, onEdit, onRevert }: {
  b: Brief; scripts: Script[]; pkg: Pkg | null; comparison: Comparison | null; busy: string | null;
  onConfig: (p: Record<string, unknown>) => void;
  onScripts: () => void; onCompare: () => void; onOverride: (r: string) => void; onPackage: () => void;
  onEdit: (level: "grade5" | "higher", fields: { hook?: string; script_body?: string; cta?: string }) => void;
  onRevert: (level: "grade5" | "higher") => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <section className="space-y-6">
      {/* Configuration */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Configuration</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs text-slate-600">
            Runtime (seconds)
            <input type="number" defaultValue={b.target_runtime_seconds}
              onBlur={(e) => onConfig({ target_runtime_seconds: Number(e.target.value) })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <label className="text-xs text-slate-600">
            Platform
            <input defaultValue={b.platform} onBlur={(e) => onConfig({ platform: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <label className="text-xs text-slate-600">
            Expert positioning
            <select defaultValue={b.expert_positioning_level}
              onChange={(e) => onConfig({ expert_positioning_level: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900">
              {["none", "subtle", "explicit", "conversion_focused"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="text-xs text-slate-600">
            Real Talk intensity
            <select defaultValue={b.real_talk_intensity ?? ""}
              onChange={(e) => onConfig({ real_talk_intensity: e.target.value || null })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900">
              <option value="">(not Real Talk)</option>
              {["light", "direct", "unfiltered"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="text-xs text-slate-600">
            Primary keyword
            <input defaultValue={b.primary_keyword ?? ""} onBlur={(e) => onConfig({ primary_keyword: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <label className="text-xs text-slate-600">
            CTA destination
            <input defaultValue={b.cta_destination ?? ""} onBlur={(e) => onConfig({ cta_destination: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
        </div>
      </div>

      {/* Scripts */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Scripts</h2>
          <div className="flex gap-2">
            <button onClick={onScripts} disabled={!b.selected_angle_id || busy !== null}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
              {busy === "scripts" ? "Writing…" : scripts.length ? "Rewrite both" : "Write both scripts"}
            </button>
            <button onClick={onCompare} disabled={scripts.length < 2 || busy !== null}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40">
              {busy === "compare" ? "Comparing…" : "Compare"}
            </button>
          </div>
        </div>
        {!b.selected_angle_id && (
          <Banner tone="info">Choose an angle on screen 2 first. Scripts are written from an approved angle.</Banner>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {scripts.map((sc) => (
            <ScriptCard key={sc.id} sc={sc} busy={busy} onEdit={onEdit} onRevert={onRevert} />
          ))}
        </div>
      </div>

      {comparison && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Comparison</h2>
          {comparison.stale && (
            <p className="mb-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <strong>Out of date.</strong> A script was edited after this ran, so the result below describes
              the previous version. Re-run the comparison before treating the package as checked.
            </p>
          )}
          <p className="text-sm text-slate-700">
            Lexical similarity <strong>{comparison.lexical_similarity}</strong> against a threshold of{" "}
            {comparison.similarity_threshold}.{" "}
            {comparison.similarity_exceeded ? "Too similar to be two reading levels." : "Within range."}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Conceptual equivalence:{" "}
            {comparison.equivalence_ok === null ? "not checked"
              : comparison.equivalence_ok ? "both scripts teach the same thing"
              : "the two scripts have diverged"}
            {comparison.equivalence_notes ? ` — ${comparison.equivalence_notes}` : ""}
          </p>
          {comparison.equivalence_ok === false && (
            <p className="mt-2 rounded bg-red-50 px-3 py-2 text-xs text-red-900">
              Divergence is not overridable. An override permits the two scripts to look alike; it says nothing
              about them teaching different lessons. Rewrite instead.
            </p>
          )}
          {comparison.similarity_exceeded && !comparison.owner_override && (
            <div className="mt-3 flex gap-2">
              <input value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for overriding the similarity warning"
                className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm" />
              <button onClick={() => onOverride(reason)} disabled={!reason.trim() || busy !== null}
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-40">
                Override
              </button>
            </div>
          )}
          {comparison.owner_override && (
            <p className="mt-2 text-xs text-slate-500">Overridden: {comparison.override_reason}</p>
          )}
        </div>
      )}

      {/* Packaging */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Packaging</h2>
          <button onClick={onPackage} disabled={scripts.length === 0 || busy !== null}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
            {busy === "package" ? "Packaging…" : pkg ? "Repackage" : "Generate packaging"}
          </button>
        </div>
        {pkg && (
          <dl className="rounded-lg border border-slate-200 bg-white px-4 py-2">
            <Field label="On-screen caption" value={pkg.on_screen_caption} />
            <Field label="Post caption" value={pkg.post_caption} />
            <Field label="Call to action" value={pkg.cta_text} />
            <Field label="Keywords" value={pkg.keywords?.join(", ")} />
            <Field label="Hashtags" value={pkg.hashtags?.join(" ")} />
            <Field label="Visual notes" value={pkg.visual_notes?.join(" · ")} />
          </dl>
        )}
      </div>
    </section>
  );
}

function ReviewScreen({ scripts, comparison, qc, busy, onRun }: {
  scripts: Script[]; comparison: Comparison | null;
  qc: { draftId: string; version: number; qc: QcState } | null;
  busy: string | null; onRun: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Quality control</h2>
        <button onClick={onRun} disabled={scripts.length === 0 || busy !== null}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
          {busy === "qc" ? "Checking…" : "Run QC and save draft"}
        </button>
      </div>

      <p className="text-sm text-slate-600">
        Checks are deterministic rules, not a model reviewing its own work. Blocking is category-sensitive:
        safety, abuse, coercion, consent, clinical, legal and medical findings block at <em>high</em>, while
        voice and SEO findings surface without blocking.
      </p>

      {!qc ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          {comparison ? "Ready to check." : "Compare the two scripts first for a complete check."}
        </p>
      ) : (
        <>
          <div className={`rounded-lg border px-4 py-3 ${qc.qc.blocked ? "border-red-300 bg-red-50" : "border-emerald-300 bg-emerald-50"}`}>
            <p className="text-sm font-semibold text-slate-900">
              {qc.qc.blocked ? "Blocked" : "Passed"} — draft v{qc.version} saved for review
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Saved as a versioned draft either way. A blocked package is kept so the findings stay reviewable;
              it simply cannot proceed. Nothing publishes automatically.
            </p>
          </div>

          {qc.qc.blocking.length > 0 && (
            <FindingList title="Blocking" tone="red" findings={qc.qc.blocking} />
          )}
          {qc.qc.warnings.length > 0 && (
            <FindingList title="Warnings" tone="amber" findings={qc.qc.warnings} />
          )}
          {qc.qc.ungoverned.length > 0 && (
            <Banner tone="info">
              No blocking rule exists for: {qc.qc.ungoverned.join(", ")}. These were reported rather than
              silently ignored — add a rule in ce_qc_blocking_rules to govern them.
            </Banner>
          )}
          {!qc.qc.blocking.length && !qc.qc.warnings.length && (
            <p className="text-sm text-slate-600">No findings.</p>
          )}
        </>
      )}
    </section>
  );
}

function FindingList({ title, tone, findings }: { title: string; tone: "red" | "amber"; findings: Finding[] }) {
  const c = tone === "red" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50";
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title} ({findings.length})</h3>
      <ul className="space-y-2">
        {findings.map((f, i) => (
          <li key={i} className={`rounded border px-3 py-2 text-sm ${c}`}>
            <span className="mr-2 rounded bg-white px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-700">
              {f.category} · {f.severity}
            </span>
            {f.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One script, editable in place.
 *
 * The engine's premise is that a person reviews every draft. A reviewer who can
 * only accept or regenerate is not reviewing — so the text is editable here, and
 * an edit is recorded as an edit: the model's original is kept, the runtime is
 * recomputed on save, and the comparison is marked out of date because it was
 * measured against text that no longer exists.
 */
function ScriptCard({ sc, busy, onEdit, onRevert }: {
  sc: Script; busy: string | null;
  onEdit: (level: "grade5" | "higher", fields: { hook?: string; script_body?: string; cta?: string }) => void;
  onRevert: (level: "grade5" | "higher") => void;
}) {
  const [editing, setEditing] = useState(false);
  const [hook, setHook] = useState(sc.hook ?? "");
  const [body, setBody] = useState(sc.body);
  const [cta, setCta] = useState(sc.cta ?? "");

  // Live estimate while typing, at the same 150 wpm the server uses. Seeing the
  // runtime move as you cut is the whole point of editing here rather than
  // pasting into a doc and back.
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const spoken = [hook, body, cta].filter(Boolean).join(" ");
  const liveWords = spoken.trim() ? spoken.trim().split(/\s+/).length : 0;
  const liveSeconds = Math.round((liveWords / 150) * 60);
  const dirty = hook !== (sc.hook ?? "") || body !== sc.body || cta !== (sc.cta ?? "");

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <header className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">
          {sc.reading_level === "grade5" ? "5th-grade" : "Higher reading level"}
          {sc.edited_by_owner && (
            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
              edited
            </span>
          )}
        </h3>
        <span className={`text-xs ${editing
          ? "text-slate-500"
          : sc.runtime_within_target ? "text-emerald-700" : "text-amber-700"}`}>
          {editing
            ? `${liveWords}w · ${fmt(liveSeconds)} (live)`
            : `${sc.word_count}w · ${fmt(sc.estimated_runtime_seconds)}${sc.runtime_within_target ? "" : " (off target)"}`}
        </span>
      </header>

      {!editing ? (
        <>
          {sc.hook && <p className="mb-2 text-sm font-medium text-slate-800">{sc.hook}</p>}
          <p className="whitespace-pre-wrap text-sm text-slate-700">{sc.body}</p>
          {sc.cta && <p className="mt-2 text-sm font-medium text-slate-800">{sc.cta}</p>}
          <div className="mt-3 flex gap-2">
            <button onClick={() => setEditing(true)} disabled={busy !== null}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 disabled:opacity-40">
              Edit
            </button>
            {sc.generated_body && (
              <button onClick={() => onRevert(sc.reading_level)} disabled={busy !== null}
                title="Restore exactly what the model produced"
                className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-500 disabled:opacity-40">
                Revert to generated
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <label className="block text-xs text-slate-500">
            Hook
            <input value={hook} onChange={(e) => setHook(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <label className="block text-xs text-slate-500">
            Body <span className="text-slate-400">({words} words)</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <label className="block text-xs text-slate-500">
            Call to action
            <input value={cta} onChange={(e) => setCta(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onEdit(sc.reading_level, { hook, script_body: body, cta }); setEditing(false); }}
              disabled={!dirty || !body.trim() || busy !== null}
              className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">
              Save edit
            </button>
            <button
              onClick={() => { setHook(sc.hook ?? ""); setBody(sc.body); setCta(sc.cta ?? ""); setEditing(false); }}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600">
              Cancel
            </button>
            <span className="text-xs text-slate-500">Saving marks the comparison out of date.</span>
          </div>
        </div>
      )}
    </article>
  );
}

function SeriesPicker({ b, series, busy, onConfig }: {
  b: Brief; series: Series[]; busy: string | null; onConfig: (p: Record<string, unknown>) => void;
}) {
  const active = series.find((x) => x.id === b.content_series_id);
  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Content series</h3>
        <select value={b.content_series_id ?? ""} disabled={busy !== null}
          onChange={(e) => onConfig({ content_series_id: e.target.value || null })}
          className="rounded border border-slate-300 px-2 py-1 text-sm">
          <option value="">No series</option>
          {series.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {active?.description ?? "A series can require its own briefing structure before any script is written."}
      </p>
    </div>
  );
}

/**
 * The seven-part Real Talk argument.
 *
 * This is what makes Real Talk a series rather than a setting. The parts are the
 * argument: what is uncomfortable and true, who it is for, what is commonly
 * misunderstood, the nuance that keeps it honest, the mechanism, the
 * consequence, and what to actually do. No script in this series is written
 * until all seven exist — enforced in the workflow and by a database check, not
 * only here.
 */
function RealTalkPanel({ rt, busy, onSave }: {
  rt: RealTalk | null; busy: string | null;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const PARTS: [keyof RealTalk, string, string][] = [
    ["uncomfortable_truth", "The uncomfortable truth", "What is true and hard to hear?"],
    ["audience_description", "Who this is for", "Who specifically needs to hear it?"],
    ["common_misunderstanding", "What gets misunderstood", "What do people get wrong about this?"],
    ["necessary_nuance", "The nuance that keeps it honest", "What would make this unfair if left out?"],
    ["relational_mechanism", "The relational mechanism", "Why does this actually happen?"],
    ["consequence", "The consequence", "What does it cost when it goes unaddressed?"],
    ["practical_takeaway", "The practical takeaway", "What should they do differently?"],
  ];
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(PARTS.map(([k]) => [k, (rt?.[k] as string) ?? ""])),
  );
  const [intensity, setIntensity] = useState(rt?.intensity ?? "direct");
  const [over, setOver] = useState(rt?.overgeneralization_risk ?? "");
  const [rep, setRep] = useState(rt?.reputational_risk_check ?? "");
  const [foundation, setFoundation] = useState(rt?.rlc_foundation ?? "");

  const missing = PARTS.filter(([k]) => !vals[k]?.trim()).map(([, label]) => label);
  const unfilteredBlocked = intensity === "unfiltered" && (!over.trim() || !rep.trim());
  const canComplete = missing.length === 0 && !unfilteredBlocked;

  const save = (complete: boolean) => onSave({
    intensity, parts: vals, complete,
    overgeneralization_risk: over || null,
    reputational_risk_check: rep || null,
    rlc_foundation: foundation || null,
  });

  return (
    <section className="mb-6 rounded-lg border border-slate-900 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Real Talk brief</h3>
        <span className={`rounded px-2 py-0.5 text-xs ${rt?.complete
          ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
          {rt?.complete ? "complete" : `${7 - missing.length}/7 parts`}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-600">
        No script in this series is written until all seven parts exist. An intensity setting with no
        argument behind it produces something that sounds unflinching and establishes nothing.
      </p>

      <div className="mt-3 space-y-2">
        {PARTS.map(([k, label, hint]) => (
          <label key={String(k)} className="block text-xs text-slate-600">
            {label} <span className="text-slate-400">— {hint}</span>
            <textarea rows={2} value={vals[k as string]}
              onChange={(e) => setVals({ ...vals, [k as string]: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
          </label>
        ))}
        <label className="block text-xs text-slate-600">
          RLC foundation — which part of the framework this rests on
          <input value={foundation} onChange={(e) => setFoundation(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-700">Intensity</span>
        {["light", "direct", "unfiltered"].map((v) => (
          <button key={v} onClick={() => setIntensity(v)}
            className={`rounded px-2 py-1 text-xs ${intensity === v
              ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-600"}`}>
            {v}
          </button>
        ))}
      </div>

      {intensity === "unfiltered" && (
        <div className="mt-3 space-y-2 rounded border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-900">
            Unfiltered requires both risk checks. The database refuses to mark it complete without them.
          </p>
          <label className="block text-xs text-amber-900">
            Overgeneralisation risk — who would this be unfair to?
            <textarea rows={2} value={over} onChange={(e) => setOver(e.target.value)}
              className="mt-1 w-full rounded border border-amber-300 px-2 py-1 text-sm text-slate-900" />
          </label>
          <label className="block text-xs text-amber-900">
            Reputational risk check — how could this be quoted against you?
            <textarea rows={2} value={rep} onChange={(e) => setRep(e.target.value)}
              className="mt-1 w-full rounded border border-amber-300 px-2 py-1 text-sm text-slate-900" />
          </label>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={() => save(false)} disabled={busy !== null}
          className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 disabled:opacity-40">
          Save progress
        </button>
        <button onClick={() => save(true)} disabled={busy !== null || !canComplete}
          className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">
          Mark complete
        </button>
        {missing.length > 0 && (
          <span className="text-xs text-slate-500">Still needed: {missing.join(", ")}</span>
        )}
        {unfilteredBlocked && (
          <span className="text-xs text-amber-800">Unfiltered needs both risk checks.</span>
        )}
      </div>
    </section>
  );
}

const CLAIM_TYPES = [
  "empirical", "statistical", "medical", "legal",
  "historical", "quoted", "current_event", "interpretation",
] as const;

/**
 * Stage 2 — claim verification.
 *
 * On screen 1 on purpose: what is factually true has to be settled before any
 * words exist, for the same reason the framework mapping does. Once you are
 * reading draft copy it is much harder to notice that a confident sentence
 * rests on nothing.
 *
 * The review is recorded even when there are no claims. "This asserts nothing"
 * and "nobody checked" are the same row otherwise.
 */
function ClaimsPanel({ claims, readiness, busy, onSave, onDelete, onReview }: {
  claims: Claim[]; readiness: ClaimReadiness; busy: string | null;
  onSave: (p: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onReview: () => void;
}) {
  const [text, setText] = useState("");
  const [type, setType] = useState<string>("empirical");
  const [risk, setRisk] = useState("medium");
  const [sourceUrl, setSourceUrl] = useState("");
  const [recheck, setRecheck] = useState("");

  const needsSource = type !== "interpretation";
  const canVerify = !needsSource || !!sourceUrl.trim();

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">Claim verification</h2>
        <span className={`rounded px-2 py-0.5 text-xs ${readiness.ready
          ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
          {readiness.ready ? "reviewed" : `${readiness.counts.unverified} unverified`}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-600">
        Applies to every brief, evergreen included. The rule is that the step is not skipped — a brief that
        asserts nothing still needs the review recorded, or &ldquo;no claims&rdquo; and &ldquo;nobody
        checked&rdquo; look identical.
      </p>

      {claims.length > 0 && (
        <ul className="mt-3 space-y-2">
          {claims.map((c) => (
            <li key={c.id} className="rounded border border-slate-200 px-3 py-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-slate-800">{c.claim_text}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {c.claim_type} · {c.risk_level} risk · {c.verification_status}
                    {c.recheck_at ? ` · recheck ${c.recheck_at}` : ""}
                    {c.sources?.length ? ` · ${c.sources.length} source(s)` : ""}
                  </p>
                  {c.sources?.map((src, i) => src.url && (
                    <a key={i} href={src.url} target="_blank" rel="noreferrer"
                      className="mr-2 text-xs text-slate-600 underline">{src.title || src.url}</a>
                  ))}
                </div>
                <div className="flex shrink-0 gap-1">
                  {c.verification_status !== "verified" && (
                    <button
                      onClick={() => onSave({
                        claim_id: c.id, claim_text: c.claim_text, claim_type: c.claim_type,
                        claim_status: "verified", sources: c.sources, risk_level: c.risk_level,
                        recheck_at: c.recheck_at,
                      })}
                      disabled={busy !== null || (c.claim_type !== "interpretation" && !c.sources?.length)}
                      title={c.claim_type !== "interpretation" && !c.sources?.length
                        ? "A claim about the world cannot be verified with no source"
                        : "Mark verified"}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">
                      Verify
                    </button>
                  )}
                  <button onClick={() => onDelete(c.id)} disabled={busy !== null}
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-500 disabled:opacity-40">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add */}
      <div className="mt-3 space-y-2 rounded border border-dashed border-slate-300 p-3">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
          placeholder="A factual claim this content will make…"
          className="w-full rounded border border-slate-300 px-2 py-1 text-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="rounded border border-slate-300 px-2 py-1 text-xs">
            {CLAIM_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}
            className="rounded border border-slate-300 px-2 py-1 text-xs">
            {["low", "medium", "high"].map((r) => <option key={r}>{r} risk</option>)}
          </select>
          <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}
            placeholder={needsSource ? "Source URL (required to verify)" : "Source (optional for interpretation)"}
            className="min-w-[220px] flex-1 rounded border border-slate-300 px-2 py-1 text-xs" />
          <input type="date" value={recheck} onChange={(e) => setRecheck(e.target.value)}
            title="Recheck date" className="rounded border border-slate-300 px-2 py-1 text-xs" />
          <button
            onClick={() => {
              onSave({
                claim_text: text, claim_type: type, risk_level: risk.split(" ")[0],
                sources: sourceUrl ? [{ url: sourceUrl }] : [],
                claim_status: canVerify && sourceUrl ? "verified" : "unverified",
                recheck_at: recheck || null,
              });
              setText(""); setSourceUrl(""); setRecheck("");
            }}
            disabled={busy !== null || !text.trim()}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">
            Add claim
          </button>
        </div>
        {type === "interpretation" && (
          <p className="text-xs text-slate-500">
            An interpretation is verified by being labelled as a reading, not by a citation — so no source
            is required. Recording a framework reading as an empirical claim is the mistake this type prevents.
          </p>
        )}
      </div>

      {!readiness.ready && readiness.reasons.length > 0 && (
        <ul className="mt-3 space-y-1">
          {readiness.reasons.map((r, i) => (
            <li key={i} className="rounded bg-amber-50 px-3 py-1.5 text-xs text-amber-900">{r}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button onClick={onReview}
          disabled={busy !== null || readiness.reviewed
            || readiness.reasons.some((r) => !r.startsWith("The claim review has not been recorded"))}
          className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">
          {readiness.reviewed ? "Review recorded" : "Record claim review"}
        </button>
        <span className="text-xs text-slate-500">
          Scripts cannot be generated until this is recorded.
        </span>
      </div>
    </section>
  );
}
