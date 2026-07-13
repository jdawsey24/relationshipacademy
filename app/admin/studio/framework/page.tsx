import Link from "next/link";
import StudioNav from "@/components/admin/StudioNav";
import FrameworkBrowser from "@/components/admin/FrameworkBrowser";
import { getFrameworkTree } from "@/lib/studioFrameworkData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The Framework — the canonical source of truth for the Relationship Life Cycle™.
// Replaces the old flat "Knowledge Base". Server component: reads the hierarchy
// once, hands it to the client browser.
export default async function FrameworkPage() {
  const tree = await getFrameworkTree();
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">
        The <strong>Framework</strong> is the canonical source of truth — Phase → Domain → Competency → Behavioral Indicators.
        Open a competency to enter its workspace, the operational hub where all of its assets are built, reviewed, and published.
      </p>
      <StudioNav />

      <div className="mb-5 flex flex-wrap gap-2 text-xs">
        {[
          "Phases", "Domains", "Competencies", "Behavioral Indicators",
        ].map((s) => (
          <span key={s} className="rounded-full bg-midnight-navy/5 px-3 py-1 font-medium text-midnight-navy">{s}</span>
        ))}
        <Link href="/admin/studio/assessment/scoring" className="rounded-full border border-light-gray px-3 py-1 text-charcoal/60 hover:bg-light-gray">Structural Markers →</Link>
      </div>

      <FrameworkBrowser tree={tree} />
    </div>
  );
}
