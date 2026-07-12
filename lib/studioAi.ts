import Anthropic from "@anthropic-ai/sdk";
import { getActiveKbByIds } from "@/lib/studioData";
import { createObject, StudioError } from "@/lib/studioWorkflow";
import type { Audience, KbCompetency, ObjectType, StudioObject } from "@/lib/studio";

// AI DRAFT generation. Two hard guarantees, enforced here in code:
//   1. It only ever drafts from APPROVED (status='active') Knowledge Base
//      competency records — nothing else is sent as source material.
//   2. Output ALWAYS lands as status='draft', provenance='ai_generated' (it
//      goes through createObject, which hard-codes draft). There is no code
//      path from generation to published — only a human owner can publish.
//
// Feature-flagged like Turnstile/Stripe: with no ANTHROPIC_API_KEY the rest of
// the Studio works unchanged and this returns a clear "not configured" error.

const MODEL = "claude-opus-4-8";

export function aiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Structured output schema — guarantees valid, parseable JSON back from Claude.
const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", description: "Clear, specific title for the piece." },
    suggested_slug: { type: "string", description: "URL-safe kebab-case slug." },
    summary: { type: "string", description: "One or two sentence summary." },
    body_markdown: { type: "string", description: "The full draft body in Markdown." },
    editor_notes: { type: "string", description: "Notes for the human reviewer: assumptions made, gaps, anything to verify against the framework." },
  },
  required: ["title", "suggested_slug", "summary", "body_markdown", "editor_notes"],
} as const;

interface DraftPayload {
  title: string;
  suggested_slug: string;
  summary: string;
  body_markdown: string;
  editor_notes: string;
}

export interface GenerateInput {
  object_type: ObjectType;
  audience: Audience;
  kb_ids: string[];
  prompt?: string;
  actor: string | null;
}

function kbBlock(records: KbCompetency[]): string {
  return records
    .map((r) => {
      const lines = [`### ${r.name} (${r.kind}${r.code ? `, ${r.code}` : ""})`];
      if (r.definition) lines.push(`Definition: ${r.definition}`);
      if (r.developmental_task) lines.push(`Developmental task: ${r.developmental_task}`);
      if (r.healthy_markers.length) lines.push(`Healthy markers: ${r.healthy_markers.join("; ")}`);
      if (r.common_challenges.length) lines.push(`Common challenges: ${r.common_challenges.join("; ")}`);
      if (r.growth_indicators.length) lines.push(`Growth indicators: ${r.growth_indicators.join("; ")}`);
      if (r.notes) lines.push(`Notes: ${r.notes}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

export async function generateDraft(input: GenerateInput): Promise<{ object: StudioObject; editorNotes: string }> {
  if (!aiConfigured()) {
    throw new StudioError("AI generation isn't configured. Set ANTHROPIC_API_KEY to enable it.", 503);
  }
  const records = await getActiveKbByIds(input.kb_ids);
  if (records.length === 0) {
    throw new StudioError("Select at least one approved Knowledge Base competency as source material.");
  }

  const system =
    "You are a drafting assistant for the Relationship Life Cycle™ (RLC), a proprietary relationship-development framework. " +
    "You are producing an internal DRAFT that a human owner will review, edit, and approve before anything is published. " +
    "Draft ONLY from the approved RLC competency records provided below. Do NOT invent framework terminology, phases, domains, " +
    "developmental tasks, or clinical claims that are not grounded in those records. If something the request asks for is not " +
    "supported by the provided records, note it in editor_notes rather than fabricating it. Write in warm, plain, non-clinical " +
    "language appropriate for the target audience. Return the draft as JSON matching the schema.";

  const user =
    `Object type: ${input.object_type}\n` +
    `Audience: ${input.audience}\n` +
    (input.prompt ? `Additional instructions from the owner: ${input.prompt}\n` : "") +
    `\nApproved RLC competency records (the ONLY source material you may use):\n\n${kbBlock(records)}`;

  let payload: DraftPayload;
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system,
      messages: [{ role: "user", content: user }],
      output_config: { format: { type: "json_schema", schema: DRAFT_SCHEMA } },
    } as Anthropic.MessageCreateParamsNonStreaming);
    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
    if (!text) throw new Error("empty response");
    payload = JSON.parse(text) as DraftPayload;
  } catch (e) {
    if (e instanceof StudioError) throw e;
    console.error("[studioAi] generation failed:", e instanceof Error ? e.message : e);
    throw new StudioError("AI generation failed. Please try again.", 502);
  }

  const object = await createObject({
    object_type: input.object_type,
    audience: input.audience,
    title: payload.title,
    slug: payload.suggested_slug,
    summary: payload.summary,
    provenance: "ai_generated",
    kb_refs: input.kb_ids,
    body: { content: payload.body_markdown, ai_editor_notes: payload.editor_notes },
    actor: input.actor,
    note: `AI-generated from ${records.length} approved competency record(s).`,
  });

  return { object, editorNotes: payload.editor_notes };
}
