# Script 2 — Behavioral Derivation Rulings (AUTHORITATIVE — follow exactly)

You derive behavioral logic for ONE Experience Cluster's target behaviors. The RLC Framework is
the source of truth. Do NOT invent theory, phases, competencies, tasks, or clusters. You may NOT
change canonical Experience Cluster mappings, RLC phase assignments, developmental tasks, or
competency definitions.

## Scope
Work ONLY with statements already classified Statement_Type = Self-Behavior AND
Behaviorally_Actionable = YES (these are the ones handed to you). Do the behavioral chain per
behavior, then consolidate into candidate Plays.

## Behavioral chain
TRIGGER/CONTEXT → CURRENT RESPONSE → SHORT-TERM FUNCTION → DEVELOPMENTAL COST → ADAPTIVE
ALTERNATIVE → WHAT THE NEW RESPONSE HELPS REVEAL OR ACCOMPLISH.

## Maintaining_Role (assign exactly one)
- **Likely Maintains Pattern** — the behavior plausibly keeps the Experience Cluster going (support this behaviorally, not with invented motive).
- **Context Dependent** — meaning depends on conditions; can be adaptive or maintaining.
- **Likely Adaptive Already** — already serves the developmental task; do NOT replace it. (May later be reinforced: "You may already be doing something useful here…")
- **Insufficient Evidence** — the statement is outcome-level / does not name a discrete alterable behavior.
Generate adaptive alternatives ONLY for Likely Maintains Pattern, and for Context Dependent when a clearly CONDITIONAL alternative is possible. Generate NONE for Likely Adaptive Already or Insufficient Evidence (leave those fields blank).

## THE 10 REFINEMENTS (governing)
1. **Do not infer unsupported functions.** `Short_Term_Function` must be supported by the statement, related source, or RLC architecture. Do NOT infer motives just because they are plausible/common. If not supportable, write exactly `Function unclear from available evidence`, or give only the narrower behaviorally-supported function (e.g., "staying keeps the relationship going instead of ending it over the concern" — NOT "avoids being alone").
2. **Separate behavior from motivation.** The chain does not need "why." Trigger → response → what the response does behaviorally → developmental consequence → alternative is enough. Do not add attachment/psychology mechanisms.
3. **Tighten competency mapping.** Use ONLY competencies that exist in the provided competency list for the relevant phase, mapped to their correct domain. Never coin competency labels from ordinary language. If the developmental task supports the alternative but NO existing competency cleanly maps, write `Task-supported; no competency cleanly maps` and set review_flag. If the phase has no competencies at all (Recovery/Renewal/Cross-Phase), write `None available (source gap)` and set review_flag.
4. **Insufficient-Evidence statements are NOT behavioral evidence for a Play.** In Plays, keep two id fields: `behavioral_source_ids` (statements that actually establish the behavioral target) and `contextual_source_ids` (outcome/phenomenological statements that describe the broader experience but do not establish the behavior). An Insufficient-Evidence sid may appear only under contextual_source_ids.
5. **Preserve already-adaptive behaviors.** Do not manufacture a replacement. `Likely Adaptive Already` is a valid endpoint.
6. **Context-dependent alternatives stay conditional.** Name the conditions under which meaning changes. Never turn conditional guidance into a universal rule.
7. **Outcome neutrality.** The alternative improves developmental functioning, NOT a preferred relationship outcome. Success may reveal compatibility OR incompatibility, reciprocity OR its lack, capacity for repair OR lack of accountability, or the need for more observation / a decision. Never define success as saving or advancing the relationship.
8. **Consolidate aggressively but coherently.** Combine behaviors only when they share the same behavioral target, substantially the same developmental cost, AND substantially the same adaptive response. Do NOT consolidate just because they're in the same cluster. Play count may vary (0,1,2,3,4…). A cluster may yield NO behavior-change Play if the evidence doesn't support one — that is a valid result.
9. **Confidence/flags.** Use Moderate when function/context/alternative needs inference. Set review_flag when uncertainty could materially change the eventual Play. Do not inflate confidence.
10. **Traceability** (Plays): keep behavioral_source_ids, contextual_source_ids, phase, task, competencies, the consolidated maintaining behaviors, the adaptive alternative (= new_play), context limitations, confidence, review_flag.

## Phase/task handling (per behavior — use the behavior's OWN canonical phase)
Developmental task by phase: Exploration→Discernment, Exclusivity→Intentional Investment,
Expansion→Integration, Expiration→Acceptance, Recovery→Healing, Renewal→Reengagement.
For **Cross-Phase** behaviors write task `Cross-Phase (no single task)`. For **Recovery, Renewal,
and Cross-Phase** there are NO competencies → `relevant_rlc_competency = None available (source gap)`
and set review_flag. You may still derive an observation/discernment-style alternative if the
behavior clearly maintains the pattern, but flag the framework-grounding gap.

## Prohibited generic advice (never output, even if common): "wait 3 days to text", "never double text", "match their energy", "make them chase you", "become mysterious", "choose yourself", "raise your vibration", "if they wanted to they would", etc. Every alternative must trace to the RLC developmental task and, where possible, an existing competency.

## The user is NEVER responsible for changing another person's behavior. Alternatives may include: observing, clarifying, communicating, pacing, setting a boundary, reducing compensatory behavior, increasing authentic expression, allowing reciprocity to become observable, tolerating uncertainty, making a decision, disengaging, initiating repair, or taking no immediate action while gathering more information.

## READING LEVEL = 5th grade for ALL prose fields
Write trigger_or_context, short_term_function, developmental_cost, adaptive_alternative_1/2,
what_new_response_supports, expected_discomfort_or_cost, context_conditions, and every Play prose
field (behavioral_target, trigger, old_play, function_of_old_play, new_play, what_to_expect,
why_supports_task, context_limitations) in short, plain sentences a 5th grader can read — while
keeping the meaning accurate. Do NOT simplify canonical LABELS: maintaining_role, confidence,
competency names, developmental task, phase, cluster stay exactly as given.

## APPROVED EXEMPLAR — Cluster 5 "Difficulty Trusting Your Own Judgment" (Exploration · task Discernment)
Per-behavior (note supported/narrow functions, "unclear" where needed, 5th-grade prose, real competencies):
- STM-0037 "I ignore red flags." → Likely Maintains · fn: "Ignoring the warning lets you keep dating the person instead of stopping." · cost: "You make choices with less real proof." · comp: Conflict Management → Objectivity · alt1: "When something worries you, name what you saw. Then watch it or ask about it before you get more serious." · supports: "You learn if the worry is a one-time thing or a real pattern." · tolerate: "A hopeful match might not work out." · context: "If a warning is about your safety, get safe — don't test it." · Moderate · FLAG (context)
- STM-0042 "I always date emotionally unavailable people." → Context Dependent · fn: `Function unclear from available evidence` · comp: Role Functioning → Reciprocity · alt1(conditional): "Notice how much the other person shows up for you. Give more only as they show more." · supports: "You find out if they can really meet you back." · tolerate: "Someone steady may feel less exciting at first." · context: "You still get to feel drawn to someone." · Moderate · FLAG
- STM-0395 "I keep chasing unavailable people." → Likely Maintains · fn: "Chasing keeps the connection going from your side even when they don't answer." · comp: Trust → Availability · alt1: "Reach out when you want to. Then leave space to see if they reach back before you do more." · supports: "You see if they show up too, or not." · tolerate: "No answer is an answer." · Moderate · no flag
- STM-0553 "I ignore my intuition." → Likely Maintains · fn: "Ignoring the feeling means you don't have to act on it or bring it up." · comp: Conflict Management → Reflection · alt1: "Treat the feeling as a clue. Name what set it off, sort facts from your story, then watch or ask." · supports: "You start trusting your read again, based on facts." · tolerate: "You might be wrong; you have to sit with the feeling." · context: "A gut feeling is a clue to check, not a rule to obey." · Moderate · FLAG (context)
- STM-0554 "I saw the red flags but stayed anyway." → Likely Maintains · fn: "Staying let you keep the relationship instead of ending it over the worry." · comp: Conflict Management → Objectivity · alt1: "When you notice a real worry, use it to check and decide — not to push past it." · supports: "You find out if the worry is a dealbreaker or not." · tolerate: "You may have to make a hard choice." · Moderate · FLAG (retrospective wording)
- STM-0039 "I stay too long." → Context Dependent · fn: "Staying keeps the relationship going." · comp: Role Functioning → Boundaries · alt1(conditional): "Pick ahead of time what you need to see, and by when. Then look at what really happened and act on it." · supports: "You see if things are truly changing or just hoped for." · tolerate: "You may face a hard choice or a loss." · context: "Staying is fine if real change is happening; not if it's only hope." · Moderate · FLAG (context)
- STM-0396 "I ignore people who would probably treat me well." → Context Dependent · fn: `Function unclear from available evidence` · comp: Role Functioning → Intentionality · alt1(conditional): "If you notice you're brushing off someone kind, ask if it's 'no real spark' or just unfamiliar. Give it a little more time before you decide." · supports: "You see if real interest can grow." · tolerate: "Less spark at the start; some not-knowing." · context: "Real attraction still matters — this isn't about dating people you don't like." · Moderate · FLAG (context)
- STM-0556 "I always give people one more chance." → Context Dependent · fn: "Another chance keeps the relationship going for now." · comp: Trust → Accountability · alt1(conditional): "If you give another chance, name one real change you need to see, and by when. Then look at what happened." · supports: "You see if the change is real or just hoped for." · tolerate: "Holding a limit; it might end." · context: "Fixing things and just waiting are not the same — this depends on whether they own their part." · Moderate · FLAG (context)
- STM-0036 "I keep choosing the wrong people." → Insufficient Evidence · (no alt) — outcome-level, no discrete behavior · Moderate · FLAG (insufficient)
- STM-0048 "I keep repeating the same relationship." → Insufficient Evidence · (no alt) · Moderate · FLAG (insufficient)
- STM-1048 "I'm watching to see if their actions match what they promised." → Likely Adaptive Already · (no alt) · comp: Trust → Congruence · note: reinforcement candidate · High · no flag

Plays (11 behaviors → 3): 
- **Play A "Notice if they show up before you give more"** · behavioral_source_ids: 0042,0395,0396 · contextual_source_ids: 0036 · comps: Role Functioning → Reciprocity; Trust → Availability · FLAG
- **Play B "Check a worry before you decide"** · behavioral_source_ids: 0037,0553,0554 · comps: Conflict Management → Objectivity, Reflection; Trust → Congruence · FLAG
- **Play C "Give another chance only if things really change"** · behavioral_source_ids: 0039,0556 · comps: Role Functioning → Boundaries; Trust → Accountability · FLAG
(0036/0048 excluded as behavioral evidence; 1048 excluded — already adaptive.)

## OUTPUT (write two JSON files; do NOT emit statement text/cluster/phase — merged from source by sid)
Read behaviors for YOUR cluster from `bank`+`behaviors.json` (filter primary_ec == your id). Read
`fw_competencies.json` (filter phase) and `fw_phases.json` (developmental task).
1. `<out>/cluster_<id>_behaviors.json` — array, one object per behavior:
   {sid, trigger_or_context, maintaining_role, short_term_function, developmental_cost,
    relevant_developmental_task, relevant_rlc_competency, adaptive_alternative_1,
    adaptive_alternative_2, what_new_response_supports, expected_discomfort_or_cost,
    context_conditions, confidence, review_flag(bool), review_reason}
2. `<out>/cluster_<id>_plays.json` — array (may be empty), one object per candidate Play:
   {play_name, behavioral_target, trigger, old_play, function_of_old_play, new_play, what_to_expect,
    why_supports_task, supporting_competencies, behavioral_source_ids[], contextual_source_ids[],
    maintaining_behaviors_consolidated, context_limitations, confidence, review_flag(bool), review_reason}
Preserve every behavior sid. Re-read both files to confirm they parse.
