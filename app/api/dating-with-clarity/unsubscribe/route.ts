import { NextResponse } from "next/server";
import { isUuid } from "@/lib/apiSecurity";
import { unsubscribeFromWaitlist } from "@/lib/clarity/sequences";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-click unsubscribe from the Dating With Clarity list. GET is the footer
// link; POST serves the List-Unsubscribe-Post one-click header that Gmail and
// Outlook now expect. Neither reveals whether the id matched anything.
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (isUuid(id)) await unsubscribeFromWaitlist(id);
  return NextResponse.redirect(new URL("/unsubscribed", request.url));
}

export async function POST(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (isUuid(id)) await unsubscribeFromWaitlist(id);
  return NextResponse.json({ ok: true });
}
