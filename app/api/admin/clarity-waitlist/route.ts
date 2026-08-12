import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";
import { CLARITY } from "@/lib/datingWithClarity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/clarity-waitlist — the Dating With Clarity priority list.
//
// Newest first, because the question this page answers most often is "who came
// in since I last looked". The four form answers come through in full rather
// than truncated: they are the reason the form asks, and reading them is how
// the first class gets built.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { data, error } = await getSupabaseAdminClient().from("dating_clarity_waitlist")
    .select("id, email, first_name, dating_status, hardest_part, confidence_goal, can_attend, status, created_at, notified_at, sent_steps")
    .eq("cohort", CLARITY.cohort)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/clarity-waitlist]", error.message);
    return NextResponse.json({ error: "Could not load the waitlist." }, { status: 502 });
  }

  const rows = data ?? [];
  return NextResponse.json({
    rows,
    counts: {
      total: rows.length,
      active: rows.filter((r) => (r as { status: string }).status === "active").length,
      enrolled: rows.filter((r) => (r as { status: string }).status === "enrolled").length,
      unsubscribed: rows.filter((r) => (r as { status: string }).status === "unsubscribed").length,
    },
    seats: CLARITY.seats,
  });
}
