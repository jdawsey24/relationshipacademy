import Link from "next/link";
import StudioNav from "@/components/admin/StudioNav";
import { listObjects } from "@/lib/studioData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Review Queue hub — surfaces the two review paths that already exist:
//   1. Governance registry objects awaiting owner review (studio_objects).
//   2. AI-generated drafts staged in the AI Authoring Studio.
// Thin: it counts + links; the actual review UIs are unchanged.
export default async function ReviewHubPage() {
  const inReview = await listObjects({ status: "in_review", includeOwnerOnly: true });

  const Card = ({ href, title, body, count }: { href: string; title: string; body: string; count?: number }) => (
    <Link href={href} className="rounded-lg border border-light-gray p-4 transition-colors hover:border-midnight-navy hover:bg-light-gray/40">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-midnight-navy">{title}</div>
        {typeof count === "number" && count > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{count}</span>}
      </div>
      <div className="mt-1 text-xs text-charcoal/60">{body}</div>
    </Link>
  );

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Review Queue — everything awaiting your review before it can be approved or published.</p>
      <StudioNav />

      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          href="/admin/studio"
          title="Governance registry — in review"
          body="Governed objects (articles and more) submitted for review in the versioned registry. Approve, request changes, or publish."
          count={inReview.length}
        />
        <Card
          href="/admin/ai/review"
          title="AI Authoring — staged drafts"
          body="AI-generated assessment items and content awaiting review, with quality checks and duplicate detection, before promotion to the canonical libraries."
        />
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        AI drafts generated inside a competency workspace appear in the item bank / content library as Drafts — approve them there or from the competency&apos;s Assessment and Content tabs.
      </p>
    </div>
  );
}
