# Relationship Statement Classification — Internal RLC Artifact (v1)

**What this is.** A versioned, reproducible classification/enrichment of the full Relationship
Life Cycle™ relational **statement bank** (1,085 statements). It is the bridge between the
**Relationship Snapshot™ Experience Cluster** architecture and the future **Relationship
Playbook™ behavioral-change system**. This step **only classifies** each statement — it does
**not** generate behaviors, interventions, adaptive alternatives, recommendations, or theory.

> **Scope boundary.** This is "Script 1" (classification/enrichment). **Script 2 (behavioral
> derivation: Trigger/Context → Current Response → Function → Cost → Adaptive Alternative) has
> NOT been run.** The finalized `outputs/` workbook is Script 2's input. Do not begin Script 2
> from this artifact until directed.

## Source of truth (CANONICAL — read-only, never overwritten by this pipeline)
Canonical inputs live **outside** this artifact and are only *read*:
- `../../_import/RLC_Experience_Clusters.xlsx` → sheet **"Full Statement Mapping"** — the
  authoritative statements + approved **Primary Experience Cluster** + **RLC Phase**. These two
  assignments are **preserved verbatim**; this pipeline never remaps them (see Rulings).
- `../../data/clusters.json` — the 27 Experience Cluster names/definitions.

The RLC Framework remains authoritative: no new constructs, phases, competencies, or clusters
were introduced. See `inputs/README.md`.

## Directory layout (canonical inputs vs generated outputs, kept separate)
```
inputs/     README pointer to the CANONICAL source (nothing is copied/duplicated here)
rulings/    classification-rulings-v1.md  — the final approved classification logic (authoritative)
scripts/    01_extract_bank.py            — canonical  -> generated/bank.json + cluster_meta.json
            02_classify_workflow.js       — the fan-out classification orchestration (Claude Code Workflow runtime)
            03_merge_build.py             — generated/* -> outputs/ workbook (validates completeness)
generated/  bank.json                     — frozen input snapshot (traceable to source rows via STM-####)
            cluster_meta.json             — generated cluster directory
            flags.json                    — human-authored Flag_Category + Flag_Reason for the 57 review rows
            enrichment/cluster_*.json     — raw per-cluster classification output (audit trail, 27 files)
outputs/    RLC_Statement_Classification.xlsx  — THE deliverable (3 sheets)
```

## Deliverable workbook (`outputs/RLC_Statement_Classification.xlsx`)
- **Classification** — all 1,085 rows × 10 columns: `Statement_ID, Original_Statement,
  Statement_Type, Primary_Experience_Cluster, Secondary_Experience_Cluster, RLC_Phase,
  Behaviorally_Actionable, Mapping_Rationale, Confidence, Review_Flag`. (Autofiltered.)
- **QA Summary** — totals by type/cluster, actionable count, review count + Flag_Category
  breakdown, unusual cluster sizes, secondary-overlap frequency.
- **Human Review** — the 57 `Review_Flag=YES` rows only, columns:
  `Statement_ID | Original_Statement | Primary_EC | RLC_Phase | Statement_Type |
  Behaviorally_Actionable | Flag_Category | Flag_Reason | Confidence | Secondary_EC |
  Mapping_Rationale`. (Autofiltered.) `Mapping_Rationale` = *why the classification was made*;
  `Flag_Reason` = *why human judgment is needed* — deliberately distinct functions.

`Flag_Category` controlled vocabulary: `statement-type-ambiguous`, `self-behavior-boundary`,
`actionability-unclear`, `relational-condition-vs-experience`, `self-vs-other-behavior`,
`wording-insufficient`, `source-data-inconsistency`, `other` (multiple allowed).

## Method / provenance (v1)
- Statement text read directly from the canonical sheet (never re-typed) → exact preservation.
- **Cluster 24 was human-calibrated** across two review rounds; its 32 rows are the approved
  exemplar every agent matched (`generated/enrichment/cluster_24.json`).
- Classification fan-out: one agent per Experience Cluster (26 agents; cluster 24 injected),
  each applying `rulings/classification-rulings-v1.md` + the exemplar, output schema-validated.
- Integrity checks (enforced by `03_merge_build.py`, build fails otherwise): every statement
  classified (0 missing/extra/duplicate); `Behaviorally_Actionable=YES` ⟺ `Self-Behavior`
  (0 violations); no `Secondary = Primary`; every flagged row has a valid category + reason.

### v1 results
1,085 statements. Types: Thought/Belief 526 · Need 117 · Experience 116 · Relational Condition
102 · Emotion 90 · Self-Behavior 81 · Fear 40 · Other-Person Behavior 13. Behaviorally
Actionable: **81 (all Self-Behavior)**. Human review: **57 (5.3%)**. Known source-data items
surfaced for review: STM-0653/STM-0654 (non-statement source scaffolding), STM-0334/STM-0879
(exact duplicates), STM-0741/STM-0820 (near-duplicates).

## Reproduce / update
If the **source bank** or the **taxonomy/rulings** change, bump the version and re-run:
1. `python3 scripts/01_extract_bank.py`  (regenerates `generated/bank.json`, `cluster_meta.json`)
2. Run the classification fan-out (`scripts/02_classify_workflow.js` via the Claude Code Workflow
   runtime) → writes `generated/enrichment/cluster_*.json`. (Update `rulings/…` first if the
   taxonomy changed; keep the cluster-24 exemplar in sync.)
3. Re-author `generated/flags.json` for any changed `Review_Flag` rows (category + reason).
4. `python3 scripts/03_merge_build.py`  (rebuilds `outputs/…xlsx`; fails on any integrity gap).

`01` and `03` are standalone Python (needs `openpyxl`). `02` records the orchestration logic and
requires the Workflow runtime. **Do not edit the canonical source to fix classification issues** —
corrections belong in the rulings + this artifact.
