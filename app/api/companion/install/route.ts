import { NextResponse } from "next/server";
import { requireCompanionUser } from "@/lib/companionAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { trackCompanionEvent } from "@/lib/companion/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — current install-guidance state. POST { state } — record shown/dismissed/
// completed (so we don't nag, and never falsely claim success the browser can't
// confirm).
const STATES = new Set(["not_shown", "shown", "dismissed", "completed"]);
const EVENT: Record<string, "install_prompt_shown" | "install_dismissed" | "install_completed"> = {
  shown: "install_prompt_shown", dismissed: "install_dismissed", completed: "install_completed",
};

export async function GET() {
  const cu = await requireCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_profiles").select("install_state").eq("user_id", cu.user.id).maybeSingle();
  return NextResponse.json({ install_state: (data as { install_state?: string } | null)?.install_state ?? "not_shown" });
}

export async function POST(request: Request) {
  const cu = await requireCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const state = String(body.state ?? "");
  if (!STATES.has(state)) return NextResponse.json({ error: "Unknown state." }, { status: 400 });
  const s = getSupabaseAdminClient();
  await s.from("companion_profiles").upsert({ user_id: cu.user.id, install_state: state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (EVENT[state]) await trackCompanionEvent(cu.user.id, EVENT[state]);
  return NextResponse.json({ ok: true });
}
