import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/apiSecurity";
import { rateLimit, tooManyRequests, clientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { joinWaitlist } from "@/lib/clarity/sequences";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Joining the Dating With Clarity priority list.
//
// Separate from /api/site-leads because this is not an enquiry: it puts her on a
// mailing list with a launch calendar attached, and the four qualifying answers
// are the reason the form asks for them. They keep their own columns rather than
// being folded into a free-text message.
//
// Only the email is required. Every other field is optional by design: a longer
// form answered honestly is worth more than a shorter one, but a required field
// she does not want to answer just loses the address.

const MAX = { email: 320, first_name: 200, dating_status: 120, can_attend: 120, free_text: 2000 };

export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "clarity-waitlist", limit: 5, windowSeconds: 60 }))) {
    return tooManyRequests();
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonBody(request, 20_000);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const str = (k: string, cap: number): string | null => {
    const v = body[k];
    if (typeof v !== "string") return null;
    const t = v.trim();
    return t ? t.slice(0, cap) : null;
  };

  const email = (str("email", MAX.email) ?? "").toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const token = typeof body.turnstile_token === "string" ? body.turnstile_token : null;
  if (!(await verifyTurnstile(token, clientIp(request)))) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const { ok } = await joinWaitlist({
    email,
    firstName: str("first_name", MAX.first_name),
    datingStatus: str("dating_status", MAX.dating_status),
    hardestPart: str("hardest_part", MAX.free_text),
    confidenceGoal: str("confidence_goal", MAX.free_text),
    canAttend: str("can_attend", MAX.can_attend),
  });
  if (!ok) {
    return NextResponse.json({ error: "Could not add you to the list. Please try again." }, { status: 502 });
  }

  // Deliberately the same answer whether or not she was already on the list.
  // Confirming an address is on a list to anyone who can type it is a small
  // privacy leak that a signup form has no reason to introduce.
  return NextResponse.json({ ok: true });
}
