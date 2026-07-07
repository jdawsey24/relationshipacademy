import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { INSTITUTE_SECTIONS, OFFERING_STATUSES } from "@/lib/institute";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTION_KEYS = new Set(INSTITUTE_SECTIONS.map((s) => s.key));
const STATUSES = new Set<string>(OFFERING_STATUSES);

// GET: all offerings (incl. drafts) for the admin list.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("institute_offerings")
    .select("*")
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: "Failed to load offerings." }, { status: 502 });
  return NextResponse.json({ rows: data ?? [] });
}

// POST: create an offering. Body: { section, title, description?, status?, cta_label?, cta_url?, sort_order? }
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

  const section = typeof body.section === "string" ? body.section : "";
  if (!SECTION_KEYS.has(section as never)) {
    return NextResponse.json({ error: "Invalid section." }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const status = typeof body.status === "string" && STATUSES.has(body.status) ? body.status : "in_development";

  const row = {
    section,
    title,
    description: typeof body.description === "string" ? body.description : null,
    status,
    cta_label: typeof body.cta_label === "string" && body.cta_label.trim() ? body.cta_label.trim() : null,
    cta_url: typeof body.cta_url === "string" && body.cta_url.trim() ? body.cta_url.trim() : null,
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    updated_by: user?.email ?? null,
  };

  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("institute_offerings").insert(row).select("id").maybeSingle();
  if (error) {
    console.error("[institute-offerings] create:", error.message);
    return NextResponse.json({ error: "Failed to create." }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "institute_offering.create", target: data?.id, metadata: { section, title } });
  return NextResponse.json({ id: data?.id });
}
