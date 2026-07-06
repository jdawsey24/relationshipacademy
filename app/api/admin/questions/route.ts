import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const [qRes, domainsRes, phasesRes] = await Promise.all([
    supabase
      .from("questions")
      .select("id, domain_id, competency_phase_id, question_text, item_type, score_direction, in_snapshot, in_profile, active")
      .order("id", { ascending: true }),
    supabase.from("domains").select("id, name"),
    supabase.from("competency_phases").select("id, name"),
  ]);
  if (qRes.error) {
    return NextResponse.json({ error: "Failed to load questions." }, { status: 502 });
  }
  const domainName = new Map((domainsRes.data ?? []).map((d) => [d.id, d.name]));
  const phaseName = new Map((phasesRes.data ?? []).map((p) => [p.id, p.name]));

  const rows = (qRes.data ?? []).map((q) => ({
    id: q.id,
    domain: domainName.get(q.domain_id) ?? "—",
    phase: phaseName.get(q.competency_phase_id) ?? "—",
    question_text: q.question_text ?? "",
    item_type: q.item_type ?? "",
    score_direction: q.score_direction ?? "",
    in_snapshot: !!q.in_snapshot,
    in_profile: !!q.in_profile,
    active: !!q.active,
  }));

  const counts = {
    total: rows.length,
    active: rows.filter((r) => r.active).length,
    in_snapshot: rows.filter((r) => r.in_snapshot).length,
  };

  return NextResponse.json({ rows, counts });
}
