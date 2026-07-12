import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { getObject } from "@/lib/studioData";
import { restoreVersion, StudioError } from "@/lib/studioWorkflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: version history for an object.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const detail = await getObject(id);
  if (!detail) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ versions: detail.versions });
}

// POST { version_no } — restore an earlier version's body into a fresh draft.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const versionNo = Number(body.version_no);
  if (!Number.isInteger(versionNo)) {
    return NextResponse.json({ error: "version_no is required." }, { status: 400 });
  }
  try {
    const object = await restoreVersion(id, versionNo, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "studio.restore", target: id, metadata: { from: versionNo } });
    return NextResponse.json({ object });
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Failed to restore.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
