// Formats a Play's executable output into the short "your saved answer" line shown
// in My Plays (and used by the Update corrective-learning loop). Pure.

import type { OutputEditorField, Play } from "@/lib/playbook/contentSchema";

export function formatEditorValue(field: OutputEditorField, value: unknown): string {
  if (field.input === "rule") {
    const r = (value ?? {}) as { condition?: string; action?: string };
    if (r.condition || r.action) return `If ${r.condition || "…"} → ${r.action || "…"}`;
    return "";
  }
  return typeof value === "string" ? value.trim() : "";
}

/** The user's key output line for My Plays, or undefined if the Play has no editor/output. */
export function deriveUserLine(play: Play, payload: Record<string, unknown>): string | undefined {
  if (!play.outputEditor) return undefined;
  const parts = play.outputEditor.fields.map((f) => formatEditorValue(f, payload[f.id])).filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}
