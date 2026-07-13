import Link from "next/link";
import { getWorkspaceCounts } from "@/lib/studioFrameworkData";
import { WORKSPACE_CONTENT_TYPES } from "@/lib/studioFramework";
import { LEARNING_TABLES } from "@/lib/studioLibrary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Health tab — a COMPLETENESS dashboard (not analytics). Shows what exists for
// this competency and, crucially, what's missing — the roadmap for finishing the
// ecosystem around it.
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function CompetencyHealthPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);
  const base = `/admin/studio/competency/${encodeURIComponent(code)}`;
  const counts = await getWorkspaceCounts(code);

  const rows: { label: string; value: number; ok: boolean; note?: string }[] = [
    { label: "Assessment items — approved", value: counts.items.approved, ok: counts.items.approved > 0 },
    { label: "Assessment items — draft", value: counts.items.draft, ok: true, note: "informational" },
    { label: "Behavioral indicators", value: counts.indicators.behavioral, ok: counts.indicators.behavioral > 0 },
    ...WORKSPACE_CONTENT_TYPES.map((t) => ({
      label: LEARNING_TABLES[t].label,
      value: counts.content[t] ?? 0,
      ok: (counts.content[t] ?? 0) > 0,
    })),
    { label: "Recommendations", value: counts.recommendations, ok: counts.recommendations > 0 },
    { label: "Published assets", value: counts.published, ok: true, note: "informational" },
  ];

  const gaps = rows.filter((r) => !r.ok && r.note !== "informational");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-sm text-charcoal/70">Completeness status for this competency. Empty essentials are flagged so you can see exactly what to build next.</p>
        <span className="text-xs text-charcoal/50">Last item update: {fmtDate(counts.lastUpdated)}</span>
      </div>

      {gaps.length > 0 && (
        <div className="mb-5 rounded-md border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="mb-1 text-sm font-semibold text-amber-900">Missing ({gaps.length})</div>
          <p className="text-sm text-amber-800">{gaps.map((g) => g.label).join(" · ")}</p>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className={`flex items-center justify-between rounded-md border px-3 py-2.5 ${r.ok || r.note === "informational" ? "border-light-gray" : "border-amber-300 bg-amber-50/40"}`}>
            <span className="text-sm text-charcoal/80">{r.label}</span>
            <span className={`text-sm font-semibold ${r.value > 0 ? "text-midnight-navy" : "text-charcoal/40"}`}>{r.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        Build missing assets from the <Link href={`${base}/assessment`} className="text-midnight-navy hover:underline">Assessment</Link> and{" "}
        <Link href={`${base}/content`} className="text-midnight-navy hover:underline">Content</Link> tabs — AI generation is available in place.
      </p>
    </div>
  );
}
