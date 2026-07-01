import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

// Public endpoint (no auth) for site lead-capture forms. Writes to site_leads
// via the service role. RLS on the table allows public insert; reads are
// admin-only. Validates the minimal required fields.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!VALID_SOURCES.has(source)) {
    return NextResponse.json({ error: "Invalid source." }, { status: 400 });
  }

  const row: Record<string, unknown> = { status: "new" };
  for (const f of FIELDS) {
    if (typeof body[f] === "string" && (body[f] as string).trim() !== "") {
      row[f] = (body[f] as string).trim();
    }
  }
  row.email = email;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_leads").insert(row);
  if (error) {
    return NextResponse.json(
      { error: "Failed to submit. Please try again.", details: error.message },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
