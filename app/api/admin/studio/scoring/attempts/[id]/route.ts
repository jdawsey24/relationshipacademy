import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getAttemptTrace } from "@/lib/studioScoringData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: full traceability for a simulation attempt (attempt → score results →
// findings → recommendations).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const trace = await getAttemptTrace(id);
  if (!trace) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(trace);
}
