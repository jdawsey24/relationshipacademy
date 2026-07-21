import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getUserStatusKey, getSituationsForStatus, getSituationCatalog, searchSituations } from "@/lib/companion/situations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?view=home|process&q= — the situation-first navigation surface. Real users
// see Published situations; staff preview Draft too.
export async function GET(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "home";
  const q = url.searchParams.get("q") ?? "";
  const includeDraft = cu.isStaff;

  if (q.trim()) return NextResponse.json({ results: await searchSituations(q, includeDraft) });
  const statusKey = await getUserStatusKey(cu.user.id);
  if (view === "process") return NextResponse.json({ groups: await getSituationCatalog(includeDraft, statusKey) });
  return NextResponse.json({ situations: await getSituationsForStatus(statusKey, includeDraft), preview: includeDraft });
}
