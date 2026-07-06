import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { readJsonBody, isUuid } from "@/lib/apiSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 20_000; // generous for a written reflection

// GET: the member's journal entries, optional ?courseId= / ?lessonId= filter.
export async function GET(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  const url = new URL(request.url);
  const courseId = url.searchParams.get("courseId");
  const lessonId = url.searchParams.get("lessonId");

  const s = getSupabaseAdminClient();
  let q = s.from("journal_entries").select("*").eq("user_id", member.user.id);
  if (courseId && isUuid(courseId)) q = q.eq("course_id", courseId);
  if (lessonId && isUuid(lessonId)) q = q.eq("lesson_id", lessonId);
  const { data, error } = await q.order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load entries." }, { status: 502 });
  return NextResponse.json({ rows: data ?? [] });
}

// POST: create an entry. Body: { body, title?, lessonId?, courseId? }
export async function POST(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request, MAX_BODY)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body : "";
  if (!text.trim()) {
    return NextResponse.json({ error: "Write something first." }, { status: 400 });
  }

  const row: Record<string, unknown> = {
    user_id: member.user.id,
    body: text,
    title: typeof body.title === "string" && body.title.trim() ? body.title.trim() : null,
    lesson_id: isUuid(body.lessonId) ? body.lessonId : null,
    course_id: isUuid(body.courseId) ? body.courseId : null,
  };

  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("journal_entries").insert(row).select("*").maybeSingle();
  if (error) {
    console.error("[academy/journal] create", error.message);
    return NextResponse.json({ error: "Could not save entry." }, { status: 502 });
  }
  return NextResponse.json({ entry: data });
}
