import { NextResponse } from "next/server";
import { requireEntitledCompanionUser, ensureCompanionProfile } from "@/lib/companionAuth";
import { getHomeSelection, getPublishedExperiences } from "@/lib/companion/consumer";
import { listRecentEntries } from "@/lib/companion/entries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?view=home|process — published experiences prioritized by the user's status.
export async function GET(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const view = new URL(request.url).searchParams.get("view") ?? "process";
  const profile = await ensureCompanionProfile(cu.user.id);
  const statusId = profile.current_status_id;

  if (view === "home") {
    const [{ featured, cards }, recent] = await Promise.all([
      getHomeSelection(statusId),
      listRecentEntries(cu.user.id, 6),
    ]);
    return NextResponse.json({ featured, cards, recent });
  }
  return NextResponse.json({ cards: await getPublishedExperiences(statusId) });
}
