import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getAdminRole } from "@/lib/adminApi";
import { audit } from "@/lib/audit";
import { listObjects } from "@/lib/studioData";
import { createObject, StudioError } from "@/lib/studioWorkflow";
import { isOwnerOnlyAudience, type Audience, type ObjectType } from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: registry list. Non-owners never see clinical/admin-audience items.
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const isOwner = getAdminRole(user) === "owner";
  const url = new URL(request.url);
  const rows = await listObjects({
    object_type: url.searchParams.get("type") || undefined,
    audience: url.searchParams.get("audience") || undefined,
    status: url.searchParams.get("status") || undefined,
    includeOwnerOnly: isOwner,
  });
  return NextResponse.json({ rows });
}

// POST: create a draft (always draft, provenance human).
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const isOwner = getAdminRole(user) === "owner";

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const object_type = body.object_type as ObjectType;
  const audience = body.audience as Audience;
  const title = typeof body.title === "string" ? body.title : "";
  if (!object_type || !audience || !title.trim()) {
    return NextResponse.json({ error: "Type, audience, and title are required." }, { status: 400 });
  }
  // Clinical/admin audiences are owner-only end-to-end.
  if (isOwnerOnlyAudience(audience) && !isOwner) {
    return NextResponse.json({ error: "That audience is owner-only." }, { status: 403 });
  }

  try {
    const object = await createObject({
      object_type,
      audience,
      title,
      slug: typeof body.slug === "string" ? body.slug : undefined,
      summary: typeof body.summary === "string" ? body.summary : undefined,
      kb_refs: Array.isArray(body.kb_refs) ? (body.kb_refs as string[]) : [],
      body: typeof body.body === "object" && body.body ? (body.body as Record<string, unknown>) : {},
      actor: user?.email ?? null,
    });
    await audit({ actor: user?.email ?? null, action: "studio.create", target: object.id, metadata: { object_type, audience, title } });
    return NextResponse.json({ id: object.id });
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Failed to create.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
