import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { createDraftMapping, getQuestionMapRows, mappingCoverage, MapError } from "@/lib/questionMapData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET → the 47 Snapshot questions with their current approved mapping + drafts +
// history counts, plus coverage. Read = admin (viewers can see).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const [rows, coverage] = await Promise.all([getQuestionMapRows(), mappingCoverage()]);
  return NextResponse.json({ rows, coverage });
}

// POST → create a DRAFT mapping. Editors may author; only the owner approves
// (PATCH on [id]). AI is not involved in this layer.
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const question_id = typeof body.question_id === "string" ? body.question_id.trim() : "";
  const mapping_kind = body.mapping_kind === "competency_direct" ? "competency_direct" : "indicator";
  if (!question_id) return NextResponse.json({ error: "question_id is required." }, { status: 400 });

  try {
    const row = await createDraftMapping({
      question_id,
      mapping_kind,
      behavior_id: typeof body.behavior_id === "string" ? body.behavior_id : null,
      competency_id: typeof body.competency_id === "string" ? body.competency_id : null,
      exception_reason: typeof body.exception_reason === "string" ? body.exception_reason : null,
      rationale: typeof body.rationale === "string" ? body.rationale : null,
      confidence_level: typeof body.confidence_level === "string" ? body.confidence_level : null,
      actor: user?.email ?? null,
    });
    await audit({ actor: user?.email ?? null, action: "studio.question_map.draft", target: question_id, metadata: { mapping_kind, behavior_id: row.behavior_id, competency_id: row.competency_id } });
    return NextResponse.json({ row });
  } catch (e) {
    const err = e instanceof MapError ? e : new MapError("Could not save the mapping.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
