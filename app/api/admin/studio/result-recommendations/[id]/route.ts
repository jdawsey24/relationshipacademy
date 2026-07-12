import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { guardForBody, patchRow } from "@/lib/studioAssessmentApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = ["trigger_type", "trigger_value", "recommendation_text", "next_step", "audience", "notes", "sort_order", "status"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const unauth = await guardForBody(body);
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const res = await patchRow("studio_result_recommendations", "id", id, body, WRITABLE, user?.email ?? null);
  if (res.ok) await audit({ actor: user?.email ?? null, action: "studio.result_rec.update", target: id, metadata: { status: body.status } });
  return res;
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_result_recommendations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.result_rec.delete", target: id });
  return NextResponse.json({ ok: true });
}
