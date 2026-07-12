import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { LEARNING_TABLES, isLibraryType } from "@/lib/studioLibrary";
import { listLibrary } from "@/lib/studioLibraryData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { type } = await params;
  if (!isLibraryType(type)) return NextResponse.json({ error: "Unknown type." }, { status: 404 });
  const u = new URL(request.url);
  const page = await listLibrary(type, {
    competency_id: u.searchParams.get("competency_id") || undefined,
    domain: u.searchParams.get("domain") || undefined,
    phase: u.searchParams.get("phase") || undefined,
    status: u.searchParams.get("status") || undefined,
    search: u.searchParams.get("search") || undefined,
    page: Number(u.searchParams.get("page")) || 1,
    pageSize: Number(u.searchParams.get("pageSize")) || 50,
  });
  return NextResponse.json(page);
}

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { type } = await params;
  if (!isLibraryType(type)) return NextResponse.json({ error: "Unknown type." }, { status: 404 });
  const cfg = LEARNING_TABLES[type];
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const pkVal = body[cfg.pk];
  if (typeof pkVal !== "string" || !pkVal.trim()) return NextResponse.json({ error: `${cfg.pk} is required.` }, { status: 400 });
  const isReference = "reference" in cfg && cfg.reference === true;
  const row = { ...body, status: typeof body.status === "string" ? body.status : (isReference ? "active" : "draft"), updated_by: user?.email ?? null };
  const s = getSupabaseAdminClient();
  const { error } = await s.from(cfg.table).insert(row);
  if (error) {
    const msg = error.message.includes("duplicate") ? "That ID already exists." : "Failed to create.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: `studio.${type}.create`, target: pkVal });
  return NextResponse.json({ id: pkVal });
}
