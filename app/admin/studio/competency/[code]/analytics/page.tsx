import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompetencyByCode } from "@/lib/studioFrameworkData";
import { getCompetencyAnalytics, type Provenance } from "@/lib/studioAnalyticsData";
import { COVERAGE_TIER_LABELS } from "@/lib/questionMap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Analytics tab — V1 architecture scaffold. Strict separation between
// competency-specific data (inventory, owner simulations) and broader phase/
// domain context (shared, NOT this competency). Validated live per-competency
// analytics do not exist yet; the future metrics are scaffolded, not faked.

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ProvLine({ prov }: { prov: Provenance }) {
  return (
    <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-charcoal/50">
      <div><dt className="inline font-medium">Source:</dt> <dd className="inline">{prov.source}</dd></div>
      <div><dt className="inline font-medium">Version:</dt> <dd className="inline">{prov.version ?? "—"}</dd></div>
      <div><dt className="inline font-medium">Validation:</dt> <dd className="inline">{prov.validation}</dd></div>
      <div><dt className="inline font-medium">Updated:</dt> <dd className="inline">{fmtDate(prov.updatedAt)}</dd></div>
    </dl>
  );
}

export default async function CompetencyAnalyticsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);
  const competency = await getCompetencyByCode(code);
  if (!competency) notFound();
  const a = await getCompetencyAnalytics(code, competency);
  const base = `/admin/studio/competency/${encodeURIComponent(code)}`;

  return (
    <div className="space-y-6">
      {/* Prominent honesty banner */}
      <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <span className="font-semibold">Validated live-respondent analytics for this individual competency are not yet available.</span>{" "}
        The metrics below are authoring inventory, owner simulation results, an <span className="font-semibold">exploratory</span> live mapped response summary, and broader phase/domain context — <span className="font-semibold">not</span> validated performance for this competency. See “Not yet tracked” for what’s coming and why.
      </div>

      {/* 1. Inventory (concise — full breakdown lives in Health) */}
      <section className="rounded-lg border border-light-gray p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-midnight-navy">Inventory</h3>
          <Link href={`${base}/health`} className="text-xs text-midnight-navy hover:underline">See the Health tab for the full breakdown →</Link>
        </div>
        <p className="mt-1 text-sm text-charcoal/80">
          <strong>{a.inventory.items}</strong> assessment items ({a.inventory.approvedItems} approved) · <strong>{a.inventory.content}</strong> content assets · <strong>{a.inventory.indicators}</strong> indicators · <strong>{a.inventory.recommendations}</strong> recommendation mappings
        </p>
        <ProvLine prov={a.inventory.prov} />
      </section>

      {/* 2. Simulation performance (competency-specific, provisional owner data) */}
      <section className="rounded-lg border border-light-gray p-4">
        <h3 className="text-sm font-semibold text-midnight-navy">Simulation performance <span className="font-normal text-charcoal/50">· this competency</span></h3>
        {a.simulation.attempts === 0 ? (
          <p className="mt-1 text-sm text-charcoal/55">No scoring simulations reference this competency yet. Run one from Studio → Assessment → Scoring to populate this.</p>
        ) : (
          <div className="mt-1 flex flex-wrap gap-6 text-sm">
            <div><div className="text-lg font-semibold text-midnight-navy">{a.simulation.avgScore ?? "—"}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">Avg simulated score (1–5)</div></div>
            <div><div className="text-lg font-semibold text-midnight-navy">{a.simulation.attempts}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">Simulation results</div></div>
            <div><div className="text-lg font-semibold text-midnight-navy">{a.simulation.confidence.ok}/{a.simulation.confidence.insufficient}/{a.simulation.confidence.suppressed}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">OK / insufficient / suppressed</div></div>
          </div>
        )}
        <p className="mt-2 rounded bg-dusty-plum/5 px-2 py-1 text-[11px] text-dusty-plum">Provisional simulation results (owner test data) — <strong>not comparable</strong> to the live aggregates below (different scoring scale and version).</p>
        <ProvLine prov={a.simulation.prov} />
      </section>

      {/* 3. Live mapped response summary — governed traceability → DESCRIPTIVE (exploratory) */}
      <section className="rounded-lg border border-light-gray p-4">
        <h3 className="text-sm font-semibold text-midnight-navy">Live mapped response summary <span className="font-normal text-charcoal/50">· this competency</span></h3>
        {a.liveSummary.mappedQuestions === 0 ? (
          <p className="mt-1 text-sm text-charcoal/55">
            No live Snapshot questions are mapped to this competency yet. Map them in{" "}
            <Link href="/admin/studio/assessment/question-map" className="text-midnight-navy hover:underline">Studio → Assessment → Question Map</Link>.
          </p>
        ) : (
          <>
            <div className="mt-1 flex flex-wrap gap-6 text-sm">
              <div><div className="text-lg font-semibold text-midnight-navy">{a.liveSummary.descriptiveMean ?? "—"}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">Descriptive mean (1–5)</div></div>
              <div><div className="text-lg font-semibold text-midnight-navy">{a.liveSummary.mappedQuestions}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">Mapped questions</div></div>
              <div><div className="text-lg font-semibold text-midnight-navy">{a.liveSummary.mappedIndicators}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">Mapped indicators</div></div>
              <div><div className="text-lg font-semibold text-midnight-navy">{a.liveSummary.contributingSessions}</div><div className="text-[11px] uppercase tracking-wide text-charcoal/50">Contributing sessions</div></div>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-charcoal/55">
              <span><span className="font-medium">Coverage:</span> {COVERAGE_TIER_LABELS[a.liveSummary.coverageTier]}</span>
              <span><span className="font-medium">Assessment version:</span> {a.liveSummary.assessmentVersion ?? "—"}</span>
              <span><span className="font-medium">Mapping version:</span> {a.liveSummary.mappingVersion ? `v${a.liveSummary.mappingVersion}` : "—"}</span>
              <span><span className="font-medium">Validation:</span> {a.liveSummary.validationStatus}</span>
            </div>
            {a.liveSummary.excludedIncompatible > 0 && <p className="mt-1 text-[11px] text-amber-700">{a.liveSummary.excludedIncompatible} mapped question(s) excluded — incompatible response model (e.g. expiration-risk items).</p>}
            {a.liveSummary.directExcluded > 0 && <p className="mt-1 text-[11px] text-amber-700">{a.liveSummary.directExcluded} direct-to-competency mapping(s) excluded from this summary (scoring-ineligible).</p>}
          </>
        )}
        <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-800"><strong>Exploratory — not psychometrically validated.</strong> A 47-item Snapshot does not validly measure all 111 competencies; this is descriptive traceability, not a competency score.</p>
      </section>

      {/* 4. Broader context — phase & domain (shared, NOT this competency) */}
      <section className="rounded-lg border border-dashed border-light-gray bg-light-gray/20 p-4">
        <h3 className="text-sm font-semibold text-charcoal/70">Broader context — phase &amp; domain</h3>
        <p className="mb-3 text-xs text-charcoal/55">Live respondent averages for the whole phase / domain. <span className="font-semibold">Shared across every competency in this phase/domain — not a measure of this competency.</span></p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ContextCard title="Phase average" ctx={a.phaseContext} />
          <ContextCard title="Domain average" ctx={a.domainContext} />
        </div>
      </section>

      {/* 5. Not yet tracked — real future events, scaffolded */}
      <section>
        <h3 className="mb-1 text-sm font-semibold text-midnight-navy">Not yet tracked <span className="font-normal text-charcoal/50">· per competency</span></h3>
        <p className="mb-3 text-xs text-charcoal/55">These require engagement instrumentation on the live assessment path (a deliberate, separate step — not built here).</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Recommendation displayed", "Needs a recommendation-impression log on /api/results."],
            ["Recommendation clicked", "Needs click events on recommendation surfaces."],
            ["Resource started", "Needs engagement events on published resources."],
            ["Resource completed", "Needs completion events on published resources."],
          ].map(([title, note]) => (
            <div key={title} className="rounded-md border border-light-gray bg-light-gray/30 px-3 py-2.5">
              <div className="text-sm font-medium text-charcoal/50">{title}</div>
              <div className="mt-0.5 text-[11px] text-charcoal/45">{note}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContextCard({ title, ctx }: { title: string; ctx: import("@/lib/studioAnalyticsData").ContextStat | null }) {
  if (!ctx) {
    return (
      <div className="rounded-md border border-light-gray px-3 py-2.5">
        <div className="text-[11px] uppercase tracking-wide text-charcoal/50">{title}</div>
        <div className="mt-1 text-sm text-charcoal/45">Not available.</div>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-light-gray bg-white px-3 py-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-wide text-charcoal/50">{title}</span>
        <span className="text-[11px] text-charcoal/45">{ctx.label}</span>
      </div>
      <div className="mt-1 text-lg font-semibold text-midnight-navy">{ctx.avg ?? "—"}<span className="ml-1 text-[11px] font-normal text-charcoal/45">avg · n={ctx.count}</span></div>
      <ProvLine prov={ctx.prov} />
    </div>
  );
}
