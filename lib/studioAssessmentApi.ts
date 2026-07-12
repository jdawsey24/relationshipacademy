import { NextResponse } from "next/server";
import { requireEditor, requireOwner } from "@/lib/adminApi";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { OWNER_ONLY_STATUSES } from "@/lib/studioAssessment";

// Editors may edit drafts and set draft/in_review; moving a row to approved/
// published/retired is owner-only (matches Phase A governance).
export async function guardForBody(body: Record<string, unknown>): Promise<NextResponse | null> {
  if (typeof body.status === "string" && (OWNER_ONLY_STATUSES as string[]).includes(body.status)) {
    return requireOwner();
  }
  return requireEditor();
}

/** Apply a whitelisted PATCH to a Studio table row keyed by its business PK. */
export async function patchRow(
  table: string,
  pk: string,
  id: string,
  body: Record<string, unknown>,
  writable: readonly string[],
  actor: string | null
): Promise<NextResponse> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: actor };
  for (const k of writable) if (k in body) update[k] = body[k];
  const s = getSupabaseAdminClient();
  const { error } = await s.from(table).update(update).eq(pk, id);
  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
