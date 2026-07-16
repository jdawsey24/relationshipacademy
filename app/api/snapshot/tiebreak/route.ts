import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { readJsonBody, isUuid } from "@/lib/apiSecurity";
import { resolveTiebreak } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/snapshot/tiebreak — { session_id, cluster_id }. The picked cluster
// becomes Primary; another tied cluster becomes Secondary.
export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "snapshot-tiebreak", limit: 15, windowSeconds: 60 }))) return tooManyRequests();
  let body: Record<string, unknown>;
  try { body = (await readJsonBody(request)) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const sessionId = String(body.session_id ?? "");
  const clusterId = Number(body.cluster_id);
  if (!isUuid(sessionId) || !Number.isInteger(clusterId)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const ok = await resolveTiebreak(sessionId, clusterId);
  if (!ok) return NextResponse.json({ error: "Could not resolve." }, { status: 400 });
  return NextResponse.json({ session_id: sessionId });
}
