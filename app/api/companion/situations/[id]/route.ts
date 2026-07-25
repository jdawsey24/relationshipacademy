import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getSituationDetail } from "@/lib/companion/situations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  // Honor the staff "view as member" toggle: with `?as=user`, draft situations
  // 404 for staff too, matching what a real member would get.
  const asUser = new URL(req.url).searchParams.get("as") === "user";
  const detail = await getSituationDetail(id, cu.isStaff && !asUser);
  if (!detail) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(detail);
}
