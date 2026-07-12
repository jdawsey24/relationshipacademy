import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: publish the Studio recommendation set to the LIVE `recommendations`
// table (what the public results page reads). Owner-only. Replaces the live set
// with every Studio row whose status is approved or published, then marks them
// published. Refuses to run on an empty set so it can never blank out live by
// accident. This changes what real assessment-takers see.
export async function POST() {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const s = getSupabaseAdminClient();

  const { data: rows, error } = await s
    .from("studio_result_recommendations")
    .select("id, trigger_type, trigger_value, recommendation_text, next_step")
    .in("status", ["approved", "published"]);
  if (error) return NextResponse.json({ error: "Could not read Studio recommendations." }, { status: 502 });

  const desired = (rows ?? []).filter((r) => (r as { trigger_type?: string }).trigger_type && (r as { trigger_value?: string }).trigger_value);
  if (desired.length === 0) {
    return NextResponse.json({ error: "Nothing to publish. Approve at least one recommendation first (an empty publish would blank the live results)." }, { status: 400 });
  }

  const liveRows = desired.map((r) => ({
    trigger_type: (r as { trigger_type: string }).trigger_type,
    trigger_value: (r as { trigger_value: string }).trigger_value,
    recommendation_text: (r as { recommendation_text: string | null }).recommendation_text ?? "",
    next_step: (r as { next_step: string | null }).next_step ?? "",
  }));

  // Replace the live set. (No DB transaction available; results tolerates an
  // empty set, and desired is guaranteed non-empty above.)
  const { error: delErr } = await s.from("recommendations").delete().not("id", "is", null);
  if (delErr) return NextResponse.json({ error: "Failed to clear live recommendations." }, { status: 502 });
  const { error: insErr } = await s.from("recommendations").insert(liveRows);
  if (insErr) return NextResponse.json({ error: "Failed to write live recommendations." }, { status: 502 });

  // Mark the published Studio rows.
  const ids = desired.map((r) => (r as { id: string }).id);
  await s.from("studio_result_recommendations").update({ status: "published", updated_by: user?.email ?? null }).in("id", ids);

  await audit({ actor: user?.email ?? null, action: "studio.result_rec.publish", target: `${liveRows.length} live`, metadata: { count: liveRows.length } });
  return NextResponse.json({ published: liveRows.length });
}
