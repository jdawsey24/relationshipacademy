import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { readJsonBody, isUuid } from "@/lib/apiSecurity";
import { convertSession } from "@/lib/snapshot/data";
import { enrollFromSession } from "@/lib/snapshot/nurture";
import { pushLeadToGHL } from "@/lib/snapshot/ghl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/snapshot/convert — { session_id, email }. Captures the lead at the
// Playbook CTA. Playbook PDF delivery is a later phase.
export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "snapshot-convert", limit: 15, windowSeconds: 60 }))) return tooManyRequests();
  let body: Record<string, unknown>;
  try { body = (await readJsonBody(request)) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const sessionId = String(body.session_id ?? "");
  const email = String(body.email ?? "").trim();
  if (!isUuid(sessionId) || !EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const ok = await convertSession(sessionId, email);
  if (!ok) return NextResponse.json({ error: "Something went wrong." }, { status: 502 });
  // Enroll in the per-cluster nurture (first email) and push the lead to GHL.
  // Both are resilient — a failure in either never fails the conversion.
  await Promise.allSettled([enrollFromSession(sessionId), pushLeadToGHL(sessionId)]);
  return NextResponse.json({ ok: true });
}
