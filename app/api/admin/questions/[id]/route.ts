import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Editable via the admin UI. Structural columns (id, domain_id,
// competency_phase_id, assessment_version_id) are intentionally excluded.
const EDITABLE = [
  "question_text",
  "item_type",
  "score_direction",
  "construct",
  "subconstruct",
  "observable_behavior",
  "active",
  "in_snapshot",
  "in_profile",
] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, domain_id, competency_phase_id, question_text, item_type, score_direction, construct, subconstruct, observable_behavior, active, in_snapshot, in_profile")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Failed to load question.", details: error.message }, { status: 502 });
  }
  if (!data) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
  return NextResponse.json({ question: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireEditor();
  if (unauth) return unauth;

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
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
    .from("questions")
    .update(update)
    .eq("id", id)
    .select("id, domain_id, competency_phase_id, question_text, item_type, score_direction, construct, subconstruct, observable_behavior, active, in_snapshot, in_profile")
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Failed to save.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ question: data });
}
