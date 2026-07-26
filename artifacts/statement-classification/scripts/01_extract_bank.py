#!/usr/bin/env python3
"""Step 1 of 3 — extract the statement bank + cluster directory from the CANONICAL source.

Reads (read-only, NEVER modified):
  <repo>/_import/RLC_Experience_Clusters.xlsx  -> sheet "Full Statement Mapping"  (statements + canonical Primary_EC + RLC Phase)
  <repo>/data/clusters.json                    -> the 27 Experience Cluster names/definitions
Writes (generated snapshots — safe to regenerate):
  ../generated/bank.json          (frozen input: sid, statement, primary_ec, phase, source_section, track)
  ../generated/cluster_meta.json  (id -> name/core_challenge/description)

Statement_ID = STM-#### = the statement's 1-based row in the "Full Statement Mapping" sheet.
Run:  python3 scripts/01_extract_bank.py
"""
import openpyxl, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # artifacts/statement-classification
REPO = os.path.dirname(os.path.dirname(ROOT))                        # repo root
SRC  = os.path.join(REPO, "_import", "RLC_Experience_Clusters.xlsx")  # CANONICAL — read only
CLUSTERS_JSON = os.path.join(REPO, "data", "clusters.json")
GEN  = os.path.join(ROOT, "generated"); os.makedirs(GEN, exist_ok=True)

wb = openpyxl.load_workbook(SRC, data_only=True)
ws = wb["Full Statement Mapping"]
rows = list(ws.iter_rows(values_only=True))
# cols: Statement | Source Section | RLC Phase (assigned) | Reassigned? | Cluster # | Cluster Name | Assessment Track
data = []
for i, r in enumerate(rows[1:], start=1):
    stmt, src, phase, _reassigned, cnum, _cname, track = (list(r) + [None] * 7)[:7]
    if stmt is None or str(stmt).strip() == "":
        continue
    data.append({"sid": f"STM-{i:04d}", "statement": str(stmt).strip(),
                 "primary_ec": cnum, "phase": phase, "source_section": src, "track": track})
json.dump(data, open(os.path.join(GEN, "bank.json"), "w"), ensure_ascii=False, indent=0)

c = json.load(open(CLUSTERS_JSON))
arr = c if isinstance(c, list) else c.get("clusters", list(c.values()))
meta = {str(x["id"]): {"name": x["name"], "core_challenge": x.get("core_challenge", ""),
                       "description": x.get("description", "")} for x in arr}
json.dump(meta, open(os.path.join(GEN, "cluster_meta.json"), "w"), ensure_ascii=False, indent=0)
print(f"bank.json: {len(data)} statements | cluster_meta.json: {len(meta)} clusters")
