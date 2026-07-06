import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { readJsonBody } from "@/lib/apiSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";

// Allowlist of uploadable extensions. Deliberately EXCLUDES anything that a
// browser would render/execute from the public bucket (.html/.htm/.svg/.xml/
// .js/.mjs/.css) — those are a stored-XSS vector when served from a public URL.
const ALLOWED_EXT = new Set([
  "jpg", "jpeg", "png", "webp", "gif", "avif", "ico",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "txt", "rtf",
  "mp4", "webm", "mov", "mp3", "wav", "zip",
]);
// Best-effort client-declared size guard (authoritative limit must be set on
// the Storage bucket in the Supabase dashboard, since the file bytes never pass
// through this route — the client uploads directly via the signed URL).
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

// GET: list media files (newest first) with public URLs + metadata.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) {
    return NextResponse.json({ error: "Failed to list media." }, { status: 502 });
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
    const parsed = await readJsonBody(request, 4_000);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const filename = typeof body.filename === "string" ? body.filename : "";
  if (!filename) return NextResponse.json({ error: "filename required." }, { status: 400 });

  // Reject file types that could execute/render from the public bucket.
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (!filename.includes(".") || !ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "That file type isn't allowed. Use an image, PDF, or document." },
      { status: 400 }
    );
  }
  // Best-effort size check on a client-declared size, if provided.
  const declaredSize = typeof body.size === "number" ? body.size : null;
  if (declaredSize !== null && declaredSize > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File is too large (50 MB max)." }, { status: 400 });
  }

  const safe = filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${randomUUID().slice(0, 8)}-${safe || "file"}`;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) {
    console.error("[media] sign upload failed:", error.message);
    return NextResponse.json({ error: "Failed to prepare upload." }, { status: 502 });
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
    return NextResponse.json({ error: "Failed to delete." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
