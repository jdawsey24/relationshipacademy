import { NextResponse } from "next/server";
import { getAdminUser, createSupabaseServerClient } from "@/lib/supabaseServer";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "owner" | "editor" | "viewer";

// Role is stored in Supabase Auth app_metadata. Fail CLOSED: a user with a
// missing or unrecognized role gets the least-privilege "viewer" (read-only),
// never elevated access. Owners must have app_metadata.role = "owner" set
// explicitly (done for admin@relationshiplc.com).
export function getAdminRole(user: User | null): AdminRole {
  const r = user?.app_metadata?.role;
  return r === "owner" || r === "editor" || r === "viewer" ? r : "viewer";
}

// Defense-in-depth auth guard for admin API routes. Middleware already blocks
// unauthenticated requests to /api/admin/*, but each route re-checks so the
// service-role data access can never run without a valid session.
export async function requireAdmin(): Promise<NextResponse | null> {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Guard for write actions (create/update/delete of content, questions, media,
 * leads, etc.). Owners and editors pass; viewers are read-only and get 403.
 * Read (GET) routes keep using requireAdmin so viewers can still see the data.
 */
export async function requireEditor(): Promise<NextResponse | null> {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (getAdminRole(user) === "viewer") {
    return NextResponse.json({ error: "Editor access required." }, { status: 403 });
  }
  return null;
}

/** Guard for owner-only actions (Users & Settings). */
export async function requireOwner(): Promise<NextResponse | null> {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (getAdminRole(user) !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }
  return null;
}

/**
 * Strict guard for FINANCIAL routes: owner role AND an MFA-verified session
 * (AAL2). Enforced inside every finance route, not just via middleware. An owner
 * without MFA enrolled is blocked (must enroll in Security). Returns the user on
 * success so routes can attribute audit entries.
 */
export async function requireOwnerFinance(): Promise<{ user: User } | NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (getAdminRole(user) !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }
  try {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") {
      return NextResponse.json({ error: "Multi-factor authentication is required for financial access." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Could not verify MFA." }, { status: 403 });
  }
  return { user };
}
