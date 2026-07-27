# Cluster 1 — Practice (Mission) Content (content gate, revised)

**Status:** FOR REVIEW. Flag-gated; v0 unchanged. No deploy, no migration.
**Source of truth:** `content/playbook/moving-beyond-rejection-missions.ts`.

Revisions in this pass: attempt no longer justifies progression; factual states (`selected / attempted / reviewed`) with the current rung, `stretchEligible`, and `lastReport` stored separately; `nextRung()` is content-ordering only; validated/idempotent events emitted (best-effort until the endpoint is live); attempt kept distinct from fidelity/success; suitability made actionable; one active practice focus at a time; progression **recommendations are NOT wired** (that belongs to Step 7 Use Review + Step 8 Change Path).

---

## Mission 1 — Read It, Then Decide

- **Title:** Read it before you react
- **Instruction (exact):** "The next time a text — or a change in how they're acting — starts turning into a story, stop before you react. Write down what you actually saw, what you're only guessing, and the one thing that would actually tell you."
- **Why it's tied to the Play operation:** it's the Play's core move — saw-it / guessing / what-would-tell-me — performed in a live situation, before the story drives the decision.
- **Suitability boundary:** "This is for ambiguity, not safety. If the real question is whether someone is treating you badly, you don't need more evidence — trust that, and step back."
- **What counts as an attempt:** "You've tried it if you paused and separated what you saw from what you were guessing — even once. It doesn't have to go well, or feel finished."
- **Optional next stretch (authored; NOT recommended here):** "Next time, don't just read it — decide. Run your 'if I see ___, I'll ___,' and make one clear move from the evidence."
- **Why the stretch is progressive Developmental Application, not just harder:** it moves from **reading** the evidence (T2a — separating observation from inference) to **acting** on it (T2b — the evidence-to-decision step). That's the next operation in the same competency, not a harder version of the same task. Acting on what you already know is a distinct skill (see "seeing vs. acting" in the field guide) — the natural next application, offered only when Use Review + Change Path judge it useful.

## Mission 2 — What It Actually Means

- **Title:** Name the narrowest true thing
- **Instruction (exact):** "The next time a letdown starts turning into a sentence about you — 'what's wrong with me,' 'this always happens' — pause and name the narrowest true thing the event actually shows, before the story hardens."
- **Why it's tied to the Play operation:** it's the establish / doesn't-establish move — keeping the conclusion the size of the evidence — in a live moment.
- **Suitability boundary:** "If this feels bigger than one dating moment — heavy for a long time, or a belief that follows you everywhere — that deserves more than a dating tool. Talking with a mental health professional can help."
- **What counts as an attempt:** "You've tried it if you caught the story starting and named the smaller, truer version — even if the bigger story still felt loud."
- **Optional next stretch (authored; NOT recommended here):** "Next time, notice you can name the narrowest true thing even while the bigger story still feels true. The feeling can stay — it just isn't the evidence."
- **Why the stretch is progressive Developmental Application, not just harder:** it adds the **cognitive-from-emotional separation** — holding the fact while the feeling persists — which is a further Developmental Application of the same operation (naming the fact) under harder internal conditions, not merely a tougher scenario. It's the same skill applied where it's most needed.

---

## MissionCard — consumer copy and states (exact)

**Header:** "What I'm practicing" (one active focus at a time).
Each card shows: **title**, current **instruction**, "How it connects: [link to operation]", "What counts as trying it: [attempt meaning]", and the **suitability** note.

**State — not yet the focus**
> **[ Try this next ]** → selects it as the one current practice focus (emits `mission_selected`).

**State — `selected` (the current focus)** — the reader reports what happened:
> **[ I tried this in real life ]** → `attempted` (emits `mission_attempt_reported`)
> [ The right moment hasn't come up yet ] → `no_opportunity` (factual; not failure)
> [ It didn't feel right or safe for this ] → `unsuitable` (factual; suitability actionable; only shown when the mission has a boundary)
> [ Not now ] → exits (absence of an attempt is **not** inability or avoidance)

After a non-attempt report:
> "Got it — this one didn't fit this time. That's not a miss. Keep it, or explore another area whenever you like." *(the attempt option remains available)*

**State — `attempted`** — leads into the review, **not** a stretch recommendation:
> "You tried this in real life. Now we can look at what happened in the practice itself."
> **[ Look at how it went → ]** *(when Use Review is wired in Step 7)* — otherwise: *"A short review comes next."*
> [ Done for now ]

No "Ready to stretch this," no "Try the next one," no mastery/perfection/"level" language anywhere.

---

## Behavior / architecture notes (for this gate)

- **Attempt ≠ progression.** A reported attempt sets `attempted`, records `stretchEligible` only (an authored stretch *exists*), and leads toward Use Review. It never recommends or advances the reader to a harder practice — that decision is Use Review + Change Path (Steps 7/8).
- **Factual states.** `selected → attempted → reviewed`. No `advanced`; the current rung is stored separately (`rungId`), as is `stretchEligible` and `lastReport`. Moving rungs never encodes a developmental claim.
- **Attempt ≠ success/fidelity.** The copy recognizes the reader tried it — never that they did it correctly, improved, or mastered anything.
- **Opportunity/suitability distinctions preserved for Step 7.** `MissionReport` already carries `attempted | no_opportunity | opportunity_not_taken | unsuitable`; the return form in Step 7 will surface all four. Absence of an attempt is never read as inability.
- **One focus at a time.** `practice_state.currentMissionId` holds a single active practice; "Explore Another Area" stays available; selecting a different mission switches the focus rather than accumulating homework.
- **Longitudinal events.** `mission_selected` / `mission_attempt_reported` are built + registry-validated with a client `action_id` (idempotency) and best-effort POSTed; the append-only server write lands when the endpoint + migration are live (owner-gated). Minimal functional payload only — no narrative, no partner data.
- **Gates:** no gamification, no mastery claim, no partner surveillance (all test-enforced); no deploy; no migration; no Snapshot/scoring/commerce/framework changes; remaining four Plays not authored.
