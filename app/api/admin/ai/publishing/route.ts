import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { listApprovedForPublishing } from "@/lib/publishingData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?source_type= → approved Content Library records of that type + the
// destinations each is currently published to.
export async function GET(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const type = new URL(request.url).searchParams.get("source_type") ?? "worksheet";
  return NextResponse.json({ rows: await listApprovedForPublishing(type) });
}
