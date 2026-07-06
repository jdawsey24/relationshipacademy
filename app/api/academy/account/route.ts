import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH: update the member's own profile. Members may edit their name and
// whether they've joined Skool — NOT their membership tier (that is admin/Stripe
// controlled). Body: { full_name?, skool_joined? }
export async function PATCH(request: Request) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request, 2_000)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ("full_name" in body) {
    update.full_name =
      typeof body.full_name === "string" && body.full_name.trim()
        ? body.full_name.trim().slice(0, 120)
        : null;
  }
  if ("skool_joined" in body) update.skool_joined = body.skool_joined === true;

  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("profiles")
    .update(update)
    .eq("id", member.user.id)
    .select("*")
    .maybeSingle();
  if (error) {
    console.error("[academy/account]", error.message);
    return NextResponse.json({ error: "Could not save." }, { status: 502 });
  }
  return NextResponse.json({ profile: data });
}
