import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cookie-bound Supabase client for server components and route handlers.
// Uses the ANON key + the user's session cookie (set at login) so auth checks
// work. This is NOT the service-role client — data reads/writes that must
// bypass RLS still use getSupabaseAdminClient() from lib/supabase.ts.
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component where cookies are read-only;
            // safe to ignore — middleware refreshes the session cookie.
          }
        },
      },
    }
  );
}

/**
 * Returns the authenticated admin user, or null. Use in admin API routes as a
 * defense-in-depth check (middleware already gates /admin and /api/admin).
 */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
