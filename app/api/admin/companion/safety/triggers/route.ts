import { NextResponse } from "next/server";
import { requireAdmin, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { listTriggers, createTrigger } from "@/lib/companion/safetyCms";
import { validateTrigger, findConflicts, type ConflictRule } from "@/lib/companion/safetyValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ triggers: await listTriggers() });
}

export async function POST(request: Request) {
  const unauth = await requireOwner();   // owner-only writes (guardrail 1)
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  // Server-side validation (guardrails 4 + 5) — never trust the client.
  const v = validateTrigger(body, true);
  if (!v.ok) return NextResponse.json({ error: v.errors.join(" ") }, { status: 400 });

  // Duplicate/overlap warnings (guardrail 6) — non-blocking.
  const existing = (await listTriggers()) as unknown as ConflictRule[];
  const warnings = findConflicts({ risk_category: body.risk_category as string, pattern: String(body.pattern) }, existing);

  try {
    const trigger = await createTrigger({ ...body, actor: user?.email ?? null });
    await audit({ actor: user?.email ?? null, action: "companion.safety.trigger.create", target: (trigger as { id?: string })?.id ?? null, metadata: { risk_category: body.risk_category, canonical_concept: body.canonical_concept } });
    return NextResponse.json({ trigger, warnings });   // created INACTIVE (guardrail 7)
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
