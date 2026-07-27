# Cluster 1 — Integrate (Use Review) Content (content gate, revised)

**Status:** FOR REVIEW. Flag-gated; v0 unchanged. No deploy, no migration.
**Source of truth:** `content/playbook/moving-beyond-rejection-usereviews.ts`.

The Integrate layer replaces the v0 "Keep/Update" dialog (on the Rev 3 path) with a **structured Use Review** — the functional return after a real-world attempt. Bounded selects only (no journaling, not a checklist score). Signals feed Change Path (Step 8). v0 keeps its original dialog when the flag is off.

## Where it's reached (Rev 3)
- After a mission **attempt** → the Practice card's "Look at how it went →" opens the review. **The mission is marked `reviewed` only when the review is submitted** — opening it leaves the mission `attempted` (the open review is transient view state, not `reviewed`).
- From the board's "I used this in real life" on a saved Play → opens the review instead of the v0 dialog.

## The review — exact copy

Intro: *"A quick, honest look at the practice itself — no score, and a hard moment isn't a failure here."*

### Read It, Then Decide (`review-read-and-decide`)
1. **What did you actually do differently? (choose any that fit)** — *multi-select* — I separated what I saw from what I was guessing · I named what I didn't know yet · **I figured out what would actually tell me more** · I made a clear move from the evidence · Honestly, not much this time
2. **How closely did you use the move: what I saw, what I was guessing, and what would actually tell me more?** — Pretty closely · Some of it · Not really this time  *(→ internal yes / partly / no)*
3. **What got clearer? (choose any that fit)** — *multi-select* — What I actually know vs. what I'm guessing · What I'd need to see next · That I already have enough to decide · Nothing yet — still murky
4. **Where did you get stuck most?** — *single-select* — Reading it — telling saw-it from guessing · Acting on what I already saw · The feeling got loud · I didn't really get stuck
5. Tool decision — see below.

### What It Actually Means (`review-what-it-actually-means`)
1. **What did you actually do differently? (choose any that fit)** — *multi-select* — I caught the story starting · I named the narrowest true thing · I kept the fact and dropped the verdict · I let the feeling stay without treating it as evidence · Honestly, not much this time
2. **How closely did you use the move: what this establishes, and what it doesn't establish?** — Pretty closely · Some of it · Not really this time  *(→ internal yes / partly / no)*
3. **What got clearer? (choose any that fit)** — *multi-select* — What the event actually establishes · What it can't establish about me · That a real pattern is separate from a verdict · Nothing yet — still heavy
4. **Where did you get stuck most?** — *single-select* — Catching the story before it hardened · Naming the narrowest true thing · The feeling made it feel true · I didn't really get stuck
5. Tool decision — see below.

### Tool decision (conditional on saved-output state)
- **A saved Play exists:** *"Does the Play you saved still fit what you learned?"* → **Keep it** (`tool_retained`) · **Update it** (`tool_updated`, opens the output editor)
- **No saved Play exists:** *"Would this be useful to keep for next time?"* → **Save this Play** (`tool_saved_after_use`) · **Not right now**

`tool_retained`, `tool_updated`, and `tool_saved_after_use` are tracked **separately**; **none independently constitutes Transfer.**

## State mappings
- Consumer fidelity → internal Technique-Fidelity: **Pretty closely → yes · Some of it → partly · Not really this time → no**.
- `didDifferently: string[]` (multi) · `becameClearer: string[]` (multi) · `stuck: string` (single, prioritized) · `performed: yes|partly|no` · `kept | updated | saved: boolean`.
- Mission: `attempted` → **(submit review)** → `reviewed`. Opening the review does not change the mission state.
- Longitudinal `use_reviewed` event payload (minimal): `performed`, `stuck`, `kept`/`updated`/`saved`.

## Preserved (this gate)
- **Attempt ≠ fidelity** (the attempt fact and `performed` are separate signals).
- **Relationship outcome is never reviewed;** remaining emotional discomfort is not failure ("a hard moment isn't a failure here").
- **Keep/Update/Save = tool review, not Transfer.**
- **Non-attempt mission outcomes remain legitimate and no-fault** (`no_opportunity | opportunity_not_taken | unsuitable`).
- **No journaling; no checklist score; no progression/recommendation in Step 7** — Change Path owns next-step orchestration in Step 8.
- v0's Keep/Update dialog is untouched when the flag is off.
