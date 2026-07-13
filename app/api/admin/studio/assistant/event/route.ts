import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight product-event logging for the Studio Assistant via the existing
// audit trail — NO new tables. Only whitelisted events, and only structural
// metadata (never the pasted reading-level text).
const ALLOWED = new Set(["opened", "competency_selected", "reading_level_check"]);

export async function POST(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const event = typeof body.event === "string" ? body.event : "";
  if (!ALLOWED.has(event)) return NextResponse.json({ error: "Unknown event." }, { status: 400 });

  // Sanitize metadata to a small, non-sensitive shape. Explicitly never persist
  // any free text (e.g. the reading-level sample) — only counts + a competency code.
  const raw = (body.metadata ?? {}) as Record<string, unknown>;
  const metadata: Record<string, unknown> = {};
  if (typeof raw.competency === "string") metadata.competency = raw.competency.slice(0, 40);
  if (typeof raw.route === "string") metadata.route = raw.route.slice(0, 120);
  for (const k of ["words", "sentences", "grade"]) {
    if (typeof raw[k] === "number") metadata[k] = raw[k];
  }

  await audit({ actor: user?.email ?? null, action: `assistant.${event}`, target: (metadata.competency as string) ?? null, metadata });
  return NextResponse.json({ ok: true });
}
