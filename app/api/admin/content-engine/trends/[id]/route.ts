import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getTrend } from "@/lib/contentEngine/trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One trend with its observations and proposed bridges — the review screen's data.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const trend = await getTrend(id);
  if (!trend) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(trend);
}
