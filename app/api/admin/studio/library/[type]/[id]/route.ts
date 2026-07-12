import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { guardForBody, patchRow } from "@/lib/studioAssessmentApi";
import { LEARNING_TABLES, isLibraryType } from "@/lib/studioLibrary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTROL = new Set(["created_at", "updated_at", "updated_by"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  if (!isLibraryType(type)) return NextResponse.json({ error: "Unknown type." }, { status: 404 });
  const cfg = LEARNING_TABLES[type];
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const unauth = await guardForBody(body);
  if (unauth) return unauth;
  const user = await getAdminUser();
  const writable = Object.keys(body).filter((k) => k !== cfg.pk && !CONTROL.has(k));
  const res = await patchRow(cfg.table, cfg.pk, id, body, writable, user?.email ?? null);
  if (res.ok) await audit({ actor: user?.email ?? null, action: `studio.${type}.update`, target: id, metadata: { status: body.status } });
  return res;
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const { type, id } = await params;
  if (!isLibraryType(type)) return NextResponse.json({ error: "Unknown type." }, { status: 404 });
  const cfg = LEARNING_TABLES[type];
  const user = await getAdminUser();
  const s = getSupabaseAdminClient();
  const { error } = await s.from(cfg.table).delete().eq(cfg.pk, id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: `studio.${type}.delete`, target: id });
  return NextResponse.json({ ok: true });
}
