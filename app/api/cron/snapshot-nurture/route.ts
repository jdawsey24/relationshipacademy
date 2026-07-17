import { NextResponse } from "next/server";
import { processDueNurture } from "@/lib/snapshot/nurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sends due emails in the Snapshot per-cluster nurture. Invoked daily by the
// Netlify scheduled function; CRON_SECRET-protected so it can't be triggered publicly.
export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret") || request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await processDueNurture();
  return NextResponse.json({ ok: true, ...res });
}
