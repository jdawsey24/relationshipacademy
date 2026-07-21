import { getSupabaseAdminClient } from "../lib/supabase";
import { BLOCK_TYPES } from "../lib/companion";

// Seeds Relationship Companion Phase-1 PLACEHOLDER content: the 22 reusable block
// templates, the top-level Process categories, and one clearly-labeled placeholder
// experience. NO final RLC content — every payload is a labeled placeholder.
// Run AFTER migrations 0037-0041:
//   (set -a; . ./.env.local; set +a; npx tsx scripts/seedCompanion.ts)

const CATEGORIES = [
  "Dating", "Communication", "Trust", "Conflict", "Boundaries", "Emotional connection",
  "Physical intimacy", "Roles and responsibilities", "Important decisions", "Relationship transitions",
  "Healing", "Personal growth", "Celebrations and milestones", "Free reflection",
];

async function main() {
  const s = getSupabaseAdminClient();

  // 1. Reusable block templates (one per type).
  const templates = BLOCK_TYPES.map((b) => ({
    block_type: b.type,
    label: b.label,
    default_payload: b.input ? { placeholder: "[GUIDED REFLECTION PROMPT TO BE PROVIDED]" } : { placeholder: "[EDUCATIONAL NOTE TO BE PROVIDED]" },
  }));
  // Idempotent-ish: only insert missing types.
  const { data: existing } = await s.from("companion_reusable_block_templates").select("block_type");
  const have = new Set(((existing ?? []) as { block_type: string }[]).map((r) => r.block_type));
  const toAdd = templates.filter((t) => !have.has(t.block_type));
  if (toAdd.length) {
    const { error } = await s.from("companion_reusable_block_templates").insert(toAdd);
    if (error) throw new Error("templates: " + error.message);
  }
  console.log("reusable block templates:", have.size + toAdd.length, `(+${toAdd.length})`);

  // 2. Categories.
  const catRows = CATEGORIES.map((label, i) => ({
    key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    label, display_order: i,
  }));
  const { error: cErr } = await s.from("companion_experience_categories").upsert(catRows, { onConflict: "key" });
  if (cErr) throw new Error("categories: " + cErr.message);
  console.log("categories:", catRows.length);

  // 3. One placeholder experience with a few placeholder blocks (draft).
  const slug = "placeholder-something-happened";
  const { data: exists } = await s.from("companion_experiences").select("id").eq("slug", slug).maybeSingle();
  if (!exists) {
    const { data: exp, error } = await s.from("companion_experiences").insert({
      slug, title: "[PLACEHOLDER] Something happened", consumer_title: "[APPROVED TITLE TO BE PROVIDED]",
      short_description: "[APPROVED INTRODUCTION TO BE PROVIDED]", est_minutes: 5, mode: "guided", status: "draft", owner: "seed",
    }).select("id").single();
    if (error) throw new Error("experience: " + error.message);
    const expId = (exp as { id: string }).id;
    const blocks = [
      { block_type: "intro_context", block_order: 0, payload: { placeholder: "[APPROVED INTRODUCTION TO BE PROVIDED]" } },
      { block_type: "reflection_long", block_order: 1, payload: { placeholder: "[GUIDED REFLECTION PROMPT TO BE PROVIDED]" } },
      { block_type: "emotion_select", block_order: 2, payload: { placeholder: "[GUIDED REFLECTION PROMPT TO BE PROVIDED]" } },
      { block_type: "closing_summary", block_order: 3, payload: { placeholder: "[EDUCATIONAL NOTE TO BE PROVIDED]" } },
    ].map((b) => ({ ...b, experience_id: expId }));
    await s.from("companion_experience_blocks").insert(blocks);
    console.log("placeholder experience: created with", blocks.length, "blocks");
  } else {
    console.log("placeholder experience: already present");
  }

  console.log("\n✓ Companion Phase 1 placeholder seed complete");
}

main().catch((e) => { console.error("SEED FAILED:", e.message); process.exit(1); });
