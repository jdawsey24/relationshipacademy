import { NextResponse } from "next/server";
import { requireEntitledCompanionUser, ensureCompanionProfile } from "@/lib/companionAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Notification preferences — ALL opt-in. No daily-content notifications. Stored on
// companion_profiles.notification_prefs.
const ALLOWED = new Set(["reminders", "unfinished_reflection", "personal_checkin", "practice_reminder", "email", "in_app"]);

export async function GET() {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const profile = await ensureCompanionProfile(cu.user.id);
  return NextResponse.json({ prefs: profile.notification_prefs ?? {} });
}

export async function PATCH(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const raw = (body.prefs && typeof body.prefs === "object") ? body.prefs as Record<string, unknown> : {};
  const prefs: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) if (ALLOWED.has(k) && (typeof v === "boolean" || typeof v === "string")) prefs[k] = v;
  const s = getSupabaseAdminClient();
  await s.from("companion_profiles").upsert({ user_id: cu.user.id, notification_prefs: prefs, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  return NextResponse.json({ ok: true, prefs });
}
