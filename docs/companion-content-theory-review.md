# Companion Content — Theory/Safety Review (preparatory)

**Date:** 2026-07-21 · **Reviewer:** AI (preparatory pass) · **Adjudication + sign-off:** owner (framework author + LMFT), via the governance ladder.

## Scope & method
All **43 published guided experiences** (288 content blocks) were reviewed against the canonical grounding already in the system: each situation's `definition` + `user_need`, and each mapped competency's `name`, `educational_objective`, and canonical behavioral `indicators` (`fw_behavioral_indicators`). Six independent reviewers each took a batch, grounding **only** in that canonical data — flagging, never rewriting or inventing theory. This report is preparatory input for the formal theory/safety pass; **the owner adjudicates every item.**

## Result at a glance
- ~27 experiences reviewed clean.
- **2 blockers**, **4 should-fix**, **~11 notes** across ~16 experiences.
- Dominant theme: **competency-mapping fit** (content vs. its mapped competency) — a registry crosswalk question, not a writing-quality one — plus **generalized "stated-as-fact" claims** in educational notes that may implicitly expand the framework.

---

## 🔴 Blockers (must resolve before launch)

1. **`placeholder-something-happened` — a placeholder is PUBLISHED.** Title is `[APPROVED TITLE TO BE PROVIDED]`, situation is empty, no mapped competency, every block is a bracket stub (`[GUIDED REFLECTION PROMPT TO BE PROVIDED]`, etc.). It cannot be reviewed and must not be live. The slug (`something-happened`) + an emotion-select block suggest a sensitive/aftermath scenario → once authored it needs an explicit safety classification and re-review. **Action:** unpublish now (I can do this on request), then author + review before re-publishing.

2. **`we-feel-more-like-roommates-than-partners` — competency contradiction. ✅ RESOLVED (2026-07-21).** The situation (RS-0051) was mapped to **Disengagement** (`EMI-EXPR-002`, Expiration/ending phase) — opposite to its reconnection intent. Owner adjudicated; re-mapped Primary to **Comfort During Stress** (`EMI-EXPN-002`, Expansion / Integration, Emotional Intimacy domain kept) in both the DB and `data/companion-registry/reg_situation_framework_map.json`.

## 🟠 Should-fix (competency-mapping fit)
The content is sound, but the **mapped competency doesn't match what the experience actually does**. These are crosswalk decisions for you — re-map, or re-align content:

- **`we-disagree-about-having-children`** → mapped **Shared Responsibility** (labor/over-underfunctioning indicators), but content is a values/desire disagreement about having children. No content touches division of labor. **✅ RESOLVED (2026-07-21):** owner re-mapped Primary to **Future-Oriented Communication** (`COM-EXCL-005`, Exclusivity / Intentional Investment / Communication — fits the engaged, pre-marriage alignment framing), in DB + JSON source.
- **`i-do-not-know-what-i-am-looking-for`** → mapped **Clarification** (interpersonal: "asks for more information", "checks understanding"), but content is **internal self-clarity** "before anyone else is part of the picture" — no other person to clarify with. **✅ RESOLVED (2026-07-21):** owner re-mapped Primary to **Intentionality** (`ROL-EXPL-002`, Exploration / Discernment / Role Functioning — acting with relational purpose/clarity of intent rather than drifting; closest self-directed fit), in DB + JSON source.
- **`they-have-not-responded-to-my-message`** → mapped **Reflection**, whose indicators are explicitly **conflict-scoped** ("processes what happened in conflict", "after disagreement"). A non-response isn't a disagreement. **✅ RESOLVED (2026-07-21):** owner re-mapped Primary to **Emotional Regulation** (`CON-EXPL-001`, Exploration / Discernment / Conflict Management — "manages emotional activation… uses calming strategies," fits "manage the uncertainty without spiraling"), in DB + JSON. Also corrected a latent domain mistag on this row (was DOM-002/Trust → now DOM-004/Conflict Management).
- **`we-are-rebuilding-trust-after-betrayal`** → **role confusion (safety-adjacent). ✅ RESOLVED (2026-07-21).** Blocks mixed betrayed-party ("keep watching for genuine, consistent effort") and betrayer-party ("show up steadily… even on the hard days") stances, risking putting repair labor on a possibly-betrayed user. Owner adjudicated → **either-party / own-resilience** reframe (fits the mapped Resilience Under Stress competency): blocks 2/3/5/6 re-authored to center the user's own steadiness + "from both people," removing both the "prove it" burden and the "watch them" stance. Re-published via the governance ladder (draft → … → published, v6), audited.

## 🟡 Notes — theory fidelity (generalized claims stated as fact)
Educational notes that assert empirical/framework generalizations **not supported by the mapped competency's canonical indicators** — verify against the manual, or soften so the framework isn't implicitly expanded:

- **`we-keep-having-the-same-fight`** — "A recurring fight *usually means* the underlying problem hasn't been named"; "Turning 'me vs. you' into 'us vs. the problem' is what makes it solvable."
- **`we-repaired-something-that-used-to-divide-us`** — "Being able to reconnect after conflict is *one of the strongest signs of a healthy bond*."
- **`we-handle-conflict-very-differently`** — "Different conflict styles aren't a dealbreaker — *unspoken ones are*" (absolute predictive claim).
- **`we-keep-arguing-about-household-responsibilities`** — "Fights about housework are *usually about fairness and feeling valued*, not just the dishes" (emotional-meaning attribution beyond Shared Responsibility).
- **`we-are-blending-families`** — "presenting a *united front*" (not in the logistical Coordination indicators).

## 🟡 Notes — sensitive-situation handling (clinician judgment) — ✅ RESOLVED (2026-07-21)
All three re-authored (owner-approved) with safety-aware balance and re-published via the governance ladder (v6). Edits keep the educational, non-diagnostic, non-directive boundary.

- **`i-do-not-feel-emotionally-safe-opening-up`** — was framing unsafety as only a pacing problem. Now acknowledges that if opening up keeps feeling unsafe no matter the pace, that's information worth heeding (reflection/educational-note/closing).
- **`i-see-potential-but-i-also-see-red-flags`** — was treating all red flags as wait-and-see. Now distinguishes fit/incompatibility concerns from **safety** concerns (controlled, disrespected, pressured, afraid) that "aren't a wait-and-see — a reason to step back and reach for support" (intro + closing).
- **`i-am-unsure-whether-i-can-trust-them`** — reflection was one-directional (suspicion only). Now even-handed: invites the fear-side too ("what past experiences might be coloring how you're reading this") and separates old fears from real evidence (reflection + closing).

## 🟡 Notes — scope / structure
- **`i-am-nervous-about-dating-apps`** — situation definition includes feeling **unsafe** about online dating, but content only addresses congruence; safety dimension untouched.
- **Reused generic `conversation_planner` block** fits poorly on solo / pre-partner experiences (`before-a-first-date`, `i-am-nervous-about-dating-apps`, `i-do-not-know-what-i-am-looking-for`) — "what you'd want *them* to understand" assumes a partner who isn't there.
- **`our-families-are-taking-over-the-wedding`** — mapped **Coordination** (logistical) but content is couple-boundary/alliance work.

---

## Recommended owner actions
1. **Unpublish `placeholder-something-happened`** immediately (blocker #1).
2. **Adjudicate the competency mappings** (blocker #2 + the should-fix set) — decide re-map vs. re-align. These touch the governed crosswalk, so they're yours to set.
3. **Review the "stated-as-fact" claims** against the manual — keep or soften each.
4. **Clinician review of the sensitive-situation cluster** (trust / red-flags / emotional-safety), especially the safety/abuse red-flag distinction.
5. Decide whether the generic conversation-planner block belongs in solo experiences.
6. Route the surviving content through the formal Draft→Theory→Safety→Approved ladder for the sign-off of record.

## Data-integrity cleanup (2026-07-21)
While fixing RS-0023, a whole-crosswalk audit found **6 rows whose `domain_id` didn't match the mapped competency's canonical domain** (a pure denormalization inconsistency — the competency defines the authoritative domain). All corrected in DB + JSON to match the competency (no competency re-mappings; mechanical fix): RS-0023 (Trust→Conflict Management), RS-0020 (Trust→Role Functioning), RS-0027/RS-0047 (Trust→Communication), RS-0040 (Conflict Management→Communication), RS-0048 (Physical Intimacy→Communication). Re-audit: **0 domain / phase / task mismatches across all 60 mappings.**

---
_The review changed no content and made no competency re-mappings on its own; every competency re-map above was owner-adjudicated. The domain_id corrections are mechanical consistency fixes (aligning denormalized data to the canonical competency)._
