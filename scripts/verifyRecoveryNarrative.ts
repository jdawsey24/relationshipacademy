/**
 * Verify the LIVE Knowledge Base Recovery narrative.
 *
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/verifyRecoveryNarrative.ts)
 *
 * Read-only. Three checks, in order:
 *
 *   1. the database matches the authored payload (no drift since seeding)
 *   2. the projection the public pages consume is renderable
 *   3. the narrative QC layer passes — six storylines, six distortion
 *      corrections, no asserted reductions, every reduction addressed
 *
 * The test suite covers the same rules against fixtures so it stays pure; this
 * is what proves the live records.
 */
import { getPhaseNarrative } from "@/lib/framework/phaseNarrative";
import { runPhaseNarrativeQc } from "@/lib/framework/narrativeQc";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { PHASE, PHASE_NARRATIVE, DOMAIN_NARRATIVES } from "@/scripts/recoveryNarrativePayload";

const norm = (s: string | null | undefined) => (s ?? "").trim().replace(/\s+/g, " ");

async function main() {
  let failures = 0;
  const fail = (m: string) => { console.log(`  ✗ ${m}`); failures++; };
  const ok = (m: string) => console.log(`  ✓ ${m}`);

  // --- 1. drift ------------------------------------------------------------
  console.log("1. Database matches the authored payload");
  const s = getSupabaseAdminClient();
  const { data: pn, error: pErr } = await s
    .from("kb_phase_narratives").select("*").eq("phase", PHASE).maybeSingle();

  if (pErr) { fail(`cannot read kb_phase_narratives: ${pErr.message}`); }
  else if (!pn) { fail(`no ${PHASE} record`); }
  else {
    const r = pn as Record<string, unknown>;
    const scalars: [string, string][] = [
      ["developmental_task", PHASE_NARRATIVE.developmental_task],
      ["consumer_phase_name", PHASE_NARRATIVE.consumer_phase_name],
      ["public_descriptor", PHASE_NARRATIVE.public_descriptor],
      ["core_human_question", PHASE_NARRATIVE.core_human_question],
      ["core_tension", PHASE_NARRATIVE.core_tension],
    ];
    for (const [k, want] of scalars) {
      if (norm(r[k] as string) !== norm(want)) fail(`${k} differs from the payload`);
    }
    const arrays: [string, string[]][] = [
      ["transformation_from", PHASE_NARRATIVE.transformation_from],
      ["transformation_toward", PHASE_NARRATIVE.transformation_toward],
      ["governing_narrative_truths", PHASE_NARRATIVE.governing_narrative_truths],
    ];
    for (const [k, want] of arrays) {
      const got = (r[k] as string[]) ?? [];
      if (got.length !== want.length) fail(`${k}: ${got.length} rows, payload has ${want.length}`);
    }
    if (!failures) ok("phase record matches");
  }

  const { data: dn } = await s
    .from("kb_phase_domain_narratives").select("*").eq("phase", PHASE);
  const domains = (dn ?? []) as Record<string, unknown>[];
  if (domains.length !== DOMAIN_NARRATIVES.length) {
    fail(`${domains.length} domain records, payload has ${DOMAIN_NARRATIVES.length}`);
  } else {
    let drift = 0;
    for (const want of DOMAIN_NARRATIVES) {
      const got = domains.find((d) => norm(d.domain as string) === norm(want.domain));
      if (!got) { fail(`missing ${want.domain}`); drift++; continue; }
      if (norm(got.common_distorted_interpretation as string) !== norm(want.common_distorted_interpretation)) {
        fail(`${want.domain}: distortion correction differs from the payload`); drift++;
      }
      if (norm(got.domain_storyline as string) !== norm(want.domain_storyline)) {
        fail(`${want.domain}: storyline differs from the payload`); drift++;
      }
    }
    if (!drift) ok(`all ${domains.length} domain records match`);
  }

  // --- 2. projection -------------------------------------------------------
  console.log("\n2. Public projection");
  const p = await getPhaseNarrative(PHASE);
  if (!p) {
    fail("getPhaseNarrative returned nothing — the public routes would throw");
    process.exit(1);
  }
  console.log(`  source version : ${p.sourceVersion}`);
  console.log(`  canonical name : ${p.phase}   slug: /${p.slug}   task: ${p.developmentalTask}`);
  console.log(`  consumer title : ${p.consumerTitle}`);
  console.log(`  descriptor     : ${p.publicDescriptor ?? "—"}`);
  console.log(`  card copy from : ${p.cardDescriptionSource}`);
  p.renderable ? ok("renderable") : fail(`missing required fields: ${p.missingRequiredFields.join(", ")}`);
  p.approvalState === "not_approved"
    ? ok(`approval state: not_approved (${p.publicationBlockers.length} blockers)`)
    : fail("approval state is not 'not_approved'");

  // --- 3. narrative QC -----------------------------------------------------
  console.log("\n3. Narrative QC");
  const qc = runPhaseNarrativeQc(p);
  console.log(`  storylines             : ${qc.domainsPresent}/6`);
  console.log(`  distortion corrections : ${qc.distortionCorrections}/6`);
  for (const [k, covered] of Object.entries(qc.reductionsCovered)) {
    console.log(`  ${covered ? "✓" : "✗"} reduction addressed: ${k}`);
    if (!covered) failures++;
  }
  const critical = qc.findings.filter((f) => f.severity === "critical");
  if (critical.length) {
    fail(`${critical.length} critical finding(s):`);
    for (const f of critical) console.log(`      • [${f.field}] ${f.message}`);
  } else ok("no critical findings");

  console.log(`\n${failures ? `❌ ${failures} problem(s)` : "✅ live Recovery narrative verified"}`);
  process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
