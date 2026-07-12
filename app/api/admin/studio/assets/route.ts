import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { listAssets } from "@/lib/studioAssetsData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const u = new URL(request.url);
  const rows = await listAssets({
    asset_type: u.searchParams.get("asset_type") || undefined,
    audience: u.searchParams.get("audience") || undefined,
    status: u.searchParams.get("status") || undefined,
    search: u.searchParams.get("search") || undefined,
  });
  return NextResponse.json({ rows });
}
