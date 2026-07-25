import { NextResponse } from "next/server";
import { requireCompanionUser } from "@/lib/companionAuth";
import { recordDisclosureAcceptance } from "@/lib/companion/disclosureAcceptance";
import { DISCLOSURE_VERSION } from "@/lib/companion/disclosures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST — record that the signed-in user accepted the CURRENT disclosure version.
// The version + timestamp are set server-side (never client-controlled); the user
// id comes from the authenticated session. Idempotent. Optionally the client sends
// { version } so we can reject a stale accept if the disclosure changed mid-session.
export async function POST(request: Request) {
  const cu = await requireCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* body optional */ }
  if (typeof body.version === "string" && body.version !== DISCLOSURE_VERSION) {
    return NextResponse.json({ error: "disclosure_out_of_date", version: DISCLOSURE_VERSION }, { status: 409 });
  }
  const ua = request.headers.get("user-agent");
  const ok = await recordDisclosureAcceptance(cu.user.id, ua);
  if (!ok) return NextResponse.json({ error: "Could not record acceptance." }, { status: 502 });
  return NextResponse.json({ ok: true, version: DISCLOSURE_VERSION });
}
