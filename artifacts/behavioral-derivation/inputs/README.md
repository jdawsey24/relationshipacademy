# Inputs (pointer only — read-only, never overwritten)

Script 2 consumes the output of Script 1 plus the canonical RLC framework tables. Nothing here is
authoritative on its own; these are the upstream sources.

| Input | Location | Used for |
|---|---|---|
| Script 1 classification | `../../statement-classification/generated/` (bank.json + enrichment/) | Selecting target behaviors (Self-Behavior + Behaviorally_Actionable) and their canonical Experience Cluster + RLC Phase. |
| RLC phases | `fw_phases` (Supabase) → snapshot `../generated/fw_phases.json` | Developmental task per phase. |
| RLC competencies | `fw_competencies` (Supabase) → snapshot `../generated/fw_competencies.json` | Mapping adaptive alternatives to an existing competency (only 4 phases covered — see README). |

**Rules:**
- Canonical Experience Cluster mappings, RLC phase assignments, developmental tasks, and competency
  definitions are FIXED. Script 2 enriches; it never changes them.
- Adaptive alternatives must trace to the RLC developmental task and, where possible, an existing
  competency. If no competency cleanly maps, that is stated (`Task-supported; no competency cleanly
  maps`) or marked a source gap — never invented.
- Do not edit the upstream sources to resolve a derivation issue; fix the rulings and re-run.
