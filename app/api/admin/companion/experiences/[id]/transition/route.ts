import { NextResponse } from "next/server";
import { requireEditor, requireOwner, getAdminRole } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { transitionExperience, CompanionCmsError } from "@/lib/companion/cms";
import { type ContentAction } from "@/lib/companion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only the OWNER may advance/approve/publish/unpublish/revise/archive/restore;
// editors may submit_for_review. The cms re-reads status + re-checks role
// (defence-in-depth).
const OWNER_ACTIONS: ContentAction[] = ["advance", "request_changes", "approve", "publish", "unpublish", "revise", "archive", "restore"];
const ALL_ACTIONS: ContentAction[] = ["submit_for_review", ...OWNER_ACTIONS];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const action = body.action as ContentAction;
  if (!ALL_ACTIONS.includes(action)) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const unauth = OWNER_ACTIONS.includes(action) ? await requireOwner() : await requireEditor();
  if (unauth) return unauth;

  const user = await getAdminUser();
  const { id } = await params;
  try {
    const to = await transitionExperience(id, action, {
      actor: user?.email ?? null,
      isOwner: getAdminRole(user) === "owner",
      note: typeof body.note === "string" ? body.note : null,
    });
    return NextResponse.json({ status: to });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
