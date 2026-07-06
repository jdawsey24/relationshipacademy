import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { type MembershipTier, type Profile, meetsTier } from "@/lib/academy";

// Server-only. Member (student) auth + tier resolution for the Academy.
//
// This is a DIFFERENT population from staff/admin. Admin-ness lives in
// app_metadata.role (owner/editor/viewer) and is unchanged. Membership TIER
// lives in the profiles table. Staff get a full-access override so an editor
// can preview any Academy content.

export interface Member {
  user: User;
  profile: Profile;
  tier: MembershipTier;
  isStaff: boolean;
}

/** True if the user is internal staff (has a recognized admin role). */
export function isStaffUser(user: User | null): boolean {
  const r = user?.app_metadata?.role;
  return r === "owner" || r === "editor" || r === "viewer";
}

/**
 * Ensure a profiles row exists for this user (defense-in-depth alongside the
 * DB trigger) and return it. Uses the service role so it works regardless of
 * RLS timing on first login.
 */
async function ensureProfile(user: User): Promise<Profile> {
  const admin = getSupabaseAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (data) return data as Profile;

  const seed = {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) ?? null,
  };
  const { data: created } = await admin
    .from("profiles")
    .upsert(seed, { onConflict: "id" })
    .select("*")
    .maybeSingle();
  // Fall back to a sane in-memory default if the write raced/failed.
  return (
    (created as Profile) ?? {
      id: user.id,
      full_name: seed.full_name,
      avatar_url: null,
      membership_tier: "free",
      skool_joined: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
}

/** The current member, or null if not signed in. For use in server components. */
export async function getMember(): Promise<Member | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await ensureProfile(user);
  const isStaff = isStaffUser(user);
  // Staff read as "professional" for display purposes but bypass gating anyway.
  const tier: MembershipTier = isStaff ? "professional" : profile.membership_tier;
  return { user, profile, tier, isStaff };
}

/** API-route guard: returns the member, or a 401 NextResponse. */
export async function requireMember(): Promise<Member | NextResponse> {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  return member;
}

/** Whether a member can access content gated at `minTier`. */
export function memberCanAccess(member: Member, minTier: string): boolean {
  return meetsTier(minTier, member.tier, member.isStaff);
}
