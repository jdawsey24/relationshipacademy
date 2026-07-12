import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: seed the Studio recommendation mapper from what is CURRENTLY LIVE on the
// results page (the public `recommendations` table). Imports any live row not
// yet in the Studio table, as status='published' (it reflects live reality).
// Re-runnable; never overwrites existing Studio rows.
export async function POST() {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const s = getSupabaseAdminClient();

  const { data: live, error } = await s.from("recommendations").select("trigger_type, trigger_value, recommendation_text, next_step");
  if (error) return NextResponse.json({ error: "Could not read the live recommendations table." }, { status: 502 });

  const { data: existing } = await s.from("studio_result_recommendations").select("trigger_type, trigger_value");
  const known = new Set((existing ?? []).map((r) => `${(r as { trigger_type: string }).trigger_type}::${(r as { trigger_value: string }).trigger_value}`));

  const toInsert = (live ?? [])
    .filter((r) => !known.has(`${(r as { trigger_type: string }).trigger_type}::${(r as { trigger_value: string }).trigger_value}`))
    .map((r) => ({
      trigger_type: (r as { trigger_type: string }).trigger_type,
      trigger_value: (r as { trigger_value: string }).trigger_value,
      recommendation_text: (r as { recommendation_text: string | null }).recommendation_text,
      next_step: (r as { next_step: string | null }).next_step,
      status: "published",
      audience: "consumer",
      created_by: user?.email ?? null,
      updated_by: user?.email ?? null,
    }));

  let added = 0;
  if (toInsert.length > 0) {
    const { error: insErr } = await s.from("studio_result_recommendations").insert(toInsert);
    if (insErr) return NextResponse.json({ error: "Failed to import." }, { status: 502 });
    added = toInsert.length;
  }
  await audit({ actor: user?.email ?? null, action: "studio.result_rec.sync", target: `${added} imported` });
  return NextResponse.json({ added, liveTotal: (live ?? []).length });
}
