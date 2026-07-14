import { NextResponse } from "next/server";
import { requireAdmin, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { publishReadiness, publishInstrument, unpublishInstrument, PublishError } from "@/lib/instrumentPublish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET → the readiness checklist for publishing this instrument (admin can view).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  return NextResponse.json(await publishReadiness(decodeURIComponent(id)));
}

// POST { action: "publish" | "unpublish" } — owner-only. Publish is blocked unless
// the readiness check passes (enforced inside publishInstrument).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const { id } = await params;
  const assessmentId = decodeURIComponent(id);
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  try {
    if (body.action === "publish") {
      const { slug } = await publishInstrument(assessmentId, user?.email ?? null);
      await audit({ actor: user?.email ?? null, action: "studio.instrument.publish", target: assessmentId, metadata: { slug } });
      return NextResponse.json({ ok: true, slug });
    }
    if (body.action === "unpublish") {
      await unpublishInstrument(assessmentId, user?.email ?? null);
      await audit({ actor: user?.email ?? null, action: "studio.instrument.unpublish", target: assessmentId });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (e) {
    const err = e instanceof PublishError ? e : new PublishError("Publish failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
