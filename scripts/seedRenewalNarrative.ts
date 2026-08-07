/**
 * Seed the Renewal phase narrative and its six phase-domain storylines.
 *
 *   dry run:  (set -a; . ./.env.local; set +a; npx tsx scripts/seedRenewalNarrative.ts)
 *   apply:    (set -a; . ./.env.local; set +a; npx tsx scripts/seedRenewalNarrative.ts --apply)
 *
 * TRANSCRIPTION, NOT AUTHORSHIP. Every string comes from the framework author's
 * Renewal narrative layer. Unlike Recovery, that document supplies every field
 * the schema has, so nothing here is inferred or left blank.
 *
 * SEEDED AS 'draft', PER THE AUTHOR'S OWN GOVERNANCE INSTRUCTION. Renewal is a
 * theory-derived public-interpretation draft: unavailable in Publication Mode
 * and ineligible for ce_source_use_approvals until the owner reviews the
 * consumer title, phase fields, six storylines, six distortion corrections,
 * safety boundaries, public/clinical boundary, approved language, prohibited
 * reductions, reading level and competency coverage.
 *
 * Requires migrations 0057, 0058 and 0061.
 */
import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  PHASE, PROVENANCE, PHASE_NARRATIVE, DOMAIN_NARRATIVES,
} from "@/scripts/renewalNarrativePayload";

const APPLY = process.argv.includes("--apply");
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

async function main() {
  const s = getSupabaseAdminClient();

  // --- canon checks before anything is written ------------------------------
  const { data: phaseRow } = await s
    .from("fw_phases").select("name, developmental_task").eq("name", PHASE).maybeSingle();
  if (!phaseRow) throw new Error(`${PHASE} is not a canonical phase.`);
  const p = phaseRow as { name: string; developmental_task: string };
  if (norm(p.developmental_task) !== norm(PHASE_NARRATIVE.developmental_task)) {
    throw new Error(
      `Developmental task mismatch: fw_phases says "${p.developmental_task}", the narrative says "${PHASE_NARRATIVE.developmental_task}".`,
    );
  }

  const { data: comps } = await s
    .from("fw_competencies").select("competency_id, name, domain").eq("phase", PHASE);
  const byId = new Map(
    ((comps ?? []) as { competency_id: string; name: string; domain: string }[])
      .map((c) => [c.competency_id, c]),
  );

  // --- validate every ID the narrative claims -------------------------------
  const failures: string[] = [];
  for (const d of DOMAIN_NARRATIVES) {
    if (d.competency_ids.length !== d.competency_names_display.length) {
      failures.push(`${d.domain}: ${d.competency_ids.length} ids but ${d.competency_names_display.length} names.`);
    }
    d.competency_ids.forEach((id, i) => {
      const hit = byId.get(id);
      if (!hit) { failures.push(`${d.domain}: "${id}" is not a canonical ${PHASE} competency.`); return; }
      if (norm(hit.domain) !== norm(d.domain)) {
        failures.push(`${d.domain}: ${id} belongs to ${hit.domain}, not ${d.domain}.`);
      }
      const claimed = d.competency_names_display[i];
      if (claimed && norm(hit.name) !== norm(claimed)) {
        failures.push(`${d.domain}: ${id} is named "${hit.name}" in canon, "${claimed}" in the narrative.`);
      }
    });
    if (!d.common_distorted_interpretation?.trim()) {
      failures.push(`${d.domain}: no distortion correction.`);
    }
  }

  // Every Renewal competency must be claimed by exactly one storyline.
  const claimed = DOMAIN_NARRATIVES.flatMap((d) => d.competency_ids);
  const dupes = claimed.filter((id, i) => claimed.indexOf(id) !== i);
  if (dupes.length) failures.push(`Claimed by more than one storyline: ${[...new Set(dupes)].join(", ")}`);
  const unclaimed = [...byId.keys()].filter((id) => !claimed.includes(id));
  if (unclaimed.length) failures.push(`Not claimed by any storyline: ${unclaimed.join(", ")}`);

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (no writes)"}\n`);
  console.log(`Phase narrative : ${PHASE} — "${PHASE_NARRATIVE.consumer_phase_name}"`);
  console.log(`  descriptor           : ${PHASE_NARRATIVE.public_descriptor}`);
  console.log(`  task matches canon   : ✓ ${p.developmental_task}`);
  console.log(`  transformation pairs : ${PHASE_NARRATIVE.transformation_from.length} / ${PHASE_NARRATIVE.transformation_toward.length}`);
  console.log(`  governing truths     : ${PHASE_NARRATIVE.governing_narrative_truths.length}`);
  console.log(`  misconceptions       : ${PHASE_NARRATIVE.common_misconceptions.length}`);
  console.log(`  signs of movement    : ${PHASE_NARRATIVE.signs_of_movement.length}`);
  console.log(`  signs constrained    : ${PHASE_NARRATIVE.signs_constrained.length}`);
  console.log(`  safety boundaries    : ${PHASE_NARRATIVE.safety_boundaries.length}`);
  console.log(`  approved language    : ${PHASE_NARRATIVE.approved_language.length}`);
  console.log(`  prohibited reductions: ${PHASE_NARRATIVE.prohibited_reductions.length}`);

  console.log(`\nDomain storylines: ${DOMAIN_NARRATIVES.length}`);
  for (const d of DOMAIN_NARRATIVES) {
    console.log(
      `  ✓ ${d.domain.padEnd(20)} ${d.competency_ids.length} ids · ` +
      `${d.observable_patterns.length} dev / ${d.constrained_patterns.length} constrained · ` +
      `${d.content_themes.length} themes`,
    );
  }

  if (failures.length) {
    console.error(`\nRefusing — ${failures.length} problem(s):`);
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }
  console.log(`\n  all ${claimed.length} competency ids validated against canon ✅`);

  // Transformation is authored as paired movements; a mismatch would silently
  // pair the wrong "from" with the wrong "toward" on the public page.
  if (PHASE_NARRATIVE.transformation_from.length !== PHASE_NARRATIVE.transformation_toward.length) {
    console.error("\nRefusing: transformation from/toward lists are different lengths.");
    process.exit(1);
  }

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply.`);
    return;
  }

  const { error: pErr } = await s.from("kb_phase_narratives")
    .upsert({ ...PHASE_NARRATIVE, updated_at: new Date().toISOString() }, { onConflict: "phase" });
  if (pErr) throw new Error(`phase narrative: ${pErr.message}`);

  const rows = DOMAIN_NARRATIVES.map((d) => ({
    phase: PHASE,
    domain: d.domain,
    // The storyline heading plus the paragraph that explains it — the heading
    // alone is a label, not a storyline.
    domain_storyline: `${d.domain_storyline}. ${d.storyline_explanation}`,
    consumer_problem_language: d.consumer_problem_language,
    internal_questions: d.internal_questions,
    emotional_experience: d.emotional_experience,
    observable_patterns: d.observable_patterns,
    constrained_patterns: d.constrained_patterns,
    developmental_interpretation: d.developmental_interpretation,
    competency_ids: d.competency_ids,
    competency_names_display: d.competency_names_display,
    healthy_narrative_movement: d.healthy_narrative_movement,
    common_distorted_interpretation: d.common_distorted_interpretation,
    content_themes: d.content_themes,
    next_step_language: d.next_step_language,
    safety_rules: d.safety_rules,
    suppression_rules: d.suppression_rules,
    source_provenance: PROVENANCE,
    record_status: "draft",
    updated_at: new Date().toISOString(),
  }));

  const { error: dErr } = await s
    .from("kb_phase_domain_narratives").upsert(rows, { onConflict: "phase,domain" });
  if (dErr) throw new Error(`domain narratives: ${dErr.message}`);

  console.log(`\n✅ applied. 1 phase narrative + ${rows.length} domain storylines, all record_status 'draft'.`);
  console.log(`   Per your governance instruction: not available in Publication Mode,`);
  console.log(`   not eligible for ce_source_use_approvals, and NOT wired to the public /renewal page.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
