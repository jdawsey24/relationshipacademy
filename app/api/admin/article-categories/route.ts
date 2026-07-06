import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: all categories, ordered.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("article_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    return NextResponse.json({ error: "Failed to load categories." }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}

// POST { name } — create a category at the end of the list.
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const { data: last } = await supabase
    .from("article_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? 0) + 10;

  const { error } = await supabase.from("article_categories").insert({ name, sort_order });
  if (error) {
    console.error("[article-categories] create failed:", error.message);
    const msg = error.message.includes("duplicate") ? "That category already exists." : "Failed to save.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  const user = await getAdminUser();
  await audit({ actor: user?.email ?? null, action: "category.create", target: name });
  return NextResponse.json({ ok: true });
}
