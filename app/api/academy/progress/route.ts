import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";
import { isUuid } from "@/lib/apiSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Records lesson progress for the signed-in member.
// Body: { lessonId, courseId, action: "view" | "complete" | "uncomplete" }
export async function POST(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request, 2_000)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lessonId = body.lessonId;
  const courseId = body.courseId;
  const action = body.action;
  if (!isUuid(lessonId) || !isUuid(courseId)) {
    return NextResponse.json({ error: "Invalid lesson or course." }, { status: 400 });
  }
  if (action !== "view" && action !== "complete" && action !== "uncomplete") {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    user_id: member.user.id,
    lesson_id: lessonId,
    course_id: courseId,
    last_viewed_at: now,
  };
  if (action === "complete") {
    row.status = "completed";
    row.completed_at = now;
  } else if (action === "uncomplete") {
    row.status = "started";
    row.completed_at = null;
  } else {
    row.status = "started";
  }

  const s = getSupabaseAdminClient();
  // Upsert on (user_id, lesson_id). For a plain "view" don't clobber an existing
  // "completed" status — only bump last_viewed_at.
  if (action === "view") {
    const { data: existing } = await s
      .from("lesson_progress")
      .select("id, status")
      .eq("user_id", member.user.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();
    if (existing) {
      await s.from("lesson_progress").update({ last_viewed_at: now }).eq("id", existing.id);
      return NextResponse.json({ ok: true, status: existing.status });
    }
  }

  const { error } = await s
    .from("lesson_progress")
    .upsert(row, { onConflict: "user_id,lesson_id" });
  if (error) {
    console.error("[academy/progress]", error.message);
    return NextResponse.json({ error: "Could not save progress." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, status: row.status });
}
