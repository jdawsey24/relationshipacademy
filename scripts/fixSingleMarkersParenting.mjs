/*
 * Remove parenting content from the two childless-single Snapshot markers
 * (single_but_dating, single_contemplating_dating). Owner-directed.
 *
 * WHAT & WHY: cluster 19 ("Feeling Like Parenting Changed Everything") is an
 * entirely parenting cluster that was being served to childless singles (the
 * Snapshot never asks "do you have kids?"). Plus a few stray parenting items in
 * clusters 20 & 26 leaked via their full pools. This:
 *   1. Reassigns every cluster-19 slot in the two single markers to a substitute
 *      cluster (same tier where possible; owner chose to promote the dating-
 *      readiness patterns 1/3/4/5/6 for single_contemplating_dating), keeping each
 *      question at 5 distinct options and every cluster within its item-pool cap.
 *   2. Moves the co-parenting item "…keep the peace for the kids' sake" from
 *      cluster 20 -> cluster 19 (context solo) — removed from singles, kept for
 *      recent_divorce_breakup / a future co-parenting track.
 *   3. Retags cluster 26: parenting items -> context "coparent" (held, unused),
 *      the rest -> "core"; single_contemplating_dating maps to "core" (see
 *      lib/snapshot/statements.ts). Cluster 19 + its items are left INTACT for a
 *      future co-parenting track.
 *
 * Idempotent: re-running is a no-op once applied (no cluster-19 slots remain;
 * contexts already set). Verify after: 0 parenting statements reach either single
 * marker; recent_divorce_breakup + married keep theirs.
 *   (set -a; . ./.env.local; set +a; node scripts/fixSingleMarkersParenting.mjs)
 *
 * NOTE: the DB is the source of truth for Snapshot marker quizzes + item contexts
 * (the seed JSON has no context field; contexts/marker-quizzes are built by tooling
 * not in this repo). A re-seed would revert this — re-run this script after one.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const isParent = (s) => /\bchild|children\b/i.test(s);
const isKidsSake = (s) => /kids' sake/i.test(s);
const CTX = { 24: { single_but_dating: "pre_definition", single_contemplating_dating: "pre_definition" }, 26: { single_contemplating_dating: "core" } };
const ctxFor = (m, c) => CTX[c]?.[m] ?? null;

const { data: allItems } = await sb.from("snapshot_quiz_items").select("id,cluster_id,statement,context");
function poolSize(marker, c) {
  let pool = allItems.filter((i) => i.cluster_id === c);
  if (c === 20) pool = pool.filter((i) => !isKidsSake(i.statement));
  if (c === 26) return pool.filter((i) => !isParent(i.statement)).length;
  const ctx = ctxFor(marker, c);
  return (ctx === null ? pool : pool.filter((i) => i.context === ctx)).length;
}

// --- Part B: item moves/retags (idempotent) ---
const kidsSake = allItems.find((i) => i.cluster_id === 20 && isKidsSake(i.statement));
if (kidsSake) { await sb.from("snapshot_quiz_items").update({ cluster_id: 19, context: "solo" }).eq("id", kidsSake.id); console.log("moved kids'-sake -> cluster 19 (solo)"); }
for (const it of allItems.filter((i) => i.cluster_id === 26)) {
  const want = isParent(it.statement) ? "coparent" : "core";
  if (it.context !== want) await sb.from("snapshot_quiz_items").update({ context: want }).eq("id", it.id);
}
console.log("cluster 26 retagged (coparent/core)");

// --- Part A: reassign cluster-19 slots + reduce over-capacity cluster 26 ---
for (const marker of ["single_but_dating", "single_contemplating_dating"]) {
  const { data: qs } = await sb.from("snapshot_quiz_questions").select("id,question_order").eq("assessment_id", marker);
  const qOrd = Object.fromEntries(qs.map((q) => [q.id, q.question_order]));
  const { data: slots } = await sb.from("snapshot_quiz_question_slots").select("id,question_id,slot_order,cluster_id,tier").in("question_id", qs.map((q) => q.id));
  const byQ = {}; for (const s of slots) (byQ[s.question_id] || (byQ[s.question_id] = new Set())).add(s.cluster_id);
  const count = {}; for (const s of slots) count[s.cluster_id] = (count[s.cluster_id] || 0) + 1;
  const clustersUsed = [...new Set(slots.map((s) => s.cluster_id))].filter((c) => c !== 19);
  const cap = {}; for (const c of clustersUsed) cap[c] = poolSize(marker, c);
  const toReassign = slots.filter((s) => s.cluster_id === 19);
  for (const s of toReassign) count[19]--;
  if ((count[26] || 0) > (cap[26] ?? Infinity)) {
    const excess = count[26] - cap[26];
    for (const s of slots.filter((s) => s.cluster_id === 26 && !toReassign.includes(s)).slice(0, excess)) { toReassign.push(s); count[26]--; }
  }
  let n = 0;
  for (const s of toReassign.sort((a, b) => qOrd[a.question_id] - qOrd[b.question_id] || a.slot_order - b.slot_order)) {
    const inQ = byQ[s.question_id];
    const cand = clustersUsed.filter((c) => c !== 26 && !inQ.has(c) && (count[c] || 0) < cap[c])
      .sort((a, b) => (count[a] || 0) / cap[a] - (count[b] || 0) / cap[b] || a - b);
    const sub = cand[0];
    if (sub === undefined) { console.log(`  ${marker} Q${qOrd[s.question_id]}s${s.slot_order}: NO substitute — ABORT`); process.exit(1); }
    await sb.from("snapshot_quiz_question_slots").update({ cluster_id: sub }).eq("id", s.id);
    count[sub] = (count[sub] || 0) + 1; inQ.delete(s.cluster_id); inQ.add(sub); n++;
  }
  console.log(`${marker}: reassigned ${n} slots (cluster 19 removed)`);
}
console.log("\n✓ Done. Verify: 0 parenting statements reach the single markers; recent_divorce_breakup + married unchanged.");
