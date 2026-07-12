/**
 * Import the normalized workbook JSON (from scripts/xlsx-to-json.py) into the
 * Studio tables on live Supabase, via the service role. Idempotent: upserts on
 * each table's business key, and removes the Phase A placeholder KB domain rows.
 *
 * Prereq: run `python3 scripts/xlsx-to-json.py` first, and have Supabase env in
 * the shell:  set -a; . ./.env.local; set +a; npx tsx scripts/import-studio.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const s = createClient(url, key, { auth: { persistSession: false } });
const DIR = join(__dirname, "..", "_import", "json");
const load = (f: string) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as Record<string, unknown>[];

async function upsert(table: string, rows: Record<string, unknown>[], onConflict: string, chunk = 500) {
  let done = 0;
  for (let i = 0; i < rows.length; i += chunk) {
    const batch = rows.slice(i, i + chunk);
    const { error } = await s.from(table).upsert(batch, { onConflict });
    if (error) {
      console.error(`  ${table} batch @${i} FAILED:`, error.message);
      process.exit(1);
    }
    done += batch.length;
  }
  console.log(`  ${table}: upserted ${done}`);
}

async function main() {
  // Remove Phase A placeholder domain rows (real domains come in as DOM-00x).
  const { error: delErr } = await s.from("kb_competencies").delete().like("code", "DOMAIN-%");
  if (delErr) { console.error("delete placeholders failed:", delErr.message); process.exit(1); }
  console.log("removed placeholder DOMAIN-% rows");

  await upsert("kb_competencies", load("kb_competencies.json"), "code");
  await upsert("studio_assessments", load("assessments.json"), "assessment_id");
  await upsert("studio_response_models", load("response_models.json"), "response_model_id");
  await upsert("studio_scoring_rules", load("scoring_rules.json"), "scoring_rule_id");
  await upsert("studio_interpretation_rules", load("interpretation_rules.json"), "interpretation_rule_id");
  await upsert("studio_results_templates", load("results_templates.json"), "template_section_id");
  await upsert("studio_recommendation_mappings", load("recommendation_mappings.json"), "mapping_id");
  await upsert("studio_lookups", load("lookups.json"), "category,value");
  await upsert("studio_assessment_items", load("assessment_items.json"), "item_id");

  // Report counts.
  for (const [table, label] of [
    ["kb_competencies", "KB records"],
    ["studio_assessment_items", "items"],
    ["studio_assessments", "assessments"],
    ["studio_recommendation_mappings", "recommendation mappings"],
  ] as const) {
    const { count } = await s.from(table).select("*", { count: "exact", head: true });
    console.log(`  ${label}: ${count}`);
  }
  console.log("Import complete.");
}

main();
