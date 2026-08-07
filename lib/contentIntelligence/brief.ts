import { getSupabaseAdminClient } from "@/lib/supabase";

// The Working Brief — "What we've decided" in the interface.
//
// Two protections, and neither of their names ever reaches the screen:
//
// 1. OWNER-EDITED FIELDS ARE NEVER OVERWRITTEN. Once you have edited or
//    confirmed a field, a write becomes a SUGGESTION you accept or dismiss. This
//    applies to every field, not only the thesis.
//
// 2. THE THESIS CANNOT COME FROM A KEYWORD. A write to `thesis` is rejected
//    unless it derives from at least one of your own messages. A keyword, a
//    trend, a source or a preliminary mapping cannot satisfy that on its own.
//
// And the correction that prompted this file: a SHARPENED restatement is not the
// same claim. "They don't want to accept what the inconsistency means, because
// accepting it would force a decision" and "they're postponing a decision" say
// different things — the second drops the mechanism. The sharper version is
// offered as a suggestion and is never stored as the decided main point.

export const BRIEF_FIELDS = [
  "thesis", "audience", "why_it_matters", "viewer_reward", "necessary_nuance",
  "editorial_direction", "content_series", "real_talk_intensity",
  "purpose", "format", "platform", "runtime", "cta", "selected_lens",
] as const;
export type BriefField = (typeof BRIEF_FIELDS)[number];

/** Shown in "What we've decided". The rest lives in the full brief. */
export const DEFAULT_VISIBLE: BriefField[] =
  ["thesis", "audience", "editorial_direction", "format", "purpose"];

/** Plain labels. No field name reaches the interface. */
export const FIELD_LABEL: Record<string, string> = {
  thesis: "Main point", audience: "Who it's for", editorial_direction: "Direction",
  format: "Format", purpose: "Purpose", cta: "Call to action",
  why_it_matters: "Why it matters", viewer_reward: "What they get",
  necessary_nuance: "Nuance to keep", content_series: "Series",
  real_talk_intensity: "Real Talk intensity", platform: "Platform",
  runtime: "Length", selected_lens: "Relationship insight",
};

export type FieldState = "inferred" | "owner_edited" | "owner_confirmed" | "superseded";

export interface BriefFieldRow {
  field: string;
  value: string | null;
  state: FieldState;
  derived_from: string[];
}

const PROTECTED: FieldState[] = ["owner_edited", "owner_confirmed"];

export async function readBrief(conversationId: string): Promise<BriefFieldRow[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ci_brief_fields")
    .select("field, value, state, derived_from")
    .eq("conversation_id", conversationId).neq("state", "superseded");
  return (data ?? []) as unknown as BriefFieldRow[];
}

export interface WriteResult {
  written: boolean;
  suggested: boolean;
  rejected?: string;
}

/**
 * Write a field on the AI's behalf.
 *
 * Returns without writing — as a suggestion — when the owner has already touched
 * the field. Rejects outright when a thesis has no owner message behind it.
 */
export async function inferField(input: {
  conversationId: string;
  field: BriefField;
  value: string;
  derivedFromMessageIds: string[];
  ownerMessageIds: string[];
  rationale?: string;
}): Promise<WriteResult> {
  const s = getSupabaseAdminClient();

  // The thesis guard. A keyword may start the exploration; it can never populate
  // the decided main point.
  if (input.field === "thesis") {
    const fromOwner = input.derivedFromMessageIds.some((id) => input.ownerMessageIds.includes(id));
    if (!fromOwner) {
      return {
        written: false, suggested: false,
        rejected:
          "A main point has to come from something you said. A keyword, a source or a framework " +
          "mapping cannot supply it on its own.",
      };
    }
  }

  const { data: existing } = await s.from("ci_brief_fields")
    .select("id, state, value").eq("conversation_id", input.conversationId)
    .eq("field", input.field).neq("state", "superseded").maybeSingle();
  const prev = existing as { id: string; state: FieldState; value: string | null } | null;

  // Owner-touched fields are never replaced. The AI offers instead.
  if (prev && PROTECTED.includes(prev.state)) {
    if ((prev.value ?? "").trim() === input.value.trim()) return { written: false, suggested: false };
    await s.from("ci_field_suggestions").insert({
      conversation_id: input.conversationId,
      field: input.field,
      suggested_value: input.value,
      rationale: input.rationale ?? null,
    });
    return { written: false, suggested: true };
  }

  if (prev) {
    await s.from("ci_brief_fields").update({
      value: input.value, state: "inferred",
      derived_from: input.derivedFromMessageIds, updated_at: new Date().toISOString(),
    }).eq("id", prev.id);
  } else {
    await s.from("ci_brief_fields").insert({
      conversation_id: input.conversationId, field: input.field, value: input.value,
      state: "inferred", derived_from: input.derivedFromMessageIds,
    });
  }
  return { written: true, suggested: false };
}

/** The owner writes or confirms. This always wins. */
export async function setFieldByOwner(input: {
  conversationId: string;
  field: BriefField;
  value: string;
  confirm?: boolean;
  actor: string | null;
}) {
  const s = getSupabaseAdminClient();
  const { data: existing } = await s.from("ci_brief_fields")
    .select("id, value").eq("conversation_id", input.conversationId)
    .eq("field", input.field).neq("state", "superseded").maybeSingle();
  const prev = existing as { id: string; value: string | null } | null;

  const state: FieldState = input.confirm ? "owner_confirmed" : "owner_edited";

  if (prev) {
    // Keep the previous value as history rather than losing it.
    if ((prev.value ?? "") !== input.value) {
      await s.from("ci_decisions").insert({
        conversation_id: input.conversationId,
        decision_type: `brief:${input.field}`,
        value: prev.value,
      });
    }
    await s.from("ci_brief_fields").update({
      value: input.value, state, updated_by: input.actor, updated_at: new Date().toISOString(),
    }).eq("id", prev.id);
  } else {
    await s.from("ci_brief_fields").insert({
      conversation_id: input.conversationId, field: input.field,
      value: input.value, state, updated_by: input.actor,
    });
  }

  // Any pending suggestion for this field is now moot.
  await s.from("ci_field_suggestions")
    .update({ status: "dismissed" })
    .eq("conversation_id", input.conversationId).eq("field", input.field).eq("status", "pending");
}

/**
 * The plain sentence shown under "What we've decided" — the interface's
 * substitute for state badges.
 */
export function provenanceLine(rows: BriefFieldRow[], pendingFields: string[]): string {
  const thesis = rows.find((r) => r.field === "thesis");
  if (!thesis) return "";
  const yours = thesis.state === "owner_edited" || thesis.state === "owner_confirmed";
  const suggested = pendingFields.includes("thesis");

  if (yours && suggested) {
    return "This is your wording. I've suggested a change — it isn't stored unless you take it.";
  }
  if (yours) return "This is your wording.";
  return "Here's what I think you're saying — change anything that's off.";
}
