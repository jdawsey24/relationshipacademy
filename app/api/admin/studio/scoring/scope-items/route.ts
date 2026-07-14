import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { scopeItems, type SimScope } from "@/lib/studioScoringData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?type=competency|domain&id= → the items in scope for the simulation form.
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const u = new URL(request.url);
  const type = u.searchParams.get("type");
  const id = u.searchParams.get("id") ?? "";
  if (!type || !["competency", "domain", "assessment"].includes(type) || !id) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: await scopeItems({ type, id } as SimScope) });
}
