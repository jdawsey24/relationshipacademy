import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { listItems } from "@/lib/studioAssessmentData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const u = new URL(request.url);
  const rev = u.searchParams.get("reverse_scored");
  const page = await listItems({
    assessment_id: u.searchParams.get("assessment_id") || undefined,
    competency_id: u.searchParams.get("competency_id") || undefined,
    domain: u.searchParams.get("domain") || undefined,
    phase: u.searchParams.get("phase") || undefined,
    item_type: u.searchParams.get("item_type") || undefined,
    reverse_scored: rev === "true" ? true : rev === "false" ? false : undefined,
    status: u.searchParams.get("status") || undefined,
    search: u.searchParams.get("search") || undefined,
    page: Number(u.searchParams.get("page")) || 1,
    pageSize: Number(u.searchParams.get("pageSize")) || 50,
  });
  return NextResponse.json(page);
}

// POST: create a new item (always draft).
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const item_id = typeof body.item_id === "string" ? body.item_id.trim() : "";
  const item_text = typeof body.item_text === "string" ? body.item_text.trim() : "";
  if (!item_id || !item_text) return NextResponse.json({ error: "Item ID and text are required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { error } = await s.from("studio_assessment_items").insert({
    item_id, item_text,
    competency_id: typeof body.competency_id === "string" ? body.competency_id : null,
    domain: typeof body.domain === "string" ? body.domain : null,
    phase: typeof body.phase === "string" ? body.phase : null,
    item_type: typeof body.item_type === "string" ? body.item_type : null,
    response_model: typeof body.response_model === "string" ? body.response_model : null,
    reverse_scored: body.reverse_scored === true,
    audience: typeof body.audience === "string" ? body.audience : "consumer",
    status: "draft",
    updated_by: user?.email ?? null,
  });
  if (error) {
    const msg = error.message.includes("duplicate") ? "That Item ID already exists." : "Failed to create.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "studio.item.create", target: item_id });
  return NextResponse.json({ id: item_id });
}
