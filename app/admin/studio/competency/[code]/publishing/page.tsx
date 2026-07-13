import Link from "next/link";
import { getCompetencyPublishing } from "@/lib/studioFrameworkData";
import { DESTINATIONS } from "@/lib/publishing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Publishing tab — this competency's publishable content assets and where each is
// currently published. Read view; the actual publish/unpublish toggle is owner +
// MFA gated and lives in the Publishing hub, one click away.
const destLabel = (v: string) => DESTINATIONS.find((d) => d.value === v)?.label ?? v;
const TYPE_LABEL: Record<string, string> = {
  worksheet: "Worksheet", practice: "Practice", activity: "Activity",
  conversation_guide: "Conversation Guide", journal_prompt: "Journal Prompt", video: "Video",
};

export default async function CompetencyPublishingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const rows = await getCompetencyPublishing(decodeURIComponent(code));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-sm text-charcoal/70">Approved &amp; published assets for this competency, and their live destinations. Only approved/published assets can be routed.</p>
        <Link href="/admin/studio/publishing" className="shrink-0 rounded-md border border-midnight-navy px-3 py-1.5 text-sm font-medium text-midnight-navy hover:bg-light-gray">Manage in Publishing →</Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">
          No approved assets yet. Approve content in the <Link href="/admin/studio/review" className="text-midnight-navy hover:underline">Review Queue</Link> to make it publishable.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Asset</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Published to</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.source_type}-${r.id}`} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2">
                    <span className="font-medium text-charcoal/90">{r.label || "—"}</span>
                    <span className="block text-[11px] text-charcoal/40">{r.id}</span>
                  </td>
                  <td className="px-3 py-2 text-charcoal/70">{TYPE_LABEL[r.source_type] ?? r.source_type}</td>
                  <td className="px-3 py-2 capitalize text-charcoal/70">{r.status}</td>
                  <td className="px-3 py-2">
                    {r.destinations.length === 0 ? (
                      <span className="text-charcoal/40">Not published</span>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {r.destinations.map((d) => (
                          <span key={d} className="rounded-full bg-sage-green/15 px-2 py-0.5 text-[11px] text-sage-green">{destLabel(d)}</span>
                        ))}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
