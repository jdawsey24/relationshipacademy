#!/usr/bin/env python3
"""Re-pull data/quiz_items.json from the authoritative statement bank
(_import/RLC_Experience_Clusters.xlsx -> 'Full Statement Mapping'). The current
519-item file diverged from the bank and truncated some cluster pools (e.g.
cluster 16: 19 vs the real 30), which is what caused the no-repeat shortfall.

Cluster 24 is context-split (pre_definition / post_definition), a curation that
does NOT exist in the xlsx — so cluster 24 rows are carried forward verbatim from
the current data/quiz_items.json. Every other cluster is taken from the bank.
"""
import json, collections, openpyxl
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
xlsx = ROOT / "_import" / "RLC_Experience_Clusters.xlsx"
out = ROOT / "data" / "quiz_items.json"

wb = openpyxl.load_workbook(xlsx, data_only=True)
rows = list(wb["Full Statement Mapping"].iter_rows(min_row=2, values_only=True))
# Statement, Source, Phase, Reassigned, Cluster #, Cluster Name, Track
bank = collections.defaultdict(list)
seen = set()
for r in rows:
    st, cnum = r[0], r[4]
    if not st or cnum is None:
        continue
    try:
        cid = int(str(cnum).strip().lstrip("#"))
    except ValueError:
        continue
    st = str(st).strip()
    key = (cid, st)
    if key in seen:
        continue
    seen.add(key)
    bank[cid].append(st)

# Carry forward cluster 24 (context-split, not in the xlsx).
current = json.loads(out.read_text())
c24 = [i for i in current if i["cluster_id"] == 24]

result = []
for cid in sorted(bank):
    if cid == 24:
        continue  # replaced by carried-forward context rows below
    for st in bank[cid]:
        result.append({"cluster_id": cid, "statement": st, "context": None})
# append cluster 24 verbatim (already has context)
for i in c24:
    result.append({"cluster_id": 24, "statement": i["statement"], "context": i.get("context")})

out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
counts = collections.Counter(i["cluster_id"] for i in result)
print(f"wrote {len(result)} items across {len(counts)} clusters")
print(f"  cluster 16: {counts[16]}  cluster 20: {counts[20]}  cluster 23: {counts[23]}")
print(f"  cluster 24 (carried, context-split): {counts[24]}")
