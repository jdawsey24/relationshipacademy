# Cluster 1 — Integrate (Use Review) Content (content gate)

**Status:** FOR REVIEW. Flag-gated; v0 unchanged. No deploy, no migration.
**Source of truth:** `content/playbook/moving-beyond-rejection-usereviews.ts`.

The Integrate layer replaces the v0 "Keep/Update" dialog (on the Rev 3 path) with a **structured Use Review** — the functional return after a real-world attempt. Bounded selects only (no journaling). It collects only what supports fidelity, behavioral transfer, updating the saved Play, and selecting the next focus. The signals feed Change Path (Step 8). v0 keeps its original Keep/Update dialog when the flag is off.

## Where it's reached (Rev 3)
- After a mission **attempt** → the Practice card's "Look at how it went →" opens the review (and marks the mission `reviewed`).
- From the board's "I used this in real life" on a saved Play → opens the review (instead of the v0 dialog).

## The review — exact copy

Intro: *"A quick, honest look at the practice itself — no score, and a hard moment isn't a failure here."*

### Read It, Then Decide (`review-read-and-decide`)
1. **What did you actually do differently?** — I separated what I saw from what I was guessing · I named what I didn't know yet · I waited for the one thing that would tell me · I made a clear move from the evidence · Honestly, not much this time
2. **Did you run the move the way it's meant to work — saw-it / guessing / what-would-tell-me?** — Yes · Partly · Not really  *(Technique-Fidelity signal)*
3. **What got clearer?** — What I actually know vs. what I'm guessing · What I'd need to see next · That I already have enough to decide · Nothing yet — still murky
4. **Where did you get stuck, if anywhere?** — Reading it — telling saw-it from guessing · Acting on what I already saw · The feeling got loud · I didn't really get stuck
5. **Does the Play you saved still fit what you learned?** — **[ Keep it ]** · **[ Update it ]**

### What It Actually Means (`review-what-it-actually-means`)
1. **What did you actually do differently?** — I caught the story starting · I named the narrowest true thing · I kept the fact and dropped the verdict · I let the feeling stay without treating it as evidence · Honestly, not much this time
2. **Did you run the move the way it's meant to work — establish / doesn't-establish?** — Yes · Partly · Not really
3. **What got clearer?** — What the event actually establishes · What it can't establish about me · That a real pattern is separate from a verdict · Nothing yet — still heavy
4. **Where did you get stuck, if anywhere?** — Catching the story before it hardened · Naming the narrowest true thing · The feeling made it feel true · I didn't really get stuck
5. **Does the Play you saved still fit what you learned?** — **[ Keep it ]** · **[ Update it ]**

## Behavior / architecture notes (this gate)
- **Structured, not journaling.** Every prompt is a bounded select. The only user-authored free text is in the Keep/**Update** editor (the Play's own output — `OutputEditor`, reused), reached via "Update it."
- **Attempt ≠ fidelity.** `performedOperation` (yes/partly/no) is the Technique-Fidelity signal; it is captured separately from the fact that the reader attempted the mission.
- **Keep/Update = tool-review, not Transfer.** "Keep it" preserves the saved output; "Update it" opens the editor. Both are recorded as `kept`/`updated` — tool-review signals, never Transfer.
- **Four-way return preserved.** The mission report already distinguishes `attempted | no_opportunity | opportunity_not_taken | unsuitable`; only `attempted` flows into this structured review. Absence of an attempt is never inability/avoidance, and the non-attempt outcomes are no-fault.
- **Signals feed Change Path (Step 8), not acted on here.** The review persists `{ performed, didDifferently, becameClearer, stuck, kept/updated }` to `use_review_state`; no next-step recommendation or progression is made in Step 7.
- **Longitudinal event.** A validated, idempotent `use_reviewed` event (minimal payload: `performed`, `stuck`, `kept`/`updated`) is emitted best-effort; it lands when the endpoint + migration are live.
- **Gates:** no gamification, no mastery claim, no partner surveillance; no deploy; no migration; no Snapshot/scoring/commerce/framework changes; remaining four Plays not authored. v0's Keep/Update dialog is untouched when the flag is off.
