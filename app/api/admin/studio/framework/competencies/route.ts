import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getFrameworkTree } from "@/lib/studioFrameworkData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Framework-owned competency registry. The canonical list for the Studio
// Assistant (context resolution + picker) and any future consumer that needs the
// competency set — competencies belong to the Framework, not the Assessment
// module. Returns id/name/domain/phase/status. Resilient (empty pre-data).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const tree = await getFrameworkTree();
  const competencies = tree.competencies.map((c) => ({
    id: c.code,
    name: c.name,
    domain: c.domain_slug,
    phase: c.phase_slug,
    status: c.status,
  }));
  return NextResponse.json({ competencies });
}
