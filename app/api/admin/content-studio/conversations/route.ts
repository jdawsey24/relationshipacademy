import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { createConversation, listConversations, addMessage } from "@/lib/contentIntelligence/conversation";
import { sanitizeUntrusted } from "@/lib/contentEngine/normalize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Start a conversation. One input, either path — a pasted thought or a keyword.
// Whether the thought is rough or already formed is worked out from what was
// written, not declared up front.

export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ conversations: await listConversations() });
}

export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  let body: { text?: string; keyword_id?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const user = await getAdminUser();
  const actor = user?.email ?? null;
  const s = getSupabaseAdminClient();

  const fromKeyword = !!body.keyword_id;
  if (!fromKeyword && !body.text?.trim()) {
    return NextResponse.json({ error: "Say what you're thinking about." }, { status: 400 });
  }

  let title = body.text?.trim().slice(0, 80) ?? null;
  let seedText = body.text ?? "";

  if (fromKeyword) {
    const { data } = await s.from("ce_platform_keywords")
      .select("primary_phrase, platform, audience_doorway, rlc_interpretation")
      .eq("id", body.keyword_id!).maybeSingle();
    const k = data as Record<string, string> | null;
    if (!k) return NextResponse.json({ error: "That phrase is no longer available." }, { status: 404 });
    title = k.primary_phrase;
    seedText = k.primary_phrase;
  }

  // The thought goes where the script stages read it, not only into the title.
  // Typed on the home screen and then invisible in the workspace, it reads as
  // the Studio having forgotten what she just said.
  const conversationId = await createConversation({
    actor, entryPath: fromKeyword ? "opportunity" : "idea",
    keywordId: body.keyword_id ?? null, title,
    topic: fromKeyword ? seedText : sanitizeUntrusted(seedText).text,
  });

  // Pasted text is untrusted. Sanitised before storage, never treated as an
  // instruction to the model.
  if (!fromKeyword) {
    const clean = sanitizeUntrusted(seedText);
    await s.from("ci_sources").insert({
      conversation_id: conversationId, kind: "text",
      raw: seedText, sanitized: clean.text,
    });
    await addMessage({ conversationId, role: "owner", content: clean.text });
  } else {
    await s.from("ci_sources").insert({
      conversation_id: conversationId, kind: "keyword",
      keyword_id: body.keyword_id, sanitized: seedText,
    });
  }

  await audit({
    actor, action: "content_studio.conversation.started",
    metadata: { conversation_id: conversationId, entry: fromKeyword ? "opportunity" : "idea" },
  });

  return NextResponse.json({ conversation_id: conversationId }, { status: 201 });
}
