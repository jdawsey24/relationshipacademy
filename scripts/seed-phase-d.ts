/**
 * Seed Phase D after migration 0020: index the "media" bucket into studio_assets,
 * and import the current LIVE recommendations into studio_result_recommendations.
 * Idempotent (skips rows that already exist). Same effect as the in-app "Sync
 * from bucket" / "Import from live" buttons — run once so the owner opens
 * populated pages.
 *
 *   set -a; . ./.env.local; set +a; npx tsx scripts/seed-phase-d.ts
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase env"); process.exit(1); }
const s = createClient(url, key, { auth: { persistSession: false } });

function assetType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "txt", "rtf", "md", "ppt", "pptx", "xls", "xlsx", "csv"].includes(ext)) return "document";
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) return "audio";
  return "other";
}

async function main() {
  // 1. Assets from the media bucket.
  const { data: files, error } = await s.storage.from("media").list("", { limit: 1000 });
  if (error) { console.error("bucket list failed:", error.message); process.exit(1); }
  const objects = (files ?? []).filter((f) => f.id);
  const { data: existingA } = await s.from("studio_assets").select("storage_path");
  const knownA = new Set((existingA ?? []).map((r) => (r as { storage_path: string }).storage_path));
  const assets = objects.filter((f) => !knownA.has(f.name)).map((f) => ({
    storage_path: f.name,
    file_name: f.name.split("/").pop() ?? f.name,
    file_url: s.storage.from("media").getPublicUrl(f.name).data.publicUrl,
    title: (f.name.split("/").pop() ?? f.name).replace(/\.[^.]+$/, ""),
    asset_type: assetType(f.name),
    size_bytes: (f.metadata as { size?: number } | null)?.size ?? null,
    source: "bucket_import",
    status: "draft",
  }));
  if (assets.length) {
    const { error: e } = await s.from("studio_assets").insert(assets);
    if (e) { console.error("asset insert failed:", e.message); process.exit(1); }
  }
  console.log(`studio_assets: +${assets.length} (bucket has ${objects.length} files)`);

  // 2. Result recommendations from the live table.
  const { data: live } = await s.from("recommendations").select("trigger_type, trigger_value, recommendation_text, next_step");
  const { data: existingR } = await s.from("studio_result_recommendations").select("trigger_type, trigger_value");
  const knownR = new Set((existingR ?? []).map((r) => `${(r as { trigger_type: string }).trigger_type}::${(r as { trigger_value: string }).trigger_value}`));
  const recs = (live ?? [])
    // Skip malformed live rows (e.g. the dormant "Elevated Risk" row has a null
    // trigger_value and was never consumed by results); NOT NULL would reject them.
    .filter((r) => {
      const x = r as { trigger_type?: string | null; trigger_value?: string | null };
      return x.trigger_type && x.trigger_value && !knownR.has(`${x.trigger_type}::${x.trigger_value}`);
    })
    .map((r) => ({ ...(r as object), status: "published", audience: "consumer" }));
  if (recs.length) {
    const { error: e } = await s.from("studio_result_recommendations").insert(recs);
    if (e) { console.error("rec insert failed:", e.message); process.exit(1); }
  }
  console.log(`studio_result_recommendations: +${recs.length} (live has ${(live ?? []).length})`);
  console.log("Phase D seed complete.");
}

main();
