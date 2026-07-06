import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { name?, sort_order? } — rename or reorder a category.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    update.name = name;
  }
  if (typeof body.sort_order === "number") update.sort_order = body.sort_order;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("article_categories").update(update).eq("id", id);
  if (error) {
    console.error("[article-categories] save failed:", error.message);
    const msg = error.message.includes("duplicate") ? "That category already exists." : "Failed to save.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  // Log renames only; skip pure reorders (sort_order) to avoid noise.
  if (typeof update.name === "string") {
    const user = await getAdminUser();
    await audit({ actor: user?.email ?? null, action: "category.rename", target: id, metadata: { name: update.name } });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("article_categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "category.delete", target: id });
  return NextResponse.json({ ok: true });
}
