import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { libraryCounts } from "@/lib/studioLibraryData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Row counts per learning-library type — powers the Library overview page.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ counts: await libraryCounts() });
}
