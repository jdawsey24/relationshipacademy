# D5 / D9 — Cluster 2 Sequencing & the Cross-Cluster Rule

**Status: RECOMMENDATION for owner decision — NOT yet ratified.** This memo advises how to sequence
two open decisions; it changes no artifact, pipeline, or code. Adopt, amend, or reject.

- **D5** — Does **Cluster 1 Portfolio Sufficiency** run *before* or *in parallel with* Cluster 2 design?
- **D9** — Does **Cluster 2 operationalize the Cross-Cluster Rule**, or run as a *second prototype*?

## Recommendation (one line)
**Resolve D5 first (sufficiency before Cluster 2 derivation); run Cluster 2 as a second prototype; let the
Cluster 1 sufficiency verdict drive how much — if at all — Cluster 2 exercises the Cross-Cluster Rule.**

---

## What the repository establishes

**Cross-Cluster Rule** — `artifacts/behavioral-derivation/cross-cluster-rule-proposal/cross-cluster-evidence-rule-draft-v1.md`:
- **Status:** *"Provisionally Validated — Cluster 1 Prototype… NOT operationalized across other clusters.
  Global validation requires successful application to additional clusters with **different
  phenomenological/developmental profiles**. Do not apply to other clusters until approved."*
- It fires **only** where a cluster's **direct (Tier 1) evidence is Limited/Insufficient** AND cross-cluster
  materially improves actionability: *"A Playbook with sufficient direct evidence does not get padded with
  borrowed behaviors."* Every **Tier 2** case **requires human approval** (first implementation).

**Portfolio Sufficiency** — `artifacts/intervention-development-standard/rlc-intervention-development-standard-v1.1.md`
(v1.1-D7): a formal gate with levels **Sufficient / Sufficient-with-Recognition / Partially / Insufficient**,
principle *"individual validity ≠ collective sufficiency,"* explicitly *"runs before Playbook translation."*

**Cluster 1 coverage audit** — `artifacts/intervention-coverage/cluster-1-intervention-coverage-analysis.md`:
*"plausible but incomplete… no DIRECT FIT for any C1 problem expression; the 41% core (self-worth
conclusion from outcomes; selection-organized self-evaluation) has no competency home at all… Returned for
human review before any development or Playbook work."*

> **Open-loop flag:** the Cluster 1 Playbook was built *despite* this "returned for review" verdict. So the
> Cluster 1 Portfolio Sufficiency determination is a genuinely **unresolved** loop, not a formality.

---

## D5 — Sufficiency *before* Cluster 2 (sequence, don't fully parallelize)

1. The Standard places sufficiency **before Playbook translation**; Cluster 2 should inherit that order.
2. Cluster 1's portfolio is already flagged **incomplete** (41% uncovered core) — its verdict is very likely
   *below* clean "Sufficient," which is a real finding to resolve.
3. Cluster 1 is the **reference implementation**; its sufficiency verdict is a **method-validation
   checkpoint** that should shape how Cluster 2 is derived.
4. The verdict is a **direct input to D9** (the rule only fires when direct evidence is insufficient).

**Allowed parallelism:** *scope* Cluster 2 (which cluster; the statement partition) while sufficiency runs —
but **freeze Cluster 2 derivation** until the verdict lands. Full parallel risks baking Cluster 1's gaps into
Cluster 2 before they're known.

## D9 — Second prototype, not rule-operationalization (contingent on D5)

1. You **cannot decide to operationalize** the rule up front — it only fires where direct evidence is thin,
   which is learned **during** derivation.
2. Making rule-validation the *objective* of Cluster 2 conflates *"can we build Cluster 2?"* with *"does the
   rule generalize?"* and risks using cross-cluster borrowing to **mask** direct-evidence gaps rather than
   validate a mechanism — acutely risky while Cluster 1's own portfolio is unresolved.
3. The rule needs a **different-profile** cluster to validate; a rule-first goal would distort *which*
   Cluster 2 is chosen.

**Therefore:** derive Cluster 2 from **primarily Tier 1 direct evidence**; invoke the Cross-Cluster Rule
**only** where Cluster 2's direct evidence is genuinely Limited/Insufficient, per-case with human approval —
so Cluster 2 can *opportunistically* exercise the rule where the evidence honestly calls for it, without the
cluster being staked on it.

---

## The coupling (the operative decision)
**Resolve D5 first; its outcome drives D9:**
- Cluster 1 lands **Insufficient / Partially** (likely) → keep the rule **provisional**; strengthen the
  **direct-evidence pipeline** before leaning on cross-cluster borrowing in Cluster 2.
- Cluster 1 lands **Sufficient / Sufficient-with-Recognition** → the method is validated; Cluster 2 may serve
  as the rule's **first genuine cross-cluster test** where its evidence is thin.

Global validation / operationalization of the rule remains a **separate milestone**, earned once a
different-profile cluster has actually exercised it.

## Proposed sequence
1. Run **Cluster 1 Portfolio Sufficiency** → formal verdict (closes the coverage-audit loop).
2. In parallel, **scope Cluster 2 only** (pick a deliberately *different* profile; partition its statements).
3. Read the verdict → decide D9: prototype-only vs prototype-with-opportunistic-rule-tests.
4. Derive Cluster 2 from Tier 1 evidence; invoke the rule per-case (human approval) only where warranted.
5. Operationalize/globally-validate the rule as its **own** milestone afterward.

---

*Sources cited above, verified against the working tree. No artifacts, pipelines, migrations, flags, or code
were modified by this memo.*
