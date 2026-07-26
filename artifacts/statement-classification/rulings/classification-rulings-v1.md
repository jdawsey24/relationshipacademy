# Statement Classification — Rulings (AUTHORITATIVE — follow exactly)

You are classifying/enriching relational statements. You do NOT change the canonical
Primary Experience Cluster or RLC Phase — those are fixed. You ONLY add: Statement_Type,
Secondary_EC, Behaviorally_Actionable, Mapping_Rationale, Confidence, Review_Flag.
Classify the MANIFEST content — do NOT infer latent mechanism, unmet need, underlying
fear, behavioral function, developmental cost, adaptive alternative, competency, attachment
style, pathology, or intervention.

## Statement_Type taxonomy (choose the ONE the sentence PRIMARILY expresses)
- **Experience** — what the person is subjectively living through.
- **Emotion** — names/directly describes an emotional state.
- **Thought/Belief** — interpretation, assumption, self-concept, prediction, conclusion, evaluation, uncertainty, wondering, rumination.
- **Fear** — anticipated threat, rejection, loss, abandonment, exposure, failure, feared outcome (often "I'm afraid/scared…").
- **Need** — a relational requirement/desire the person wants to receive, experience, establish, or preserve.
- **Self-Behavior** — something the person DOES / avoids doing / withholds / initiates / repeats / stops / delays / monitors — a response that could reasonably be enacted differently.
- **Other-Person Behavior** — behavior attributed to another person.
- **Relational Condition** — the state, pattern, structure, or circumstances of the relationship itself.

## RULING 1 — Self-Behavior requires an identifiable enacted response
Use Self-Behavior when the statement identifies something the person does or does not do that
could theoretically be enacted differently (need NOT be externally visible — avoidance,
withholding, monitoring, delaying, non-action count). Governing question: *Does the statement
identify something the person is doing or not doing that could be enacted differently?*
- PURELY COGNITIVE activity is NOT Self-Behavior even with action-verbs:
  - "I keep second-guessing relationships." → Thought/Belief
  - "I keep wondering whether they really like me." → Thought/Belief
  - "I keep thinking they may lose interest." → Fear/Thought/Belief
  - "I keep hoping they will change." → Thought/Belief
- ENACTED responses ARE Self-Behavior:
  - "I keep texting first." / "I hold back from asking what I need to know." / "I avoid bringing up commitment." / "I check their social media." / "I stop texting when I feel uncertain." / "I say yes when I want to say no." / "I test them to see if they care." → Self-Behavior
  - "I keep waiting to see if this holds up over time." → Self-Behavior (an enacted wait-and-see/monitoring strategy).

## RULING 2 — Behaviorally_Actionable = YES when an observable/enacted user behavior could be altered, increased, decreased, interrupted, practiced, or used differently. It does NOT mean the behavior is unhealthy or maintains the pattern. Only Self-Behavior statements should be YES. Do NOT infer a behavior that is not stated (e.g., "I feel invisible." → do NOT infer withdrawal/reassurance-seeking; "I'm afraid they'll leave." → do NOT infer clinging/testing/avoidance).

## RULING 3 — Canonical 23/24 (and all) boundaries are CLOSED
Primary_EC is fixed and NOT under review. When a statement's language overlaps another cluster,
you MAY set that as Secondary_EC, but do NOT set Review_Flag = YES merely for conceptual
overlap / adjacency / a Secondary existing / canonical differing from what you'd infer.
Example: "I'm afraid I'll choose the wrong person." → Type=Fear, Primary=24, Secondary=23,
Actionable=NO, Review_Flag=NO.

## RULING 4 — "I want / I don't want" ≠ automatically Need
Classify substantive content. Need = a relational requirement/desire to receive/experience/
establish/preserve ("I want to feel emotionally safe" / "I need more consistency" → Need).
But "I don't want to waste my time." → Thought/Belief (evaluative concern about investment).
Do not infer the latent need underneath.

## Relational Condition vs Experience
Relational Condition = state/pattern/structure/circumstances of the relationship
("We barely spend time together." / "We keep having the same argument." / "Our communication
changed after we became exclusive."). Experience = what it is like for the person to live
through it ("I feel alone even when we're together." / "I feel invisible in this relationship.").
For MIXED statements classify by the DOMINANT proposition, not the words "feel"/"felt":
- "Things were easy when it was casual. Now it feels like a test." → Relational Condition
- "Everything felt easier before we called it something." → Relational Condition

## Secondary_EC
Assign an integer cluster id (1–27, ≠ Primary) ONLY on meaningful conceptual overlap; else null.
Never keyword-only. Secondary never overrides Primary.

## Confidence: High | Moderate | Low.

## Review_Flag = YES ONLY for uncertainty that could materially affect downstream behavioral
derivation: Statement_Type genuinely ambiguous · Behaviorally_Actionable unclear · unclear
whether it identifies Self-Behavior · genuinely unclear wording · source-data inconsistency.
Do NOT flag solely for: a Secondary existing · cluster adjacency · mixed subjective+relational
wording that has a clear dominant proposition · canonical mapping differing from inference.

## Mapping_Rationale: one concise clause on WHY the type fits (manifest content). No latent analysis.

---
## APPROVED CALIBRATION EXEMPLAR — Cluster 24 (match this style exactly)
| SID | Statement | Type | Sec | Actionable | Rationale | Conf | Flag |
|---|---|---|---|---|---|---|---|
| STM-0063 | Should I ask what we are? | Thought/Belief | — | NO | Internal deliberation; behavior contemplated not performed. | High | NO |
| STM-0066 | I don't want to waste my time. | Thought/Belief | — | NO | Evaluative concern about investment; not a stated relational need. | Moderate | NO |
| STM-0185 | I'm afraid I'll choose the wrong person. | Fear | 23 | NO | Explicit fear; canonical 24 preserved, 23 as adjacency; not flagged. | High | NO |
| STM-0198 | I keep second-guessing relationships. | Thought/Belief | 23 | NO | Recurring internal rumination — cognition, not an enacted behavior. | High | NO |
| STM-1039 | I keep waiting to see if this holds up over time. | Self-Behavior | — | YES | Enacted wait-and-see/monitoring stance; alterable; adaptiveness not judged. | Moderate | YES |
| STM-1044 | Things were easy when it was casual. Now it feels like a test. | Relational Condition | — | NO | Dominant proposition compares the relational dynamic before/after definition. | Moderate | NO |

## OUTPUT
Read /private/tmp/claude-501/-Users-janelledawsey-Relationship-Life-Cycle/7ab13422-85a2-448e-a48b-62bda44413bf/scratchpad/bank.json.
Filter to the rows whose "primary_ec" equals YOUR assigned cluster id. Classify EVERY such row.
Write a JSON array to the given output path, one object per statement:
{"sid","statement_type","secondary_ec"(int|null),"behaviorally_actionable"(true/false),"mapping_rationale","confidence","review_flag"(true/false)}
Preserve every sid; do not add/drop/reorder-lose any. Do NOT emit statement text, primary_ec, or phase (merged later from source).
