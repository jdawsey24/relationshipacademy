import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "title", "description", "file_url", "file_name", "file_type",
  "category", "status", "sort_order",
] as const;

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
    if (k in body) update[k] = body[k] === "" ? null : body[k];
  }
  if (typeof update.title === "string" && !update.title.trim()) {
    return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("resources").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to save.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete.", details: error.message }, { status: 502 });
  return NextResponse.json({ ok: true });
}
