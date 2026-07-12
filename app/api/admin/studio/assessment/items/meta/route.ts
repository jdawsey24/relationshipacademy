import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { competencyOptions } from "@/lib/studioAssessmentData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Filter-dropdown data for the item bank (competency id + name list). Domains,
// phases, and item statuses are client-side constants (lib/studioAssessment).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ competencies: await competencyOptions() });
}
