import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readJsonBody } from "@/lib/apiSecurity";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Self-serve Companion signup that BYPASSES email confirmation: the account is
// created already-confirmed via the service role, so the client can sign in
// immediately and land in the purchase flow. Public (no session) — rate-limited.
// Reuses the shared Supabase auth (same account space as Academy/Snapshot); the
// client does signInWithPassword afterward to get its own session.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ok = await rateLimit(request, { bucket: "companion-signup", limit: 5, windowSeconds: 60 });
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

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // pre-confirmed → no verification email, immediate sign-in
    user_metadata: { full_name: fullName || null },
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }
    console.error("[companion/signup]", error.message);
    return NextResponse.json({ error: "Could not create your account." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
