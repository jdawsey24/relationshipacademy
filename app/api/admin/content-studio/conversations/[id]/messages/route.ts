import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getAiSettings } from "@/lib/ai/settings";
import { audit } from "@/lib/audit";
import { sanitizeUntrusted } from "@/lib/contentEngine/normalize";
import { runTurn, TurnError, TURN_TEMPLATE } from "@/lib/contentIntelligence/turn";
import { authoriseContinue } from "@/lib/contentIntelligence/conversation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One turn. The owner speaks, the Studio replies.
//
// A hard cost stop is not an error here: the message is saved, the reply is
// withheld, and the response says so in plain language. Nothing is lost and the
// owner can authorise continuing.

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  let body: { content?: string; continue_anyway?: boolean };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Nothing to send." }, { status: 400 });
  }

  const settings = await getAiSettings();
  const blocked = await preflightGeneration(request, settings, TURN_TEMPLATE);
  if (blocked) return blocked;

  const user = await getAdminUser();
  const actor = user?.email ?? null;

  if (body.continue_anyway) await authoriseContinue(id);

  // Pasted text is data, never instruction.
  const clean = sanitizeUntrusted(body.content);

  try {
    const r = await runTurn({ conversationId: id, content: clean.text, actor });
    if (r.blocked) {
      return NextResponse.json({ blocked: true, notice: r.notice }, { status: 200 });
    }
    await audit({
      actor, action: "content_studio.turn",
      metadata: { conversation_id: id, cost_usd: r.costUsd, lenses: (r.lenses as unknown[]).length },
    });
    return NextResponse.json({
      blocked: false, reply: r.reply, lenses: r.lenses,
      stripped_injection: clean.strippedInjection,
    });
  } catch (e) {
    if (e instanceof TurnError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "The reply failed. Your message is saved." }, { status: 500 });
  }
}
