import { NextResponse } from "next/server";
import { requireAdmin, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { listImmediacy, createImmediacy } from "@/lib/companion/safetyCms";
import { validateImmediacyTerm } from "@/lib/companion/safetyValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ terms: await listImmediacy() });
}

export async function POST(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const v = validateImmediacyTerm(body, true);
  if (!v.ok) return NextResponse.json({ error: v.errors.join(" ") }, { status: 400 });
  try {
    const term = await createImmediacy({ ...body, actor: user?.email ?? null });
    await audit({ actor: user?.email ?? null, action: "companion.safety.immediacy.create", target: (term as { id?: string })?.id ?? null, metadata: { kind: body.kind } });
    return NextResponse.json({ term });   // created INACTIVE
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
