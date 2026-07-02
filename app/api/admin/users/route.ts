import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwner, getAdminRole, type AdminRole } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: AdminRole[] = ["owner", "editor", "viewer"];

export async function GET() {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: "Failed to load users.", details: error.message }, { status: 502 });
  const rows = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    role: getAdminRole(u),
    last_sign_in_at: u.last_sign_in_at ?? null,
    deactivated: !!(u as { banned_until?: string }).banned_until,
  }));
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = ROLES.includes(body.role as AdminRole) ? (body.role as AdminRole) : "viewer";
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role } });
  if (error) return NextResponse.json({ error: "Failed to create user.", details: error.message }, { status: 502 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const me = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });
  if (id === me?.id) return NextResponse.json({ error: "You can't change your own role or status." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const attrs: Record<string, unknown> = {};
  if (ROLES.includes(body.role as AdminRole)) attrs.app_metadata = { role: body.role };
  if (typeof body.deactivated === "boolean") attrs.ban_duration = body.deactivated ? "876000h" : "none";
  if (Object.keys(attrs).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  const { error } = await supabase.auth.admin.updateUserById(id, attrs);
  if (error) return NextResponse.json({ error: "Failed to update user.", details: error.message }, { status: 502 });
  return NextResponse.json({ ok: true });
}
