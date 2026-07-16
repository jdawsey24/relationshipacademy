import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { isUuid } from "@/lib/apiSecurity";
import { getResults } from "@/lib/snapshot/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/snapshot/results?session= — the Primary alignment paragraph + Playbook
// + Secondary blurb for the results page.
export async function GET(request: Request) {
  const session = new URL(request.url).searchParams.get("session") ?? "";
  if (!isUuid(session)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!(await rateLimit(request, { bucket: "snapshot-results", limit: 30, windowSeconds: 60 }))) return tooManyRequests();
  const results = await getResults(session);
  if (!results) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(results);
}
