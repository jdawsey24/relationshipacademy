# Cluster 3 — Partition Ruling (statement anomalies + non-behavioural core)

**Status:** verified against `../generated/bank.json` and `../generated/enrichment/cluster_3.json`.
Items 1 & 3 are **settled calls**; item 2 requires an **owner canonical-mapping ruling** (flagged, not
executed). No canonical source, partition, or derivation artifact was modified by this memo.

**Cluster:** 3 (Exploration). **Canonical `primary_ec===3` rows:** 58.
**Corrected statement count: 56** (see §1).

---

## 1. Scaffolding rows — EXCLUDE from partition (settled)
| STM | Text | Why | Canonical |
|---|---|---|---|
| STM-0653 | "These are thoughts people are ashamed to admit because they conflict with who they want to be." | section descriptor | ec=3, src "Hidden Thoughts" |
| STM-0654 | "Examples:" | list header | ec=3, src "Hidden Thoughts" |

The classifier typed both **Thought/Belief**, treating section headers as statements. These are **source
scaffolding, not statements** (the same anomaly flagged in the count reconciliation — see
`../../change-system/rlc-change-system-architecture-final-v1.md`).

**Call:** exclude from the Cluster 3 partition; **record, do not delete**. This is a **classifier/partition
correction, not a canonical remap** (the rows exist in canon but are non-statements) — no owner ruling
required. **Cluster 3 real count = 56.** The Evidence Gap Analysis's "58 Total_Statements" is 2 high → **56**.

---

## 2. "Hidden Thoughts" block (STM-0655–0664) — QUARANTINE + escalate an owner ruling
All **ten** ids STM-0655…0664 are **canonically `ec=3`, phase Exploration, src "Hidden Thoughts"** (verified).
Thematically the block is about wanting pursuit / missing attention / wanting a partner to intuit or change
unprompted / staying in something known-wrong (e.g. *"I like being chased more than being in a relationship,"
"I wanted them to read my mind," "I kept hoping love would fix our incompatibility"*) — **not** Cluster 3's
availability / vulnerability / avoidance theme.

- **This is a canonical-mapping challenge, not a classifier artifact.** The `primary_ec=3` assignment comes
  from the approved "Full Statement Mapping" (preserved verbatim), not the classifier.
- **Cross-Cluster Rule #1** ("canonical mappings never change; cross-cluster use is an *application*
  relationship, not a remapping") ⇒ **the pipeline must not move this block.** Correcting a canonical
  mis-assignment is an **owner ruling that edits the source.**
- Classifier secondary-EC hints (verified inputs, not authority): **STM-0658 → 15 (Taken for Granted)**,
  **STM-0664 → 21 (Want Different Things)**.
- Two of the ten already absorbed into Core Plays: **0660 → CP-08 (testing)**, **0661 → CP-20 (fit-based
  decision)** → residual with no application = **8** (not 7).

**Call (process):** do **not** treat this as a derived PE-8. **Hold the whole block out of Cluster 3
derivation (quarantine)** pending the ruling; do not dissolve it into the other seven PEs (that manufactures
false coherence). **Escalate one owner canonical-mapping ruling:** *"Is the 'Hidden Thoughts' section
(STM-0655–0664) correctly assigned to Cluster 3, or a section-level canonical mis-assignment to redistribute
(candidates 1 / 15 / 21 / 24)?"* — with the heterogeneity + secondary-EC evidence attached.

**Caution:** do **not** assume mis-mapping. "Hidden Thoughts" may be a deliberate confessional grouping;
present it as an owner *question*, not a correction.

**Count impact if the owner rules it moves:** Cluster 3 → **46** (56 − 10), not 47; and the two Core-Play
absorptions (0660/0661) must be re-examined (move with the block, or retained as cross-cluster application).
> ⚠️ Reconcile with Chat: Chat's note said "nine statements"; the range 0655–0664 is **ten**. Confirm which id
> was dropped before finalizing the count.

---

## 3. PE-4 / PE-6 zero-Self-Behaviour third — DEFER split to Gate 5 (settled deferral)
PE-4 + PE-6 = **19 statements (~34% of Cluster 3)** with **no Self-Behaviour base** (verified: all
internal-state / capacity statements, e.g. *"I lose interest when someone likes me," "I feel trapped when
relationships get serious," "I don't know how to receive love"*). Structurally the **same shape as Cluster 1
PE-1/PE-2**, which required the **Task-Supported (Tier 3) / FCQ** route.

**Call:** **do not rule now** — pathway analysis is frozen (Gate 5/6). The anti-proliferation consolidation is
the correct default. **Candidate sub-split to revisit at Gate 5:** PE-4 currently merges
**desire-collapse-on-reciprocation** (0306, 0309, 0308, 0310 — "Avoidance") with **difficulty receiving care**
(0059, 0783, 0995, 0996, 0315 — "Emotional Availability / Self-Sabotage / Emotional Safety"). These read as
distinct pathways (avoidant deactivation as closeness rises vs a skill/capacity deficit in receiving) — **hold
the flag; split only if pathway analysis shows divergence.**

**A zero-Self-Behaviour PE is NOT disqualifying — it routes through the v1.1 FCQ / Task-Supported gate.**
Interventions target a developmental **Change Target** (a capacity supporting the phase's task), *not* a
Self-Behaviour statement. `Behaviorally_Actionable = Self-Behaviour` is a **statement-typing** rule
(`classification-rulings-v1.md` R1), not a limit on what may be intervened on. The Intervention Development
Standard v1.1 expanded admissibility beyond direct behavioural evidence:
- **v1.1-D1** — *barrier-describability ≠ competency-coverage*; a describable interference is not a covered target.
- **v1.1-D2** — *Barrier ≠ Competency ≠ Change Target* + the **FCQ (Framework Coverage Question) gate**: where
  a target's capacity isn't demonstrably covered, **raise an FCQ for human adjudication** — never invent a
  competency, never treat a barrier as coverage.
- **Cross-Cluster Rule Tier 3 — Task-Supported Behavioral Derivation**: a behavioural application justified by
  the RLC task/competency architecture *with no direct behavioural statement*, lower evidence status, explicit
  human approval.

So PE-4/PE-6 are **admissible via the Task-Supported/FCQ route** (same route as Cluster 1 PE-1/PE-2) — but with
two consequences: (a) their targets should be **raised as FCQs**, not admitted as covered; (b) **if any *major*
PE-4/PE-6 pathway carries an unresolved FCQ, the Standard's rubric makes Cluster 3 "Partially Sufficient," not
"Sufficient"** (§Rubric). **Precedent:** Cluster 1 **PE-1 is still an OPEN FCQ** and is its single hard
development blocker (v1.1-D1/D10).

**Method signal (for D5/D9):** this is the **second** cluster with a large non-behavioural core (C1 ≈41%,
C3 ≈34%). The Task-Supported / FCQ route is **load-bearing, not exceptional** — the "individual validity ≠
collective sufficiency" case the Portfolio Sufficiency Standard exists for. Reinforces resolving **D5
(Cluster 1 Portfolio Sufficiency)** before scaling (see `../../change-system/D5-D9-sequencing-decision.md`).

---

## Corrected Cluster 3 counts
| Figure | Value |
|---|---|
| Canonical `primary_ec===3` rows | 58 |
| − scaffolding (0653, 0654) | **56 = real statement count** |
| "Hidden Thoughts" block held in quarantine | 10 (STM-0655–0664) |
| Non-behavioural third (PE-4 + PE-6) | 19 (~34%) |
| Count **if** owner rules the block moves out | **46** (owner ruling required; 0660/0661 re-examined) |

*Verified against the working tree; no files modified.*
