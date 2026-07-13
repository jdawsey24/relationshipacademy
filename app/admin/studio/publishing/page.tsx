import Link from "next/link";
import StudioNav from "@/components/admin/StudioNav";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Publishing hub — a thin entry point to the existing publishing surfaces. No
// logic is reimplemented here; the owner+MFA-gated actions live where they
// already work. Publication for a single competency is visible in its workspace.
const SURFACES = [
  {
    href: "/admin/ai/publishing",
    title: "Content Publishing (destinations)",
    body: "Route approved Content Library records to their destinations (Resource Library, Academy, Institute, Books, Course Lessons, …) via publication mappings — one source, many destinations, no duplication.",
  },
  {
    href: "/admin/studio/assessment/recommendations",
    title: "Result Recommendations (live)",
    body: "Manage and publish the recommendation rows that power the assessment results “What’s Next” block. Owner-gated publish replaces the live set.",
  },
];

export default function PublishingHubPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Publishing — route approved assets to where members and visitors see them. Approved/published assets only.</p>
      <StudioNav />

      <div className="grid gap-3 sm:grid-cols-2">
        {SURFACES.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-lg border border-light-gray p-4 transition-colors hover:border-midnight-navy hover:bg-light-gray/40">
            <div className="text-sm font-semibold text-midnight-navy">{s.title}</div>
            <div className="mt-1 text-xs text-charcoal/60">{s.body}</div>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        To see where a single competency&apos;s assets are published, open its workspace → <span className="font-medium">Publishing</span> tab.
      </p>
    </div>
  );
}
