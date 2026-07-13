import { getSupabaseAdminClient } from "@/lib/supabase";
import type { PublishableRecord, PublishedContent } from "@/lib/publishing";

// Server-only publishing data. Approved Content Library records → destinations via
// publication_mappings. RESILIENT: returns empty if tables absent.

const SOURCE_TABLES: Record<string, { table: string; pk: string; labelCol: string }> = {
  worksheet: { table: "studio_worksheets", pk: "worksheet_id", labelCol: "title" },
  lesson: { table: "studio_lessons", pk: "lesson_id", labelCol: "title" },
  practice: { table: "studio_practices", pk: "practice_id", labelCol: "name" },
  activity: { table: "studio_activities", pk: "activity_id", labelCol: "name" },
  conversation_guide: { table: "studio_conversation_guides", pk: "guide_id", labelCol: "title" },
  journal_prompt: { table: "studio_journal_prompts", pk: "prompt_id", labelCol: "title" },
  video: { table: "studio_videos", pk: "video_id", labelCol: "title" },
  item: { table: "studio_assessment_items", pk: "item_id", labelCol: "item_text" },
};

export function publishableSource(type: string) { return SOURCE_TABLES[type]; }

// Approved/published records of a type + the destinations each is mapped to.
export async function listApprovedForPublishing(sourceType: string): Promise<PublishableRecord[]> {
  const cfg = SOURCE_TABLES[sourceType];
  if (!cfg) return [];
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s.from(cfg.table).select(`${cfg.pk}, ${cfg.labelCol}`).in("status", ["approved", "published"]).order(cfg.pk).limit(300);
    if (error) return [];
    const rows = (data ?? []) as unknown[];
    const ids = rows.map((r) => String((r as Record<string, unknown>)[cfg.pk]));
    const { data: maps } = await s.from("publication_mappings").select("source_id, destination").eq("source_type", sourceType).eq("status", "active").in("source_id", ids);
    const byId = new Map<string, string[]>();
    for (const m of maps ?? []) { const x = m as { source_id: string; destination: string }; byId.set(x.source_id, [...(byId.get(x.source_id) ?? []), x.destination]); }
    return rows.map((r) => { const x = r as Record<string, unknown>; const id = String(x[cfg.pk]); return { source_type: sourceType, id, label: String(x[cfg.labelCol] ?? ""), destinations: byId.get(id) ?? [] }; });
  } catch {
    return [];
  }
}

export async function setMapping(sourceType: string, sourceId: string, destination: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  await s.from("publication_mappings").upsert(
    { source_type: sourceType, source_id: sourceId, destination, status: "active", created_by: actor },
    { onConflict: "source_type,source_id,destination" }
  );
}

export async function removeMapping(sourceType: string, sourceId: string, destination: string): Promise<void> {
  const s = getSupabaseAdminClient();
  await s.from("publication_mappings").delete().eq("source_type", sourceType).eq("source_id", sourceId).eq("destination", destination);
}

// Resolve what a destination surface should show — reads mappings, then the
// source rows. The source is NOT duplicated per destination; surfaces read it here.
export async function getPublishedForDestination(destination: string): Promise<PublishedContent[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data: maps } = await s.from("publication_mappings").select("source_type, source_id").eq("destination", destination).eq("status", "active");
    if (!maps || maps.length === 0) return [];
    const byType = new Map<string, string[]>();
    for (const m of maps) { const x = m as { source_type: string; source_id: string }; byType.set(x.source_type, [...(byType.get(x.source_type) ?? []), x.source_id]); }
    const out: PublishedContent[] = [];
    for (const [type, ids] of byType) {
      const cfg = SOURCE_TABLES[type];
      if (!cfg) continue;
      const hasDetail = type !== "item"; // studio_assessment_items has no detail column
      const sel = hasDetail ? `${cfg.pk}, ${cfg.labelCol}, detail` : `${cfg.pk}, ${cfg.labelCol}`;
      const { data } = await s.from(cfg.table).select(sel).in(cfg.pk, ids).limit(200);
      for (const r of (data ?? []) as unknown[]) {
        const x = r as Record<string, unknown>;
        const detail = (x.detail ?? {}) as Record<string, unknown>;
        const description = [detail.purpose, detail.introduction, detail.overview].find((v) => typeof v === "string" && v) as string | undefined;
        out.push({ source_type: type, id: String(x[cfg.pk]), title: String(x[cfg.labelCol] ?? ""), description: description ?? "" });
      }
    }
    return out;
  } catch {
    return [];
  }
}
