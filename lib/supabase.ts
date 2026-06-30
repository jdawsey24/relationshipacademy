import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Two clients, two trust levels.
//
// - The anon client is safe for read-only / browser-exposed use and respects
//   Row Level Security.
// - The service-role client bypasses RLS and is used ONLY on the server (the
//   scoring API) to write session/result rows. Its key must never be exposed
//   to the browser, so it is read from a non-NEXT_PUBLIC env var.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public, RLS-respecting client. Safe to import anywhere.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Privileged, RLS-bypassing client for server-side writes only.
 * Throws if called without the service role key configured. NEVER import this
 * into client components.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
