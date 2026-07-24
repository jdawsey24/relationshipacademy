import { NextResponse } from "next/server";
import { requireAdmin, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { listResponses, upsertResponse } from "@/lib/companion/safetyCms";
import { RESPONSE_LEVELS } from "@/lib/companion/safetyValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ responses: await listResponses() });
}

// PUT — upsert the supportive response copy for a protocol level.
export async function PUT(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const level = String(body.level ?? "");
  if (!RESPONSE_LEVELS.includes(level as (typeof RESPONSE_LEVELS)[number])) {
    return NextResponse.json({ error: `Level must be one of: ${RESPONSE_LEVELS.join(", ")}.` }, { status: 400 });
  }
  if (!String(body.message ?? "").trim()) return NextResponse.json({ error: "Message required." }, { status: 400 });
  try {
    await upsertResponse(body, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "companion.safety.response.upsert", target: level });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
