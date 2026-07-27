# Cluster 1 Intervention Coverage Analysis

A **coverage audit** (not intervention generation): does the existing RLC intervention/practice
knowledge base adequately support the developmental shifts Cluster 1 (Difficulty Feeling Chosen)
requires under Exploration → Discernment?

- `cluster-1-intervention-coverage-analysis.md` — the full 10-deliverable analysis (READ THIS).
- `generated/` — reproducible extraction:
  - `c1_statements.json` — the 101 Cluster 1 statements + Script-1 classification.
  - `pe_assignment.json` — every statement → problem expression (verified 101/101 partition); `assign_pe.py`.
  - `kb_defs.json` — canonical definitions (`kb_competencies`) for the 20 Discernment-relevant competencies.
  - `interventions.json` / `practices.json` — full content (not titles) for those 20 competencies.

**Headline:** the library has full breadth (3 interventions + 3 practices per competency) but they are
uniform templates with the competency name interpolated (Theory-Derived, In Development, draft). No DIRECT
FIT for any C1 problem expression; the cluster's 41% core (self-worth conclusion from outcomes; selection-
organized self-evaluation) has no competency home at all. Pathway to target = **plausible but incomplete**.
Returned for human review before any development or Playbook work.
