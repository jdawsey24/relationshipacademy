import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { slugify } from "@/lib/academy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: all courses (incl. drafts) for the admin list.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("courses")
    .select("id, slug, title, subtitle, min_tier, status, sort_order, updated_at")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: "Failed to load courses." }, { status: 502 });
  return NextResponse.json({ rows: data ?? [] });
}

// POST: create a course (draft by default).
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const slug = typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(title);

  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("courses")
    .insert({ title, slug, status: "draft", updated_by: user?.email ?? null })
    .select("id")
    .maybeSingle();
  if (error) {
    const msg = error.message.includes("duplicate") ? "That slug is already in use." : "Failed to create.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "course.create", target: data?.id ?? slug, metadata: { title } });
  return NextResponse.json({ id: data?.id });
}
