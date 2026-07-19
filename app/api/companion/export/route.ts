import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { buildCompanionExport } from "@/lib/companion/export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — download all of the user's OWN Companion data as JSON.
export async function GET() {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const data = await buildCompanionExport(cu.user.id);
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="relationship-companion-export.json"`,
      "Cache-Control": "no-store",
    },
  });
}
