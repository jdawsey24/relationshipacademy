import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const [levelsRes, domainsRes] = await Promise.all([
    supabase
      .from("result_levels")
      .select("id, domain_id, level, title, interpretation, recommendation, cta, score_min, score_max")
      .order("score_min", { ascending: false }),
    supabase.from("domains").select("id, name"),
  ]);
  if (levelsRes.error) {
    return NextResponse.json({ error: "Failed to load result levels.", details: levelsRes.error.message }, { status: 502 });
  }
  const domainName = new Map((domainsRes.data ?? []).map((d) => [d.id, d.name]));
  const rows = (levelsRes.data ?? []).map((r) => ({
    ...r,
    domain_name: r.domain_id ? domainName.get(r.domain_id) ?? "Unknown" : "Generic",
  }));
  return NextResponse.json({ rows });
}

const EDITABLE = ["title", "interpretation", "recommendation", "cta", "score_min", "score_max"] as const;

export async function PATCH(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (key in body) update[key] = body[key];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("result_levels")
    .update(update)
    .eq("id", body.id)
    .select()
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Failed to save.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ row: data });
}
