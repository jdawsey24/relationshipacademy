import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { RELATIONSHIP_STATUSES, INTEREST_TOPICS } from "@/lib/companion";
import { trackCompanionEvent } from "@/lib/companion/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { status_key, interests[] } — complete onboarding (post-entitlement only).
export async function POST(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const statusKey = String(body.status_key ?? "");
  if (!RELATIONSHIP_STATUSES.some((s) => s.key === statusKey)) return NextResponse.json({ error: "Pick a relationship status." }, { status: 400 });
  const interests = Array.isArray(body.interests) ? body.interests.map(String).filter((t) => (INTEREST_TOPICS as readonly string[]).includes(t)) : [];

  const s = getSupabaseAdminClient();
  const { data: st } = await s.from("structural_statuses").select("id").eq("key", statusKey).maybeSingle();
  const statusId = (st as { id: string } | null)?.id;
  if (!statusId) return NextResponse.json({ error: "Unknown status." }, { status: 400 });

  const uid = cu.user.id;
  await s.from("companion_profiles").upsert({ user_id: uid, current_status_id: statusId, onboarding_completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  await s.from("user_structural_status_history").insert({ user_id: uid, structural_status_id: statusId });
  // Replace interest preferences.
  await s.from("user_interest_preferences").delete().eq("user_id", uid);
  if (interests.length) await s.from("user_interest_preferences").insert(interests.map((topic) => ({ user_id: uid, topic })));
  await trackCompanionEvent(uid, "onboarding_completed", { status_key: statusKey, count: interests.length });
  return NextResponse.json({ ok: true });
}
