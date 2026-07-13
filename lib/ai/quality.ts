import { getSupabaseAdminClient } from "@/lib/supabase";
import { getProvider } from "@/lib/ai/provider";
import { getActiveTemplate, renderTemplate } from "@/lib/ai/templates";
import { getAiSettings } from "@/lib/ai/settings";

// Quality-check engine. Deterministic checks run at generation time (free/fast);
// AI-assisted checks run on demand from the Review Queue. Findings are advisory —
// nothing here approves anything.

export interface Finding {
  check_type: string;
  passed: boolean;
  severity: "info" | "low" | "medium" | "high" | "critical";
  finding: string;
  recommendation: string;
}

const JARGON = ["competency", "construct", "developmental", "dyadic", "psychometric", "differentiation", "attachment style", "self-report", "reverse-scored"];
const MORALIZING = ["should", "must", "ought", "good partner", "bad partner", "healthy relationship", "unhealthy", "right way", "wrong way", "supposed to"];

function words(t: string): string[] { return t.toLowerCase().replace(/[^a-z'\s]/g, " ").split(/\s+/).filter(Boolean); }
function syllables(w: string): number {
  const m = w.toLowerCase().replace(/[^a-z]/g, "").replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, m ? m.length : 1);
}
function fkGrade(t: string): number {
  const ws = words(t); if (ws.length === 0) return 0;
  const syl = ws.reduce((a, w) => a + syllables(w), 0);
  const sentences = Math.max(1, (t.match(/[.!?]+/g) || []).length);
  return 0.39 * (ws.length / sentences) + 11.8 * (syl / ws.length) - 15.59;
}

export interface ItemForCheck {
  item_text: string;
  reverse_candidate: boolean;
  behavioral_indicator_id?: string | null;
  audience?: string | null;
}

export function runDeterministicItemChecks(it: ItemForCheck): Finding[] {
  const text = (it.item_text || "").trim();
  const lower = text.toLowerCase();
  const ws = words(text);
  const out: Finding[] = [];
  const add = (check_type: string, passed: boolean, severity: Finding["severity"], finding: string, recommendation: string) =>
    out.push({ check_type, passed, severity, finding, recommendation });

  // Double-barreled
  const barreled = /\b(and|or)\b/.test(lower) && ws.length > 8;
  add("double_barreled", !barreled, barreled ? "medium" : "info", barreled ? "Possible double-barreled wording (joins two ideas)." : "No obvious double-barreling.", "Split into a single observable behavior.");

  // Double negative
  const negs = (lower.match(/\b(not|never|no|none|n't|without|rarely)\b/g) || []).length;
  add("double_negative", negs < 2, negs >= 2 ? "high" : "info", negs >= 2 ? `Multiple negations (${negs}) — hard to read.` : "No double negative.", "Reword positively; keep at most one negation.");

  // Length
  add("length", ws.length <= 20, ws.length > 20 ? "medium" : "info", ws.length > 20 ? `Item is long (${ws.length} words).` : `${ws.length} words.`, "Aim for ≤ 20 words.");

  // Reading level (target ~Grade 5 for consumer)
  const grade = Math.round(fkGrade(text));
  const rlBad = grade > 8;
  add("reading_level", grade <= 8, rlBad ? "medium" : grade > 5 ? "low" : "info", `Estimated reading level ~Grade ${grade}.`, "Simplify wording toward ~Grade 5 for consumer items.");

  // Moralizing
  const moral = MORALIZING.find((m) => lower.includes(m));
  add("moralizing", !moral, moral ? "high" : "info", moral ? `Moralizing/judgmental phrase: "${moral}".` : "No moralizing language.", "Describe the behavior neutrally, without judgment.");

  // Jargon
  const jargon = JARGON.find((j) => lower.includes(j));
  add("jargon", !jargon, jargon ? "medium" : "info", jargon ? `Clinical/theory jargon: "${jargon}".` : "No jargon.", "Use plain, everyday language for consumer items.");

  // Missing source link
  const linked = !!it.behavioral_indicator_id;
  add("missing_source_links", linked, linked ? "info" : "critical", linked ? "Traces to a behavioral indicator." : "No behavioral-indicator link.", "Every item must trace to an approved behavioral indicator.");

  // Reverse ambiguity
  if (it.reverse_candidate) {
    const hasNeg = /\b(not|never|no|rarely|without|let|avoid|ignore|move on)\b/.test(lower);
    add("reverse_ambiguity", hasNeg, hasNeg ? "info" : "low", hasNeg ? "Reverse polarity reads clearly." : "Reverse item may be ambiguous (no clear negative polarity).", "Make the lower-development direction explicit.");
  }
  return out;
}

// AI-assisted review of one item (construct overlap, social desirability, unsafe
// assumptions, phase leakage). On-demand from the Review Queue.
export async function runAiItemReview(itemText: string, contextText: string): Promise<Finding[]> {
  const settings = await getAiSettings();
  const tpl = await getActiveTemplate("item_review");
  if (!tpl) return [];
  const provider = getProvider(settings.provider);
  if (!provider.configured()) return [];
  const user = renderTemplate(tpl.user_template, { item_text: itemText, context: contextText });
  const res = await provider.generate({
    system: tpl.system_instruction, user, schema: tpl.output_schema as object,
    model: settings.model, maxTokens: 2000, timeoutSeconds: settings.timeout_seconds,
  });
  const out = res.output as { findings?: Finding[] };
  return Array.isArray(out.findings) ? out.findings : [];
}

// Persist findings + roll up the draft's quality_status.
export async function persistChecks(draftType: "item" | "content", draftId: string, requestId: string | null, findings: Finding[]): Promise<void> {
  const s = getSupabaseAdminClient();
  if (findings.length) {
    await s.from("ai_quality_checks").insert(findings.map((f) => ({
      generation_request_id: requestId, draft_type: draftType, draft_id: draftId,
      check_type: f.check_type, severity: f.severity, passed: f.passed, finding: f.finding, recommendation: f.recommendation,
    })));
  }
  const failed = findings.filter((f) => !f.passed);
  const status = failed.some((f) => f.severity === "high" || f.severity === "critical") ? "flagged" : failed.length ? "review" : "passed";
  const table = draftType === "item" ? "ai_item_drafts" : "ai_content_drafts";
  await s.from(table).update({ quality_status: status }).eq("id", draftId);
}
