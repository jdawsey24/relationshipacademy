import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { listAssessments } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/snapshot/assessments — the 6 phase quizzes for the picker.
export async function GET(request: Request) {
  if (!(await rateLimit(request, { bucket: "snapshot-assessments", limit: 60, windowSeconds: 60 }))) return tooManyRequests();
  const assessments = await listAssessments();
  return NextResponse.json({ assessments });
}
