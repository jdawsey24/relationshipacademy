import { notFound } from "next/navigation";
import CompetencyProfile from "@/components/admin/CompetencyProfile";
import { getCompetencyByCode } from "@/lib/studioFrameworkData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Overview tab — the canonical Framework profile for this competency.
export default async function CompetencyOverviewPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const competency = await getCompetencyByCode(decodeURIComponent(code));
  if (!competency) notFound();
  return <CompetencyProfile competency={competency} />;
}
