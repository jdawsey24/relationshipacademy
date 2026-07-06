import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { readJsonBody } from "@/lib/apiSecurity";
import { slugify } from "@/lib/academy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "title", "slug", "video_url", "content", "key_takeaways", "reflection_questions",
  "homework", "workbook_url", "skool_url", "min_tier", "is_preview",
  "estimated_minutes", "sort_order", "status",
] as const;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("lessons").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to load." }, { status: 502 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ lesson: data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: user?.email ?? null };
  for (const k of WRITABLE) {
    if (k in body) {
      let v = body[k];
      if (k === "slug" && typeof v === "string") v = slugify(v);
      update[k] = v === "" ? null : v;
    }
  }
  if (typeof update.title === "string" && !(update.title as string).trim()) {
    return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  }

  const s = getSupabaseAdminClient();
  const { error } = await s.from("lessons").update(update).eq("id", id);
  if (error) {
    const msg = error.message.includes("duplicate") ? "That slug is already used in this course." : "Failed to save.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "lesson.update", target: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("lessons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "lesson.delete", target: id });
  return NextResponse.json({ ok: true });
}
