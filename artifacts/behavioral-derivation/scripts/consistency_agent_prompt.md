# Step 3a — Global consistency reviewer (agent record)

Run in the agent runtime AFTER the derivation fan-out (02) and BEFORE the build (03). One reviewer
agent reads all `generated/enrichment/cluster_*_{behaviors,plays}.json` + `generated/behaviors.json`
+ `generated/bank.json` + `rulings/derivation-rulings-v1.md`, performs the judgment-level checks a
script cannot, and writes `generated/qa_agent.json`.

It reports six judgment categories (mechanical checks are handled by 03_build_derivation.py):
1. `same_behavior_diff_function` — duplicate/near-identical statements given materially different function or Maintaining_Role.
2. `inconsistent_alternatives` — the same behavior given contradictory adaptive alternatives in different places.
3. `generic_advice` — alternatives that are generic dating advice not traceable to the RLC task/competency (see the prohibited list in the rulings).
4. `unsupported_mechanisms` — functions/costs asserting a psychological motive not supported by the statement (should have been "Function unclear from available evidence").
5. `over_consolidated_plays` — Plays merging different behavioral targets / different adaptive responses (violating refinement 8).
6. `duplicative_plays_across_clusters` — near-identical Plays across clusters that should be noted as shared.

Output schema (`generated/qa_agent.json`): an object with those six keys (each an array of concrete
instances, empty if none) plus a `notes` string. Do NOT modify any derivation data — review only.
