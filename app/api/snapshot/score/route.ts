import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { readJsonBody, isUuid } from "@/lib/apiSecurity";
import { scoreAndCreateSession } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/snapshot/score — { assessment, answers: [{ question_id, option_id }] }
// Creates the session, persists answers, scores. Returns { session_id } or, on a
// first-place tie, { tied: true, tiebreak: [...] } for the head-to-head step.
export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "snapshot-score", limit: 15, windowSeconds: 60 }))) return tooManyRequests();
  let body: Record<string, unknown>;
  try { body = (await readJsonBody(request)) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const assessment = typeof body.assessment === "string" ? body.assessment : "";
  const raw = Array.isArray(body.answers) ? body.answers : [];
  const answers = raw
    .map((a) => a as { question_id?: unknown; option_id?: unknown })
    .filter((a) => isUuid(String(a.question_id)) && isUuid(String(a.option_id)))
    .map((a) => ({ question_id: String(a.question_id), option_id: String(a.option_id) }));
  if (!assessment || answers.length === 0) return NextResponse.json({ error: "Missing answers." }, { status: 400 });

  try {
    const outcome = await scoreAndCreateSession({ assessmentId: assessment, answers });
    if (!outcome) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(outcome);
  } catch {
    return NextResponse.json({ error: "Scoring failed." }, { status: 502 });
  }
}
