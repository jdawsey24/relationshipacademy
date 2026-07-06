import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { slugify } from "@/lib/academy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "title", "slug", "subtitle", "description", "audience", "learning_objectives",
  "estimated_minutes", "min_tier", "cover_image_url", "sort_order", "status",
] as const;

// GET: a course with its ordered modules + lessons (for the editor).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { data: course, error } = await s.from("courses").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to load." }, { status: 502 });
  if (!course) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { data: modules } = await s.from("modules").select("*").eq("course_id", id).order("sort_order");
  const { data: lessons } = await s
    .from("lessons")
    .select("id, module_id, slug, title, min_tier, is_preview, status, sort_order")
    .eq("course_id", id)
    .order("sort_order");
  return NextResponse.json({ course, modules: modules ?? [], lessons: lessons ?? [] });
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
  const { error } = await s.from("courses").update(update).eq("id", id);
  if (error) {
    const msg = error.message.includes("duplicate") ? "That slug is already in use." : "Failed to save.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "course.update", target: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const s = getSupabaseAdminClient();
  // Modules + lessons cascade via FK ON DELETE CASCADE.
  const { error } = await s.from("courses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "course.delete", target: id });
  return NextResponse.json({ ok: true });
}
