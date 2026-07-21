import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { RELATIONSHIP_STATUSES } from "@/lib/companion";
import { trackCompanionEvent } from "@/lib/companion/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { status_key } — update relationship status later. A status change writes
// history and NEVER rewrites or recategorizes past entries (they keep the status
// frozen at creation).
export async function POST(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const statusKey = String(body.status_key ?? "");
  if (!RELATIONSHIP_STATUSES.some((s) => s.key === statusKey)) return NextResponse.json({ error: "Unknown status." }, { status: 400 });

  const s = getSupabaseAdminClient();
  const { data: st } = await s.from("structural_statuses").select("id").eq("key", statusKey).maybeSingle();
  const statusId = (st as { id: string } | null)?.id;
  if (!statusId) return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  const uid = cu.user.id;
  await s.from("companion_profiles").update({ current_status_id: statusId, updated_at: new Date().toISOString() }).eq("user_id", uid);
  await s.from("user_structural_status_history").insert({ user_id: uid, structural_status_id: statusId });
  await trackCompanionEvent(uid, "status_changed", { status_key: statusKey });
  return NextResponse.json({ ok: true });
}
