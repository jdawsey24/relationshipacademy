import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readJsonBody } from "@/lib/apiSecurity";

// Public endpoint (no auth) for site lead-capture forms. Writes to site_leads
// via the service role. RLS on the table allows public insert; reads are
// admin-only. Validates the minimal required fields.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-field length caps: block oversized submissions that would bloat the DB.
const MAX_LEN: Record<string, number> = {
  name: 200, email: 320, source: 40, inquiry_type: 80,
  message: 5000, organization: 200, event_type: 80,
};

const VALID_SOURCES = new Set([
  "contact_form",
  "speaking_inquiry",
  "learn_waitlist",
  "professional_interest",
  "newsletter",
]);

const FIELDS = [
  "name",
  "email",
  "source",
  "inquiry_type",
  "message",
  "organization",
  "event_type",
] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonBody(request, 20_000); // 20 KB cap for a form
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source : "";
  if (!email || email.length > MAX_LEN.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!VALID_SOURCES.has(source)) {
    return NextResponse.json({ error: "Invalid source." }, { status: 400 });
  }

  const row: Record<string, unknown> = { status: "new" };
  for (const f of FIELDS) {
    const v = body[f];
    if (typeof v === "string" && v.trim() !== "") {
      const trimmed = v.trim();
      if (trimmed.length > (MAX_LEN[f] ?? 500)) {
        return NextResponse.json({ error: `${f} is too long.` }, { status: 400 });
      }
      row[f] = trimmed;
    }
  }
  row.email = email;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_leads").insert(row);
  if (error) {
    // Log the real cause server-side; never leak DB internals to the client.
    console.error("[site-leads] insert failed:", error.message);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
