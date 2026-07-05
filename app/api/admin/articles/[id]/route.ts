import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { slugify } from "@/lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "title", "slug", "category", "summary", "content", "featured_image_url",
  "author", "publish_date", "status", "tags", "related_phase_slug",
  "cta_text", "cta_url", "seo_title", "seo_description",
] as const;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to load.", details: error.message }, { status: 502 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ article: data });
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

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("articles").update(update).eq("id", id);
  if (error) {
    const msg = error.message.includes("duplicate") ? "That slug is already in use." : error.message;
    return NextResponse.json({ error: "Failed to save.", details: msg }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete.", details: error.message }, { status: 502 });
  return NextResponse.json({ ok: true });
}
