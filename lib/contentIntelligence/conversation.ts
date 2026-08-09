import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";

// Conversation state and cost governance.
//
// The cost rule that matters: REACHING A LIMIT NEVER DESTROYS WORK. Every
// message, brief field, lens and decision is already saved. Hitting the hard
// limit stops the next model call and says what remains unfinished; it does not
// close the conversation or discard anything, and the owner can authorise
// continuing.

export interface CostState {
  spent: number;
  softLimit: number;
  hardLimit: number;
  state: "ok" | "soft_warned" | "hard_stopped" | "owner_continued";
  /** Plain sentence for the interface, or null when there is nothing to say. */
  notice: string | null;
  mayProceed: boolean;
}

export async function checkCost(conversationId: string): Promise<CostState> {
  const s = getSupabaseAdminClient();
  // The Studio's own limits. A script costs about fifty cents and a few
  // regenerations are normal, so the shared four-dollar warning fired mid-build.
  const settings = await getAiSettings("content_studio") as unknown as {
    conversation_soft_limit_usd?: number; conversation_hard_limit_usd?: number;
  };
  const soft = Number(settings.conversation_soft_limit_usd ?? 4);
  const hard = Number(settings.conversation_hard_limit_usd ?? 6);

  const { data } = await s.from("ci_conversations")
    .select("cost_usd, cost_state").eq("id", conversationId).maybeSingle();
  const c = data as { cost_usd: number; cost_state: CostState["state"] } | null;
  const spent = Number(c?.cost_usd ?? 0);
  const current = c?.cost_state ?? "ok";

  if (current === "owner_continued") {
    return { spent, softLimit: soft, hardLimit: hard, state: "owner_continued",
             notice: null, mayProceed: true };
  }
  if (spent >= hard) {
    return {
      spent, softLimit: soft, hardLimit: hard, state: "hard_stopped",
      notice:
        `This conversation has reached $${hard.toFixed(2)}. Everything is saved — the thinking, the ` +
        `decisions and any drafts. Say the word and I'll carry on.`,
      mayProceed: false,
    };
  }
  if (spent >= soft) {
    return {
      spent, softLimit: soft, hardLimit: hard, state: "soft_warned",
      notice: `We're at $${spent.toFixed(2)} on this one. Nothing's wrong — just so you know.`,
      mayProceed: true,
    };
  }
  return { spent, softLimit: soft, hardLimit: hard, state: "ok", notice: null, mayProceed: true };
}

export async function recordCost(conversationId: string, usd: number) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ci_conversations").select("cost_usd").eq("id", conversationId).maybeSingle();
  const next = Number((data as { cost_usd: number } | null)?.cost_usd ?? 0) + usd;
  const cost = await checkCost(conversationId);
  await s.from("ci_conversations").update({
    cost_usd: next,
    cost_state: cost.state === "owner_continued" ? "owner_continued"
      : next >= cost.hardLimit ? "hard_stopped"
      : next >= cost.softLimit ? "soft_warned" : "ok",
    updated_at: new Date().toISOString(),
  }).eq("id", conversationId);
}

/** Owner authorises continuing past the hard limit. Nothing was lost meanwhile. */
export async function authoriseContinue(conversationId: string) {
  const s = getSupabaseAdminClient();
  await s.from("ci_conversations")
    .update({ cost_state: "owner_continued", updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}

// ---------------------------------------------------------------------------
// Conversation lifecycle
// ---------------------------------------------------------------------------

export async function createConversation(input: {
  actor: string | null;
  entryPath?: "idea" | "opportunity";
  keywordId?: string | null;
  title?: string | null;
  /** What she typed, kept where the script stages actually read it. */
  topic?: string | null;
}) {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("ci_conversations").insert({
    entry_path: input.entryPath ?? "idea",
    keyword_id: input.keywordId ?? null,
    title: input.title ?? null,
    topic: input.topic ?? null,
    created_by: input.actor,
  }).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export async function addMessage(input: {
  conversationId: string;
  role: "owner" | "assistant" | "system";
  content: string;
  kind?: string;
  costUsd?: number;
  generationRequestId?: string | null;
}) {
  const s = getSupabaseAdminClient();
  const { data: last } = await s.from("ci_messages")
    .select("seq").eq("conversation_id", input.conversationId)
    .order("seq", { ascending: false }).limit(1).maybeSingle();
  const seq = ((last as { seq: number } | null)?.seq ?? 0) + 1;

  const { data, error } = await s.from("ci_messages").insert({
    conversation_id: input.conversationId, seq, role: input.role,
    content: input.content, kind: input.kind ?? "message",
    cost_usd: input.costUsd ?? 0,
    generation_request_id: input.generationRequestId ?? null,
  }).select("id").maybeSingle();
  if (error) throw new Error(error.message);

  if (input.costUsd) await recordCost(input.conversationId, input.costUsd);
  await s.from("ci_conversations")
    .update({ updated_at: new Date().toISOString() }).eq("id", input.conversationId);

  return (data as { id: string }).id;
}

export async function ownerMessageIds(conversationId: string): Promise<string[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ci_messages")
    .select("id").eq("conversation_id", conversationId).eq("role", "owner");
  return (data ?? []).map((m) => (m as { id: string }).id);
}

export async function listConversations(limit = 20) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ci_conversations")
    .select("id, title, status, entry_path, updated_at")
    .order("updated_at", { ascending: false }).limit(limit);
  return data ?? [];
}
