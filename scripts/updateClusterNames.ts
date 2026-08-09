/**
 * Apply the updated consumer names from the Experience Clusters workbook.
 *
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/updateClusterNames.ts)
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/updateClusterNames.ts --apply)
 *
 * Source: import/RLC_Experience_Clusters_consumer_results_and_playbooks_updated.xlsx
 *
 * THE EXISTING COLUMN ROLES STAND (owner, 2026-08-09). `playbook_title` is the
 * brand line — "The Relationship Playbook™" on every row — and
 * `playbook_subtitle` is the specific name. The workbook labels its columns the
 * other way round, calling the specific name the "Consumer Playbook Title", so
 * its Title column is read into the SUBTITLE here and its Product Family Line
 * is ignored.
 *
 * `playbook_title` is therefore never written. It already holds the right value
 * with its trademark symbol, and rewriting it from the workbook's wording would
 * silently drop the ™ from all 27 rows.
 *
 * Matched on cluster NAME, never on row order. A row whose name is not in the
 * workbook is left alone and reported rather than guessed at.
 */
import { readFileSync } from "node:fs";
import { getSupabaseAdminClient } from "@/lib/supabase";

const APPLY = process.argv.includes("--apply");
const NAMES = JSON.parse(
  readFileSync("scripts/data/clusterNames.json", "utf8"),
) as Record<string, { playbook_title: string; family_line: string; result_title: string }>;

/** Cluster names carry annotations like "[BACKEND ONLY — not a quiz]". Not part of the name. */
const norm = (s: string) =>
  s.replace(/\[BACKEND ONLY[^\]]*\]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

interface Row {
  id: number; name: string;
  playbook_title: string | null; playbook_subtitle: string | null; result_title: string | null;
}

async function main() {
  const s = getSupabaseAdminClient();
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}\n`);

  const { data, error } = await s.from("snapshot_clusters")
    .select("id, name, playbook_title, playbook_subtitle, result_title").order("id");
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as Row[];

  const changes: { id: number; patch: Record<string, string>; before: Row }[] = [];
  const unmatched: Row[] = [];

  for (const row of rows) {
    const wanted = NAMES[norm(row.name)];
    if (!wanted) { unmatched.push(row); continue; }

    const patch: Record<string, string> = {};
    // playbook_title is deliberately absent. See the header.
    if (row.playbook_subtitle !== wanted.playbook_title) patch.playbook_subtitle = wanted.playbook_title;
    if (row.result_title !== wanted.result_title) patch.result_title = wanted.result_title;
    if (Object.keys(patch).length) changes.push({ id: row.id, patch, before: row });
  }

  for (const c of changes) {
    console.log(`── ${c.id}  ${c.before.name}`);
    for (const [field, next] of Object.entries(c.patch)) {
      const prev = (c.before as unknown as Record<string, string | null>)[field];
      console.log(`   ${field}`);
      console.log(`     was: ${prev ?? "(empty)"}`);
      console.log(`     now: ${next}`);
    }
  }

  if (unmatched.length) {
    console.log(`\n⚠ ${unmatched.length} cluster(s) not in the workbook — left untouched:`);
    for (const u of unmatched) console.log(`   ${u.id}  ${u.name}`);
  }

  const workbookOnly = Object.keys(NAMES).filter((k) => !rows.some((r) => norm(r.name) === k));
  if (workbookOnly.length) {
    console.log(`\n⚠ ${workbookOnly.length} workbook row(s) with no cluster — nothing written:`);
    for (const w of workbookOnly) console.log(`   ${w}`);
  }

  console.log(`\n${changes.length} of ${rows.length} clusters change.`);
  if (!APPLY) { console.log("Dry run — nothing written. Re-run with --apply."); return; }

  for (const c of changes) {
    const { error: e } = await s.from("snapshot_clusters").update(c.patch).eq("id", c.id);
    if (e) throw new Error(`cluster ${c.id}: ${e.message}`);
  }
  console.log("✅ Written.");
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
