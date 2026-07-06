import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "title", "description", "file_url", "file_name", "file_type",
  "category", "status", "sort_order",
] as const;

// GET: all resources (incl. drafts) for the admin table.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Failed to load resources." }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}

// POST: create a resource.
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

  const insert: Record<string, unknown> = { updated_by: user?.email ?? null };
  for (const k of WRITABLE) {
    if (k in body) insert[k] = body[k] === "" ? null : body[k];
  }
  if (typeof insert.title !== "string" || !insert.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (typeof insert.file_url !== "string" || !insert.file_url) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("resources").insert(insert).select("id").single();
  if (error) {
    return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "resource.create", target: data.id, metadata: { title: insert.title } });
  return NextResponse.json({ ok: true, id: data.id });
}
