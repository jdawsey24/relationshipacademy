import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getMember } from "@/lib/academyAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Self-serve professional activation for an already signed-in user (e.g. an
// existing Academy member who wants Institute access). Open signup → flipping
// the flag is free. Auth required (middleware gates /api/institute/*).
export async function POST() {
  const member = await getMember();
  if (!member) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ is_professional: true, updated_at: new Date().toISOString() })
    .eq("id", member.user.id);
  if (error) {
    console.error("[institute/activate]", error.message);
    return NextResponse.json({ error: "Could not activate access." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
