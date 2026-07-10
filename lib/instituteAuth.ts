import { NextResponse } from "next/server";
import { getMember, type Member } from "@/lib/academyAuth";

// Server-only. Institute professional access. Reuses the same Supabase Auth +
// profiles as the Academy (see getMember); a professional is a signed-in user
// whose profile has is_professional=true. Staff always count as professional.

export interface Professional extends Member {
  isProfessional: boolean;
}

/** The current user with professional status, or null if not signed in. */
export async function getProfessional(): Promise<Professional | null> {
  const member = await getMember();
  if (!member) return null;
  const isProfessional = member.isStaff || member.profile.is_professional === true;
  return { ...member, isProfessional };
}

/** API guard: 401 if not signed in, 403 if signed in but not a professional. */
export async function requireProfessional(): Promise<Professional | NextResponse> {
  const pro = await getProfessional();
  if (!pro) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!pro.isProfessional) {
    return NextResponse.json({ error: "Professional access required." }, { status: 403 });
  }
  return pro;
}
