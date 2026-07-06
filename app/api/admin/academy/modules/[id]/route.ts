import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = ["title", "summary", "sort_order"] as const;

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
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of WRITABLE) if (k in body) update[k] = body[k] === "" ? null : body[k];

  const s = getSupabaseAdminClient();
  const { error } = await s.from("modules").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "module.update", target: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("modules").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "module.delete", target: id });
  return NextResponse.json({ ok: true });
}
