import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { runSimulation, type SimScope } from "@/lib/studioScoringData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { scope, structuralContext, acknowledgedTransition, responses } → run the
// deterministic engine on a SIMULATION attempt. PROVISIONAL; not public scoring.
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const scope = body.scope as SimScope;
  if (!scope || (scope.type !== "competency" && scope.type !== "domain") || !scope.id) {
    return NextResponse.json({ error: "A competency or domain scope is required." }, { status: 400 });
  }
  const responses = (typeof body.responses === "object" && body.responses ? body.responses : {}) as Record<string, number>;
  const result = await runSimulation({
    scope,
    structuralContext: typeof body.structuralContext === "string" ? body.structuralContext : null,
    acknowledgedTransition: typeof body.acknowledgedTransition === "string" ? body.acknowledgedTransition : null,
    responses,
    actor: user?.email ?? null,
  });
  await audit({ actor: user?.email ?? null, action: "studio.scoring.simulate", target: `${scope.type}:${scope.id}`, metadata: { attempt_id: result.attempt_id, findings: result.findings.length } });
  return NextResponse.json(result);
}
