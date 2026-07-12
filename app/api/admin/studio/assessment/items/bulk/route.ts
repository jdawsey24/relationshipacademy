import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { guardForBody } from "@/lib/studioAssessmentApi";
import { STATUS_LABELS } from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { ids: string[], status } — bulk status change on items. Owner required
// when the target status is approved/published/retired (via guardForBody).
export async function POST(request: Request) {
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
  const { error } = await s
    .from("studio_assessment_items")
    .update({ status, updated_at: new Date().toISOString(), updated_by: user?.email ?? null })
    .in("item_id", ids);
  if (error) return NextResponse.json({ error: "Failed to update." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.item.bulk_status", target: `${ids.length} items`, metadata: { status } });
  return NextResponse.json({ ok: true, count: ids.length });
}
