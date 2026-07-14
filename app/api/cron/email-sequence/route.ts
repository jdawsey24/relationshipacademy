import { NextResponse } from "next/server";
import { processDueEnrollments } from "@/lib/email/enrollment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Processes due emails in the Snapshot sequence. Invoked daily by the Netlify
// scheduled function (netlify/functions/email-sequence-cron.mjs). Protected by
// CRON_SECRET so it can't be triggered publicly.
export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret") || request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await processDueEnrollments();
  return NextResponse.json({ ok: true, ...res });
}
