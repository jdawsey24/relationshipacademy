import { NextResponse } from "next/server";
import { getProfessional } from "@/lib/instituteAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Identity endpoint for the Institute chrome (auth-aware masthead).
export async function GET() {
  const pro = await getProfessional();
  if (!pro) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    email: pro.user.email,
    name: pro.profile.full_name,
    isProfessional: pro.isProfessional,
  });
}
