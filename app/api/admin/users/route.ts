import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwner, getAdminRole, type AdminRole } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { readJsonBody } from "@/lib/apiSecurity";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: AdminRole[] = ["owner", "editor", "viewer"];

// Admin password policy: 12+ chars with mixed character classes.
function passwordError(pw: string): string | null {
  if (pw.length < 12) return "Password must be at least 12 characters.";
  if (pw.length > 200) return "Password is too long.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include a symbol.";
  return null;
}

export async function GET() {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: "Failed to load users." }, { status: 502 });
  const rows = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    role: getAdminRole(u),
    last_sign_in_at: u.last_sign_in_at ?? null,
    deactivated: !!(u as { banned_until?: string }).banned_until,
    mfa: (u.factors ?? []).some((f) => f.status === "verified"),
  }));
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonBody(request, 8_000);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = ROLES.includes(body.role as AdminRole) ? (body.role as AdminRole) : "viewer";
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const pwErr = passwordError(password);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });

  const me = await getAdminUser();
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role } });
  if (error) return NextResponse.json({ error: "Failed to create user." }, { status: 502 });
  await audit({ actor: me?.email ?? null, action: "user.create", target: email, metadata: { role } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const me = await getAdminUser();
  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonBody(request, 8_000);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

  // Reset (remove) a user's MFA factors — recovery for a locked-out admin.
  // Allowed for any user, including self.
  if (body.resetMfa === true) {
    const supabase = getSupabaseAdminClient();
    const { data: fData, error: listErr } = await supabase.auth.admin.mfa.listFactors({ userId: id });
    if (listErr) return NextResponse.json({ error: "Failed to reset two-factor." }, { status: 502 });
    for (const f of fData?.factors ?? []) {
      await supabase.auth.admin.mfa.deleteFactor({ id: f.id, userId: id });
    }
    await audit({ actor: me?.email ?? null, action: "user.mfa_reset", target: id, metadata: { removed: fData?.factors?.length ?? 0 } });
    return NextResponse.json({ ok: true });
  }

  if (id === me?.id) return NextResponse.json({ error: "You can't change your own role or status." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const attrs: Record<string, unknown> = {};
  if (ROLES.includes(body.role as AdminRole)) attrs.app_metadata = { role: body.role };
  if (typeof body.deactivated === "boolean") attrs.ban_duration = body.deactivated ? "876000h" : "none";
  if (Object.keys(attrs).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  const { error } = await supabase.auth.admin.updateUserById(id, attrs);
  if (error) return NextResponse.json({ error: "Failed to update user." }, { status: 502 });
  await audit({
    actor: me?.email ?? null,
    action: "user.update",
    target: id,
    metadata: {
      ...(attrs.app_metadata ? { role: (attrs.app_metadata as { role?: string }).role } : {}),
      ...(typeof body.deactivated === "boolean" ? { deactivated: body.deactivated } : {}),
    },
  });
  return NextResponse.json({ ok: true });
}
