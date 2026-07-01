import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";

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
