import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { isUuid } from "@/lib/apiSecurity";
import { slugify } from "@/lib/academy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: create a lesson under a module. Body: { module_id, course_id, title }
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
  if (!isUuid(body.module_id) || !isUuid(body.course_id)) {
    return NextResponse.json({ error: "Invalid module or course." }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const slug = typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(title);

  const s = getSupabaseAdminClient();
  const { data: last } = await s
    .from("lessons")
    .select("sort_order")
    .eq("module_id", body.module_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await s
    .from("lessons")
    .insert({
      module_id: body.module_id,
      course_id: body.course_id,
      title,
      slug,
      status: "draft",
      sort_order,
      updated_by: user?.email ?? null,
    })
    .select("id")
    .maybeSingle();
  if (error) {
    const msg = error.message.includes("duplicate") ? "That slug is already used in this course." : "Failed to create lesson.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  await audit({ actor: user?.email ?? null, action: "lesson.create", target: data?.id, metadata: { course_id: body.course_id } });
  return NextResponse.json({ id: data?.id });
}
