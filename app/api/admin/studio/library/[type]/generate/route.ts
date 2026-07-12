import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { generateLibraryItem } from "@/lib/studioAiAuthor";
import { StudioError } from "@/lib/studioWorkflow";
import { LEARNING_TABLES, isLibraryType } from "@/lib/studioLibrary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { competency_id, instructions } → one AI-drafted record into the type's
// Library table. Always status='draft', provenance='ai_generated'.
export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { type } = await params;
  if (!isLibraryType(type)) return NextResponse.json({ error: "Unknown type." }, { status: 404 });
  if (!LEARNING_TABLES[type].generatable) return NextResponse.json({ error: "AI generation isn't available for this type." }, { status: 400 });
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const competency_id = typeof body.competency_id === "string" ? body.competency_id.trim() : "";
  if (!competency_id) return NextResponse.json({ error: "Select a competency." }, { status: 400 });
  try {
    const res = await generateLibraryItem({
      type,
      competency_id,
      instructions: typeof body.instructions === "string" ? body.instructions : undefined,
      actor: user?.email ?? null,
    });
    await audit({ actor: user?.email ?? null, action: `studio.${type}.ai_generate`, target: res.id, metadata: { competency_id } });
    return NextResponse.json(res);
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Generation failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
