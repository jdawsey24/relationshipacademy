import { readFileSync } from "fs";
import { join } from "path";
import { getSupabaseAdminClient } from "../lib/supabase";

// Seeds the Relationship Snapshot content tables from /data (run AFTER migration
// 0032). Idempotent: clusters/assessments upsert by id; item/question/option
// content is replaced. Never touches sessions/answers (runtime data), so only
// re-run before real sessions exist on the new system.
//   (set -a; . ./.env.local; set +a; npx tsx scripts/seedSnapshot.ts)

const DATA = join(process.cwd(), "data");
const read = (f: string) => JSON.parse(readFileSync(join(DATA, f), "utf8"));

async function main() {
  const s = getSupabaseAdminClient();
  const clusters = read("clusters.json");
  const items = read("quiz_items.json");
  const assessments = read("assessments.json");
  const questions = read("quiz_questions.json"); // keyed by assessment id

  // 1. clusters (upsert)
  const clusterRows = clusters.map((c: Record<string, unknown>) => ({
    id: c.id, name: c.name, core_challenge: c.core_challenge, description: c.description,
    unmet_need: c.unmet_need, underlying_fear: c.underlying_fear,
    playbook_title: c.playbook_title, playbook_subtitle: c.playbook_subtitle,
    alignment_paragraph: c.alignment_paragraph, secondary_blurb: c.secondary_blurb,
    content_pillars: c.content_pillars ?? [], is_assessable: c.is_assessable ?? true,
  }));
  { const { error } = await s.from("snapshot_clusters").upsert(clusterRows, { onConflict: "id" });
    if (error) throw new Error("clusters: " + error.message); }
  console.log("clusters upserted:", clusterRows.length);

  // 2. assessments (upsert) + assessment_clusters (replace)
  const asmRows = assessments.map((a: Record<string, unknown>) => ({
    id: a.id, display_name: a.display_name, entry_prompt: a.entry_prompt, question_count: a.question_count ?? 22,
  }));
  { const { error } = await s.from("snapshot_assessments").upsert(asmRows, { onConflict: "id" });
    if (error) throw new Error("assessments: " + error.message); }
  await s.from("snapshot_assessment_clusters").delete().neq("assessment_id", "");
  const acRows: { assessment_id: string; cluster_id: number }[] = [];
  for (const a of assessments) for (const cid of (a.valid_clusters ?? [])) acRows.push({ assessment_id: a.id, cluster_id: cid });
  { const { error } = await s.from("snapshot_assessment_clusters").insert(acRows);
    if (error) throw new Error("assessment_clusters: " + error.message); }
  console.log("assessments:", asmRows.length, "| assessment_clusters:", acRows.length);

  // 3. quiz_items (replace)
  await s.from("snapshot_quiz_items").delete().neq("cluster_id", -1);
  { const rows = items.map((i: Record<string, unknown>) => ({ cluster_id: i.cluster_id, statement: i.statement }));
    const { error } = await s.from("snapshot_quiz_items").insert(rows);
    if (error) throw new Error("quiz_items: " + error.message);
    console.log("quiz_items:", rows.length); }

  // 4. questions + options (replace)
  await s.from("snapshot_quiz_question_options").delete().neq("option_order", -1);
  await s.from("snapshot_quiz_questions").delete().neq("question_order", -1);
  let qCount = 0, oCount = 0;
  for (const [assessmentId, qList] of Object.entries(questions) as [string, Record<string, unknown>[]][]) {
    for (const q of qList) {
      const { data: qRow, error: qe } = await s.from("snapshot_quiz_questions")
        .insert({ assessment_id: assessmentId, question_order: q.question_order, option_count: q.option_count })
        .select("id").single();
      if (qe || !qRow) throw new Error(`question ${assessmentId}#${q.question_order}: ${qe?.message}`);
      qCount++;
      const opts = ((q.options as Record<string, unknown>[]) ?? []).map((o, idx) => ({
        question_id: (qRow as { id: string }).id, cluster_id: o.cluster_id, statement: o.statement, option_order: idx + 1,
      }));
      const { error: oe } = await s.from("snapshot_quiz_question_options").insert(opts);
      if (oe) throw new Error(`options ${assessmentId}#${q.question_order}: ${oe.message}`);
      oCount += opts.length;
    }
  }
  console.log("questions:", qCount, "| options:", oCount);
  console.log("\n✓ seed complete");
}

main().catch((e) => { console.error("SEED FAILED:", e.message); process.exit(1); });
