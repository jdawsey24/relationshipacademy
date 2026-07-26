// ARTIFACT RECORD — Step 2 of 3: statement-classification fan-out.
// This is the orchestration logic used to classify the bank (one agent per Experience
// Cluster). It runs in the Claude Code Workflow runtime (agents Read the files below and
// Write per-cluster enrichment). Cluster 24 is human-calibrated and injected at merge, so it
// is NOT processed here. Paths point at this committed artifact. See ../README.md.

export const meta = {
  name: 'classify-statement-bank',
  description: 'Classify/enrich 1,053 relational statements (all clusters except 24) per approved rulings',
  phases: [{ title: 'Classify', detail: 'one general-purpose agent per Experience Cluster' }],
}
const ART = '/Users/janelledawsey/Relationship Life Cycle/artifacts/statement-classification'
const RULINGS = `${ART}/rulings/classification-rulings-v1.md`, BANK = `${ART}/generated/bank.json`, META = `${ART}/generated/cluster_meta.json`
const CLUSTERS = [
  { id: 1, count: 101 }, { id: 2, count: 20 }, { id: 3, count: 58 }, { id: 4, count: 27 },
  { id: 5, count: 63 }, { id: 6, count: 59 }, { id: 7, count: 30 }, { id: 8, count: 60 },
  { id: 9, count: 17 }, { id: 10, count: 18 }, { id: 11, count: 43 }, { id: 12, count: 58 },
  { id: 13, count: 36 }, { id: 14, count: 20 }, { id: 15, count: 53 }, { id: 16, count: 31 },
  { id: 17, count: 62 }, { id: 18, count: 20 }, { id: 19, count: 29 }, { id: 20, count: 91 },
  { id: 21, count: 48 }, { id: 22, count: 20 }, { id: 23, count: 31 }, { id: 25, count: 32 },
  { id: 26, count: 10 }, { id: 27, count: 16 },
]
const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['cluster_id', 'count', 'actionable_count', 'flag_count', 'written'],
  properties: {
    cluster_id: { type: 'integer' }, count: { type: 'integer' },
    actionable_count: { type: 'integer' }, flag_count: { type: 'integer' }, written: { type: 'boolean' },
  },
}
phase('Classify')
const results = await parallel(CLUSTERS.map((c) => () =>
  agent(
    `You are enriching relational statements for Relationship Snapshot Experience Cluster ${c.id}.\n` +
    `STEP 1: Read ${RULINGS} and follow it EXACTLY — the Statement_Type taxonomy, the 4 standing rulings, the Relational-Condition-vs-Experience rule, the Secondary_EC rule, and the Review_Flag principle. The approved calibration exemplar at the bottom shows the exact style/strictness to match.\n` +
    `STEP 2: Read ${BANK} (a JSON array of statements). Filter to the objects where primary_ec === ${c.id}. You must get EXACTLY ${c.count} statements. Read ${META} for cluster names/definitions (all 27) to judge Secondary_EC overlaps.\n` +
    `STEP 3: Classify EVERY one of the ${c.count} statements. The canonical Primary Experience Cluster (${c.id}) and RLC Phase are FIXED — do not change or emit them. For each statement produce an object: {"sid": <its sid>, "statement_type": one of [Experience, Emotion, Thought/Belief, Fear, Need, Self-Behavior, Other-Person Behavior, Relational Condition], "secondary_ec": integer 1-27 (not ${c.id}) or null, "behaviorally_actionable": true/false, "mapping_rationale": one concise clause on manifest content (no latent analysis), "confidence": "High"|"Moderate"|"Low", "review_flag": true/false}.\n` +
    `STEP 4: Write the JSON array (EXACTLY ${c.count} objects, every sid from the filter preserved, none added/dropped) to ${ART}/generated/enrichment/cluster_${c.id}.json. Then re-read that file and confirm it parses as JSON and length === ${c.count}. If not, fix and rewrite.\n` +
    `Return the summary: cluster_id, count (must be ${c.count}), actionable_count (# behaviorally_actionable true), flag_count (# review_flag true), written (true once the file is verified).`,
    { label: `cluster-${c.id}`, phase: 'Classify', agentType: 'general-purpose', schema: SCHEMA }
  )
))
return { results: results.filter(Boolean) }