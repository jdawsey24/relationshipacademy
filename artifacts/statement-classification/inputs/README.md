# Canonical inputs (pointer only — DO NOT copy or overwrite)

This artifact deliberately keeps **generated outputs** separate from the **canonical source of
truth**. Nothing is duplicated into this folder; the classification pipeline only *reads* the
canonical files below and never modifies them.

| Canonical input | Location (relative to repo root) | Used for |
|---|---|---|
| Experience Cluster workbook | `_import/RLC_Experience_Clusters.xlsx` → sheet **"Full Statement Mapping"** | The statement bank + approved **Primary Experience Cluster** + **RLC Phase** (preserved verbatim). |
| Cluster directory | `data/clusters.json` | The 27 Experience Cluster names/definitions (for context + Secondary_EC judgment). |

The workbook's other sheets (Cluster Framework, Relationship Playbooks, Assessment Structure,
Results, etc.) are the broader canonical architecture and are likewise authoritative.

**Rules:**
- The approved **Primary Experience Cluster** and **RLC Phase** in "Full Statement Mapping" are
  authoritative. The classification pipeline enriches (adds type, secondary, actionability, etc.)
  but never remaps Primary or Phase. Tension is recorded via `Review_Flag`, not by remapping.
- Do **not** edit the canonical source to resolve classification issues. Corrections belong in
  `../rulings/` and are re-applied by re-running the pipeline (see `../README.md`).
- If the canonical bank changes, re-run `../scripts/01_extract_bank.py` to refresh the frozen
  snapshot in `../generated/bank.json`, then re-run the rest of the pipeline.
