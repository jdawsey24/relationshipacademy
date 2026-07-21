import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { listResources, createResource } from "@/lib/companion/safetyCms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ resources: await listResources() });
}

export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!String(body.name ?? "").trim()) return NextResponse.json({ error: "Name required." }, { status: 400 });
  try { return NextResponse.json({ resource: await createResource(body) }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
