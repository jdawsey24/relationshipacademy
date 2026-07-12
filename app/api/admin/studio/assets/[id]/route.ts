import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { guardForBody, patchRow } from "@/lib/studioAssessmentApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = ["title", "asset_type", "description", "audience", "competency_id", "phase", "domain", "tags", "status"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const unauth = await guardForBody(body);
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const res = await patchRow("studio_assets", "id", id, body, WRITABLE, user?.email ?? null);
  if (res.ok) await audit({ actor: user?.email ?? null, action: "studio.asset.update", target: id, metadata: { status: body.status } });
  return res;
}

// DELETE removes the catalogue row (owner-only). The bucket file is left intact
// unless ?purge=1 is passed, in which case the underlying storage object is also
// removed.
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const purge = new URL(request.url).searchParams.get("purge") === "1";
  if (purge) {
    const { data } = await s.from("studio_assets").select("storage_path").eq("id", id).maybeSingle();
    const path = (data as { storage_path: string | null } | null)?.storage_path;
    if (path) await s.storage.from("media").remove([path]);
  }
  const { error } = await s.from("studio_assets").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.asset.delete", target: id, metadata: { purge } });
  return NextResponse.json({ ok: true });
}
