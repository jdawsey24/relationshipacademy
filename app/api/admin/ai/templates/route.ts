import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: all prompt templates (view/version history). Approved rows are immutable —
// edits create a NEW version via POST.
export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("prompt_templates").select("*").order("generation_type").order("version", { ascending: false });
  if (error) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: data ?? [] });
}

// POST: create a new template version (never mutate an approved one). If a
// template with the same name exists, version = max+1, status 'draft'.
export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const generation_type = typeof body.generation_type === "string" ? body.generation_type : "";
  if (!name || !generation_type) return NextResponse.json({ error: "Name and generation type are required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { data: existing } = await s.from("prompt_templates").select("version").eq("name", name).order("version", { ascending: false }).limit(1);
  const version = ((existing?.[0] as { version: number } | undefined)?.version ?? 0) + 1;
  const { data, error } = await s.from("prompt_templates").insert({
    name, generation_type,
    system_instruction: typeof body.system_instruction === "string" ? body.system_instruction : "",
    user_template: typeof body.user_template === "string" ? body.user_template : "",
    required_source_fields: Array.isArray(body.required_source_fields) ? body.required_source_fields : [],
    output_schema: typeof body.output_schema === "object" && body.output_schema ? body.output_schema : {},
    version, status: "draft", created_by: auth.user.email ?? null,
  }).select("id, version").maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to create version." }, { status: 502 });
  await audit({ actor: auth.user.email ?? null, action: "ai.template.create_version", target: name, metadata: { version } });
  return NextResponse.json({ id: (data as { id: string }).id, version });
}

// PATCH { id, status } — approve or retire a version. Approving makes it the
// active template; content stays immutable.
export async function PATCH(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  const status = body.status;
  if (!id || (status !== "approved" && status !== "retired" && status !== "draft")) {
    return NextResponse.json({ error: "id and a valid status are required." }, { status: 400 });
  }
  const s = getSupabaseAdminClient();
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (status === "approved") patch.approved_by = auth.user.email ?? null;
  const { error } = await s.from("prompt_templates").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to update." }, { status: 502 });
  await audit({ actor: auth.user.email ?? null, action: "ai.template.status", target: id, metadata: { status } });
  return NextResponse.json({ ok: true });
}
