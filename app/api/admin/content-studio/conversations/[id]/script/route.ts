import { NextResponse } from "next/server";
import { preflightGeneration, requireAiOwner } from "@/lib/ai/guard";
import { getAiSettings } from "@/lib/ai/settings";
import { CONTENT_STUDIO_SURFACE } from "@/lib/contentStudio/stages";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { sanitizeUntrusted } from "@/lib/contentEngine/normalize";
import { chooseOption, editOption, readProject, runStage, ScriptError } from "@/lib/contentStudio/script";
import { STAGES, type Stage } from "@/lib/contentStudio/stages";
import { isValidChoice } from "@/lib/contentStudio/directions";
import { isValidPlatform, matchKeywords, platformFor } from "@/lib/contentStudio/platforms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The script pipeline. GET reads the whole project; POST does one thing.

type Params = { params: Promise<{ id: string }> };

/**
 * Phrases worth landing, for the platform she chose. Empty until she chooses
 * one, because a keyword list for no particular platform is just noise.
 */
async function keywordsFor(project: Awaited<ReturnType<typeof readProject>>) {
  const brief = (project.conversation.brief ?? {}) as { platform?: string };
  if (!brief.platform || !platformFor(brief.platform)) return [];
  const idea = [project.readback, project.conversation.topic, project.conversation.source_text]
    .filter(Boolean).join(" ");
  return matchKeywords(brief.platform, idea, 5);
}

export async function GET(_r: Request, { params }: Params) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    const project = await readProject(id);
    return NextResponse.json({ ...project, keywords: await keywordsFor(project) });
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
    action?: "source" | "run" | "choose" | "edit" | "rehearsal";
    on?: boolean;
    stage?: string; option_id?: string; content?: string;
    source_text?: string; source_url?: string; topic?: string; offer?: string;
    form?: string; tone?: string; opening?: string;
    platform?: string; keyword?: string; readback?: string;
  };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const actor = (await getAdminUser())?.email ?? null;
  const s = getSupabaseAdminClient();

  try {
    switch (body.action) {
      case "source": {
        // PARTIAL. A field that was not sent is left alone.
        //
        // This handler also takes the shape and tone chips, and it used to write
        // every column on every call, so choosing a tone would have wiped the
        // pasted clip, the link and the note along with it.
        const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

        if (body.source_text !== undefined) {
          // Pasted text is untrusted. Sanitised before storage, delimited again
          // when it reaches the model.
          patch.source_text = body.source_text.trim() ? sanitizeUntrusted(body.source_text).text : null;
        }
        if (body.source_url !== undefined) patch.source_url = body.source_url.trim() || null;
        if (body.topic !== undefined) patch.topic = body.topic.trim() || null;

        const { data: existing } = await s.from("ci_conversations")
          .select("brief, title, topic, source_text").eq("id", id).maybeSingle();
        const row = existing as {
          brief?: Record<string, unknown>; title: string | null;
          topic: string | null; source_text: string | null;
        } | null;

        // The offer and the chips ride on the brief. Not a catalogue, not
        // settings — notes about this one script.
        const brief = { ...(row?.brief ?? {}) };
        if (body.offer !== undefined) {
          if (body.offer.trim()) brief.offer = body.offer.trim();
          else delete brief.offer;
        }
        if (body.platform !== undefined) {
          if (!isValidPlatform(body.platform)) {
            return NextResponse.json({ error: "Unknown platform." }, { status: 400 });
          }
          if (body.platform) brief.platform = body.platform;
          else { delete brief.platform; delete brief.keyword; }
        }
        // The chosen phrase is free text from her own sheet, so it is stored as
        // given but never treated as an instruction.
        if (body.keyword !== undefined) {
          if (body.keyword.trim()) brief.keyword = sanitizeUntrusted(body.keyword).text.slice(0, 200);
          else delete brief.keyword;
        }
        if (body.readback !== undefined) {
          // Hers now. The Studio does not write over it on a re-read.
          patch.readback = body.readback.trim() || null;
        }

        for (const axis of ["form", "tone", "opening"] as const) {
          const v = body[axis];
          if (v === undefined) continue;
          if (!isValidChoice(axis, v)) {
            return NextResponse.json({ error: `Unknown ${axis}.` }, { status: 400 });
          }
          if (v) brief[axis] = v; else delete brief[axis];
        }
        patch.brief = brief;

        // Only name it from what it is now, and never blank an existing name.
        const name = (patch.topic ?? row?.topic ?? patch.source_text ?? row?.source_text ?? "") as string;
        if (name.trim()) patch.title = name.trim().slice(0, 80);

        await s.from("ci_conversations").update(patch).eq("id", id);
        break;
      }

      case "run": {
        if (!STAGES.includes(body.stage as Stage)) {
          return NextResponse.json({ error: "Unknown stage." }, { status: 400 });
        }

        // The kill switch, the type allowlist, the rate limit and the daily
        // ceiling. This route was skipping all four: the Studio was the only
        // generator in the system with no spend ceiling above it.
        const settings = await getAiSettings(CONTENT_STUDIO_SURFACE);
        const stop = await preflightGeneration(request, settings, `cs_${body.stage}`);
        if (stop) return stop;

        const result = await runStage({ conversationId: id, stage: body.stage as Stage, actor });
        await audit({
          actor, action: "content_studio.stage.run",
          metadata: { conversation_id: id, stage: body.stage },
        });
        if (result.blocked) return NextResponse.json({ blocked: true, notice: result.notice });
        break;
      }

      case "rehearsal": {
        await s.from("ci_conversations")
          .update({ rehearsal: body.on === true, updated_at: new Date().toISOString() })
          .eq("id", id);
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

    const project = await readProject(id);
    return NextResponse.json({ ...project, keywords: await keywordsFor(project) });
  } catch (e) {
    const status = e instanceof ScriptError ? e.status : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}
