#!/usr/bin/env python3
"""Step 1 of 3 — select the target behaviors for derivation from Script 1's classification output.

Target set = statements classified Statement_Type == "Self-Behavior" AND Behaviorally_Actionable == True.
Reads Script 1 (../../statement-classification/generated/): bank.json + enrichment/cluster_*.json.
Writes ../generated/behaviors.json, and copies bank.json + cluster_meta.json here for self-containment.

fw_phases.json + fw_competencies.json in ../generated/ are DB snapshots of the canonical `fw_phases`
and `fw_competencies` tables (Supabase). Refresh them from the DB if the RLC framework changes.
Run:  python3 scripts/01_extract_behaviors.py
"""
import json, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # artifacts/behavioral-derivation
S1   = os.path.join(os.path.dirname(ROOT), "statement-classification", "generated")
GEN  = os.path.join(ROOT, "generated"); os.makedirs(GEN, exist_ok=True)

bank = {b["sid"]: b for b in json.load(open(os.path.join(S1, "bank.json")))}
enr = {}
for fp in glob.glob(os.path.join(S1, "enrichment", "cluster_*.json")):
    for r in json.load(open(fp)): enr[r["sid"]] = r
beh = [{**bank[s], "secondary_ec": enr[s].get("secondary_ec")} for s in bank
       if enr[s]["statement_type"] == "Self-Behavior" and enr[s]["behaviorally_actionable"]]
json.dump(beh, open(os.path.join(GEN, "behaviors.json"), "w"), ensure_ascii=False, indent=0)
for f in ("bank.json", "cluster_meta.json"):
    json.dump(json.load(open(os.path.join(S1, f))), open(os.path.join(GEN, f), "w"), ensure_ascii=False, indent=0)
print(f"behaviors.json: {len(beh)} target behaviors (Self-Behavior + Behaviorally_Actionable)")
