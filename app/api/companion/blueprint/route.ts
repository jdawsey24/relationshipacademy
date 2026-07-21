import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getBlueprint, saveBlueprintSection } from "@/lib/companion/blueprint";
import { screenText } from "@/lib/companion/safety";

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
  const key = String(body.key ?? "");
  const ok = await saveBlueprintSection(cu.user.id, key, String(body.text ?? ""), body.archivePrior === true);
  if (!ok) return NextResponse.json({ error: "Unknown section." }, { status: 400 });
  const safety = await screenText(body.text, { userId: cu.user.id, context: "blueprint", situationRef: key });
  return NextResponse.json(safety ? { ok: true, safety } : { ok: true });
}
