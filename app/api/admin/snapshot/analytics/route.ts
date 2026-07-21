import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getSnapshotAnalytics } from "@/lib/snapshot/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    return NextResponse.json(await getSnapshotAnalytics());
  } catch {
    return NextResponse.json({ error: "Failed to load Snapshot analytics." }, { status: 502 });
  }
}
