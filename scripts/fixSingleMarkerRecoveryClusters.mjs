/*
 * Remove the recovery/transition clusters 12 & 20 from the two "single" Snapshot
 * markers (single_but_dating, single_contemplating_dating). Owner-directed.
 *
 * WHY: cluster 12 ("Difficulty Letting Go of What's Already Over" — "I can't move
 * on", "I still think about them every day") and cluster 20 ("Difficulty Recognizing
 * My Own Life" — "I don't recognize my life anymore", "I'm grieving someone who's
 * still alive") are breakup-recovery / major-transition patterns. They don't fit a
 * person who is SINGLE and ACTIVELY DATING (or contemplating it), yet they were
 * seeded as "shadow" slots in these two markers. This reassigns every c12/c20 slot
 * to the marker's OTHER (dating-appropriate) clusters, keeping each question at 5
 * DISTINCT clusters and every cluster within its item-pool cap. Mirrors the earlier
 * fixSingleMarkersParenting.mjs (cluster-19 removal). c23 ("Fear of Making the Wrong
 * Choice") is intentionally KEPT — it fits deciding whom to pursue.
 *
 * Idempotent: once no c12/c20 slots remain in these markers, re-running is a no-op.
 *
 * DRY RUN by default (prints the plan, writes nothing). To apply:
 *   (set -a; . ./.env.local; set +a; node scripts/fixSingleMarkerRecoveryClusters.mjs --apply)
 *
 * NOTE: the DB is the source of truth for Snapshot marker quizzes (the seed JSON is
 * incomplete; marker quizzes are built by external tooling). A re-seed would revert
 * this — re-run after one.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const APPLY = process.argv.includes("--apply");
const MARKERS = ["single_but_dating", "single_contemplating_dating"];
const REMOVE = new Set([12, 20]);

// Item-pool context filter (mirror lib/snapshot/statements.ts CLUSTER_CONTEXT_BY_MARKER).
const CTX = {
  24: { single_but_dating: "pre_definition", single_contemplating_dating: "pre_definition", in_a_relationship: "post_definition" },
  19: { single_but_dating: "solo", single_contemplating_dating: "solo", recent_divorce_breakup: "solo", married_or_long_term: "partnered" },
  20: { married_or_long_term: "general" },
  11: { recent_divorce_breakup: "reflective" },
  16: { recent_divorce_breakup: "reflective" },
  21: { recent_divorce_breakup: "reflective" },
  26: { single_contemplating_dating: "core" },
};
const ctxFor = (marker, c) => CTX[c]?.[marker] ?? null;

const { data: clusters } = await sb.from("snapshot_clusters").select("id, name");
const cname = new Map((clusters ?? []).map((c) => [c.id, c.name]));
const { data: allItems } = await sb.from("snapshot_quiz_items").select("cluster_id, statement, context");
const poolCap = (marker, c) => {
  const ctx = ctxFor(marker, c);
  return (allItems ?? []).filter((i) => i.cluster_id === c && (ctx === null || i.context === ctx)).length;
};

let totalPlanned = 0;
let hadError = false;

for (const marker of MARKERS) {
  const { data: qs } = await sb.from("snapshot_quiz_questions").select("id, question_order").eq("assessment_id", marker).order("question_order");
  if (!qs?.length) { console.log(`\n### ${marker}: no questions found — skipping`); continue; }
  const { data: slots } = await sb.from("snapshot_quiz_question_slots").select("id, question_id, slot_order, cluster_id, tier").in("question_id", qs.map((q) => q.id));
  const qOrder = new Map(qs.map((q) => [q.id, q.question_order]));

  const byQ = new Map();
  for (const s of slots) { if (!byQ.has(s.question_id)) byQ.set(s.question_id, []); byQ.get(s.question_id).push(s); }

  // Allowed substitutes = clusters already in this marker, minus the removed ones.
  const allowed = [...new Set(slots.map((s) => s.cluster_id))].filter((c) => !REMOVE.has(c));
  // Current count per allowed cluster (non-removed slots only).
  const count = new Map(allowed.map((c) => [c, 0]));
  for (const s of slots) if (!REMOVE.has(s.cluster_id)) count.set(s.cluster_id, (count.get(s.cluster_id) ?? 0) + 1);
  const cap = new Map(allowed.map((c) => [c, poolCap(marker, c)]));

  // Per-question set of clusters that will remain (start from non-removed slots).
  const qClusters = new Map();
  for (const [qid, list] of byQ) qClusters.set(qid, new Set(list.filter((s) => !REMOVE.has(s.cluster_id)).map((s) => s.cluster_id)));

  const toFix = slots.filter((s) => REMOVE.has(s.cluster_id))
    .sort((a, b) => (qOrder.get(a.question_id) - qOrder.get(b.question_id)) || (a.slot_order - b.slot_order));

  console.log(`\n### ${marker} — ${toFix.length} slot(s) to reassign (c12/c20)`);
  if (!toFix.length) { console.log("   already clean — no-op."); continue; }

  const updates = [];
  for (const s of toFix) {
    const inQ = qClusters.get(s.question_id);
    // Candidates: allowed, not already in this question, with pool headroom. Prefer least-used, then smaller id.
    const cand = allowed
      .filter((c) => !inQ.has(c) && (count.get(c) ?? 0) < (cap.get(c) ?? 0))
      .sort((a, b) => (count.get(a) - count.get(b)) || (a - b));
    if (!cand.length) {
      console.log(`   !! Q${qOrder.get(s.question_id)} slot ${s.slot_order}: NO feasible substitute (pool caps exhausted). Needs manual attention.`);
      hadError = true;
      continue;
    }
    const pick = cand[0];
    count.set(pick, count.get(pick) + 1);
    inQ.add(pick);
    updates.push({ id: s.id, q: qOrder.get(s.question_id), slot: s.slot_order, from: s.cluster_id, to: pick });
    console.log(`   Q${qOrder.get(s.question_id)} slot ${s.slot_order}: c${s.cluster_id} ${cname.get(s.cluster_id)} -> c${pick} ${cname.get(pick)}`);
  }

  // Validate: every question 5 distinct clusters, no removed remaining, caps respected.
  for (const [qid, set] of qClusters) {
    if (set.size !== byQ.get(qid).length) { console.log(`   !! Q${qOrder.get(qid)} would not have ${byQ.get(qid).length} distinct clusters (${set.size}).`); hadError = true; }
    for (const c of set) if (REMOVE.has(c)) { console.log(`   !! Q${qOrder.get(qid)} still has removed cluster ${c}.`); hadError = true; }
  }
  for (const c of allowed) if ((count.get(c) ?? 0) > (cap.get(c) ?? 0)) { console.log(`   !! cluster ${c} ${cname.get(c)}: ${count.get(c)} slots > pool cap ${cap.get(c)}.`); hadError = true; }

  totalPlanned += updates.length;

  if (APPLY && updates.length && !hadError) {
    for (const u of updates) {
      const { error } = await sb.from("snapshot_quiz_question_slots").update({ cluster_id: u.to }).eq("id", u.id);
      if (error) { console.log(`   ERROR updating slot ${u.id}: ${error.message}`); hadError = true; }
    }
    console.log(`   ✓ applied ${updates.length} update(s).`);
  }
}

console.log(`\n${APPLY ? "APPLIED" : "DRY RUN"} — ${totalPlanned} slot reassignment(s) planned${hadError ? " (WITH ERRORS — review above; nothing applied where errors blocked it)" : ""}.`);
if (!APPLY) console.log("Re-run with --apply to write the changes.");
process.exit(hadError ? 1 : 0);
