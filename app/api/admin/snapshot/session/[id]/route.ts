import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getSessionDetail } from "@/lib/snapshot/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  try {
    const detail = await getSessionDetail(id);
    if (!detail) return NextResponse.json({ error: "Session not found." }, { status: 404 });
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to load session." }, { status: 502 });
  }
}
