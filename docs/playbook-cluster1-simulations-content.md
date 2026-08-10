# Cluster 1 — Authored Simulation Content (Experience Gate, revised)

**Status:** FOR CONTENT/EXPERIENCE REVIEW. Not wired into the live Playbook. No deploy, no migration.
**Source of truth:** `content/playbook/finding-love-that-feels-mutual-simulations.ts` (this doc renders it verbatim).
**Engine:** approved Step-4 foundation (deterministic graph, no LLM, non-scoring). Engine unchanged in this revision.

Every string below is the **exact consumer-facing copy** as it will appear. Fidelity states, JIT hooks, teaching branches, routing, and the Play handoff are shown for each node.

**Guardrails in force (approved):**
1. Fidelity is authored per node/response from that scenario's evidence — never fixed by signature.
2. JIT literature is Exposure/content-engagement only — it never contributes to Technique Fidelity or Transfer.
3. Process tags are narrowly behavioural/operational — never personality, attachment, diagnosis, etiology, or trait.

Reader controls throughout: **← Back** (exit); each step advances only on **Continue** (tap/keyboard; no drag; reveals are user-advanced). Every branch rejoins **before** the same authored evidence reveal — the reader's choice never changes what the other person does.

---

## Simulation A — Read It, Then Decide
`id: sim-rd-shorter-texts` · signature **`evidenceTimeline`** · start `m1` · hands off to Play **read-and-decide**

**Signature presentation:** an unfolding **timeline** — each moment/reveal is added to a left-rail “**What you've seen so far**.” Header: *“Reading the signals over time.”*

### 1 · `m1` Moment (beat)
> Great first date. It was easy, and they said they'd love to see you again.

→ **Continue** → `m2`

### 2 · `m2` Moment (beat)
> Over the next four days, their texts get shorter.

→ **Continue** → `c1`

### 3 · `c1` Capture — interpretation · JIT hook → `lit-jit-ambiguity-spiral` (“Related read”)
> What do you think the shorter texts mean?

◦ They're losing interest ◦ They're just busy this week ◦ That's just how they text ◦ I'm not sure yet
→ **Continue** → `c2`

### 4 · `c2` Decision — temptation *(now experientially meaningful — each choice teaches, then rejoins the reveal)*
> What are you tempted to do right now?

| Choice | Routes to |
|---|---|
| Pull back to protect myself | → `note-c2-act` |
| Double-text to check | → `note-c2-act` |
| End it now | → `note-c2-act` |
| Wait and watch a bit | → `note-c2-wait` |

### 4a · `note-c2-act` Teaching branch *(acting before it's clear)* → rejoins `r1`
> That's a move made before you have enough to go on.
> Right now the shorter texts could mean a lot of things. Acting on the story before the evidence is in is the exact habit this is here to interrupt.

### 4b · `note-c2-wait` Teaching branch *(watching ≠ waiting forever)* → rejoins `r1`
> Good instinct — with one catch.
> Watching only works when you know what you're watching for. Gathering more information isn't the same as waiting forever. Decide what would actually tell you, so “wait” doesn't quietly become “never decide.”

### 5 · `r1` Reveal (evidence) · label **“New evidence”**
> Day 5: they message you to set up a real plan for next week.

→ **Continue** → `rc1`

### 6 · `rc1` Reconsider
> Weigh your first read against the new evidence. Where does it land now?

**A. “The plan changes what I can reasonably conclude. I was ahead of the evidence.”**
- Feedback: *Right — the plan is new evidence that widens what's possible. You updated the read to fit what you've seen, not the other way around.*
- Fidelity: reconsidered **demonstrated** · response **demonstrated** → `t1`

**B. “Losing interest is still possible, but I don't have enough to call it that yet.”**
- Feedback: *Exactly — “possible, not established” is the honest size of it. You're holding the conclusion to the evidence, not to the fear.*
- Fidelity: reconsidered **demonstrated** · response **demonstrated** *(holding is appropriate — the plan does not prove interest)* → `t1`

**C. “The shorter texts tell me they're losing interest. The plan doesn't really change that.”**
- Fidelity: reconsidered **demonstrated** · response **not_demonstrated** → `note-keep`

### 6c · `note-keep` Teaching branch *(neither piece of evidence is discarded)* → rejoins `t1`
> Both things are real evidence: the shorter texts, and the concrete plan.
> The shorter texts might still point to fading interest — but the plan is evidence too, and “losing interest” quietly discards it. The move isn't to pick the hopeful read or the fearful one. It's to hold a conclusion the size of everything you've actually seen.

*(“Losing interest” is never treated as a wrong answer; the fidelity-poor move is discarding half the evidence.)*

### 7 · `t1` Teach / Handoff → **read-and-decide**
> That gap — between your first read and the new evidence — is exactly what this tool trains.
> It doesn't predict what they'll do. It helps your next move follow what you've actually seen.

Button: **Open the tool →**

---

## Simulation B — What It Actually Means
`id: sim-wm-not-a-match` · signature **`conclusionNarrowing`** · start `m1` · hands off to Play **what-it-actually-means**

**Signature presentation:** expand→narrow. Event pinned under “**What happened.**” A globalizing read shows as a red “**…grew into**” chip; a bounded read shows as a neutral green “**…and you kept it bounded**” chip; the narrowed fact shows as a green “**Narrowed to**” chip. Header: *“How big did the story get?”*

### 1 · `m1` Moment (event)
> After a few good dates, they say: “I had a great time, but I don't think we're a match.”

→ **Continue** → `c1`

### 2 · `c1` Decision — first read (expansion) · JIT hook → `lit-jit-globalizing` (“Related read”)
> In the moment, what did that start to turn into?

| Choice | Process tag | Routes to |
|---|---|---|
| This will happen with everyone | `jumped_to_conclusion` | → `d1` |
| It'll always be like this | `jumped_to_conclusion` | → `d1` |
| Something's wrong with me | `jumped_to_conclusion` | → `d1` |
| I'm not worth choosing | `jumped_to_conclusion` | → `d1` |
| **It hurt, but I didn't make it mean something bigger about me** | `bounded_to_evidence` | → `note-bounded` |

### 2a · `note-bounded` Teaching branch *(bounded read acknowledged — no problem manufactured)* → rejoins `r1`
> That's the move — the sting is real, and you kept it from turning into a verdict about you.
> Nothing to undo here. Let's just be clear about what the event does and doesn't establish, so it stays that way.

### 3 · `d1` Decision — establish-check *(only for globalizing reads)*
> Which of these does the event actually establish?

**a) “Only that this one person didn't want to continue”** · tag `bounded_to_evidence`
- Feedback: *Right-sized. That's what the event supports — and it's worth being just as clear about what it doesn't.* → `r1`

**b) “That something's wrong with me”** · tag `jumped_to_conclusion`
- Feedback: *That's the jump — let's look at why one event can't carry it.* → `note-jump`

**c) “That it'll always be like this”** · tag `jumped_to_conclusion`
- Feedback: *“Always” reaches past one event — let's look at why.* → `note-jump`

### 3a · `note-jump` Teaching branch → rejoins `r1`
> One event can't establish a claim about everyone, about forever, or about your worth.
> The event is real. The size of the conclusion is what to check.

### 4 · `r1` Reveal (evidence) · label **“What this actually establishes”** *(evidence-bounded)*
> For sure: this one person, at this time, didn't want to keep dating you.
> What it can't establish: anything about everyone, about how it will always go, or about your worth.

→ **Continue** → `rc1`

### 5 · `rc1` Reconsider (narrowing) — *cognitive fidelity separated from emotional persistence*
> Land it on the smallest true thing the event supports.

**A. “This one person didn't want to keep dating me. That's what the event shows.”**
- Feedback: *That's the fact the event supports — nothing added, nothing inflated.*
- Fidelity: reconsidered **demonstrated** · response **demonstrated** → `t1`

**B. “I know that's what the event shows, even though the bigger story still feels true right now.”**
- Feedback: *That's the skill: the feeling doesn't have to disappear for you to stop treating it as evidence. You can hold the fact and the feeling at the same time.*
- Fidelity: reconsidered **demonstrated** · response **demonstrated** → `t1`

**C. “I still think this proves something is wrong with me.”**
- Fidelity: reconsidered **demonstrated** · response **not_demonstrated** → `note-still-wrong`

### 5c · `note-still-wrong` Teaching branch *(real pain vs. unsupported conclusion)* → rejoins `t1`
> The hurt is real, and it makes sense. Keep it — it's honest.
> But “something is wrong with me” is a conclusion this event can't support. One person's “not a match” can't establish that. Keep the pain; drop the verdict — the evidence doesn't back it.

### 6 · `t1` Teach / Handoff → **what-it-actually-means**
> Keeping the story the size of the facts is the whole operation.
> It won't erase the sting. It keeps a hard moment from becoming a verdict about you.

Button: **Open the tool →**

---

## Fidelity mapping (summary)

| Sim | Response | evidence_reconsidered | interpretation_response_appropriate |
|---|---|---|---|
| RD | A “ahead of the evidence” | demonstrated | demonstrated |
| RD | B “possible, not enough to call it” | demonstrated | demonstrated |
| RD | C “plan doesn't change losing interest” | demonstrated | **not_demonstrated** |
| WM | A “that's what the event shows” | demonstrated | demonstrated |
| WM | B “I know it, even though it still feels true” | demonstrated | demonstrated |
| WM | C “still proves something's wrong with me” | demonstrated | **not_demonstrated** |

**Persisted on completion:** only these two explicit states from the chosen reconsider response. Interpretation/temptation/first-read choices drive the on-screen chrome and are ephemeral (not stored as narrative).

**Guardrail 1 in the content:** the RD “hold” (B) is `demonstrated` and the WM “hold the verdict” (C) is `not_demonstrated` — proving fidelity is authored from each scenario's evidence, not from the signature.
