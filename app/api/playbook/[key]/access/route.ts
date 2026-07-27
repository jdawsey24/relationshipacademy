import { NextResponse } from "next/server";
import { getMember } from "@/lib/academyAuth";
import { getPlaybookContent } from "@/content/playbook";
import { ownsPlaybook } from "@/lib/playbook/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight access probe for the marketing page's owner-aware CTA. Returns only
// the viewer's own state (whether an interactive experience exists, whether they
// are signed in, and whether they own this playbook). No side effects.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const interactive = Boolean(getPlaybookContent(key));
  const member = await getMember();
  const owned = member ? await ownsPlaybook(member.user.id, key) : false;
  return NextResponse.json({ signedIn: Boolean(member), interactive, owned });
}
