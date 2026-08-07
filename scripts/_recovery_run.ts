import { getSupabaseAdminClient } from "@/lib/supabase";
import { createManualTrend } from "@/lib/contentEngine/trends";
import { generateBridges } from "@/lib/contentEngine/bridges";
import {
  createBrief, generateAngles, selectAngle, generateScripts,
  compareScripts, generatePackage, runQcAndDraft,
} from "@/lib/contentEngine/scriptBuilder/workflow";
import { upsertClaim, markClaimsReviewed, checkClaimReadiness } from "@/lib/contentEngine/scriptBuilder/claims";

const ACTOR = "hello@janelledawsey.com";
const TOPIC =
  `The "no contact rule" is everywhere right now — 30 days, 60 days, 90 days of zero contact after a breakup. ` +
  `People post countdowns and treat breaking it as failure, starting the count over from day one.`;
const line = (s: string) => console.log(`\n${"─".repeat(74)}\n${s}\n${"─".repeat(74)}`);
let cost = 0;

async function main() {
  const s = getSupabaseAdminClient();

  line("STAGE 1 — topic intake");
  const trend = await createManualTrend({ raw: TOPIC, community_seen: "Breakup TikTok", platform: "tiktok" }, ACTOR);
  console.log(`  candidate ${trend.id}  merged=${trend.merged}  injection stripped=${trend.strippedInjection}`);

  line("STAGE 4 — relational bridges");
  const bridged = await generateBridges({ candidateId: trend.id, actor: ACTOR });
  console.log(`  proposed ${bridged.bridges.length}, discarded ${bridged.rejected.length}`);
  const { data: rows } = await s.from("ce_relational_bridges")
    .select("id, status, competency_id, angle, rationale, mapping_valid, mapping_errors, eligible_for_generation")
    .eq("candidate_id", trend.id);
  const bridges = (rows ?? []) as any[];
  for (const b of bridges) {
    console.log(`\n  [${b.status}] ${b.competency_id}  ${b.eligible_for_generation ? "ELIGIBLE" : "not eligible"}`);
    console.log(`     angle: ${b.angle}`);
    console.log(`     why  : ${(b.rationale ?? "").slice(0, 200)}`);
    if (!b.mapping_valid) console.log(`     ✗ ${(b.mapping_errors ?? []).join(" ")}`);
  }
  const recovery = bridges.filter(b => /-RECV-/.test(b.competency_id ?? ""));
  console.log(`\n  Recovery-mapped bridges: ${recovery.length} of ${bridges.length}`);
  const chosen = bridges.find(b => b.eligible_for_generation && b.status === "strong")
              ?? bridges.find(b => b.eligible_for_generation);
  if (!chosen) { console.log("  no eligible bridge — stopping"); return; }
  console.log(`  → accepting [${chosen.status}] ${chosen.competency_id}`);

  line("STAGE 6 — content brief");
  const { briefId, warnings } = await createBrief({ bridgeId: chosen.id, topic: "The no contact rule", actor: ACTOR, platform: "instagram" });
  console.log(`  brief ${briefId}`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  await s.from("ce_content_briefs").update({ target_runtime_seconds: 45 }).eq("id", briefId);

  line("STAGE 2 — claim verification");
  let r = await checkClaimReadiness(briefId);
  console.log(`  before: ready=${r.ready} — ${r.reasons[0]?.slice(0,95)}`);
  await upsertClaim({ briefId, actor: ACTOR, claimType: "interpretation", status: "verified",
    claimText: "On a framework reading, no contact functions as disengagement from a relationship that is continuing through contact — not as a punishment or a test." });
  await markClaimsReviewed(briefId, ACTOR);
  r = await checkClaimReadiness(briefId);
  console.log(`  after : ready=${r.ready} reviewed=${r.reviewed} claims=${r.counts.total}`);

  line("STAGE 7 — angles");
  const ang = await generateAngles(briefId, ACTOR); cost += ang.costUsd;
  for (const a of ang.angles as any[]) {
    console.log(`\n  • ${a.label}\n    ${a.premise}\n    hook: ${a.hook}`);
    if (a.risk_notes) console.log(`    risk: ${a.risk_notes}`);
  }
  const pick = (ang.angles as any[])[0];
  await selectAngle(briefId, pick.id);
  console.log(`\n  → selected: ${pick.label}`);

  line("STAGE 9 — two scripts");
  cost += (await generateScripts(briefId, ACTOR)).costUsd;
  const { data: scripts } = await s.from("ce_scripts")
    .select("reading_level, hook, body, cta, word_count, estimated_runtime_seconds, runtime_within_target")
    .eq("brief_id", briefId).order("reading_level");
  for (const x of (scripts ?? []) as any[]) {
    console.log(`\n══ ${x.reading_level} — ${x.word_count}w / ${x.estimated_runtime_seconds}s ${x.runtime_within_target ? "on target" : "OFF TARGET"}`);
    console.log(`HOOK: ${x.hook}\n${x.body}\nCTA: ${x.cta}`);
  }

  line("COMPARISON");
  const cmp = await compareScripts(briefId, ACTOR); cost += cmp.costUsd;
  console.log(`  similarity ${cmp.comparison.lexicalSimilarity} / ${cmp.comparison.threshold} ${cmp.comparison.similarityExceeded ? "EXCEEDED" : "ok"}`);
  console.log(`  equivalence ${cmp.comparison.equivalenceOk}${cmp.comparison.divergences.length ? " — diverged: " + cmp.comparison.divergences.join(", ") : ""}`);

  line("STAGE 10 — packaging");
  cost += (await generatePackage(briefId, ACTOR)).costUsd;
  const { data: pk } = await s.from("ce_script_packages").select("*").eq("brief_id", briefId).maybeSingle();
  const p = pk as any;
  console.log(`  on-screen: ${p.on_screen_caption}\n  caption  : ${p.post_caption}\n  cta      : ${p.cta_text}`);
  console.log(`  keywords : ${(p.keywords??[]).join(", ")}\n  hashtags : ${(p.hashtags??[]).join(" ")}`);

  line("STAGES 11-12 — QC and draft");
  const qc = await runQcAndDraft(briefId, ACTOR);
  console.log(`  draft ${qc.draftId} v${qc.version} — ${qc.qc.blocked ? "BLOCKED" : "passed"}`);
  for (const f of qc.qc.blocking) console.log(`    BLOCK [${f.category}/${f.severity}] ${f.message}`);
  for (const f of qc.qc.warnings) console.log(`    warn  [${f.category}/${f.severity}] ${f.message}`);
  if (qc.qc.ungoverned.length) console.log(`    ungoverned: ${qc.qc.ungoverned.join(", ")}`);

  line(`DONE — model cost $${cost.toFixed(4)} · brief ${briefId}`);
}
main().catch(e => { console.error("\n❌ FAILED:", e.message); process.exit(1); });
