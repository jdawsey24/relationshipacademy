import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getExperienceDetail } from "@/lib/companion/data";
import { updateExperienceMeta, CompanionCmsError } from "@/lib/companion/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — full experience detail (blocks, versions, reviews, mappings).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const detail = await getExperienceDetail(id);
  if (!detail) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(detail);
}

// PATCH — edit metadata (only while Draft; enforced in cms).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  try {
    await updateExperienceMeta(id, body, user?.email ?? null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
