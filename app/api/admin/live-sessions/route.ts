import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { LIVE_STATUSES } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AREAS = new Set(["academy", "institute"]);
const STATUSES = new Set<string>(LIVE_STATUSES);

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("live_sessions")
    .select("*")
    .order("scheduled_at", { ascending: false, nullsFirst: false });
  if (error) return NextResponse.json({ error: "Failed to load sessions." }, { status: 502 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const area = typeof body.area === "string" ? body.area : "";
  if (!AREAS.has(area)) return NextResponse.json({ error: "Invalid area." }, { status: 400 });
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  const str = (k: string) => (typeof body[k] === "string" && (body[k] as string).trim() ? (body[k] as string).trim() : null);
  const row = {
    area,
    title,
    description: str("description"),
    embed_url: str("embed_url"),
    join_url: str("join_url"),
    replay_url: str("replay_url"),
    scheduled_at: str("scheduled_at"),
    status: typeof body.status === "string" && STATUSES.has(body.status) ? body.status : "scheduled",
    min_tier: typeof body.min_tier === "string" && body.min_tier ? body.min_tier : "academy_plus",
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    updated_by: user?.email ?? null,
  };

  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("live_sessions").insert(row).select("id").maybeSingle();
  if (error) {
    console.error("[live-sessions] create:", error.message);
    return NextResponse.json({ error: "Failed to create." }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "live_session.create", target: data?.id, metadata: { area, title } });
  return NextResponse.json({ id: data?.id });
}
