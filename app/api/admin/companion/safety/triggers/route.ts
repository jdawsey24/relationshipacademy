import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { listTriggers, createTrigger } from "@/lib/companion/safetyCms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ triggers: await listTriggers() });
}

export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const pattern = String(body.pattern ?? "").trim();
  if (!pattern) return NextResponse.json({ error: "Pattern required." }, { status: 400 });
  try {
    const trigger = await createTrigger({
      pattern, match_type: body.match_type as string | undefined, level: body.level as string | undefined,
      risk_category: (body.risk_category as string) || null, notes: (body.notes as string) || null, actor: user?.email ?? null,
    });
    return NextResponse.json({ trigger });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
