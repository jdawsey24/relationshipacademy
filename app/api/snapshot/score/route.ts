import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { readJsonBody, isUuid } from "@/lib/apiSecurity";
import { scoreSession } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/snapshot/score — { session_id, answers: [{ question_id, option_id }] }
// where option_id is the chosen session_item id. Scores the started session and
// returns { session_id } or, on a first-place tie, { tied: true, tiebreak: [...] }.
export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "snapshot-score", limit: 15, windowSeconds: 60 }))) return tooManyRequests();
  let body: Record<string, unknown>;
  try { body = (await readJsonBody(request)) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const sessionId = String(body.session_id ?? "");
  const raw = Array.isArray(body.answers) ? body.answers : [];
  const answers = raw
    .map((a) => a as { question_id?: unknown; option_id?: unknown })
    .filter((a) => isUuid(String(a.question_id)) && isUuid(String(a.option_id)))
    .map((a) => ({ question_id: String(a.question_id), option_id: String(a.option_id) }));
  if (!isUuid(sessionId) || answers.length === 0) return NextResponse.json({ error: "Missing answers." }, { status: 400 });

  try {
    const outcome = await scoreSession({ sessionId, answers });
    if (!outcome) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(outcome);
  } catch {
    return NextResponse.json({ error: "Scoring failed." }, { status: 502 });
  }
}
