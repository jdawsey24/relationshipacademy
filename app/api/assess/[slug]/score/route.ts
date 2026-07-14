import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { readJsonBody } from "@/lib/apiSecurity";
import { getPublicInstrumentBySlug } from "@/lib/instrumentPublish";
import { runLiveScoring } from "@/lib/studioScoringData";
import { enrollFromAttempt } from "@/lib/email/enrollment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LEN = 200;
const cap = (v: unknown) => (typeof v === "string" ? v.slice(0, MAX_LEN) : "");

// POST /api/assess/[slug]/score — score a real respondent against a published
// instrument using the deterministic studio engine; persist a kind='live' attempt.
// 404 unless the instrument is live. Never touches the Snapshot path.
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await rateLimit(request, { bucket: "assess-score", limit: 10, windowSeconds: 60 }))) return tooManyRequests();

  const instrument = await getPublicInstrumentBySlug(decodeURIComponent(slug));
  if (!instrument) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = (await readJsonBody(request)) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const structuralContext = typeof body.structural_context === "string" ? body.structural_context : null;
  const responsesRaw = (typeof body.responses === "object" && body.responses ? body.responses : {}) as Record<string, unknown>;
  const responses: Record<string, number> = {};
  for (const [k, v] of Object.entries(responsesRaw)) {
    const n = Number(v);
    if (Number.isInteger(n) && n >= 1 && n <= 5) responses[k] = n;
  }
  if (Object.keys(responses).length === 0) return NextResponse.json({ error: "No responses." }, { status: 400 });

  try {
    const res = await runLiveScoring({
      assessmentId: instrument.assessment_id,
      structuralContext,
      responses,
      name: cap(body.name) || null,
      email: cap(body.email) || null,
    });
    if (!res.attempt_id) return NextResponse.json({ error: "Scoring did not complete." }, { status: 502 });
    // Enroll in the email sequence + send the results email. Resilient — never
    // blocks or fails the score response if email isn't configured or errors.
    await enrollFromAttempt(res.attempt_id).catch(() => {});
    return NextResponse.json({ attempt_id: res.attempt_id });
  } catch {
    return NextResponse.json({ error: "Scoring failed." }, { status: 502 });
  }
}
