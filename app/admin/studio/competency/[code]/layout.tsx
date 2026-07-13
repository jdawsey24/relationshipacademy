import Link from "next/link";
import { notFound } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import CompetencyWorkspaceTabs from "@/components/admin/CompetencyWorkspaceTabs";
import { getCompetencyByCode, getWorkspaceCounts } from "@/lib/studioFrameworkData";
import { domainLabel, phaseLabel } from "@/lib/studioFramework";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Competency Workspace shell — the primary operational workspace of RLC Studio.
// Loads the competency once (cached) and frames its tabs. Everything below the
// header belongs to this single competency.
export default async function CompetencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);
  const competency = await getCompetencyByCode(code);
  if (!competency) notFound();

  const counts = await getWorkspaceCounts(code);
  const contentTotal = Object.values(counts.content).reduce((a, b) => a + b, 0);
  const badges: Record<string, number> = {
    indicators: counts.indicators.behavioral,
    assessment: counts.items.total,
    content: contentTotal,
    publishing: counts.published,
  };

  const domain = competency.domain_slug ?? "";
  const phase = competency.phase_slug ?? competency.competency_phase_slug ?? "";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Competency Workspace — the operational hub for everything this competency owns.</p>
      <StudioNav />

      <nav className="mb-3 text-xs text-charcoal/50">
        <Link href="/admin/studio/framework" className="hover:underline">Framework</Link>
        {domain && <> <span className="px-1">/</span> {domainLabel(domain)}</>}
        {phase && <> <span className="px-1">/</span> {phaseLabel(phase)}</>}
      </nav>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-midnight-navy">{competency.name}</h2>
        <span className="font-mono text-xs text-charcoal/45">{competency.code}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${competency.status === "retired" ? "bg-light-gray text-charcoal/50" : "bg-sage-green/20 text-sage-green"}`}>{competency.status}</span>
        {domain && <span className="rounded bg-dusty-plum/10 px-2 py-0.5 text-[11px] text-dusty-plum">{domainLabel(domain)}</span>}
        {phase && <span className="rounded bg-sage-green/15 px-2 py-0.5 text-[11px] text-sage-green">{phaseLabel(phase)}</span>}
      </div>

      <CompetencyWorkspaceTabs code={code} badges={badges} />

      {children}
    </div>
  );
}
