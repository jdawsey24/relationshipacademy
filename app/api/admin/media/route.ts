import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";

// GET: list media files (newest first) with public URLs + metadata.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) {
    return NextResponse.json({ error: "Failed to list media.", details: error.message }, { status: 502 });
  }
  const rows = (data ?? [])
    .filter((f) => f.name && f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size ?? null,
      mimetype: f.metadata?.mimetype ?? null,
      created_at: f.created_at ?? null,
    }));
  return NextResponse.json({ rows });
}

// POST { filename } -> signed upload URL (client uploads directly to Storage).
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const filename = typeof body.filename === "string" ? body.filename : "";
  if (!filename) return NextResponse.json({ error: "filename required." }, { status: 400 });

  const safe = filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${randomUUID().slice(0, 8)}-${safe || "file"}`;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) {
    return NextResponse.json({ error: "Failed to prepare upload.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({
    path: data.path,
    token: data.token,
    url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
  });
}

// DELETE ?path=
export async function DELETE(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "path required." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    return NextResponse.json({ error: "Failed to delete.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
