import { NextResponse } from "next/server";
import { requireEditor, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = ["rule_name", "structural_context", "compared_phase", "condition_config", "severity", "consumer_language", "professional_language", "status", "validation_status"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of WRITABLE) if (k in body) update[k] = body[k];
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_incongruence_rules").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.incongruence.update", target: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_incongruence_rules").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.incongruence.delete", target: id });
  return NextResponse.json({ ok: true });
}
