import { getSupabaseAdminClient } from "../lib/supabase";
import { BLOCK_TYPES } from "../lib/companion";

// Seeds Relationship Companion Phase-1 scaffolding: the 22 reusable block
// templates and the top-level Process categories. Does NOT seed any experience
// (experiences are authored via the CMS; the old placeholder experience was
// removed after it published in error — see docs/companion-content-theory-review.md).
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

  // NOTE: this seed no longer creates a placeholder experience. It previously
  // seeded "placeholder-something-happened", which got published in error and
  // was flagged + unpublished in the content theory review (see
  // docs/companion-content-theory-review.md). Experiences are authored via the
  // CMS, not seeded.

  console.log("\n✓ Companion Phase 1 seed complete (block templates + categories)");
}

main().catch((e) => { console.error("SEED FAILED:", e.message); process.exit(1); });
