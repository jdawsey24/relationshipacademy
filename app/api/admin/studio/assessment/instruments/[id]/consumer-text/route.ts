import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getAiSettings } from "@/lib/ai/settings";
import { audit } from "@/lib/audit";
import { patchRow } from "@/lib/studioAssessmentApi";
import { generateConsumerItemDrafts, loadConsumerTargets, ConsumerTextError, CONSUMER_ITEM_TEXT_TYPE } from "@/lib/ai/consumerItemText";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — current consumer-text status for the instrument's approved items.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAiOwner();
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const items = await loadConsumerTargets(decodeURIComponent(id), { includeExisting: true });
  const withText = items.filter((i) => (i.consumer_item_text ?? "").trim()).length;
  return NextResponse.json({ items, total: items.length, with_text: withText, missing: items.length - withText });
}

// POST — generate AI consumer-text drafts (does NOT write the bank).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAiOwner();
  if (gate instanceof NextResponse) return gate;
  const settings = await getAiSettings();
  const pre = await preflightGeneration(req, settings, CONSUMER_ITEM_TEXT_TYPE);
  if (pre) return pre;
  const { id } = await params;
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body = draft all missing */ }
  const itemIds = Array.isArray(body.item_ids) ? (body.item_ids as unknown[]).map(String) : undefined;
  const includeExisting = body.include_existing === true;
  try {
    const result = await generateConsumerItemDrafts({
      assessmentId: decodeURIComponent(id), actor: gate.user.email ?? null, itemIds, includeExisting,
    });
    await audit({ actor: gate.user.email ?? null, action: "studio.consumer_text.draft", target: decodeURIComponent(id), metadata: { count: result.drafts.length, request_id: result.request_id } });
    return NextResponse.json(result);
  } catch (e) {
    const status = e instanceof ConsumerTextError ? e.status : 502;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Generation failed." }, { status });
  }
}

// PATCH — apply approved consumer text to the canonical bank (governed write).
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAiOwner();
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const updates = Array.isArray(body.updates) ? (body.updates as { item_id?: unknown; consumer_item_text?: unknown }[]) : [];
  if (!updates.length) return NextResponse.json({ error: "No updates provided." }, { status: 400 });

  // Only allow items that actually belong to this instrument's approved membership.
  const allowed = new Set((await loadConsumerTargets(decodeURIComponent(id), { includeExisting: true })).map((i) => i.item_id));
  let applied = 0;
  const failed: string[] = [];
  for (const u of updates) {
    const itemId = String(u.item_id ?? "");
    const text = String(u.consumer_item_text ?? "").trim();
    if (!itemId || !allowed.has(itemId) || !text) { failed.push(itemId); continue; }
    const res = await patchRow("studio_assessment_items", "item_id", itemId, { consumer_item_text: text }, ["consumer_item_text"], gate.user.email ?? null);
    if (res.status === 200) applied++; else failed.push(itemId);
  }
  await audit({ actor: gate.user.email ?? null, action: "studio.consumer_text.apply", target: decodeURIComponent(id), metadata: { applied, failed: failed.length } });
  return NextResponse.json({ applied, failed });
}
