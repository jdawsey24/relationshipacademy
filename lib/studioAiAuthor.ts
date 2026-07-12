import { randomUUID } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { aiConfigured } from "@/lib/studioAi";
import { StudioError } from "@/lib/studioWorkflow";
import { LEARNING_TABLES, type LibraryType } from "@/lib/studioLibrary";

// Type-aware AI AUTHORING assist (Phase E). Writes STRUCTURED, competency-
// grounded Draft records into the item bank / library tables — not generic
// prose. Same guarantees as Phase A: grounded only in approved KB records, and
// every output is status='draft', provenance='ai_generated' (no path to live).

const MODEL = "claude-opus-4-8";

interface Grounding {
  competency_id: string;
  name: string;
  domain: string | null;
  phase: string | null;
  definition: string | null;
  detail: Record<string, unknown>;
  indicators: string[];
}

async function loadGrounding(competencyId: string): Promise<Grounding> {
  const s = getSupabaseAdminClient();
  const { data: comp } = await s
    .from("kb_competencies")
    .select("code, name, domain_slug, phase_slug, definition, detail, status")
    .eq("code", competencyId)
    .eq("kind", "competency")
    .maybeSingle();
  if (!comp) throw new StudioError(`Competency ${competencyId} not found in the Knowledge Base.`, 404);
  if ((comp as { status: string }).status !== "active") {
    throw new StudioError("That competency is retired — only active Knowledge Base records can seed AI drafts.");
  }
  const { data: inds } = await s.from("studio_behavioral_indicators").select("indicator").eq("competency_id", competencyId);
  const c = comp as { name: string; domain_slug: string | null; phase_slug: string | null; definition: string | null; detail: Record<string, unknown> };
  return {
    competency_id: competencyId,
    name: c.name,
    domain: c.domain_slug,
    phase: c.phase_slug,
    definition: c.definition,
    detail: c.detail ?? {},
    indicators: (inds ?? []).map((r) => (r as { indicator: string }).indicator).filter(Boolean),
  };
}

function groundingText(g: Grounding): string {
  const d = g.detail;
  const get = (k: string) => (typeof d[k] === "string" && (d[k] as string).trim() ? (d[k] as string) : null);
  const lines = [
    `Competency: ${g.name} (${g.competency_id})`,
    g.domain ? `Domain: ${g.domain}` : null,
    g.phase ? `Phase: ${g.phase}` : null,
    g.definition ? `Definition: ${g.definition}` : null,
    get("Purpose") ? `Purpose: ${get("Purpose")}` : null,
    get("Assessment Intent") ? `Assessment intent: ${get("Assessment Intent")}` : null,
    get("Item Writing Considerations") ? `Item-writing considerations: ${get("Item Writing Considerations")}` : null,
    get("Observable Expressions") ? `Observable expressions: ${get("Observable Expressions")}` : null,
    g.indicators.length ? `Behavioral indicators:\n- ${g.indicators.join("\n- ")}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

async function callClaude<T>(system: string, user: string, schema: object, maxTokens = 4000): Promise<T> {
  if (!aiConfigured()) throw new StudioError("AI generation isn't configured. Set ANTHROPIC_API_KEY to enable it.", 503);
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
      output_config: { format: { type: "json_schema", schema } },
    } as Anthropic.MessageCreateParamsNonStreaming);
    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
    if (!text) throw new Error("empty response");
    return JSON.parse(text) as T;
  } catch (e) {
    if (e instanceof StudioError) throw e;
    console.error("[studioAiAuthor] generation failed:", e instanceof Error ? e.message : e);
    throw new StudioError("AI generation failed. Please try again.", 502);
  }
}

const shortId = () => randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

// ---------------------------------------------------------------------------
// Assessment items
// ---------------------------------------------------------------------------
const ITEMS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", description: "The item as the respondent reads it, first-person, one behavior." },
          reverse_scored: { type: "boolean", description: "True if worded so that AGREEMENT indicates LOWER development." },
          rationale: { type: "string", description: "Which behavioral indicator / consideration this item targets." },
        },
        required: ["text", "reverse_scored", "rationale"],
      },
    },
  },
  required: ["items"],
} as const;

export async function generateAssessmentItems(input: {
  competency_id: string;
  count: number;
  instructions?: string;
  actor: string | null;
}): Promise<{ count: number; ids: string[] }> {
  const g = await loadGrounding(input.competency_id);
  const n = Math.min(20, Math.max(1, input.count || 8));
  const system =
    "You are an assessment item writer for the Relationship Life Cycle™ (RLC). Write self-report items on a five-point frequency scale " +
    "(Almost Never → Almost Always). Draft ONLY from the provided competency record and its behavioral indicators — do not invent constructs. " +
    "Items must be first-person, single-behavior, plain-language, and non-clinical. Include a mix of forward and reverse-scored items. " +
    "These are DRAFTS a human will review and approve. Return JSON matching the schema.";
  const user =
    `Write ${n} candidate assessment items for this competency.\n` +
    (input.instructions ? `Owner instructions: ${input.instructions}\n` : "") +
    `\n${groundingText(g)}`;
  const out = await callClaude<{ items: { text: string; reverse_scored: boolean; rationale: string }[] }>(system, user, ITEMS_SCHEMA);

  const s = getSupabaseAdminClient();
  const rows = out.items.slice(0, n).map((it) => ({
    item_id: `ASM-AI-${shortId()}`,
    competency_id: g.competency_id,
    competency: g.name,
    domain: g.domain,
    phase: g.phase,
    item_text: it.text,
    item_type: it.reverse_scored ? "Reverse-Scored" : "Behavioral",
    reverse_scored: !!it.reverse_scored,
    scoring_direction: it.reverse_scored ? "reverse" : "forward",
    response_model: "RM-FREQ-001",
    audience: "consumer",
    face_validity_notes: it.rationale,
    status: "draft",
    provenance: "ai_generated",
    updated_by: input.actor,
  }));
  if (rows.length === 0) throw new StudioError("The model returned no items. Try again.", 502);
  const { error } = await s.from("studio_assessment_items").insert(rows);
  if (error) throw new StudioError("Failed to save generated items.", 502);
  return { count: rows.length, ids: rows.map((r) => r.item_id) };
}

// ---------------------------------------------------------------------------
// Library content (worksheet / practice / activity / journal prompt / etc.)
// ---------------------------------------------------------------------------
const LIBRARY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    purpose: { type: "string", description: "One or two sentences: what this is for and the developmental goal." },
    body_markdown: { type: "string", description: "The main content — instructions / steps / prompt(s), in Markdown." },
    reflection_prompt: { type: "string", description: "A closing reflection question for the participant." },
  },
  required: ["title", "purpose", "body_markdown", "reflection_prompt"],
} as const;

interface LibraryDraft { title: string; purpose: string; body_markdown: string; reflection_prompt: string; }

function libraryColumns(type: LibraryType, ai: LibraryDraft): Record<string, unknown> {
  const detail = { ai_generated: true, purpose: ai.purpose, body: ai.body_markdown, reflection_prompt: ai.reflection_prompt };
  switch (type) {
    case "practices": return { name: ai.title, practice_type: "Guided", instructions: ai.body_markdown, reflection_prompt: ai.reflection_prompt, detail };
    case "activities": return { name: ai.title, activity_type: "Experiential", participant_instructions: ai.body_markdown, detail };
    case "interventions": return { name: ai.title, category: "Structured", overview: ai.purpose, participant_instructions: ai.body_markdown, detail };
    case "worksheets": return { title: ai.title, purpose: ai.purpose, detail };
    case "conversation-guides": return { title: ai.title, purpose: ai.purpose, detail };
    case "journal-prompts": return { title: ai.title, prompt: ai.body_markdown, use_case: ai.purpose, detail };
    case "videos": return { title: ai.title, video_type: "Concept Lesson", learning_objective: ai.purpose, detail };
    case "lessons": return { title: ai.title, content_type: "Lesson", learning_objective: ai.purpose, detail };
    default: return { detail };
  }
}

export async function generateLibraryItem(input: {
  type: LibraryType;
  competency_id: string;
  instructions?: string;
  actor: string | null;
}): Promise<{ id: string }> {
  const cfg = LEARNING_TABLES[input.type];
  if (!cfg.generatable) throw new StudioError(`AI generation isn't available for ${cfg.label}.`);
  const g = await loadGrounding(input.competency_id);
  const system =
    `You are creating a "${cfg.label.replace(/s$/, "")}" for the Relationship Life Cycle™ (RLC). Draft ONLY from the provided ` +
    "competency record and its behavioral indicators — do not invent framework facts. Write warm, plain, non-clinical, actionable content " +
    "appropriate for a consumer/member audience. This is a DRAFT a human will review and approve. Return JSON matching the schema.";
  const user =
    `Create one ${cfg.label.replace(/s$/, "").toLowerCase()} that helps someone develop this competency.\n` +
    (input.instructions ? `Owner instructions: ${input.instructions}\n` : "") +
    `\n${groundingText(g)}`;
  const ai = await callClaude<LibraryDraft>(system, user, LIBRARY_SCHEMA);

  const id = `${cfg.idPrefix}-AI-${shortId()}`;
  const row: Record<string, unknown> = {
    [cfg.pk]: id,
    domain: g.domain,
    phase: g.phase,
    audience: "consumer",
    status: "draft",
    provenance: "ai_generated",
    updated_by: input.actor,
    ...libraryColumns(input.type, ai),
  };
  if (cfg.competencyCol) row[cfg.competencyCol] = g.competency_id;
  else row.competency_ids = g.competency_id; // lessons

  const s = getSupabaseAdminClient();
  const { error } = await s.from(cfg.table).insert(row);
  if (error) throw new StudioError("Failed to save the generated draft.", 502);
  return { id };
}
