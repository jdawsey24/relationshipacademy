import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { isStaffUser } from "@/lib/academyAuth";
import { COMPANION_PRODUCT_KEY } from "@/lib/companion";

// Server-only. Relationship Companion consumer auth + entitlement resolution.
// Reuses the shared Supabase Auth pool. Companion access is a DEDICATED grant
// (companion_entitlements), independent of the Academy membership_tier ladder.
// Staff get a full-access override for previewing.

export interface CompanionUser {
  user: User;
  emailVerified: boolean;
  hasEntitlement: boolean;
  isStaff: boolean;
}

/** True if the user has an active, unexpired Companion grant. */
async function resolveEntitlement(user: User): Promise<boolean> {
  const admin = getSupabaseAdminClient();
  try {
    const { data } = await admin
      .from("companion_entitlements")
      .select("id, status, expires_at")
      .eq("user_id", user.id)
      .eq("status", "active");
    const now = Date.now();
    return (data ?? []).some((r) => {
      const row = r as { expires_at: string | null };
      return row.expires_at === null || new Date(row.expires_at).getTime() > now;
    });
  } catch {
    return false; // resilient: table may not exist yet pre-migration
  }
}

/** The current Companion user, or null if not signed in. For server components. */
export async function getCompanionUser(): Promise<CompanionUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const isStaff = isStaffUser(user);
  const emailVerified = !!user.email_confirmed_at || !!(user as { confirmed_at?: string }).confirmed_at;
  // Staff bypass entitlement for preview; everyone else needs an active grant.
  const hasEntitlement = isStaff || (await resolveEntitlement(user));
  return { user, emailVerified, hasEntitlement, isStaff };
}

/** API guard: signed in. Returns the user or a 401. */
export async function requireCompanionUser(): Promise<CompanionUser | NextResponse> {
  const cu = await getCompanionUser();
  if (!cu) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return cu;
}

/** API guard: signed in, email verified, AND entitled. Returns the user or an error response. */
export async function requireEntitledCompanionUser(): Promise<CompanionUser | NextResponse> {
  const cu = await getCompanionUser();
  if (!cu) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!cu.isStaff && !cu.emailVerified) return NextResponse.json({ error: "Please verify your email.", code: "email_unverified" }, { status: 403 });
  if (!cu.hasEntitlement) return NextResponse.json({ error: "Companion access required.", code: "no_entitlement" }, { status: 403 });
  return cu;
}

export interface CompanionProfile {
  user_id: string;
  current_status_id: string | null;
  onboarding_completed_at: string | null;
  install_state: string;
  notification_prefs: Record<string, unknown>;
}

/** Ensure a companion_profiles row exists (defense-in-depth) and return it. */
export async function ensureCompanionProfile(userId: string): Promise<CompanionProfile> {
  const admin = getSupabaseAdminClient();
  const { data } = await admin.from("companion_profiles").select("*").eq("user_id", userId).maybeSingle();
  if (data) return data as CompanionProfile;
  const { data: created } = await admin.from("companion_profiles").upsert({ user_id: userId }, { onConflict: "user_id" }).select("*").maybeSingle();
  return (created as CompanionProfile) ?? {
    user_id: userId, current_status_id: null, onboarding_completed_at: null, install_state: "not_shown", notification_prefs: {},
  };
}

export { COMPANION_PRODUCT_KEY };
