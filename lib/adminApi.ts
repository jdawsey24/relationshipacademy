import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "owner" | "editor" | "viewer";

// Role is stored in Supabase Auth app_metadata. A user with no role set is
// treated as "owner" so the original/legacy admin account is never locked out.
export function getAdminRole(user: User | null): AdminRole {
  const r = (user?.app_metadata?.role ?? "owner") as AdminRole;
  return r === "editor" || r === "viewer" ? r : "owner";
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

/** Guard for owner-only actions (Users & Settings). */
export async function requireOwner(): Promise<NextResponse | null> {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (getAdminRole(user) !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }
  return null;
}
