import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const { data } = await s.from("studio_phase_option_mappings").select("*").order("created_at", { ascending: false }).limit(500);
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const item_id = typeof body.item_id === "string" ? body.item_id.trim() : "";
  const response_option_id = typeof body.response_option_id === "string" ? body.response_option_id.trim() : "";
  const phase_code = typeof body.phase_code === "string" ? body.phase_code.trim() : "";
  if (!item_id || !response_option_id || !phase_code) return NextResponse.json({ error: "item_id, response_option_id, and phase_code are required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_phase_option_mappings").insert({
    item_id, response_option_id, phase_code,
    score_value: body.score_value != null ? Number(body.score_value) : null,
    structural_context_condition: typeof body.structural_context_condition === "string" ? body.structural_context_condition : null,
    version: "v1",
  });
  if (error) return NextResponse.json({ error: "Failed to create." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.phase_mapping.add", target: item_id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_phase_option_mappings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.phase_mapping.remove", target: id });
  return NextResponse.json({ ok: true });
}
