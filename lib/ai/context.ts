import { getSupabaseAdminClient } from "@/lib/supabase";

// Retrieval-Augmented context assembler (server-only). Retrieves ONLY approved /
// canonical records, EXCLUDES retired ones, attaches source IDs + versions, caps
// size, and returns immutable snapshots for ai_generation_sources. The returned
// text is DATA only (never system instructions) and every record is wrapped as
// UNTRUSTED to blunt prompt injection — the caller's system prompt states the
// same. We do not send the whole database: only records for the current task.

export interface SourceSnapshot {
  source_entity_type: string;
  source_entity_id: string | null;
  source_version: string | null;
  source_status: string | null;
  source_snapshot: Record<string, unknown>;
}

export interface AssembledContext {
  contextText: string;
  sources: SourceSnapshot[];
}

const MAX_FIELD = 1200;
const MAX_CONTEXT = 16000;

// Neutralize untrusted retrieved text: strip ASCII control chars, collapse
// whitespace, cap length. (Content stays in a delimited DATA block and the model
// is instructed to treat it as reference data, not instructions.)
function clean(v: unknown): string {
  if (v == null) return "";
  return String(v)
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, MAX_FIELD)
    .trim();
}

export interface ItemContextParams {
  competency_id: string;
  includeIncomplete?: boolean;
  includeApprovedItems?: boolean;
  excludeSourceIds?: string[];
}

export async function assembleItemContext(p: ItemContextParams): Promise<AssembledContext> {
  const s = getSupabaseAdminClient();
  const exclude = new Set(p.excludeSourceIds ?? []);
  const sources: SourceSnapshot[] = [];
  const blocks: string[] = [];

  // 1. Competency (must be active/approved — never retired).
  const { data: comp } = await s
    .from("kb_competencies")
    .select("code, name, definition, developmental_task, purpose, detail, status, domain_slug, phase_slug")
    .eq("code", p.competency_id)
    .eq("kind", "competency")
    .maybeSingle();
  if (!comp) throw new Error(`Competency ${p.competency_id} not found.`);
  const c = comp as { code: string; name: string; definition: string | null; developmental_task: string | null; purpose: string | null; detail: Record<string, unknown>; status: string; domain_slug: string | null; phase_slug: string | null };
  if (c.status !== "active") throw new Error("That competency is retired — retired records are excluded from retrieval.");
  const d = c.detail ?? {};
  const dv = (k: string) => clean(d[k]);
  const version = clean(d["Version"]) || clean(d["Source Version"]) || null;
  if (!exclude.has(c.code)) {
    sources.push({ source_entity_type: "kb_competency", source_entity_id: c.code, source_version: version, source_status: c.status, source_snapshot: { name: c.name, definition: c.definition, domain: c.domain_slug, phase: c.phase_slug } });
    blocks.push(
      `[COMPETENCY ${c.code}] ${c.name} (domain: ${c.domain_slug}, phase: ${c.phase_slug})\n` +
      [
        c.definition ? `Definition: ${clean(c.definition)}` : "",
        c.developmental_task ? `Developmental task: ${clean(c.developmental_task)}` : "",
        c.purpose || dv("Purpose") ? `Purpose: ${clean(c.purpose) || dv("Purpose")}` : "",
        dv("Developmental Significance") ? `Developmental significance: ${dv("Developmental Significance")}` : "",
        dv("Assessment Intent") ? `Assessment intent: ${dv("Assessment Intent")}` : "",
        dv("Item Writing Considerations") ? `Item-writing considerations: ${dv("Item Writing Considerations")}` : "",
        dv("Interpretation Notes") ? `Interpretation notes: ${dv("Interpretation Notes")}` : "",
        dv("Structural Context Sensitivity") ? `Structural-context sensitivity: ${dv("Structural Context Sensitivity")}` : "",
        dv("Consumer Translation") ? `Consumer translation: ${dv("Consumer Translation")}` : "",
        dv("Suppression or Safety Logic") ? `Safety/suppression: ${dv("Suppression or Safety Logic")}` : "",
      ].filter(Boolean).join("\n")
    );
  }

  // 2. Behavioral indicators (active only) — items must trace to these.
  const { data: inds } = await s
    .from("studio_behavioral_indicators")
    .select("behavior_id, indicator, evidence_level, status")
    .eq("competency_id", p.competency_id)
    .neq("status", "retired");
  const indLines: string[] = [];
  for (const r of inds ?? []) {
    const x = r as { behavior_id: string; indicator: string; evidence_level: string | null; status: string };
    if (exclude.has(x.behavior_id)) continue;
    sources.push({ source_entity_type: "behavioral_indicator", source_entity_id: x.behavior_id, source_version: null, source_status: x.status, source_snapshot: { indicator: x.indicator } });
    indLines.push(`- ${x.behavior_id}: ${clean(x.indicator)}${x.evidence_level ? ` (evidence: ${clean(x.evidence_level)})` : ""}`);
  }
  if (indLines.length) blocks.push(`[BEHAVIORAL INDICATORS — items must trace to one of these]\n${indLines.join("\n")}`);

  // 3. Incomplete indicators (optional).
  if (p.includeIncomplete) {
    const { data: ii } = await s
      .from("studio_incomplete_indicators")
      .select("indicator_id, indicator, status")
      .eq("competency_id", p.competency_id)
      .neq("status", "retired");
    const iiLines: string[] = [];
    for (const r of ii ?? []) {
      const x = r as { indicator_id: string; indicator: string; status: string };
      if (exclude.has(x.indicator_id)) continue;
      sources.push({ source_entity_type: "incomplete_indicator", source_entity_id: x.indicator_id, source_version: null, source_status: x.status, source_snapshot: { indicator: x.indicator } });
      iiLines.push(`- ${x.indicator_id}: ${clean(x.indicator)}`);
    }
    if (iiLines.length) blocks.push(`[INCOMPLETE-DEVELOPMENT INDICATORS]\n${iiLines.join("\n")}`);
  }

  // 4. Existing APPROVED items (for overlap/duplication awareness).
  if (p.includeApprovedItems) {
    const { data: items } = await s
      .from("studio_assessment_items")
      .select("item_id, item_text, status")
      .eq("competency_id", p.competency_id)
      .eq("status", "approved")
      .limit(30);
    const itemLines = (items ?? []).map((r) => `- ${clean((r as { item_text: string }).item_text)}`);
    if (itemLines.length) blocks.push(`[EXISTING APPROVED ITEMS — do not duplicate]\n${itemLines.join("\n")}`);
  }

  let contextText = blocks.join("\n\n");
  if (contextText.length > MAX_CONTEXT) contextText = contextText.slice(0, MAX_CONTEXT) + "\n…[context truncated]";
  return { contextText, sources };
}
