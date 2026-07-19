import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { listExperiences } from "@/lib/companion/data";
import { createExperience, CompanionCmsError } from "@/lib/companion/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — list all Companion experiences (owner CMS). POST — create a draft.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ experiences: await listExperiences() });
}

export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  try {
    const exp = await createExperience({ title: String(body.title ?? ""), consumer_title: body.consumer_title as string | undefined, mode: body.mode as string | undefined, actor: user?.email ?? null });
    return NextResponse.json({ experience: exp });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
