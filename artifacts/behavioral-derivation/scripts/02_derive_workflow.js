export const meta = {
  name: 'behavioral-derivation',
  description: 'Script 2 behavioral derivation + Play synthesis for 70 behaviors across 22 clusters (except 5)',
  phases: [{ title: 'Derive', detail: 'one agent per Experience Cluster' }],
}
const SP = '/private/tmp/claude-501/-Users-janelledawsey-Relationship-Life-Cycle/7ab13422-85a2-448e-a48b-62bda44413bf/scratchpad'
const RULINGS = `${SP}/derivation_rulings.md`, BANK = `${SP}/bank.json`, BEH = `${SP}/behaviors.json`
const FWC = `${SP}/fw_competencies.json`, FWP = `${SP}/fw_phases.json`, OUT = `${SP}/out2`
const CLUSTERS = [
  { id: 1, n: 2 }, { id: 2, n: 1 }, { id: 3, n: 19 }, { id: 4, n: 1 }, { id: 6, n: 3 },
  { id: 7, n: 4 }, { id: 8, n: 1 }, { id: 10, n: 1 }, { id: 11, n: 2 }, { id: 12, n: 1 },
  { id: 13, n: 1 }, { id: 14, n: 10 }, { id: 15, n: 8 }, { id: 16, n: 4 }, { id: 17, n: 1 },
  { id: 20, n: 1 }, { id: 21, n: 1 }, { id: 22, n: 3 }, { id: 23, n: 3 }, { id: 24, n: 1 },
  { id: 25, n: 1 }, { id: 27, n: 1 },
]
const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['cluster_id', 'n_behaviors', 'n_plays', 'likely_maintains', 'context_dependent', 'adaptive_already', 'insufficient', 'written'],
  properties: {
    cluster_id: { type: 'integer' }, n_behaviors: { type: 'integer' }, n_plays: { type: 'integer' },
    likely_maintains: { type: 'integer' }, context_dependent: { type: 'integer' },
    adaptive_already: { type: 'integer' }, insufficient: { type: 'integer' }, written: { type: 'boolean' },
  },
}
phase('Derive')
const results = await parallel(CLUSTERS.map((c) => () =>
  agent(
    `You perform Script 2 BEHAVIORAL DERIVATION for Experience Cluster ${c.id}.\n` +
    `STEP 1: Read ${RULINGS} and follow it EXACTLY — the behavioral chain, Maintaining_Role rules, the 10 refinements, the phase/task handling, the 5th-grade reading level for ALL prose fields, competency-mapping discipline, consolidation guidance, and the two output schemas. The approved Cluster-5 exemplar in that file is the required style — match it.\n` +
    `STEP 2: Read ${BANK} and the behaviors file ${BEH}. Your behaviors are the objects in that behaviors file with primary_ec === ${c.id} — exactly ${c.n} of them. Read ${FWC} (competencies; use each behavior's OWN phase to pick from them) and ${FWP} (developmental task per phase). The canonical cluster, RLC phase, and developmental task are FIXED — never change them.\n` +
    `STEP 3: For EACH of the ${c.n} behaviors, produce one object matching the behavior schema. Reading level 5th grade for all prose. Short_Term_Function must be supported or exactly "Function unclear from available evidence" — do NOT invent motives. Relevant_RLC_Competency must be a REAL competency from the list (correct domain) or "Task-supported; no competency cleanly maps" or "None available (source gap)" (Recovery/Renewal/Cross-Phase) with review_flag. Adaptive alternatives ONLY for Likely Maintains Pattern and (conditional) Context Dependent; leave alt fields blank for Likely Adaptive Already and Insufficient Evidence. Write the array (exactly ${c.n} objects, every sid) to ${OUT}/cluster_${c.id}_behaviors.json.\n` +
    `STEP 4: Consolidate behaviors into candidate Plays per the rulings (aggressive but coherent; a cluster may yield 0..n Plays; NO Play if evidence doesn't support one). Insufficient-Evidence sids may appear ONLY under contextual_source_ids, never behavioral_source_ids. Outcome-neutral. Write the Plays array (may be empty) to ${OUT}/cluster_${c.id}_plays.json.\n` +
    `STEP 5: Re-read both files; confirm each parses and the behaviors file has exactly ${c.n} objects. Fix and rewrite if not.\n` +
    `Return the summary counts.`,
    { label: `derive-c${c.id}`, phase: 'Derive', agentType: 'general-purpose', schema: SCHEMA }
  )
))
return { results: results.filter(Boolean) }