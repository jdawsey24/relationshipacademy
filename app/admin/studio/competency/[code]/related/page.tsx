import Link from "next/link";
import { getRelatedAssets } from "@/lib/studioFrameworkData";
import { WORKSPACE_CONTENT_TYPES } from "@/lib/studioFramework";
import { LEARNING_TABLES } from "@/lib/studioLibrary";
import { DESTINATIONS } from "@/lib/publishing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Related Assets tab — read-only ECOSYSTEM TRACEABILITY. Everywhere this
// competency is currently used: which assessments carry its items, how much
// content exists, its recommendation rules, and which live destinations surface
// its assets. Distinct from Content (which manages assets); this is "where used".
const destLabel = (v: string) => DESTINATIONS.find((d) => d.value === v)?.label ?? v;

export default async function CompetencyRelatedPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const rel = await getRelatedAssets(decodeURIComponent(code));
  const contentTotal = Object.values(rel.content).reduce((a, b) => a + b, 0);
  const empty = rel.assessments.length === 0 && contentTotal === 0 && rel.recommendations === 0 && rel.destinations.length === 0;

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-lg border border-light-gray p-4">
      <h3 className="mb-2 text-sm font-semibold text-midnight-navy">{title}</h3>
      {children}
    </section>
  );

  return (
    <div>
      <p className="mb-4 max-w-2xl text-sm text-charcoal/70">Complete traceability — everywhere this competency currently appears across the ecosystem.</p>

      {empty && <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">This competency isn&apos;t referenced by any assets yet.</p>}

      <div className="grid gap-3 lg:grid-cols-2">
        {rel.assessments.length > 0 && (
          <Card title="Assessments using this competency">
            <ul className="space-y-1 text-sm">
              {rel.assessments.map((a) => (
                <li key={a.assessment_id} className="flex items-center justify-between">
                  <span className="text-charcoal/80">{a.name}</span>
                  <span className="text-xs text-charcoal/50">{a.itemCount} item{a.itemCount === 1 ? "" : "s"}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {contentTotal > 0 && (
          <Card title="Content assets">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {WORKSPACE_CONTENT_TYPES.filter((t) => (rel.content[t] ?? 0) > 0).map((t) => (
                <li key={t} className="flex items-center justify-between">
                  <span className="text-charcoal/80">{LEARNING_TABLES[t].label}</span>
                  <span className="text-xs text-charcoal/50">{rel.content[t]}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Recommendation rules">
          <p className="text-sm text-charcoal/80">{rel.recommendations} recommendation mapping{rel.recommendations === 1 ? "" : "s"} reference this competency.</p>
          <Link href="/admin/studio/assessment/recommendation-mappings" className="mt-1 inline-block text-xs text-midnight-navy hover:underline">Open Recommendation Mappings →</Link>
        </Card>

        {rel.destinations.length > 0 && (
          <Card title="Published destinations">
            <ul className="space-y-1 text-sm">
              {rel.destinations.map((d) => (
                <li key={d.destination} className="flex items-center justify-between">
                  <span className="text-charcoal/80">{destLabel(d.destination)}</span>
                  <span className="text-xs text-charcoal/50">{d.count} asset{d.count === 1 ? "" : "s"}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
