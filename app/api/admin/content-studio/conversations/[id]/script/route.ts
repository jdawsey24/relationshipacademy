import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { sanitizeUntrusted } from "@/lib/contentEngine/normalize";
import { chooseOption, editOption, readProject, runStage, ScriptError } from "@/lib/contentStudio/script";
import { STAGES, type Stage } from "@/lib/contentStudio/stages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The script pipeline. GET reads the whole project; POST does one thing.

type Params = { params: Promise<{ id: string }> };

export async function GET(_r: Request, { params }: Params) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    return NextResponse.json(await readProject(id));
  } catch (e) {
    const status = e instanceof ScriptError ? e.status : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}

export async function POST(request: Request, { params }: Params) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  let body: {
    action?: "source" | "run" | "choose" | "edit";
    stage?: string; option_id?: string; content?: string;
    source_text?: string; source_url?: string; topic?: string;
  };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const actor = (await getAdminUser())?.email ?? null;
  const s = getSupabaseAdminClient();

  try {
    switch (body.action) {
      case "source": {
        // What she pasted is untrusted. Sanitised before it is ever stored, and
        // delimited again when it reaches the model.
        const clean = body.source_text ? sanitizeUntrusted(body.source_text).text : null;
        await s.from("ci_conversations").update({
          source_text: clean,
          source_url: body.source_url?.trim() || null,
          topic: body.topic?.trim() || null,
          title: (body.topic?.trim() || clean || "").slice(0, 80) || null,
          updated_at: new Date().toISOString(),
        }).eq("id", id);
        break;
      }

      case "run": {
        if (!STAGES.includes(body.stage as Stage)) {
          return NextResponse.json({ error: "Unknown stage." }, { status: 400 });
        }
        const result = await runStage({ conversationId: id, stage: body.stage as Stage, actor });
        await audit({
          actor, action: "content_studio.stage.run",
          metadata: { conversation_id: id, stage: body.stage },
        });
        if (result.blocked) return NextResponse.json({ blocked: true, notice: result.notice });
        break;
      }

      case "choose": {
        if (!body.option_id) return NextResponse.json({ error: "No option given." }, { status: 400 });
        await chooseOption(id, body.option_id);
        break;
      }

      case "edit": {
        if (!body.option_id || !body.content?.trim()) {
          return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
        }
        await editOption(id, body.option_id, body.content);
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    return NextResponse.json(await readProject(id));
  } catch (e) {
    const status = e instanceof ScriptError ? e.status : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}
