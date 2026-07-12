import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { guardForBody } from "@/lib/studioAssessmentApi";
import { LEARNING_TABLES, isLibraryType } from "@/lib/studioLibrary";
import { STATUS_LABELS } from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { ids, status } — bulk status change. Owner required for approved/
// published/retired (via guardForBody). NB: static routes ([id]) don't collide —
// "bulk" is a distinct literal segment that wins over [id].
export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isLibraryType(type)) return NextResponse.json({ error: "Unknown type." }, { status: 404 });
  const cfg = LEARNING_TABLES[type];
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const unauth = await guardForBody(body);
  if (unauth) return unauth;
  const user = await getAdminUser();
  const ids = Array.isArray(body.ids) ? (body.ids as string[]) : [];
  const status = body.status;
  if (!ids.length || typeof status !== "string" || !(status in STATUS_LABELS)) {
    return NextResponse.json({ error: "ids and a valid status are required." }, { status: 400 });
  }
  const s = getSupabaseAdminClient();
  const { error } = await s.from(cfg.table).update({ status, updated_at: new Date().toISOString(), updated_by: user?.email ?? null }).in(cfg.pk, ids);
  if (error) return NextResponse.json({ error: "Failed to update." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: `studio.${type}.bulk_status`, target: `${ids.length} rows`, metadata: { status } });
  return NextResponse.json({ ok: true, count: ids.length });
}
