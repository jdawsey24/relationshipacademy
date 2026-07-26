# Play-Layer Adjudication Spec (AUTHORITATIVE — formalize exactly this)

You are formalizing an APPROVED adjudication of the Play layer into source-of-truth data. The
per-behavior derivations already exist (out2/cluster_*_behaviors.json) — do NOT regenerate them;
only apply the small mechanism fixes listed. The Core Play Library + Application mapping BELOW are
decided — your job is to formalize them into clean JSON, write the 5th-grade cluster framings,
validate competencies, assign evidence status, and build the decision log. Reading level = 5th grade
for all prose; canonical labels unchanged. Competencies must be REAL (from fw_competencies.json) or
`Task-supported; no competency cleanly maps` or `None available (source gap)`; never invent.

## MECHANISM FIXES (refinement 2 — rewrite behaviorally, remove inferred motive)
Apply to out2 behaviors (adjudicated copy) AND wherever the phrase appears in Play framings:
- STM-0052, STM-0782 (c3): the alternative says "name the fear behind it / driving it." Rewrite →
  "name what is making you want to pull away, and whether any reason is a real dealbreaker or just a way to make distance." (No "fear" as presupposed motive.)
- Play "Wait and watch before you leave first" (c3): same fix in its new_play.
- STM-0655/0661 & the "Decide by fit, not by fear" framing (c3): rewrite "staying out of fear" →
  "staying even though part of you knows it isn't good for you" (0661 states this; 0655 states "didn't want to be alone" — keep only what's stated).
- STM-0357 (c16) short_term_function: rewrite "helps you feel like you are watching for danger instead of sitting with not knowing" → "Searching keeps you doing something instead of waiting for their actions to show over time." (behavioral)
- STM-0449 (c14): its alternative was generic "just be honest." Replace with the canonical protocol
  (CP-06): "Pick one true thing and say it to a safe person. Watch how they take it." (conditional + observation). Same for the c14 keep-the-peace Play framing.

## CONTROLLED VOCAB
- Play_Function (1+): Interrupt | Replace | Increase | Preserve | Observe | Clarify | Decide
- Evidence_Status (exactly one per Application): Strongly Supported | Supported with Context Conditions | Task-Supported / Competency Gap | Requires Human Adjudication | Reject
  Guidance: multi-behavior + real competency + no context caveat → Strongly Supported. Context-Dependent behaviors / conditional protocol → Supported with Context Conditions. Recovery/Renewal/Cross-Phase or `no competency cleanly maps` → Task-Supported / Competency Gap. Single borderline / retrospective / self-flagged source → Requires Human Adjudication. Use Reject only if the behavioral evidence does not actually support a change-play.

## CORE PLAY LIBRARY (decided) — write Core_Play_Name_Internal (behavioral, not marketing), Behavioral_Target, Play_Function, a one-line canonical protocol, Relevant_Developmental_Task(s), and Supporting_RLC_Competency (real or gap). Assign Core_Play_ID exactly as given.
- CP-01 Pace effort to observed reciprocity (hold initiation/pursuit/giving; observe reciprocity; match) — Observe, Decide
- CP-02 Don't dismiss available people before checking — Observe, Decide
- CP-03 Check a worry before deciding — Observe, Clarify, Decide
- CP-04 Set a see-by date, then decide — Decide, Observe
- CP-05 Name what actually happened before explaining it away — Interrupt, Clarify
- CP-06 Graduated self-disclosure with observation (share one true thing with a safe person, watch) — Replace, Increase, Observe
- CP-07 Wait and watch before leaving first — Interrupt, Observe, Decide
- CP-08 Ask directly instead of testing — Replace, Clarify, Observe
- CP-09 Get a real answer instead of checking; observe real actions over time — Interrupt, Clarify, Observe
- CP-10 Pause before reopening an old hurt; name if there is a real issue — Interrupt, Clarify
- CP-11 Time-box a grief/rumination checking urge — Interrupt, Observe  [Recovery — competency gap]
- CP-12 Do your part and leave room for their share / shared initiation — Preserve, Observe, Clarify
- CP-13 Name a hard thing instead of avoiding it — Replace, Clarify
- CP-14 Say no and ask for what you need directly — Increase, Clarify
- CP-15 Save "sorry" for real faults (reduce over-apologizing) — Interrupt, Decrease→use Interrupt
- CP-16 Take a small step before feeling fully sure — Decide
- CP-17 Let real differences count — Clarify, Decide
- CP-18 Choose dating breaks on purpose — Decide, Observe
- CP-19 Let things unfold instead of managing ahead — Preserve, Observe
- CP-20 Decide by fit, not by staying to avoid ending — Observe, Decide

## APPLICATION MAPPING (decided) — one Application per (Core_Play, cluster). behavioral_source_ids given; keep each behavior's canonical cluster/phase; write a 5th-grade cluster_framing (the new_play in that cluster's context, reusing existing Play text where good). Contextual_source_ids = Insufficient-Evidence sids describing the same area (never behavioral).
CP-01: c2[0881]; c4[0289]; c5[0042,0395]; c15[0532,0533,0538]
CP-02: c5[0396]
CP-03: c5[0037,0553,0554]
CP-04: c5[0039,0556]; c11[0689]; c14[0318]; c24[1039]
CP-05: c11[0695]
CP-06: c1[0262]; c3[0050,0051,0055,0307,0779,0988,0989]; c8[1010]; c14[0448,0449]; c17[0819]; c23[0985]; c27[1085]
CP-07: c3[0052,0314,0782]
CP-08: c3[0660,0780]; c6[1054]
CP-09: c6[0273,0420]; c16[0357,0358]
CP-10: c16[0364,0614]
CP-11: c12[0230]; c20[0751]
CP-12: c7[0078]; c10[0595]; c14[0317,0321]; c15[0212,0456]
CP-13: c7[0076,0700,0704]; c14[0446]; c15[0464]
CP-14: c14[0444,0319,0450]
CP-15: c14[0447]
CP-16: c23[0963,0966]
CP-17: c21[0511]
CP-18: c1[0177]
CP-19: c22[0949,0953]
CP-20: c3[0655,0661]

## ZERO-PLAY CLUSTERS: 13 and 25 have NO application (behavioral evidence insufficient). Do not manufacture any. Record them in the decision log as intentionally empty.

## COMPETENCY per application: use the competency already assigned to those behaviors in out2 IF it is real and phase-correct; where the SAME behavior got different competencies across clusters (e.g., STM-0055 vs STM-1085), NORMALIZE to Emotional Intimacy → Gradual Self-Disclosure (the disclosure protocol). For CP-13 "avoid hard conversation" normalize to Communication → Conflict Navigation where the phase has competencies; Cross-Phase applications = `Task-supported; no competency cleanly maps`. Never invent.

## OUTPUT FILES (write to <base>/adj/)
1. adjudicated_behaviors.json — array of the 81 behavior objects (copy from out2 by sid; apply the mechanism fixes above; keep all fields). One object per sid.
2. core_plays.json — array: {core_play_id, core_play_name_internal, behavioral_target, play_function:[...], canonical_protocol, developmental_tasks:[...], supporting_competency, notes}
3. applications.json — array: {application_id (e.g. APP-CP01-c5), core_play_id, experience_cluster (int), rlc_phase, cluster_framing, play_function:[...], behavioral_source_ids:[...], contextual_source_ids:[...], supporting_competency, evidence_status, context_limitations, confidence, review_flag(bool), review_reason}
4. decision_log.json — array: {change_type (one of: Consolidation|Split|Rejection|Competency-Remap|Mechanism-Removal|Normalization|Zero-Play-Preserved|Generic-Advice-Fix), target, description} — one entry per substantive change (every split, every mechanism fix, the 0449 fix, every duplicate-family normalization, competency normalizations, zero-play preservations).
Re-read each file to confirm it parses. Return a short summary (counts: core plays, applications, decision-log entries, evidence-status distribution).
