import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { listSafetyEvents } from "@/lib/companion/safetyCms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only, metadata-only safety audit log.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ events: await listSafetyEvents(200) });
}
