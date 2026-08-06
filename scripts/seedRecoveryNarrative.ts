/**
 * Seed the Recovery phase narrative and its six phase-domain storylines.
 *
 *   dry run (default — reads only, writes nothing):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/seedRecoveryNarrative.ts)
 *   apply:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/seedRecoveryNarrative.ts --apply)
 *
 * TRANSCRIPTION, NOT AUTHORSHIP. Every string below is the framework author's
 * own text. Fields the author did not supply are left EMPTY and reported as
 * outstanding — they are not inferred, paraphrased, or filled from adjacent
 * material. Blank does not mean approved.
 *
 * Records are seeded with record_status 'draft'. Nothing here approves anything
 * for public use; that is ce_source_use_approvals, recorded separately.
 *
 * Requires migration 0057.
 */
import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  PHASE, PROVENANCE, PHASE_NARRATIVE, DOMAIN_NARRATIVES, type DomainSeed,
} from "@/scripts/recoveryNarrativePayload";

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
  const byName = new Map(
    ((comps ?? []) as { competency_id: string; name: string; domain: string }[])
      .map((c) => [norm(c.name), c]),
  );

  // --- resolve every display name to a canonical id -------------------------
  const resolved: (DomainSeed & { competency_ids: string[] })[] = [];
  const failures: string[] = [];

  for (const d of DOMAIN_NARRATIVES) {
    const ids: string[] = [];
    for (const name of d.competency_names_display) {
      const hit = byName.get(norm(name));
      if (!hit) { failures.push(`${d.domain}: "${name}" does not resolve to a canonical ${PHASE} competency.`); continue; }
      if (norm(hit.domain) !== norm(d.domain)) {
        failures.push(`${d.domain}: "${name}" resolves to ${hit.competency_id}, which belongs to ${hit.domain}.`);
        continue;
      }
      ids.push(hit.competency_id);
    }
    if (!d.common_distorted_interpretation?.trim()) {
      failures.push(`${d.domain}: no common_distorted_interpretation. Every storyline must state its distortion.`);
    }
    resolved.push({ ...d, competency_ids: ids });
  }

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (no writes)"}\n`);
  console.log(`Phase narrative : ${PHASE} — "${PHASE_NARRATIVE.consumer_phase_name}"`);
  console.log(`  developmental task matches fw_phases : ✓ ${p.developmental_task}`);
  console.log(`  transformation pairs : ${PHASE_NARRATIVE.transformation_from.length} from / ${PHASE_NARRATIVE.transformation_toward.length} toward`);
  console.log(`  governing truths     : ${PHASE_NARRATIVE.governing_narrative_truths.length}`);

  console.log(`\nDomain storylines: ${resolved.length}`);
  for (const d of resolved) {
    const ok = d.competency_ids.length === d.competency_names_display.length;
    console.log(`  ${ok ? "✅" : "❌"} ${d.domain.padEnd(20)} ${d.competency_ids.length}/${d.competency_names_display.length} → ${d.competency_ids.join(", ")}`);
  }

  if (failures.length) {
    console.error(`\nRefusing — ${failures.length} competency name(s) did not resolve:`);
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }

  console.log(`\n  distortion corrections : ${resolved.length}/${resolved.length} ✅`);

  console.log(`\nFields left EMPTY, awaiting the author (blank ≠ approved):`);
  console.log(`  phase  : lived_experience_summary, developmental_explanation, common_misconceptions,`);
  console.log(`           signs_of_movement, signs_constrained, safety_boundaries,`);
  console.log(`           public_or_clinical_boundary, reading_level, approved_language, prohibited_reductions`);
  console.log(`  domain : consumer_problem_language, observable_patterns, developmental_interpretation,`);
  console.log(`           healthy_narrative_movement, content_themes, next_step_language,`);
  console.log(`           safety_rules, suppression_rules`);

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply.`);
    return;
  }

  const { error: pErr } = await s
    .from("kb_phase_narratives")
    .upsert({ ...PHASE_NARRATIVE, updated_at: new Date().toISOString() }, { onConflict: "phase" });
  if (pErr) throw new Error(`phase narrative: ${pErr.message}`);

  const rows = resolved.map((d) => ({
    phase: PHASE,
    domain: d.domain,
    domain_storyline: d.domain_storyline,
    emotional_experience: d.emotional_experience,
    internal_questions: d.internal_questions,
    common_distorted_interpretation: d.common_distorted_interpretation,
    competency_ids: d.competency_ids,
    competency_names_display: d.competency_names_display,
    source_provenance: PROVENANCE,
    record_status: "draft",
    updated_at: new Date().toISOString(),
  }));

  const { error: dErr } = await s
    .from("kb_phase_domain_narratives").upsert(rows, { onConflict: "phase,domain" });
  if (dErr) throw new Error(`domain narratives: ${dErr.message}`);

  console.log(`\n✅ applied. 1 phase narrative + ${rows.length} domain storylines, all record_status 'draft'.`);
  console.log(`   Nothing is approved for public use. That is ce_source_use_approvals.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
