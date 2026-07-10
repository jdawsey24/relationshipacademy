import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { LIVE_STATUSES } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AREAS = new Set(["academy", "institute"]);
const STATUSES = new Set<string>(LIVE_STATUSES);
const WRITABLE = ["area", "title", "description", "embed_url", "join_url", "replay_url", "scheduled_at", "status", "min_tier", "sort_order"] as const;

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
    if (!(k in body)) continue;
    const v = body[k];
    if (k === "area" && !AREAS.has(v as string)) return NextResponse.json({ error: "Invalid area." }, { status: 400 });
    if (k === "status" && !STATUSES.has(v as string)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    if (k === "sort_order") { update[k] = Number.isFinite(Number(v)) ? Number(v) : 0; continue; }
    update[k] = typeof v === "string" && v.trim() === "" ? null : v;
  }
  if ("title" in update && typeof update.title === "string" && !update.title.trim()) {
    return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  }

  const s = getSupabaseAdminClient();
  const { error } = await s.from("live_sessions").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "live_session.update", target: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("live_sessions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "live_session.delete", target: id });
  return NextResponse.json({ ok: true });
}
