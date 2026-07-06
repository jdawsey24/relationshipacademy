import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { isUuid } from "@/lib/apiSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: create a module under a course. Body: { course_id, title }
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!isUuid(body.course_id)) return NextResponse.json({ error: "Invalid course." }, { status: 400 });
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  const s = getSupabaseAdminClient();
  // Append to the end.
  const { data: last } = await s
    .from("modules")
    .select("sort_order")
    .eq("course_id", body.course_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await s
    .from("modules")
    .insert({ course_id: body.course_id, title, sort_order })
    .select("id")
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to create module." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "module.create", target: data?.id, metadata: { course_id: body.course_id } });
  return NextResponse.json({ id: data?.id });
}
