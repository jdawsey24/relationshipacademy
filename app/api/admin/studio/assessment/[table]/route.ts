import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { ASSESSMENT_TABLES, isAssessmentTableKey } from "@/lib/studioAssessment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Generic list/create for the five sub-editor tables (response-models,
// scoring-rules, interpretation-rules, results-templates, recommendation-
// mappings). assessments/items have their own dedicated routes and win by
// static-route precedence.
export async function GET(_req: Request, { params }: { params: Promise<{ table: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { table } = await params;
  if (!isAssessmentTableKey(table)) return NextResponse.json({ error: "Unknown table." }, { status: 404 });
  const cfg = ASSESSMENT_TABLES[table];
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from(cfg.table).select("*").order(cfg.pk);
  if (error) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { table } = await params;
  if (!isAssessmentTableKey(table)) return NextResponse.json({ error: "Unknown table." }, { status: 404 });
  const cfg = ASSESSMENT_TABLES[table];
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const pkVal = body[cfg.pk];
  if (typeof pkVal !== "string" || !pkVal.trim()) {
    return NextResponse.json({ error: `${cfg.pk} is required.` }, { status: 400 });
  }
  const row = { ...body, status: typeof body.status === "string" ? body.status : "draft", updated_by: user?.email ?? null };
  const s = getSupabaseAdminClient();
  const { error } = await s.from(cfg.table).insert(row);
  if (error) {
    const msg = error.message.includes("duplicate") ? "That ID already exists." : "Failed to create.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: `studio.${table}.create`, target: pkVal });
  return NextResponse.json({ id: pkVal });
}
