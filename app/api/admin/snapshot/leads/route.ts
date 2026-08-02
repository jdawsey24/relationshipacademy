import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getSnapshotLeads } from "@/lib/snapshot/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    return NextResponse.json({ leads: await getSnapshotLeads() });
  } catch {
    return NextResponse.json({ error: "Failed to load Snapshot leads." }, { status: 502 });
  }
}
