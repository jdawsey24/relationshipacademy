import { NextResponse } from "next/server";
import { getMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";
import { getPlaybookContent } from "@/content/playbook";
import { ownsPlaybook, loadProgress, saveProgress } from "@/lib/playbook/progress";
import { sanitizeIncomingProgress } from "@/lib/playbook/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function gate(keyParam: string) {
  const member = await getMember();
  if (!member) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  const content = getPlaybookContent(keyParam);
  if (!content) return { error: NextResponse.json({ error: "No interactive playbook for that key." }, { status: 404 }) };
  const owns = await ownsPlaybook(member.user.id, keyParam);
  if (!owns) return { error: NextResponse.json({ error: "This playbook isn't in your library." }, { status: 403 }) };
  return { userId: member.user.id, content };
}

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const g = await gate(key);
  if (g.error) return g.error;
  const progress = await loadProgress(g.userId, key, g.content.playbookVersion);
  return NextResponse.json(progress);
}

export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const g = await gate(key);
  if (g.error) return g.error;

  const body = await readJsonBody(request).catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Bad body." }, { status: 400 });
  }

  // user_id + playbook_key + playbook_version are authoritative here, never trusted
  // from the client. Functional data only.
  const sanitized = sanitizeIncomingProgress(body, key, g.content.playbookVersion);
  await saveProgress(g.userId, key, sanitized);
  return NextResponse.json({ ok: true });
}
