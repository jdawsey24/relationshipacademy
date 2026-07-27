import { NextResponse } from "next/server";
import { getMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";
import { getPlaybookContent } from "@/content/playbook";
import { ownsPlaybook } from "@/lib/playbook/progress";
import { screenPlaybookText } from "@/lib/playbook/crisisSafety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// R4 Layer A — crisis screening of a short free-text field. Metadata-only; never
// stores the raw text. Non-blocking: the client surfaces resources, does not gate.
export async function POST(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const member = await getMember();
  if (!member) return NextResponse.json({ interrupt: false, heading: null, message: null, resources: [] });
  if (!getPlaybookContent(key)) return NextResponse.json({ interrupt: false, heading: null, message: null, resources: [] });
  if (!(await ownsPlaybook(member.user.id, key))) {
    return NextResponse.json({ interrupt: false, heading: null, message: null, resources: [] });
  }

  const body = (await readJsonBody(request).catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text : "";
  const result = await screenPlaybookText(member.user.id, text);
  return NextResponse.json(result);
}
