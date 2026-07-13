import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { data } = await s.from("studio_scoring_rule_inputs").select("*").eq("scoring_rule_id", id).order("created_at");
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const input_id = typeof body.input_id === "string" ? body.input_id.trim() : "";
  const input_type = typeof body.input_type === "string" ? body.input_type : "item";
  if (!input_id) return NextResponse.json({ error: "input_id is required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_scoring_rule_inputs").insert({
    scoring_rule_id: id, input_type, input_id,
    weight: Number(body.weight) || 1, reverse_scored: body.reverse_scored === true, required: body.required === true,
  });
  if (error) return NextResponse.json({ error: "Failed to add input." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.scoring.input.add", target: id, metadata: { input_id } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const inputRowId = new URL(request.url).searchParams.get("inputId");
  if (!inputRowId) return NextResponse.json({ error: "inputId required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_scoring_rule_inputs").delete().eq("id", inputRowId);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.scoring.input.remove", target: inputRowId });
  return NextResponse.json({ ok: true });
}
