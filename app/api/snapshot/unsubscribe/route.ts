import { NextResponse } from "next/server";
import { isUuid } from "@/lib/apiSecurity";
import { unsubscribeSession } from "@/lib/snapshot/nurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-click unsubscribe from the Snapshot nurture. GET (footer link) redirects to
// the confirmation page; POST supports List-Unsubscribe-Post one-click.
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session") ?? "";
  if (isUuid(id)) await unsubscribeSession(id);
  return NextResponse.redirect(new URL("/unsubscribed", request.url));
}

export async function POST(request: Request) {
  const id = new URL(request.url).searchParams.get("session") ?? "";
  if (isUuid(id)) await unsubscribeSession(id);
  return NextResponse.json({ ok: true });
}
