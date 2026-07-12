import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { listAssessments } from "@/lib/studioAssessmentData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ rows: await listAssessments() });
}
