import { NextResponse } from "next/server";
import { requireEditor, getAdminRole } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { aiConfigured, generateDraft } from "@/lib/studioAi";
import { StudioError } from "@/lib/studioWorkflow";
import { isOwnerOnlyAudience, type Audience, type ObjectType } from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: is AI generation available? (drives the UI enable/disable state.)
export async function GET() {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  return NextResponse.json({ configured: aiConfigured() });
}

// POST: generate an AI DRAFT from approved KB competencies. The result is ALWAYS
// status='draft', provenance='ai_generated' — there is no path from here to
// published. Only a human owner can approve and publish.
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const isOwner = getAdminRole(user) === "owner";

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const object_type = body.object_type as ObjectType;
  const audience = body.audience as Audience;
  const kb_ids = Array.isArray(body.kb_ids) ? (body.kb_ids as string[]) : [];
  if (!object_type || !audience) {
    return NextResponse.json({ error: "Type and audience are required." }, { status: 400 });
  }
  if (isOwnerOnlyAudience(audience) && !isOwner) {
    return NextResponse.json({ error: "That audience is owner-only." }, { status: 403 });
  }
  if (kb_ids.length === 0) {
    return NextResponse.json({ error: "Select at least one approved Knowledge Base competency." }, { status: 400 });
  }

  try {
    const { object, editorNotes } = await generateDraft({
      object_type,
      audience,
      kb_ids,
      prompt: typeof body.prompt === "string" ? body.prompt : undefined,
      actor: user?.email ?? null,
    });
    await audit({
      actor: user?.email ?? null,
      action: "studio.ai_generate",
      target: object.id,
      metadata: { object_type, audience, kb_count: kb_ids.length },
    });
    return NextResponse.json({ id: object.id, editorNotes });
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Generation failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
