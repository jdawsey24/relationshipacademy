import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { assetTypeFromName } from "@/lib/studioAssets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";

// POST: index any files in the "media" bucket that aren't catalogued yet. Never
// overwrites existing catalogue rows (so owner tagging/status is preserved) —
// only inserts rows for new storage paths. Re-runnable.
export async function POST() {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const s = getSupabaseAdminClient();

  const { data: files, error: listErr } = await s.storage.from(BUCKET).list("", {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (listErr) return NextResponse.json({ error: "Could not read the media bucket." }, { status: 502 });

  // Real files only (folders come back with a null id).
  const objects = (files ?? []).filter((f) => f.id);
  const { data: existing } = await s.from("studio_assets").select("storage_path");
  const known = new Set((existing ?? []).map((r) => (r as { storage_path: string }).storage_path));

  const toInsert = objects
    .filter((f) => !known.has(f.name))
    .map((f) => ({
      storage_path: f.name,
      file_name: f.name.split("/").pop() ?? f.name,
      file_url: s.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      title: (f.name.split("/").pop() ?? f.name).replace(/\.[^.]+$/, ""),
      asset_type: assetTypeFromName(f.name),
      size_bytes: (f.metadata as { size?: number } | null)?.size ?? null,
      source: "bucket_import",
      status: "draft",
      created_by: user?.email ?? null,
      updated_by: user?.email ?? null,
    }));

  let added = 0;
  if (toInsert.length > 0) {
    const { error } = await s.from("studio_assets").insert(toInsert);
    if (error) return NextResponse.json({ error: "Failed to index files." }, { status: 502 });
    added = toInsert.length;
  }
  await audit({ actor: user?.email ?? null, action: "studio.asset.sync", target: `${added} added`, metadata: { total: objects.length } });
  return NextResponse.json({ added, total: objects.length });
}
