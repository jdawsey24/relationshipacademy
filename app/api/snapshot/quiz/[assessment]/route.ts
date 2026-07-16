import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { getQuiz } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/snapshot/quiz/[assessment] — the 22 questions + options for one quiz.
// Option→cluster mapping stays server-side; the client only sees option ids + text.
export async function GET(request: Request, { params }: { params: Promise<{ assessment: string }> }) {
  const { assessment } = await params;
  if (!(await rateLimit(request, { bucket: "snapshot-quiz", limit: 60, windowSeconds: 60 }))) return tooManyRequests();
  const quiz = await getQuiz(decodeURIComponent(assessment));
  if (!quiz) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(quiz);
}
