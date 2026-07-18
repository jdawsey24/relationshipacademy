import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { readJsonBody } from "@/lib/apiSecurity";
import { startSession } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/snapshot/start — { marker } → creates a session, resolves each slot to
// a unique statement (without replacement, cluster-24 context-filtered), and returns
// { session_id, questions:[{ id, options:[{ id, statement }] }] }. Option id is the
// session_item id the client sends back when answering.
export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "snapshot-start", limit: 30, windowSeconds: 60 }))) return tooManyRequests();
  let body: Record<string, unknown>;
  try { body = (await readJsonBody(request)) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const marker = typeof body.marker === "string" ? body.marker : "";
  if (!marker) return NextResponse.json({ error: "Missing marker." }, { status: 400 });
  try {
    const res = await startSession(marker);
    if (!res) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "Could not start." }, { status: 502 });
  }
}
