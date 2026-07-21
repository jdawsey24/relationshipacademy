import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { listResponses, upsertResponse } from "@/lib/companion/safetyCms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ responses: await listResponses() });
}

// PUT — upsert the supportive response language for a level.
export async function PUT(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const message = String(body.message ?? "").trim();
  if (!message) return NextResponse.json({ error: "Message required." }, { status: 400 });
  try {
    await upsertResponse({
      level: (body.level as string) || "high_risk", heading: (body.heading as string) || null, message,
      resource_intro: (body.resource_intro as string) || null, is_active: body.is_active as boolean | undefined, actor: user?.email ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
