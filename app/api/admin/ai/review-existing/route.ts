import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getAiSettings } from "@/lib/ai/settings";
import { audit } from "@/lib/audit";
import { reviewExistingAsset, isReviewTarget } from "@/lib/ai/reviewContent";
import { AiError } from "@/lib/ai/generateItem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { target_type, target_id } → review an EXISTING asset (never edits it).
export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const target_type = typeof body.target_type === "string" ? body.target_type : "";
  const target_id = typeof body.target_id === "string" ? body.target_id.trim() : "";
  if (!isReviewTarget(target_type) || !target_id) return NextResponse.json({ error: "A valid target type and id are required." }, { status: 400 });

  const settings = await getAiSettings();
  const pre = await preflightGeneration(request, settings, "review_existing");
  if (pre) return pre;

  try {
    const res = await reviewExistingAsset({ target_type, target_id, actor: auth.user.email ?? null });
    await audit({ actor: auth.user.email ?? null, action: "ai.review_existing", target: `${target_type}:${target_id}`, metadata: { findings: res.findings.length } });
    return NextResponse.json(res);
  } catch (e) {
    const err = e instanceof AiError ? e : new AiError("Review failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
