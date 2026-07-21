import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getBlueprint, saveBlueprintSection } from "@/lib/companion/blueprint";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — all Blueprint sections (filled + empty). PATCH { key, text, archivePrior? }.
export async function GET() {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  return NextResponse.json({ sections: await getBlueprint(cu.user.id) });
}

export async function PATCH(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const ok = await saveBlueprintSection(cu.user.id, String(body.key ?? ""), String(body.text ?? ""), body.archivePrior === true);
  if (!ok) return NextResponse.json({ error: "Unknown section." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
