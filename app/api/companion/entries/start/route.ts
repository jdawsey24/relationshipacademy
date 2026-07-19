import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { startEntry } from "@/lib/companion/entries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { slug } — start (or resume the newest draft of) a published experience.
export async function POST(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const slug = String(body.slug ?? "");
  const started = await startEntry(cu.user.id, slug);
  if (!started) return NextResponse.json({ error: "Experience not available." }, { status: 404 });
  return NextResponse.json(started);
}
