/*
 * Rebalance the `single_contemplating_dating` Snapshot marker toward the sellable
 * Playbook clusters. Owner-directed.
 *
 * WHY: the Snapshot result is simply the most-picked cluster across the 24
 * questions (see lib/snapshot/scoring.ts — every pick counts equally; the `tier`
 * field is authoring metadata and does NOT affect scoring). So how often a cluster
 * can WIN is driven by its total OFFER-FREQUENCY (how many questions list it as an
 * option), capped by its context-filtered item-pool size. After the parenting fix,
 * only 43% of this marker's offer-frequency mapped to a cluster with a sellable
 * Playbook (1/3/4/5/6/24); the dominant results were no-Playbook clusters
 * (12/13/20/25/26), so most respondents landed on a lead-capture-only result.
 *
 * WHAT: reassign slots from the no-Playbook clusters to the Playbook clusters to
 * hit the target offer counts below (~66% Playbook share), while (a) keeping every
 * question at 5 DISTINCT clusters, (b) never exceeding a cluster's item-pool cap,
 * (c) keeping every no-Playbook pattern present (floor 8) so it still surfaces as a
 * valid result / secondary, and (d) preserving the parenting-free property (only
 * ever adds to non-parenting Playbook clusters; never touches cluster 19/26 pools).
 *
 * Idempotent: drives to the TARGET counts; re-running once at target is a no-op.
 * Preserves each moved slot's `tier` (cosmetic to scoring). Aborts (no writes to
 * the remaining slots) if a surplus slot can't be placed without a duplicate.
 *   (set -a; . ./.env.local; set +a; node scripts/rebalanceContemplatingDatingPlaybooks.mjs)
 *
 * NOTE: DB is the source of truth for Snapshot marker quizzes (seed JSON has no
 * context field). A re-seed would revert this — re-run after one, AND after
 * scripts/fixSingleMarkersParenting.mjs (this assumes that fix is already applied:
 * no cluster-19 slots, cluster 26 split into core/coparent).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const MARKER = "single_contemplating_dating";
// Target total offer-count per cluster (both tiers). Sum must equal slot count (120).
const TARGET = { 1: 16, 3: 14, 4: 12, 5: 14, 6: 14, 24: 9, 12: 9, 13: 8, 20: 8, 25: 8, 26: 8 };

// --- pool caps (mirror fixSingleMarkersParenting.mjs / statements.ts) ---
const CTX = { 24: { single_contemplating_dating: "pre_definition" }, 26: { single_contemplating_dating: "core" } };
const ctxFor = (c) => CTX[c]?.[MARKER] ?? null;
const isParent = (s) => /\bchild|children\b/i.test(s);
const isKidsSake = (s) => /kids' sake/i.test(s);
const { data: allItems } = await sb.from("snapshot_quiz_items").select("id,cluster_id,statement,context");
function poolCap(c) {
  let pool = allItems.filter((i) => i.cluster_id === c);
  if (c === 20) pool = pool.filter((i) => !isKidsSake(i.statement));
  if (c === 26) return pool.filter((i) => !isParent(i.statement)).length;
  const ctx = ctxFor(c);
  return (ctx === null ? pool : pool.filter((i) => i.context === ctx)).length;
}

// --- load slots ---
const { data: qs } = await sb.from("snapshot_quiz_questions").select("id,question_order").eq("assessment_id", MARKER).order("question_order");
const qOrd = Object.fromEntries(qs.map((q) => [q.id, q.question_order]));
const { data: slots } = await sb.from("snapshot_quiz_question_slots").select("id,question_id,slot_order,cluster_id,tier").in("question_id", qs.map((q) => q.id));

// rollback snapshot
writeFileSync(process.env.HOME + "/rebalance-scd-backup.json", JSON.stringify(slots, null, 2));

const count = {}; for (const s of slots) count[c(s)] = (count[c(s)] || 0) + 1;
function c(s) { return s.cluster_id; }
const byQ = {}; for (const s of slots) (byQ[s.question_id] || (byQ[s.question_id] = new Set())).add(s.cluster_id);

// sanity: TARGET sum == slots, all present clusters targeted, no growth past cap
const tgtSum = Object.values(TARGET).reduce((a, b) => a + b, 0);
if (tgtSum !== slots.length) { console.log(`ABORT: TARGET sum ${tgtSum} != ${slots.length} slots`); process.exit(1); }
for (const cid of Object.keys(count).map(Number)) if (!(cid in TARGET)) { console.log(`ABORT: cluster ${cid} in use but not in TARGET`); process.exit(1); }
for (const cid of Object.keys(TARGET).map(Number)) if (TARGET[cid] > poolCap(cid)) { console.log(`ABORT: target ${TARGET[cid]} > pool cap ${poolCap(cid)} for cluster ${cid}`); process.exit(1); }

// Deficit-driven matching: for each Playbook cluster needing slots, find any
// convertible surplus slot (its cluster still over target) in a question that
// doesn't already contain the deficit cluster. Searching across ALL surplus slots
// per deficit avoids the dead-end of pre-committing specific slots.
const need = {}; for (const cid of Object.keys(TARGET).map(Number)) { const d = TARGET[cid] - (count[cid] || 0); if (d > 0) need[cid] = d; }
const budget = {}; for (const cid of Object.keys(TARGET).map(Number)) { const o = (count[cid] || 0) - TARGET[cid]; if (o > 0) budget[cid] = o; }

let moved = 0;
while (Object.keys(need).length) {
  // most-needed deficit first
  const d = Object.keys(need).map(Number).sort((a, b) => need[b] - need[a] || a - b)[0];
  if ((count[d] || 0) >= poolCap(d)) { console.log(`ABORT: cluster ${d} at pool cap, still needs ${need[d]}`); process.exit(1); }
  // convertible slots: cluster still has surplus budget, question lacks d.
  // Prefer taking from the surplus cluster with the MOST remaining budget (spread removals).
  const cand = slots.filter((s) => (budget[s.cluster_id] || 0) > 0 && !byQ[s.question_id].has(d))
    .sort((a, b) => (budget[b.cluster_id] || 0) - (budget[a.cluster_id] || 0)
      || qOrd[a.question_id] - qOrd[b.question_id] || a.slot_order - b.slot_order);
  const s = cand[0];
  if (!s) { console.log(`ABORT: no convertible slot for deficit cluster ${d} (needs ${need[d]})`); process.exit(1); }
  await sb.from("snapshot_quiz_question_slots").update({ cluster_id: d }).eq("id", s.id); // preserve tier
  byQ[s.question_id].delete(s.cluster_id); byQ[s.question_id].add(d);
  budget[s.cluster_id]--; if (budget[s.cluster_id] === 0) delete budget[s.cluster_id];
  count[s.cluster_id]--; count[d] = (count[d] || 0) + 1; need[d]--; if (need[d] === 0) delete need[d];
  moved++;
}

console.log(`Reassigned ${moved} slots. Remaining unmet deficit: ${Object.keys(need).length ? JSON.stringify(need) : "none ✓"}`);
console.log(`Backup: ~/rebalance-scd-backup.json`);
console.log("Done. Verify offer-share + per-question distinctness next.");
