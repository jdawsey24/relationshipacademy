import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readBrief, provenanceLine, DEFAULT_VISIBLE, FIELD_LABEL } from "@/lib/contentIntelligence/brief";
import { checkCost } from "@/lib/contentIntelligence/conversation";
import { provisionalNotice, type LensOption } from "@/lib/contentIntelligence/lenses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Everything one conversation needs, shaped for the interface rather than for
// the database — plain labels, no state vocabulary, no IDs in the default view.

export async function GET(_r: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const s = getSupabaseAdminClient();

  const { data: convo } = await s.from("ci_conversations").select("*").eq("id", id).maybeSingle();
  if (!convo) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [{ data: messages }, { data: lenses }, { data: suggestions }, brief, cost] = await Promise.all([
    s.from("ci_messages").select("id, seq, role, content, kind, created_at")
      .eq("conversation_id", id).order("seq"),
    s.from("ci_lens_options").select("*").eq("conversation_id", id).order("created_at"),
    s.from("ci_field_suggestions").select("field, suggested_value, rationale")
      .eq("conversation_id", id).eq("status", "pending"),
    readBrief(id),
    checkCost(id),
  ]);

  const pending = (suggestions ?? []).map((x) => (x as { field: string }).field);
  const selected = ((lenses ?? []) as unknown as LensOption[]).find((l) => l.status === "selected");

  return NextResponse.json({
    conversation: convo,
    messages: messages ?? [],
    // Only what "What we've decided" shows by default, already labelled.
    decided: DEFAULT_VISIBLE
      .map((f) => {
        const row = brief.find((b) => b.field === f);
        return row?.value ? { label: FIELD_LABEL[f] ?? f, value: row.value, field: f } : null;
      })
      .filter(Boolean),
    provenance: provenanceLine(brief, pending),
    suggestions: suggestions ?? [],
    lenses: (lenses ?? []).map((l) => {
      const lens = l as unknown as LensOption;
      return {
        id: lens.id, summary: lens.plain_summary, status: lens.status,
        // The one notice, and only when it applies.
        notice: provisionalNotice(lens),
      };
    }),
    // A single sentence when the chosen direction rests on working material.
    provisional_notice: selected ? provisionalNotice(selected) : null,
    cost_notice: cost.notice,
    may_proceed: cost.mayProceed,
  });
}
