import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { BridgeError, generateBridges } from "@/lib/contentEngine/bridges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Propose relational bridges for a trend. The model chooses from the canonical
// competency set; anything outside it is rejected here AND by the FK.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const user = await getAdminUser();

  try {
    const result = await generateBridges({ candidateId: id, actor: user?.email ?? null });
    await audit({
      actor: user?.email ?? null,
      action: "content_engine.bridges.generated",
      metadata: {
        candidate_id: id,
        accepted: result.bridges.length,
        rejected: result.rejected.length,
        stripped_injection: result.strippedInjection,
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    const status = e instanceof BridgeError ? e.status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bridge generation failed." }, { status });
  }
}
