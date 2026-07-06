import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { slugify } from "@/lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "title", "slug", "category", "summary", "content", "featured_image_url",
  "author", "publish_date", "status", "tags", "related_phase_slug",
  "cta_text", "cta_url", "seo_title", "seo_description",
] as const;

// GET: all articles (incl. drafts) for the admin table.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, category, author, status, publish_date, related_phase_slug, updated_at")
    .order("updated_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Failed to load articles." }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}

// POST: create a new article (draft by default).
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

  const slug = (typeof body.slug === "string" && body.slug.trim()) ? slugify(body.slug) : slugify(title);

  const row: Record<string, unknown> = { title, slug, status: "draft", updated_by: user?.email ?? null };
  for (const k of WRITABLE) {
    if (k === "title" || k === "slug") continue;
    if (k in body && body[k] !== undefined) row[k] = body[k] === "" ? null : body[k];
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("articles").insert(row).select("id").maybeSingle();
  if (error) {
    console.error("[articles] create failed:", error.message);
    const msg = error.message.includes("duplicate") ? "That slug is already in use." : "Failed to create.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "article.create", target: data?.id ?? row.slug as string, metadata: { title: row.title } });
  return NextResponse.json({ id: data?.id });
}
