#!/usr/bin/env python3
"""Convert the RLC source workbooks (in _import/) into normalized JSON for the
Studio importer (scripts/import-studio.ts). Reads git-ignored IP; writes
git-ignored JSON to _import/json/. Idempotent — safe to re-run.

Usage:  python3 scripts/xlsx-to-json.py
"""
import json, os, re, sys
import openpyxl

ROOT = os.path.join(os.path.dirname(__file__), "..", "_import")
KB = os.path.join(ROOT, "RLC_Master_Knowledge_Base_v2.1.xlsx")
ASM = os.path.join(ROOT, "RLC_Assessment_Master_v1_FINAL.xlsx")
OUT = os.path.join(ROOT, "json")

DOMAIN_SLUG = {
    "Communication": "communication",
    "Trust": "trust",
    "Emotional Intimacy": "emotional_intimacy",
    "Conflict Management": "conflict_management",
    "Role Functioning": "role_functioning",   # canonical (workbook name)
    "Relational Functioning": "role_functioning",
    "Physical Intimacy": "physical_intimacy",
}
def phase_slug(v): return (str(v).strip().lower() if v else None)


def sheet_rows(path, name):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb[name]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    hdr = [str(c).strip() if c is not None else "" for c in rows[0]]
    out = []
    for r in rows[1:]:
        d = {hdr[i]: r[i] for i in range(len(hdr))}
        out.append(d)
    return hdr, out


def s(v):
    if v is None:
        return None
    v = str(v).strip()
    return v or None


def splitlist(v):
    if v is None:
        return []
    parts = re.split(r"[|;\n]", str(v))
    return [p.strip() for p in parts if p and p.strip()]


def yes(v):
    return str(v).strip().lower() in ("yes", "true", "y", "1")


def write(name, data):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=1, default=str)
    print(f"  wrote {name}: {len(data)} rows")


def main():
    for p in (KB, ASM):
        if not os.path.exists(p):
            print(f"MISSING: {p}", file=sys.stderr); sys.exit(1)

    # --- competency map (id -> phase/domain/name/task) from 04_Competencies ---
    _, comp04 = sheet_rows(KB, "04_Competencies")
    cmap = {}
    for r in comp04:
        cid = s(r.get("Competency ID"))
        if not cid:
            continue
        cmap[cid] = {
            "phase": phase_slug(r.get("Phase")),
            "domain": DOMAIN_SLUG.get(s(r.get("Domain")) or "", None),
            "name": s(r.get("Competency")),
            "task": s(r.get("Developmental Task")),
            "source_ref": " — ".join([x for x in [s(r.get("Source Document")), s(r.get("Source Chapter"))] if x]),
        }

    # --- rich detail from 22_Competency_Details ---
    _, det = sheet_rows(KB, "22_Competency_Details")
    detmap = {}
    for r in det:
        cid = s(r.get("Competency ID"))
        if cid:
            detmap[cid] = {k: (str(v).strip() if v is not None else None) for k, v in r.items()}

    # --- kb_competencies: domains + phases + 111 competencies ---
    kb = []
    _, dom = sheet_rows(KB, "21_Domain_Details")
    for r in dom:
        did = s(r.get("Domain ID"))
        if not did:
            continue
        kb.append({
            "code": did, "kind": "domain",
            "domain_slug": DOMAIN_SLUG.get(s(r.get("Domain Name")) or "", None),
            "name": s(r.get("Domain Name")),
            "definition": s(r.get("Definition")),
            "purpose": s(r.get("Purpose")),
            "audiences": ["consumer", "academy", "institute"],
            "status": "active",
            "detail": {k: (str(v).strip() if v is not None else None) for k, v in r.items()},
            "sort_order": 100,
        })
    # phases: 4 from workbook + recovery/renewal from the public framework
    PHASES = [
        ("PHASE-EXPLORATION", "exploration", "Exploration", "Discernment"),
        ("PHASE-EXCLUSIVITY", "exclusivity", "Exclusivity", "Intentional Investment"),
        ("PHASE-EXPANSION", "expansion", "Expansion", "Integration"),
        ("PHASE-EXPIRATION", "expiration", "Expiration", "Acceptance"),
        ("PHASE-RECOVERY", "recovery", "Recovery", "Healing"),
        ("PHASE-RENEWAL", "renewal", "Renewal", "Reengagement"),
    ]
    for i, (code, slug, name, task) in enumerate(PHASES):
        kb.append({"code": code, "kind": "phase", "phase_slug": slug, "name": name,
                   "developmental_task": task, "audiences": ["consumer", "academy", "institute"],
                   "status": "active", "sort_order": 10 + i})
    for cid, c in cmap.items():
        d = detmap.get(cid, {})
        kb.append({
            "code": cid, "kind": "competency",
            "phase_slug": c["phase"], "domain_slug": c["domain"],
            "name": c["name"], "developmental_task": c["task"],
            "definition": d.get("Definition"), "purpose": d.get("Purpose"),
            "healthy_markers": splitlist(d.get("Observable Expressions")),
            "common_challenges": splitlist(d.get("Common Developmental Barriers")),
            "growth_indicators": splitlist(d.get("Common Developmental Enhancements")),
            "audiences": ["consumer", "academy", "institute"],
            "status": "active", "source_ref": c["source_ref"] or None,
            "notes": d.get("Operational Notes"),
            "detail": d, "sort_order": 200,
        })
    write("kb_competencies.json", kb)

    # --- item bank (04A_Item_Bank_Behavioral) ---
    _, items = sheet_rows(ASM, "04A_Item_Bank_Behavioral")
    out = []
    for r in items:
        iid = s(r.get("Item ID"))
        if not iid:
            continue
        cid = s(r.get("Competency ID"))
        c = cmap.get(cid or "", {})
        rev = yes(r.get("Reverse Scored"))
        out.append({
            "item_id": iid, "competency_id": cid, "competency": s(r.get("Competency")) or c.get("name"),
            "domain": c.get("domain"), "phase": c.get("phase"),
            "behavior_id": s(r.get("Behavior ID")), "behavioral_indicator": s(r.get("Behavioral Indicator")),
            "item_family": s(r.get("Item Family")), "item_type": s(r.get("Item Type")),
            "candidate_number": s(r.get("Candidate Number")), "item_text": s(r.get("Item Text")),
            "response_model": s(r.get("Response Model")), "reverse_scored": rev,
            "evidence_strength": s(r.get("Evidence Strength")), "face_validity_notes": s(r.get("Face Validity Notes")),
            "audience": "consumer", "scoring_direction": "reverse" if rev else "forward",
            "status": "draft",
        })
    write("assessment_items.json", out)

    # --- assessments (01) ---
    _, inv = sheet_rows(ASM, "01_Assessment_Inventory")
    out = []
    for r in inv:
        aid = s(r.get("Assessment ID"))
        if not aid:
            continue
        out.append({
            "assessment_id": aid, "name": s(r.get("Assessment Name")), "audience": s(r.get("Audience")),
            "purpose": s(r.get("Purpose")), "delivery_mode": s(r.get("Delivery Mode")),
            "estimated_items": s(r.get("Estimated Items")), "estimated_time": s(r.get("Estimated Time")),
            "primary_outputs": s(r.get("Primary Outputs")), "scoring_level": s(r.get("Scoring Level")),
            "current_stage": s(r.get("Current Stage")), "launch_priority": s(r.get("Launch Priority")),
            "requires_partner_data": s(r.get("Requires Partner Data")),
            "requires_clinician_data": s(r.get("Requires Clinician Data")),
            "notes": s(r.get("Notes")), "status": "draft",
        })
    write("assessments.json", out)

    # --- response models (05) ---
    _, rm = sheet_rows(ASM, "05_Response_Models")
    out = []
    for r in rm:
        rid = s(r.get("Response Model ID"))
        if not rid:
            continue
        out.append({
            "response_model_id": rid, "name": s(r.get("Response Model Name")), "use_case": s(r.get("Use Case")),
            "response_options": splitlist(r.get("Response Options")), "numeric_coding": splitlist(r.get("Numeric Coding")),
            "scoring_direction": s(r.get("Scoring Direction")), "missing_handling": s(r.get("Missing Response Handling")),
            "consumer_labeling": s(r.get("Consumer Labeling")), "professional_notes": s(r.get("Professional Notes")),
            "status": "draft",
        })
    write("response_models.json", out)

    # --- scoring rules (06) ---
    _, sr = sheet_rows(ASM, "06_Scoring_Rules")
    out = []
    for r in sr:
        rid = s(r.get("Scoring Rule ID"))
        if not rid:
            continue
        out.append({
            "scoring_rule_id": rid, "assessment_id": s(r.get("Assessment ID")), "score_name": s(r.get("Score Name")),
            "score_type": s(r.get("Score Type")), "level": s(r.get("Level")), "input_entity": s(r.get("Input Entity")),
            "input_ids": s(r.get("Input IDs")), "formula_logic": s(r.get("Formula / Logic")),
            "min_valid_responses": s(r.get("Minimum Valid Responses")), "missing_data_rule": s(r.get("Missing Data Rule")),
            "direction": s(r.get("Direction")), "display_to_consumer": s(r.get("Display to Consumer")),
            "validation_status": s(r.get("Validation Status")), "cut_points_status": s(r.get("Cut Points Status")),
            "cut_points": [], "version": s(r.get("Version")), "notes": s(r.get("Operational Notes")), "status": "draft",
        })
    write("scoring_rules.json", out)

    # --- interpretation rules (07) ---
    _, ir = sheet_rows(ASM, "07_Interpretation_Rules")
    out = []
    for r in ir:
        rid = s(r.get("Interpretation Rule ID"))
        if not rid:
            continue
        out.append({
            "interpretation_rule_id": rid, "assessment_id": s(r.get("Assessment ID")), "rule_name": s(r.get("Rule Name")),
            "trigger_type": s(r.get("Trigger Type")), "trigger_inputs": s(r.get("Trigger Inputs")),
            "rule_logic": s(r.get("Rule Logic")), "interpretation_category": s(r.get("Interpretation Category")),
            "consumer_interpretation": s(r.get("Consumer Interpretation")),
            "professional_interpretation": s(r.get("Professional Interpretation")), "priority": s(r.get("Priority")),
            "suppression_conditions": s(r.get("Suppression Conditions")), "safety_escalation": s(r.get("Safety Escalation")),
            "validation_status": s(r.get("Validation Status")), "notes": s(r.get("Operational Notes")), "status": "draft",
        })
    write("interpretation_rules.json", out)

    # --- results templates (09) ---
    _, rt = sheet_rows(ASM, "09_Results_Templates")
    out = []
    for r in rt:
        rid = s(r.get("Template Section ID"))
        if not rid:
            continue
        try:
            order = int(r.get("Section Order")) if r.get("Section Order") is not None else None
        except (ValueError, TypeError):
            order = None
        out.append({
            "template_section_id": rid, "assessment_id": s(r.get("Assessment ID")), "section_order": order,
            "section_name": s(r.get("Section Name")), "audience": s(r.get("Audience")),
            "display_condition": s(r.get("Display Condition")), "required_inputs": s(r.get("Required Inputs")),
            "consumer_heading": s(r.get("Consumer Heading")), "consumer_copy_template": s(r.get("Consumer Copy Template")),
            "professional_notes": s(r.get("Professional Notes")), "cta": s(r.get("CTA / Next Action")),
            "notes": s(r.get("Operational Notes")), "status": "draft",
        })
    write("results_templates.json", out)

    # --- recommendation mappings (08 + KB 16) ---
    out = []
    _, m8 = sheet_rows(ASM, "08_Recommendation_Mappings")
    for r in m8:
        mid = s(r.get("Mapping ID"))
        if not mid:
            continue
        out.append({
            "mapping_id": mid, "assessment_id": s(r.get("Assessment ID")), "trigger_type": s(r.get("Trigger Type")),
            "trigger_value": s(r.get("Trigger ID / Value")), "structural_context": s(r.get("Structural Context")),
            "phase_context": s(r.get("Phase Context")), "priority": s(r.get("Priority")),
            "recommendation_type": s(r.get("Recommendation Type")), "recommendation_id": s(r.get("Recommendation ID")),
            "recommendation_name": s(r.get("Recommendation Name")), "consumer_rationale": s(r.get("Consumer Rationale")),
            "professional_rationale": s(r.get("Professional Rationale")), "status": "draft",
        })
    _, m16 = sheet_rows(KB, "16_Recommendation_Rules")
    for r in m16:
        rid = s(r.get("Rule ID"))
        if not rid:
            continue
        out.append({
            "mapping_id": rid, "competency_id": s(r.get("Competency ID")), "trigger_type": s(r.get("Trigger Type")),
            "trigger_value": s(r.get("Trigger Value")), "recommendation_type": s(r.get("Recommendation Type")),
            "recommendation_id": s(r.get("Recommendation ID")), "priority": s(r.get("Priority")),
            "audience": s(r.get("Audience")), "trigger_metric": s(r.get("Trigger Metric")),
            "trigger_comparator": s(r.get("Trigger Comparator")), "trigger_threshold": s(r.get("Trigger Threshold")),
            "suppression_logic": s(r.get("Suppression Logic")), "escalation_logic": s(r.get("Escalation Logic")),
            "structural_context": s(r.get("Structural Context Precondition")), "phase_context": s(r.get("Phase Context")),
            "status": "draft",
        })
    write("recommendation_mappings.json", out)

    # --- lookups (KB 02 + ASM 11) ---
    seen = set(); out = []
    _, l2 = sheet_rows(KB, "02_Lookups")
    for i, r in enumerate(l2):
        cat, val = s(r.get("Category")), s(r.get("Value"))
        if cat and val and (cat, val) not in seen:
            seen.add((cat, val)); out.append({"category": cat, "value": val, "code": None, "sort_order": i})
    _, l11 = sheet_rows(ASM, "11_Lookups")
    for i, r in enumerate(l11):
        cat, val = s(r.get("Category")), s(r.get("Value"))
        if cat and val and (cat, val) not in seen:
            seen.add((cat, val)); out.append({"category": cat, "value": val, "code": s(r.get("Code")), "sort_order": 1000 + i})
    write("lookups.json", out)

    print("Done.")


if __name__ == "__main__":
    main()
