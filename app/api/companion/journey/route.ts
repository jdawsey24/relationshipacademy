import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { listJourney } from "@/lib/companion/journey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?q=&type=&status=&favorite= — the user's saved work, filtered.
export async function GET(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const p = new URL(request.url).searchParams;
  const entries = await listJourney(cu.user.id, {
    q: p.get("q") ?? undefined,
    type: p.get("type") ?? undefined,
    status: p.get("status") ?? undefined,
    favorite: p.get("favorite") === "1",
  });
  return NextResponse.json({ entries });
}
