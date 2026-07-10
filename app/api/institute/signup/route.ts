import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readJsonBody } from "@/lib/apiSecurity";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Self-serve PROFESSIONAL signup. Creates a pre-confirmed account (no email
// step, mirroring the Academy) and marks the profile is_professional=true so the
// gated Institute area unlocks. Public + rate-limited. The client signs in after.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ok = await rateLimit(request, { bucket: "institute-signup", limit: 5, windowSeconds: 60 });
  if (!ok) return tooManyRequests();

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request, 2_000)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fullName = typeof body.full_name === "string" ? body.full_name.trim().slice(0, 120) : "";
  const organization = typeof body.organization === "string" ? body.organization.trim().slice(0, 160) : "";

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const admin = getSupabaseAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || null, organization: organization || null },
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 });
    }
    console.error("[institute/signup]", error.message);
    return NextResponse.json({ error: "Could not create your account." }, { status: 502 });
  }

  // Mark professional (profile row is auto-created by the DB trigger).
  if (created?.user?.id) {
    await admin
      .from("profiles")
      .upsert(
        { id: created.user.id, full_name: fullName || null, is_professional: true, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
  }

  return NextResponse.json({ ok: true });
}
