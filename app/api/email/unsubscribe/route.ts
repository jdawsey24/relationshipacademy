import { NextResponse } from "next/server";
import { isUuid } from "@/lib/apiSecurity";
import { unsubscribe } from "@/lib/email/enrollment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-click unsubscribe. GET (link in the footer) redirects to a confirmation
// page; POST supports the List-Unsubscribe-Post one-click header. Both mark the
// enrollment unsubscribed (no further emails).
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (isUuid(id)) await unsubscribe(id);
  return NextResponse.redirect(new URL("/unsubscribed", request.url));
}

export async function POST(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (isUuid(id)) await unsubscribe(id);
  return NextResponse.json({ ok: true });
}
