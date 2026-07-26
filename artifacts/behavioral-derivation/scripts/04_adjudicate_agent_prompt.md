# Step 4 — Play-layer adjudication (agent record)

Run in the agent runtime AFTER the derivation build (03) and consistency pass. One agent formalizes
the APPROVED adjudication (`../rulings/adjudication-spec-v1.md`) into structured JSON:
`generated/adjudication/{adjudicated_behaviors.json, core_plays.json, applications.json, decision_log.json}`.

The spec is authoritative and pre-decided (Core Play Library CP-01..CP-20, the CP→cluster→behavior
application mapping, the splits, the mechanism fixes, the STM-0449 generic-advice fix, competency
normalizations, zero-Play clusters 13 & 25). The agent formalizes it — it does NOT re-adjudicate or
invent plays/competencies. Output is validated by 05_build_adjudicated.py (competencies checked
exactly against fw_competencies; Insufficient-Evidence never used as behavioral evidence; controlled
vocab for Play_Function + Evidence_Status; clusters 13/25 empty).
