import { getProvider } from "@/lib/ai/provider";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderTemplate } from "@/lib/ai/templates";
import { aiConfigured } from "@/lib/studioAi";
import { fkGrade } from "@/lib/readability";

// Grounded AI expansion of a respondent's DETERMINISTIC result into a warm,
// personalized narrative. The SCORES are never touched — this writes prose only,
// strictly from the computed results + the owner's authored consumer copy. Phase 1
// is owner-only (Sandbox preview); the live wiring is a separate, guarded step.

export interface NarrativeInput {
  firstName?: string | null;
  structuralContext: string | null;
  phaseAlignment?: string | null;   // consumer phrase for the aligned phase
  strengths: string[];              // friendly domain names
  growthArea?: string | null;       // friendly domain name
  alignmentStatus?: string | null;  // Congruent | Incongruent | null
  authoredSections: { heading: string; body: string }[]; // the deterministic report (voice/fact scaffold)
}

export interface NarrativeSection { heading: string; body: string }
export interface NarrativeResult {
  sections: NarrativeSection[];
  model: string;
  safety_status: "ok" | "flagged";
  safety_notes: string[];
}

export class NarrativeError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    sections: {
      type: "array",
      items: { type: "object", additionalProperties: false, properties: { heading: { type: "string" }, body: { type: "string" } }, required: ["heading", "body"] },
    },
  },
  required: ["sections"],
};

// The governed voice + hard guardrails. Overridable by an approved
// `result_narrative` prompt template (Prompt Templates), else this default.
const DEFAULT_SYSTEM = `You write a warm, plain-language personalized summary for someone who just completed the Relationship Life Cycle™ Snapshot — an educational relationship self-assessment.

HARD RULES (never violate):
- Use ONLY the results provided. NEVER invent scores, numbers, percentages, diagnoses, or facts not present in the input.
- This is educational, NOT therapy. No clinical, diagnostic, or therapeutic claims. No medical or mental-health advice. Do not label the person or their relationship.
- Be encouraging and non-alarming, including about growth areas — frame them as normal, workable next steps.
- Write in second person ("you", "your"). Warm, human, concrete. Short paragraphs.
- Reading level around grade 6.
- Mirror the RLC voice in the provided authored sections; EXPAND them, never contradict them.

Return 3–5 sections that expand the provided report into one cohesive, personal narrative (e.g. a warm opening, where they are, what's working, what to grow, an encouraging close).`;

const BANNED: RegExp[] = [
  /\bdiagnos/i, /\bdisorder\b/i, /\btherap(y|ist)\b/i, /\bclinical\b/i, /\bpatholog/i,
  /\bnarcissis/i, /\bgaslight/i, /\babus(e|ive)\b/i, /\bmental illness\b/i, /\bmedication\b/i,
  /\byou should (leave|divorce|break up)\b/i,
];

function safetyCheck(sections: NarrativeSection[]): { status: "ok" | "flagged"; notes: string[] } {
  const text = sections.map((s) => `${s.heading} ${s.body}`).join("  ");
  const notes: string[] = [];
  for (const re of BANNED) if (re.test(text)) notes.push(`flagged term: /${re.source}/`);
  const grade = fkGrade(text);
  if (grade > 9) notes.push(`reading grade ${grade.toFixed(1)} exceeds 9`);
  if (text.trim().length < 60) notes.push("narrative too short");
  return { status: notes.length ? "flagged" : "ok", notes };
}

export async function generateResultNarrative(input: NarrativeInput): Promise<NarrativeResult> {
  if (!aiConfigured()) throw new NarrativeError("AI is not configured. Set ANTHROPIC_API_KEY.", 503);
  const settings = await getAiSettings();
  if (settings.kill_switch_active) throw new NarrativeError("AI generation is paused (kill switch is on).", 503);

  const tpl = await getActiveTemplate("result_narrative");
  const system = tpl?.system_instruction?.trim() || DEFAULT_SYSTEM;

  // Only the deterministic results + first name — never email or raw responses.
  const grounding = {
    first_name: input.firstName ?? null,
    structural_context: input.structuralContext,
    phase_alignment: input.phaseAlignment ?? null,
    alignment_status: input.alignmentStatus ?? null,
    strengths: input.strengths,
    growth_area: input.growthArea ?? null,
    authored_report: input.authoredSections,
  };
  const groundingJson = JSON.stringify(grounding, null, 2);
  const user = tpl?.user_template
    ? renderTemplate(tpl.user_template, { results: groundingJson })
    : `Here are the person's results and the authored report to expand:\n\n${groundingJson}\n\nWrite the personalized narrative sections now.`;

  let output: unknown;
  let model = settings.model;
  try {
    const provider = getProvider(settings.provider);
    const res = await provider.generate({ system, user, schema: OUTPUT_SCHEMA, model: settings.model, maxTokens: 1600, timeoutSeconds: settings.timeout_seconds });
    output = res.output;
    model = res.model;
  } catch (e) {
    throw new NarrativeError(e instanceof Error ? e.message : "Generation failed.", 502);
  }

  const raw = (output as { sections?: { heading?: unknown; body?: unknown }[] })?.sections ?? [];
  const sections: NarrativeSection[] = raw
    .map((s) => ({ heading: String(s.heading ?? "").trim(), body: String(s.body ?? "").trim() }))
    .filter((s) => s.body);
  if (sections.length === 0) throw new NarrativeError("The model returned an empty narrative.", 502);

  const safety = safetyCheck(sections);
  return { sections, model, safety_status: safety.status, safety_notes: safety.notes };
}
