import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { isUuid } from "@/lib/apiSecurity";
import { getLiveResults, getLiveResultsDetailed } from "@/lib/studioScoringData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/assess/results?attempt= — the participant report for a live attempt.
// UUID-guarded + rate-limited (same bearer posture as /api/results). Returns the
// authored consumer report; the raw score trace stays server-side.
export async function GET(request: Request) {
  const attempt = new URL(request.url).searchParams.get("attempt") ?? "";
  if (!isUuid(attempt)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!(await rateLimit(request, { bucket: "assess-results", limit: 30, windowSeconds: 60 }))) return tooManyRequests();

  const [res, detailed] = await Promise.all([getLiveResults(attempt), getLiveResultsDetailed(attempt)]);
  if (!res) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({
    consumerReport: res.consumerReport,
    structuralContext: res.structuralContext,
    firstName: detailed?.firstName ?? null,
    domains: detailed?.domains ?? [],
    alignment: detailed?.alignment ?? null,
    expirationRisk: detailed?.expirationRisk ?? null,
  });
}
