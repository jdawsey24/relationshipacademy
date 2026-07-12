import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { listKb } from "@/lib/studioData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Knowledge Base browser list.
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const url = new URL(request.url);
  const rows = await listKb({
    kind: url.searchParams.get("kind") || undefined,
    status: url.searchParams.get("status") || undefined,
    audience: url.searchParams.get("audience") || undefined,
  });
  return NextResponse.json({ rows });
}

// POST: create a competency record (defaults to active — the owner curates the KB).
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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const row: Record<string, unknown> = {
    name,
    kind: typeof body.kind === "string" ? body.kind : "competency",
    code: typeof body.code === "string" && body.code.trim() ? body.code.trim() : null,
    phase_slug: typeof body.phase_slug === "string" ? body.phase_slug : null,
    domain_slug: typeof body.domain_slug === "string" ? body.domain_slug : null,
    competency_phase_slug: typeof body.competency_phase_slug === "string" ? body.competency_phase_slug : null,
    definition: typeof body.definition === "string" ? body.definition : null,
    developmental_task: typeof body.developmental_task === "string" ? body.developmental_task : null,
    healthy_markers: Array.isArray(body.healthy_markers) ? body.healthy_markers : [],
    common_challenges: Array.isArray(body.common_challenges) ? body.common_challenges : [],
    growth_indicators: Array.isArray(body.growth_indicators) ? body.growth_indicators : [],
    audiences: Array.isArray(body.audiences) ? body.audiences : [],
    status: body.status === "retired" ? "retired" : "active",
    source_ref: typeof body.source_ref === "string" ? body.source_ref : null,
    notes: typeof body.notes === "string" ? body.notes : null,
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    created_by: user?.email ?? null,
    updated_by: user?.email ?? null,
  };
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("kb_competencies").insert(row).select("id").maybeSingle();
  if (error) {
    const msg = error.message.includes("duplicate") ? "That code is already in use." : "Failed to create.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "kb.create", target: (data as { id: string })?.id, metadata: { name } });
  return NextResponse.json({ id: (data as { id: string })?.id });
}
