import { NextResponse } from "next/server";
import { requireAdmin, requireEditor, requireOwner, getAdminRole } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { getObject } from "@/lib/studioData";
import { deleteObject, saveDraft, StudioError } from "@/lib/studioWorkflow";
import { isOwnerOnlyAudience, type Audience } from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: full workspace payload — object + version history + review log + current body.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const detail = await getObject(id);
  if (!detail) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const user = await getAdminUser();
  if (isOwnerOnlyAudience(detail.object.audience) && getAdminRole(user) !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }
  return NextResponse.json(detail);
}

// PATCH: save a new draft version (metadata and/or body).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  if (typeof body.audience === "string" && isOwnerOnlyAudience(body.audience) && getAdminRole(user) !== "owner") {
    return NextResponse.json({ error: "That audience is owner-only." }, { status: 403 });
  }

  try {
    const object = await saveDraft(id, {
      title: typeof body.title === "string" ? body.title : undefined,
      slug: typeof body.slug === "string" ? body.slug : undefined,
      summary: typeof body.summary === "string" ? body.summary : undefined,
      audience: typeof body.audience === "string" ? (body.audience as Audience) : undefined,
      kb_refs: Array.isArray(body.kb_refs) ? (body.kb_refs as string[]) : undefined,
      body: typeof body.body === "object" && body.body ? (body.body as Record<string, unknown>) : undefined,
      actor: user?.email ?? null,
      note: typeof body.note === "string" ? body.note : undefined,
    });
    await audit({ actor: user?.email ?? null, action: "studio.update", target: id, metadata: { version: object.current_version } });
    return NextResponse.json({ object });
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Failed to save.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}

// DELETE: owner-only, only draft/retired items (workflow enforces the state rule).
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  try {
    await deleteObject(id, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "studio.delete", target: id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Failed to delete.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
