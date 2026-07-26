# Difficulty Feeling Chosen — Interactive UX Architecture (v1)

**Status:** UX architecture FOR APPROVAL. Not final copy · not implementation · not other clusters.
A distinct **$29 Relationship Playbook™** product (shares auth/infra/design-system/data with RLC, but is
its own experience — not the Companion, not a journal, course, chatbot, or coaching). Web stack
(Next.js/React + Supabase + Tailwind — the existing platform). Representative copy is `[rep]` only.
Source of truth: the locked PRESENT → OBSERVE → DECIDE architecture (T1 Authentic Self-Presentation,
T2 Reciprocity-Based Investment, T3 Evidence-Informed Decision-Making) + context-activated Intentional
Dating Break. No new primary Play. Governing task: **Discernment (Exploration).**

**Every interaction earns its place** by doing ≥1 of: teach the pattern · help recognize if it applies ·
rehearse an adaptive response · help observe relational information · help make a developmentally
appropriate decision · reinforce PRESENT→OBSERVE→DECIDE. Progress model = **Recognize → Practice → Use**
(no streaks/points/badges/%/challenges). Motion only when it teaches.

Persistent element: a slim **PRESENT · OBSERVE · DECIDE** progress rail is visible throughout so the user
always knows where they are in the behavioral process (not a completion bar).

---

## A. UX STORYBOARD (screen by screen)

### S0 — Access & Welcome
- **Purpose:** confirm entitlement; frame this as a *do-something* product, not a document.
- **Sees:** the Playbook title ("Moving Beyond Rejection"), a one-line promise about *making clearer relational decisions*, a single **Begin** action. No table of contents, no chapter list.
- **Does:** taps Begin.
- **Interaction type:** entry gate.
- **System response:** creates/loads the user's Playbook session; routes to S1.
- **Changes on input:** none yet.
- **Behavioral function:** reinforce (sets the "process, not article" expectation).
- **Data stored:** `session{user_id, cluster:1, started_at, resumed_at}` (gated by existing playbook entitlement).
- **Motion:** none needed.
- **Accessibility:** single clear focus target; skip-to-content; respects reduced-motion from here on.
- **Complexity:** Low.

### S1 — The Shift
- **Purpose:** introduce the central reframe without diagnosing/labeling.
- **Sees:** two short contrasting statements animating one into the other — `[rep]` "Am I being chosen?" → "What is this showing me — and what do I want to do with it?" A note that this isn't about becoming more desirable, it's about better information + intentional decisions.
- **Does:** reads; taps continue.
- **Interaction type:** guided reveal (passive, one interaction).
- **System response:** advances.
- **Changes on input:** none.
- **Behavioral function:** teach + reinforce (worth ≠ chosenness).
- **Data stored:** none.
- **Motion:** **teaching motion** — the first sentence's words gently re-settle into the second (the *reframe*, made visible). Reduced-motion → crossfade.
- **Accessibility:** motion is decorative-with-meaning; text conveys it fully without motion.
- **Complexity:** Low.

### S2 — The Map (PRESENT → OBSERVE → DECIDE)
- **Purpose:** give the user the mental model + establish the persistent rail.
- **Sees:** three labeled stops with one-line purposes (`[rep]` Present = show real information; Observe = notice what's actually there; Decide = choose from what you see). The rail highlights "you are here."
- **Does:** taps to enter PRESENT.
- **Interaction type:** navigation map.
- **System response:** enters PRESENT; rail persists.
- **Changes on input:** current-stop state.
- **Behavioral function:** reinforce the process.
- **Data stored:** `progress.current_stop`.
- **Motion:** rail draws left→right once.
- **Accessibility:** rail is a labeled progress landmark (aria) + not motion-dependent.
- **Complexity:** Low.

### S3 — PRESENT · Recognition
- **Purpose:** let the user recognize *whether* self-editing is their pattern (never assume it).
- **Sees:** a short set of conditional, non-judgmental situations — `[rep]` "In early dating, do you ever hide a preference, agree when you disagree, downplay a need, or present what you think they want?" with calm self-select responses (*Often / Sometimes / Rarely / Not me*).
- **Does:** selects a self-recognition level.
- **Interaction type:** self-recognition select (single).
- **System response:** branches (see C): applies → S4; "Rarely/Not me" → S4-reinforce (skip rehearsal).
- **Changes on input:** sets `present.applies`.
- **Behavioral function:** recognize.
- **Data stored:** `present.recognition`.
- **Motion:** none.
- **Accessibility:** plain radio semantics; no timing pressure.
- **Complexity:** Low.

### S4 — PRESENT · Rehearsal (scenario choice)  *(shown if applies)*
- **Purpose:** rehearse *appropriately-paced authentic expression* vs the two failure modes.
- **Sees:** 2–3 short scenario cards (a low-stakes early-dating moment). For each, three responses: **self-edit** · **over-disclose** · **paced-authentic**. After choosing, a brief, non-scoring explanation of what each option would/wouldn't let them *learn about fit*.
- **Does:** picks a response per card.
- **Interaction type:** scenario cards (branching micro-choices).
- **System response:** reflects back what that choice reveals/obscures about fit (no "correct answer" badge; the paced-authentic option is explained in terms of *information quality*, not virtue).
- **Changes on input:** none persisted beyond an internal "engaged rehearsal" flag.
- **Behavioral function:** teach + rehearse (Discernment needs accurate self-information).
- **Data stored:** `present.rehearsed = true`.
- **Motion:** the chosen card's response subtly resolves; optional **"edited-self" visual** where excess filtering falls away to reveal a *fuller-but-not-total* self (never "reveal everything").
- **Accessibility:** each card fully readable; choices keyboard-navigable; explanation is text-first.
- **Complexity:** Moderate (scenario state + explanations).

### S4R — PRESENT · Reinforce  *(shown if NOT their pattern)*
- **Purpose:** don't manufacture a deficit; affirm and move on.
- **Sees:** a brief `[rep]` "Sounds like you already show up pretty honestly — that's exactly what makes fit readable." + a single continue.
- **Does:** continues.
- **Interaction type:** reinforcement.
- **System response:** routes to S5 capture (optional) or straight to OBSERVE.
- **Behavioral function:** reinforce.
- **Data stored:** `present.reinforced = true`.
- **Complexity:** Low.

### S5 — PRESENT · Capture
- **Purpose:** convert insight into one concrete, user-chosen intention (feeds the final summary).
- **Sees:** `[rep]` "One true thing you'd like to express more accurately" — a small set of user-selectable chips (preference / need / opinion / boundary / what you actually want) or a short free field.
- **Does:** selects/writes one item (optional but encouraged).
- **Interaction type:** single capture (chips or short text).
- **System response:** saves to the play; advances the rail to OBSERVE.
- **Changes on input:** `summary.present`.
- **Behavioral function:** rehearse + reinforce.
- **Data stored:** `summary.present` (short string/enum).
- **Motion:** captured item animates into the PRESENT stop on the rail.
- **Accessibility:** label + optional text; not required to proceed.
- **Complexity:** Low.

### S6 — OBSERVE · Teach  **★ SIGNATURE INTERACTION** (see D)
- **Purpose:** teach *interest vs mutual investment* and that **reciprocity becomes observable only when you leave relational space.**
- **Sees:** a **two-lane relational timeline** (You / Them). The user makes a "move" (reach out / share / invest); the interface then shows a **space**; then whether/what the other lane contributes becomes visible — as **differently-shaped** contributions (initiation · response · follow-through · availability · consistency · curiosity/engagement · planning/contribution · word–action congruence), NOT as a mirror of the user's move (see **D.1** — pattern-level, not matched turns). Two short illustrative passes: (1) filling every gap (over-pursuit) → the other lane stays *unreadable*; (2) leaving space → the broader **pattern of mutual participation** (or its absence) becomes *information*.
- **Does:** taps to place their moves and to advance time; watches contributions surface.
- **Interaction type:** interactive staged timeline (the centerpiece).
- **System response:** reveals contribution tokens on the Them lane per pass; surfaces the through-line `[rep]` "Reciprocity is information — you can only see it if you leave room for it."
- **Changes on input:** none about a real person (this is a **teaching simulation**, not tracking a partner).
- **Behavioral function:** teach + observe.
- **Data stored:** `observe.viewed = true` (no relational data about any real person).
- **Motion:** **signature animation** — contributions from both sides accumulate over time along the two lanes; over-pursuit visibly *crowds out* the other lane's signal. Reduced-motion → stepwise static reveal with the same information.
- **Accessibility:** every state has a text equivalent; operable via keyboard/tap; no reliance on color alone (contribution types are labeled + iconographic).
- **Complexity:** Moderate.

### S7 — OBSERVE · Recognition / Practice
- **Purpose:** shift the user from monitoring *"do they want me?"* to observing *"what are they contributing?"*; recognize what they overlook.
- **Sees:** the approved contribution constructs (initiation · follow-through · availability · consistency · word–behavior congruence) as selectable items — `[rep]` "Which of these do you tend to *not* notice, because you're focused on whether they like you?"
- **Does:** selects any they tend to overlook (multi-select). If they indicate they already observe these well → reinforce.
- **Interaction type:** multi-select recognition.
- **System response:** branches (C): overlooked items → carried to capture; "already observe well" → brief reinforcement.
- **Changes on input:** `observe.overlooked[]`.
- **Behavioral function:** recognize + observe.
- **Data stored:** `observe.overlooked[]`.
- **Motion:** selected constructs light up on the two-lane model from S6.
- **Accessibility:** labeled checkboxes; not a scorecard (no totals/ratings).
- **Complexity:** Low.

### S8 — OBSERVE · Capture
- **Purpose:** one concrete "what I'll pay attention to."
- **Sees:** `[rep]` "Relational information you want to pay more attention to" — pre-filled from S7 selections, editable.
- **Does:** confirms/edits one focus.
- **Interaction type:** capture.
- **System response:** saves; advances rail to DECIDE.
- **Data stored:** `summary.observe`.
- **Behavioral function:** reinforce.
- **Complexity:** Low.

### S9 — DECIDE · Teach
- **Purpose:** teach *hoping something changes* vs *deciding from sufficient evidence* — with **no timelines**.
- **Sees:** a short contrast — waiting-on-hope (open-ended) vs deciding-from-what-you-see (condition-based).
- **Does:** taps continue.
- **Interaction type:** guided reveal.
- **System response:** advances to the decision builder.
- **Behavioral function:** teach.
- **Data stored:** none.
- **Complexity:** Low.

### S10 — DECIDE · Condition Builder
- **Purpose:** build a **condition-based** (not calendar-based) decision frame.
- **Sees:** two columns — **"What I'd need to SEE"** (select from approved evidence categories: consistent follow-through · mutual initiation · direct clarification · changed behavior · accountability · demonstrated availability) and **"What's actually happening"** (the user reflects their real read against each chosen condition). Then a set of **equally-weighted** legitimate outcomes: *continue · deepen · slow down · gather more information · clarify directly · discontinue*.
- **Does:** picks the conditions that matter to them; marks whether each is present/absent/unclear; selects an outcome (or "gather more information").
- **Interaction type:** two-column condition mapper + outcome select.
- **System response:** reflects the mapping neutrally; **does not recommend** an outcome or bias toward staying/leaving. If conditions are mostly "unclear/not-yet-observable" → surfaces *gather more information* / *clarify directly* as natural next steps.
- **"Gather more information" guardrail (required):** the builder distinguishes *"I genuinely don't have enough information yet"* (the user's own condition-reads are mostly **unclear/not-yet-observable**) from *"I have relevant information but am reluctant to act on it"* (conditions the user already marked **present/absent**). If the user selects *gather more information* while their reads are mostly resolved, the interface **neutrally reflects** that they may already hold relevant information — **without** recommending any decision. This keeps *gather more information* from becoming an indefinite escape hatch while never telling the user what to choose.
- **Changes on input:** `decide.conditions[]`, `decide.outcome`.
- **Behavioral function:** decide (Discernment: informed decision).
- **Data stored:** `decide.conditions[]`, `decide.read`, `decide.outcome`.
- **Motion:** as conditions are marked, the outcome options quietly become available — **no single path is highlighted as correct** (see D/G).
- **Accessibility:** columns are a labeled data table pattern; outcomes are peer radio options with equal visual weight.
- **Complexity:** Moderate.

### S11 — DECIDE · Capture
- **Purpose:** one durable "evidence I'll use."
- **Sees:** `[rep]` "The evidence you want to use when deciding whether to keep investing" — prefilled from S10 conditions.
- **Does:** confirms.
- **Data stored:** `summary.decide`.
- **Behavioral function:** reinforce.
- **Complexity:** Low.

### S12 — Context Self-Check
- **Purpose:** decide whether the Dating-Break module is relevant — *without diagnosing burnout*.
- **Sees:** 1–2 calm questions — `[rep]` "Right now, does dating feel draining, hopeless, or like it's costing more than it gives?" (*Yes / Somewhat / No*).
- **Does:** answers.
- **Interaction type:** short gate.
- **System response:** *Yes/Somewhat* → S13; *No* → **skip module entirely** → S14.
- **Changes on input:** `break.relevant`.
- **Behavioral function:** recognize (context activation).
- **Data stored:** `break.relevant`.
- **Complexity:** Low.

### S13 — Intentional Dating Break  *(context-activated only; kept smaller than the primary Plays)*
- **Purpose:** distinguish **intentional rest** from **avoidant withdrawal** — without assuming which it is.
- **Sees:** three short intentionality prompts — **What am I stepping away from? · What is this break for? · What would tell me I'm ready to reassess?** An **optional** "set a reassessment reminder" (never required; no fixed duration).
- **Does:** answers the three; optionally sets a reassessment marker.
- **Interaction type:** brief structured reflection (3 fields + optional date).
- **System response:** assembles an "IF I NEED A BREAK" block for the summary.
- **Changes on input:** `summary.break{from, for, reassess_signal, reassess_date?}`.
- **Behavioral function:** decide / reinforce (intentionality).
- **Data stored:** `summary.break`.
- **Motion:** none.
- **Accessibility:** three labeled short fields; the date is clearly optional.
- **Complexity:** Low.

### S14 — Integration
- **Purpose:** frame PRESENT→OBSERVE→DECIDE as a **repeatable process**, not a completed task.
- **Sees:** the full rail lights as a loop; `[rep]` "This isn't a finish line — it's a way to read any new connection." No "Congratulations, you're done."
- **Does:** taps to view "My Relationship Play."
- **Interaction type:** transition.
- **Behavioral function:** reinforce.
- **Data stored:** `progress.completed_pass = true` (a *pass*, not mastery).
- **Motion:** rail forms a gentle loop (process, not trophy).
- **Complexity:** Low.

### S15 — "My Relationship Play" (see E)
- **Purpose:** a concise personalized behavioral reference generated **only** from the user's own selections.
- **Sees:** PRESENT / OBSERVE / DECIDE (+ IF I NEED A BREAK, only if S12 positive), each filled with what *they* chose. A "return anytime" note.
- **Does:** reviews; can edit; can save/return.
- **Interaction type:** generated summary (editable).
- **System response:** persists the play; makes it re-openable.
- **Data stored:** `summary{present, observe, decide, break?}` (the canonical returnable artifact).
- **Behavioral function:** reinforce + use.
- **Motion:** each section assembles from the rail captures.
- **Accessibility:** a structured, readable document region; printable/shareable-to-self.
- **Complexity:** Low–Moderate.

### S16 — Re-entry / "Used it"
- **Purpose:** support **Use** without implying mastery.
- **Sees:** on return, the saved Play; an optional, low-key `[rep]` "I used this in real life" marker per section.
- **Does:** re-reads; optionally marks a section as *used*.
- **Interaction type:** revisit + optional self-mark.
- **System response:** records a *use* event (never a mastery/score claim).
- **Changes on input:** `progress.used[section] = true` (Recognize→Practice→**Use**).
- **Behavioral function:** use.
- **Data stored:** `progress.used[]`.
- **Motion:** none.
- **Accessibility:** optional, unobtrusive.
- **Complexity:** Low.

---

## B. INTERACTION INVENTORY
| # | Component | Behavioral function | Interaction type | Data stored | Complexity |
|---|---|---|---|---|---|
| 1 | The-Shift reveal (S1) | teach/reinforce | guided reveal + teaching motion | — | Low |
| 2 | POD map + persistent rail (S2, all) | reinforce | nav landmark | `progress.current_stop` | Low |
| 3 | PRESENT recognition (S3) | recognize | single self-select | `present.recognition` | Low |
| 4 | PRESENT scenario cards (S4) | teach/rehearse | branching micro-choices | `present.rehearsed` | Moderate |
| 5 | PRESENT capture (S5) | rehearse/reinforce | chips/short text | `summary.present` | Low |
| 6 | **OBSERVE two-lane reciprocity timeline (S6) ★** | teach/observe | staged interactive timeline | `observe.viewed` | Moderate |
| 7 | OBSERVE overlooked-constructs (S7) | recognize/observe | multi-select | `observe.overlooked[]` | Low |
| 8 | OBSERVE capture (S8) | reinforce | capture | `summary.observe` | Low |
| 9 | DECIDE teach (S9) | teach | guided reveal | — | Low |
| 10 | DECIDE condition builder (S10) | decide | two-column mapper + equal-weight outcomes | `decide.*` | Moderate |
| 11 | DECIDE capture (S11) | reinforce | capture | `summary.decide` | Low |
| 12 | Context self-check (S12) | recognize | short gate | `break.relevant` | Low |
| 13 | Dating-break intentionality (S13) | decide/reinforce | 3-field reflection + optional marker | `summary.break` | Low |
| 14 | "My Relationship Play" (S15) | reinforce/use | generated editable summary | `summary{}` | Low–Moderate |
| 15 | Re-entry + "used it" (S16) | use | revisit + optional self-mark | `progress.used[]` | Low |

No component requires AR/VR, 3D, a game engine, or per-interaction AI inference. Everything is standard
React state + SVG/CSS motion + Supabase rows.

---

## C. BRANCHING LOGIC (lightweight; the product responds to the user)
```
S3 PRESENT recognition
   ├─ Often / Sometimes  → S4 scenario rehearsal → S5 capture
   └─ Rarely / Not me    → S4R reinforce (skip rehearsal) → S5 capture (optional) 
S6 OBSERVE teach (everyone — it's the core lesson)
S7 OBSERVE recognition
   ├─ overlooks constructs → S8 capture (prefilled)
   └─ "I already watch for these" → brief reinforce → S8 (optional)
S10 DECIDE condition builder
   ├─ conditions mostly present/absent (clear) → continue/deepen/slow/discontinue all available
   └─ conditions mostly "unclear" / not enough info → foreground GATHER MORE INFORMATION + CLARIFY DIRECTLY (both valid)
S12 context self-check
   ├─ Yes / Somewhat → S13 Intentional Dating Break → summary includes IF I NEED A BREAK
   └─ No → skip module entirely → summary omits the break block
Summary (S15) contains ONLY the sections the user engaged.
```
No path is scored; no outcome is nudged. Reinforcement replaces intervention wherever a pattern doesn't apply.

---

## D. SIGNATURE INTERACTION — the OBSERVE two-lane reciprocity timeline (S6)
**Recommendation: this is the memorable centerpiece.**
- **What it is:** a two-lane (You / Them) timeline the user drives. They place a "move," the interface
  imposes a **space**, then the other lane's contribution — initiation, follow-through, availability,
  consistency, word–behavior congruence — becomes visible (or conspicuously doesn't). Two short passes
  contrast **over-pursuit** (filling every gap → the other lane stays unreadable) with **leaving space**
  (the other lane becomes *information*).
- **Why it deserves to be the signature:** it converts the single hardest idea in this cluster —
  *stop asking "do they want me?" and start observing "what are they contributing?"* — into a thing the
  user **does with their hands** and **sees happen**, not a paragraph they read. It's the exact behavioral
  translation of T2 (Reciprocity-Based Investment) and the OBSERVE stop of the locked sequence.
- **How it teaches RLC logic:** it makes visible that (a) reciprocity is **observable information, not
  scorekeeping**; (b) that information only appears when you **leave relational space** (the corrected B2
  logic); and (c) that both people contribute over time — Discernment is reading *that*, not auditioning.
- **Guardrail built in:** it is a **teaching simulation** (illustrative), never a tracker of a real
  partner; it shows contribution as *information*, never as a tally to "win"; it never says "match energy."
- **Complexity: Moderate** — SVG/flex lanes + staged state machine + reduced-motion static fallback.

### D.1 — Reciprocity is represented at the PATTERN level, not as mirrored turns  *(required)*
The timeline must **NOT** visually teach "I did X, therefore they should do X" or "I initiated once, therefore
they must initiate next." **Reciprocity is not strict alternation, equal quantities, or 50/50 matching.** The
other person's contribution may take a **different form** from the user's:
- User initiates a date → other **enthusiastically follows through** and later **proposes another plan**.
- User shares something meaningful → other responds with **attention, curiosity, appropriate self-disclosure**.
- User expresses interest → other **demonstrates availability and continued engagement**.
- User initiates *twice* → the relationship may still be reciprocal if the **broader pattern** shows mutual participation.
- Conversely: user repeatedly initiates → other responds pleasantly but **never initiates, follows through
  inconsistently, or doesn't contribute to progression** → the pattern is **not** mutual.

So the visualization teaches **PATTERN OF MUTUAL PARTICIPATION**, never **MATCHED ACTIONS**. It makes multiple,
**non-identical** forms of contribution visible — *initiation · response · follow-through · availability ·
consistency · curiosity/engagement · planning/contribution · word–action congruence* — and the Them-lane
tokens deliberately **differ in form** from the You-lane tokens (a response or follow-through can answer an
initiation; they need not match). **No numerical scorecard, no totals, no per-side counts.** The through-line
the interface communicates is *"What happens across the interaction when I leave enough room for both people
to participate?"* — never *"Did they give exactly what I gave?"* **Reciprocity is information, not accounting.**

---

## E. FINAL SUMMARY EXPERIENCE — "My Relationship Play"
A **concise behavioral reference**, generated only from the user's selections — **not a journal entry**,
not a "mastery" record. Structure:
```
MY RELATIONSHIP PLAY
PRESENT  — Something I want to express more accurately:     {summary.present}
OBSERVE  — Relational information I want to notice:          {summary.observe}
DECIDE   — Evidence I'll use when deciding to invest:        {summary.decide}
IF I NEED A BREAK  (only if the context module applied)      {summary.break: from / for / reassess-signal}
```
- Editable; **returnable** (re-openable from S16); printable/save-to-self.
- Each line is the user's *own* wording/choice — the product never fills it with assumed content.
- On re-entry the user may optionally mark a section "I used this" (**Use** stage) — which records an event,
  never implies the skill is mastered.

---

## F. BUILD RECOMMENDATION
**MVP (build first):** S0–S2 (entry/shift/map + persistent rail) · S3–S5 PRESENT (recognition → scenario
rehearsal → capture, with the S4R reinforce branch) · **S6 signature OBSERVE timeline** · S7–S8 · S9–S11
DECIDE condition builder · S12–S13 context break (intentionality, optional date) · S14–S15 integration +
"My Relationship Play." This is the whole coherent behavioral loop; the product isn't itself without it.

**v1.1 (defer):** S16 "used it" re-entry marking + the Recognize→Practice→Use progression surface;
richer scenario variety in S4; optional print/share styling of the Play; a lightweight "review only" mode.

**Do NOT build (complexity without behavioral value):** streaks/points/badges/% or challenge mechanics;
any partner-tracking/relationship-logging (would make it a journal + import prevalence risk); AI chat or
per-interaction inference; multi-branch scenario trees beyond what recognition needs; 3D/AR motion novelty;
outcome recommendations in S10 (violates neutrality).

---

## G. ARCHITECTURE COMPLIANCE CHECK
- ✅ **Preserves PRESENT → OBSERVE → DECIDE** — it is the literal spine + a persistent rail.
- ✅ **No new primary Plays** — exactly T1/T2/T3; the break stays context-activated.
- ✅ **Intentional Dating Break stays context-activated** — gated by S12; skipped entirely if not relevant; smaller than the primary Plays; duration optional.
- ✅ **No unsupported behavioral assumptions** — every pattern is *recognized* by the user (S3, S7, S12), never assumed; reinforcement replaces intervention when a pattern doesn't apply.
- ✅ **No unsupported psychological claims** — no mechanism/"why you feel unchosen"; the removed "steadiness feels less exciting" line is not reintroduced; discomfort is framed as *leaving space makes behavior observable*.
- ✅ **Discernment preserved as governing task** — PRESENT (accurate info) → OBSERVE (read reciprocity) → DECIDE (informed choice) is Discernment operationalized.
- ✅ **Distinct from the Companion** — a bounded, self-contained behavioral-application product; no ongoing chat/navigation; no daily loop.
- ✅ **Not a journal** — captures are discrete behavioral selections feeding one reference artifact, not free-form logging of a relationship.
- ✅ **Not a course** — no lessons/modules/quizzes/completion %; it's a single interactive behavioral pass.
- ✅ **Not a chatbot** — no conversational agent; no AI inference in the loop.
- ✅ **Reciprocity is not tit-for-tat** — S6/S7 + **D.1** teach reciprocity at the **pattern level** (mutual participation), not mirrored turns/equal quantities/50/50; Them-lane contributions are differently-shaped; no scorecard; effort-matching and "match energy" are explicitly excluded.
- ✅ **"Gather more information" is not an indefinite escape hatch** — S10 distinguishes genuine insufficiency from reluctance-to-decide, without telling the user what to choose.
