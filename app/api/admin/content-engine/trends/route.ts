import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { createManualTrend, listTrends } from "@/lib/contentEngine/trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Content Engine — manual trend entry and listing. Owner + MFA only.
//
// POST accepts whatever the operator saw: a phrase, a post URL, pasted post
// text, or a description. That text is UNTRUSTED and is sanitized before it is
// stored, never after.

export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ trends: await listTrends() });
}

export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  let body: { raw?: string; community_seen?: string; platform?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.raw || typeof body.raw !== "string" || !body.raw.trim()) {
    return NextResponse.json({ error: "Paste a phrase, a link, or the post text." }, { status: 400 });
  }

  const user = await getAdminUser();
  try {
    const result = await createManualTrend(
      { raw: body.raw, community_seen: body.community_seen ?? null, platform: body.platform ?? null },
      user?.email ?? null,
    );
    await audit({
      actor: user?.email ?? null,
      action: result.merged ? "content_engine.trend.merged" : "content_engine.trend.created",
      metadata: { id: result.id, stripped_injection: result.strippedInjection },
    });
    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save that." }, { status: 400 });
  }
}
