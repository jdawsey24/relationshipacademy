import { NextResponse } from "next/server";
import { processDueSteps, heldSteps } from "@/lib/clarity/sequences";
import { sendWaitlistDigest } from "@/lib/clarity/digest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sends whatever is due today in the Dating With Clarity launch calendar.
// Invoked twice a day by netlify/functions/clarity-sequence-cron.mjs, because
// the last day of enrollment has a morning email and an evening one.
// CRON_SECRET-protected so it can't be triggered publicly.
//
// The response names the steps that were HELD as well as the ones that were
// sent. A held step means an owner decision is still open, and a launch is
// exactly the wrong time for that to be invisible.
export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret") || request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await processDueSteps();
  if (res.held.length) {
    console.warn(`[cron/clarity-sequence] held pending an owner decision: ${res.held.join(", ")}`);
  }

  // The owner's digest rides along. Deliberately after the sequence and unable
  // to throw into it: a notification failing must never stop the emails that
  // people are actually waiting for.
  const digest = await sendWaitlistDigest();

  return NextResponse.json({ ok: true, ...res, unresolved: heldSteps(), digest });
}
