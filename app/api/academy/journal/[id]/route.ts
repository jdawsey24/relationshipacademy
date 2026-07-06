import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 20_000;

// PATCH: edit an entry the member owns. Body: { body?, title? }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await readJsonBody(request, MAX_BODY)) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.body === "string") {
    if (!body.body.trim()) return NextResponse.json({ error: "Entry can't be empty." }, { status: 400 });
    update.body = body.body;
  }
  if ("title" in body) update.title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : null;

  const s = getSupabaseAdminClient();
  // Scope the update to the owner so a member can never edit someone else's entry.
  const { data, error } = await s
    .from("journal_entries")
    .update(update)
    .eq("id", id)
    .eq("user_id", member.user.id)
    .select("*")
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Could not save." }, { status: 502 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ entry: data });
}

// DELETE: remove an entry the member owns.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;
  const { id } = await params;

  const s = getSupabaseAdminClient();
  const { error } = await s
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", member.user.id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
