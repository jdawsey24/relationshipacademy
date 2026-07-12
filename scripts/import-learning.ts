/**
 * Import the Phase C learning-library JSON (from scripts/xlsx-to-json.py) into
 * the studio_* learning tables on live Supabase via the service role. Idempotent
 * (upsert on each table's business key). Rows within a file are homogeneous, so
 * no normalization is needed.
 *
 * Prereq: run `python3 scripts/xlsx-to-json.py` first, with Supabase env in the
 * shell:  set -a; . ./.env.local; set +a; npx tsx scripts/import-learning.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase env"); process.exit(1); }
const s = createClient(url, key, { auth: { persistSession: false } });
const DIR = join(__dirname, "..", "_import", "json");
const load = (f: string) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as Record<string, unknown>[];

const TABLES: [file: string, table: string, pk: string][] = [
  ["practices.json", "studio_practices", "practice_id"],
  ["activities.json", "studio_activities", "activity_id"],
  ["interventions.json", "studio_interventions", "intervention_id"],
  ["worksheets.json", "studio_worksheets", "worksheet_id"],
  ["conversation_guides.json", "studio_conversation_guides", "guide_id"],
  ["journal_prompts.json", "studio_journal_prompts", "prompt_id"],
  ["videos.json", "studio_videos", "video_id"],
  ["lessons.json", "studio_lessons", "lesson_id"],
  ["courses.json", "studio_courses", "course_id"],
  ["behavioral_indicators.json", "studio_behavioral_indicators", "behavior_id"],
  ["incomplete_indicators.json", "studio_incomplete_indicators", "indicator_id"],
];

async function upsert(table: string, rows: Record<string, unknown>[], pk: string, chunk = 500) {
  for (let i = 0; i < rows.length; i += chunk) {
    const { error } = await s.from(table).upsert(rows.slice(i, i + chunk), { onConflict: pk });
    if (error) { console.error(`  ${table} @${i} FAILED:`, error.message); process.exit(1); }
  }
}

async function main() {
  for (const [file, table, pk] of TABLES) {
    const rows = load(file);
    await upsert(table, rows, pk);
    const { count } = await s.from(table).select("*", { count: "exact", head: true });
    console.log(`  ${table}: upserted ${rows.length} (table now ${count})`);
  }
  console.log("Learning import complete.");
}

main();
