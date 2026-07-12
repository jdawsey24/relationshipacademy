import { NextResponse } from "next/server";
import { requireAdmin, requireEditor, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { getKb } from "@/lib/studioData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "name", "kind", "code", "phase_slug", "domain_slug", "competency_phase_slug",
  "definition", "developmental_task", "healthy_markers", "common_challenges",
  "growth_indicators", "audiences", "status", "source_ref", "notes", "sort_order",
] as const;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const row = await getKb(id);
  if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ row });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const update: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: user?.email ?? null };
  for (const k of WRITABLE) {
    if (k in body) update[k] = body[k];
  }
  const s = getSupabaseAdminClient();
  const { error } = await s.from("kb_competencies").update(update).eq("id", id);
  if (error) {
    const msg = error.message.includes("duplicate") ? "That code is already in use." : "Failed to save.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "kb.update", target: id });
  return NextResponse.json({ ok: true });
}

// DELETE is owner-only. Retiring (status='retired') is the softer, preferred path.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("kb_competencies").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "kb.delete", target: id });
  return NextResponse.json({ ok: true });
}
