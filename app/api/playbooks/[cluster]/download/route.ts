import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { requireMember } from "@/lib/academyAuth";
import { hasPlaybook } from "@/lib/snapshot/playbooks";
import { ownsPlaybook } from "@/lib/snapshot/playbookGrants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ownership-gated Playbook download. The PDFs live in /content/playbooks (OUTSIDE
// public/, so they are never directly reachable). Only a signed-in member who
// owns the playbook gets the bytes. The files are bundled into this function via
// outputFileTracingIncludes in next.config.ts.
export async function GET(_request: Request, { params }: { params: Promise<{ cluster: string }> }) {
  const member = await requireMember();
  if (member instanceof NextResponse) return member;

  const clusterId = Number((await params).cluster);
  if (!Number.isInteger(clusterId) || !hasPlaybook(clusterId)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!member.isStaff && !(await ownsPlaybook(member.user.id, clusterId))) {
    return NextResponse.json({ error: "You don't own this playbook." }, { status: 403 });
  }

  try {
    const file = path.join(process.cwd(), "content", "playbooks", `cluster-${clusterId}.pdf`);
    const bytes = await readFile(file);
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="relationship-playbook-${clusterId}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("[playbooks/download]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not load the playbook." }, { status: 500 });
  }
}
