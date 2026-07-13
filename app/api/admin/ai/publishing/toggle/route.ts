import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { audit } from "@/lib/audit";
import { setMapping, removeMapping, publishableSource } from "@/lib/publishingData";
import { isDestination } from "@/lib/publishing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { source_type, source_id, destination, action: publish|unpublish }
// Publishes/unpublishes an approved record to a destination via a mapping —
// never duplicates the source. Owner+MFA only.
export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const source_type = typeof body.source_type === "string" ? body.source_type : "";
  const source_id = typeof body.source_id === "string" ? body.source_id.trim() : "";
  const destination = typeof body.destination === "string" ? body.destination : "";
  const action = body.action === "unpublish" ? "unpublish" : "publish";
  if (!publishableSource(source_type) || !source_id || !isDestination(destination)) {
    return NextResponse.json({ error: "source_type, source_id, and a valid destination are required." }, { status: 400 });
  }
  try {
    if (action === "publish") await setMapping(source_type, source_id, destination, auth.user.email ?? null);
    else await removeMapping(source_type, source_id, destination);
    await audit({ actor: auth.user.email ?? null, action: `ai.publish.${action}`, target: `${source_type}:${source_id}`, metadata: { destination } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update publication." }, { status: 502 });
  }
}
