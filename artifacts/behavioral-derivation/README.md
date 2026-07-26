# Behavioral Derivation — Internal RLC Artifact (v1)

**What this is.** Script 2 of the Relationship Playbook™ pipeline: the **internal behavioral logic**
that a future Playbook generator will use. It analyzes the user **self-behaviors** identified in
Script 1 and, where justified, derives adaptive alternatives that serve the developmental task of
the relevant RLC phase.

> **Scope boundary.** This step produces internal logic ONLY. It does **not** write consumer-facing
> Playbook copy or build the Playbook experience. The RLC Framework is the source of truth — no new
> theory, phases, competencies, tasks, or clusters were introduced.

## Input (from Script 1)
Target behaviors = statements classified `Statement_Type = Self-Behavior` AND
`Behaviorally_Actionable = YES` in **`../statement-classification/`** (Script 1). That is **81
behaviors** across 23 Experience Clusters. Canonical Experience Cluster, RLC Phase, and developmental
task are **preserved** from source and never modified here.

## Canonical framework (read-only)
- `fw_phases` (Supabase) → 6 phases + developmental task: Exploration→Discernment, Exclusivity→Intentional
  Investment, Expansion→Integration, Expiration→Acceptance, Recovery→Healing, Renewal→Reengagement.
- `fw_competencies` (Supabase) → **111 competencies, but only for Exploration/Exclusivity/Expansion/
  Expiration.** Recovery, Renewal, and Cross-Phase have **no competencies** — a known source gap.
  Behaviors in those phases cite the task but `Relevant_RLC_Competency = None available (source gap)`
  and are review-flagged, rather than inventing a competency.
Snapshots of both live in `generated/fw_phases.json` and `generated/fw_competencies.json`.

## Deliverable (`outputs/RLC_Behavioral_Derivation.xlsx`)
- **Derivation** — 81 behaviors × 17 cols: the full behavioral chain (Trigger→Response→Function→Cost
  →Adaptive Alternative→What It Reveals), `Maintaining_Role`, developmental task, RLC competency,
  alternatives, discomfort, context, confidence, review flag.
- **Play Synthesis** — 38 candidate Plays consolidated from the behaviors, with full traceability
  (behavioral vs contextual source IDs, phase, task, competencies, consolidated behaviors, context limits).
- **Human Review** — every flagged behavior + flagged Play with its reason.
- **Global QA** — the QA summary + mechanical & judgment global-consistency findings.

All consumer-bound prose is written at a **5th-grade reading level**; canonical labels
(Maintaining_Role, competency names, task, phase, cluster, confidence) are unchanged.

## Governing rules
`rulings/derivation-rulings-v1.md` — the approved spec: the behavioral chain, the 4 Maintaining_Role
categories (alternatives only for *Likely Maintains Pattern* and conditional *Context Dependent*;
none for *Likely Adaptive Already* or *Insufficient Evidence*), the 10 refinements (no unsupported
functions/motives; strict competency mapping; Insufficient-Evidence never counts as behavioral
evidence; outcome-neutrality; aggressive-but-coherent consolidation; etc.), the prohibited generic-advice
list, and the cluster-5 exemplar.

## Method / provenance (v1)
- **Cluster 5 was human-calibrated** across two rounds; its 11-behavior / 3-Play derivation is the
  approved exemplar (`generated/enrichment/cluster_5_*.json`).
- Fan-out: one agent per cluster (22 agents; cluster 5 injected), each applying the rulings + exemplar,
  writing per-cluster `_behaviors.json` + `_plays.json`.
- **Global consistency pass:** mechanical checks in `03_build_derivation.py` (Insufficient-Evidence used
  as behavioral evidence = **0**; invented competency labels = **0**; duplicate-text role conflicts = **0**;
  plays-per-cluster) + a judgment pass by a consistency reviewer agent (`generated/qa_agent.json`).

### v1 results
81 behaviors → Maintaining_Role: Likely Maintains 49 · Context Dependent 20 · Insufficient Evidence 9 ·
Likely Adaptive Already 3. **38 candidate Plays** (clusters 13 & 25 yielded none — a valid result).
62 behaviors + 32 Plays flagged for human review (conservative first-pass flagging).

## Reproduce
1. `python3 scripts/01_extract_behaviors.py`  (selects the 81 targets from Script 1; refresh fw_*.json from the DB if the framework changed)
2. Run the derivation fan-out (`scripts/02_derive_workflow.js`, Claude Code Workflow runtime) → `generated/enrichment/cluster_*_{behaviors,plays}.json`
3. Run the consistency reviewer (`scripts/consistency_agent_prompt.md`) → `generated/qa_agent.json`
4. `python3 scripts/03_build_derivation.py`  (mechanical checks + builds the workbook)

`01`/`03` are standalone Python (needs `openpyxl`). `02` + the consistency reviewer run in the agent
runtime. Do not edit canonical inputs to fix derivation issues — corrections belong in the rulings.

## Play-layer adjudication (v1) — the APPROVED source-of-truth architecture
The raw Play Synthesis (38 candidate Plays) was a *working* layer, not final. The adjudication pass
turns it into the governed architecture: it removes inferred psychological mechanisms, resolves every
Global-QA inconsistency by correcting the underlying logic (not just clearing flags), **splits**
over-consolidated Plays (e.g. Cluster 5 pursuit vs premature selection), and **normalizes** reusable
protocols into a **Core Play Library** with per-cluster **Applications**.

**Deliverable:** `outputs/RLC_Play_Architecture_Adjudicated.xlsx` — 6 sheets:
`Behavior Derivation Adjudicated` (81, with mechanism fixes) · `Core Play Library` (20 core protocols,
each with `Core_Play_Name_Internal`, `Play_Function` [Interrupt/Replace/Increase/Preserve/Observe/
Clarify/Decide], canonical protocol, competency-or-gap) · `Cluster Play Applications` (40, each with
`Evidence_Status` [Strongly Supported / Supported with Context Conditions / Task-Supported·Competency
Gap / Requires Human Adjudication / Reject], behavioral vs contextual source IDs) · `Human Review` ·
`Global QA — Resolved` · `Decision Log` (16 documented changes).

**Governing spec:** `rulings/adjudication-spec-v1.md`. **Data:** `generated/adjudication/*.json`.
**Reproduce:** step 4 = the adjudication agent (`scripts/04_adjudicate_agent_prompt.md`) →
`generated/adjudication/`; step 5 = `python3 scripts/05_build_adjudicated.py` (validates competencies
exactly against `fw_competencies`, enforces the controlled vocab + zero-Play clusters 13/25, builds the
workbook). v1 result: 20 Core Plays · 40 Applications · Evidence status 8 Strongly / 14 Context-Conditions
/ 13 Competency-Gap / 5 Human-Adjudication / **0 Reject** · 0 invented competencies · 0 Insufficient-as-evidence.

**Next stage (NOT started):** consumer-facing Playbook copy + the Playbook experience. The adjudicated
architecture (`RLC_Play_Architecture_Adjudicated.xlsx`) is its source of truth.
