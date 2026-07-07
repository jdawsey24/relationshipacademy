import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { INSTITUTE_SECTIONS, OFFERING_STATUSES } from "@/lib/institute";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTION_KEYS = new Set(INSTITUTE_SECTIONS.map((s) => s.key));
const STATUSES = new Set<string>(OFFERING_STATUSES);
const WRITABLE = ["section", "title", "description", "status", "cta_label", "cta_url", "sort_order"] as const;

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
    if (k === "section" && !SECTION_KEYS.has(v as never)) return NextResponse.json({ error: "Invalid section." }, { status: 400 });
    if (k === "status" && !STATUSES.has(v as string)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    if (k === "sort_order") { update[k] = Number.isFinite(Number(v)) ? Number(v) : 0; continue; }
    update[k] = v === "" ? null : v;
  }
  if ("title" in update && typeof update.title === "string" && !update.title.trim()) {
    return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  }

  const s = getSupabaseAdminClient();
  const { error } = await s.from("institute_offerings").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "institute_offering.update", target: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("institute_offerings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "institute_offering.delete", target: id });
  return NextResponse.json({ ok: true });
}
