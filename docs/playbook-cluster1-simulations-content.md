# Cluster 1 — Authored Simulation Content (Experience Gate)

**Status:** FOR CONTENT/EXPERIENCE REVIEW. Not wired into the live Playbook. No deploy, no migration.
**Source of truth:** `content/playbook/moving-beyond-rejection-simulations.ts` (this doc renders it verbatim).
**Engine:** approved Step-4 foundation (deterministic graph, no LLM, non-scoring).

Every string below is the **exact consumer-facing copy** as it will appear. Fidelity states, JIT hooks, teaching branches, routing, and the Play handoff are shown for each node.

**Guardrails in force (approved):**
1. Fidelity is authored per node/response from that scenario's evidence — never fixed by signature.
2. JIT literature is Exposure/content-engagement only — it never contributes to Technique Fidelity or Transfer.
3. Process tags are narrowly behavioural/operational — never personality, attachment, diagnosis, etiology, or trait.

Reader controls throughout: **← Back** (exit), and each step advances only when the reader taps **Continue** (choices are tap/keyboard; no drag; reveals are user-advanced).

---

## Simulation A — Read It, Then Decide
`id: sim-rd-shorter-texts` · signature **`evidenceTimeline`** · start node `m1` · hands off to Play **read-and-decide**

**Signature presentation:** an unfolding **timeline**. As the reader advances, each moment/reveal is added to a left-rail “**What you've seen so far**” list, so evidence visibly accumulates over time. Header label: *“Reading the signals over time.”*

### 1 · `m1` — Moment (role: beat)
> Great first date. It was easy, and they said they'd love to see you again.

→ **Continue** → `m2`

### 2 · `m2` — Moment (role: beat)
> Over the next four days, their texts get shorter.

*(Timeline now shows moment 1 as a past beat.)*
→ **Continue** → `c1`

### 3 · `c1` — Capture (interpretation) · JIT hook → `lit-jit-ambiguity-spiral` (“Related read”)
Prompt:
> What do you think the shorter texts mean?

Choices (single-select):
- They're losing interest
- They're just busy this week
- That's just how they text
- I'm not sure yet

→ **Continue** → `c2`

### 4 · `c2` — Capture (temptation)
Prompt:
> What are you tempted to do?

Choices (single-select):
- Pull back to protect myself
- Double-text to check
- Wait and watch a bit
- End it now

→ **Continue** → `r1`

### 5 · `r1` — Reveal (role: evidence) · authored label **“New evidence”**
> Day 5: they message you to set up a real plan for next week.

→ **Continue** → `rc1`

### 6 · `rc1` — Reconsider
Prompt:
> Weigh your first read against the new evidence. Where does it land now?

Responses (each carries authored fidelity + educational feedback):

**a) “The plan is real evidence — my first read was ahead of the facts”**
- Feedback: *You let the new evidence update the story instead of the story updating the evidence.*
- Fidelity: `evidence_reconsidered: demonstrated` · `interpretation_response_appropriate: demonstrated`
- → `t1` (handoff)

**b) “Still not fully clear — I'll hold it open and keep watching”**
- Feedback: *“Not sure yet” is an evidence-appropriate place to stand: the plan is real, and some ambiguity remains.*
- Fidelity: `evidence_reconsidered: demonstrated` · `interpretation_response_appropriate: demonstrated`
- *(Holding is appropriate here — revising is not the target.)*
- → `t1` (handoff)

**c) “I still read it as losing interest”**
- Feedback: *You weighed it — let's look at what the concrete plan adds.*
- Fidelity: `evidence_reconsidered: demonstrated` · `interpretation_response_appropriate: not_demonstrated`
- → `note-keep` (teaching branch)

### 6b · `note-keep` — Teaching branch (Note) *(only if response **c** chosen; then rejoins)*
> One reading is “losing interest.” But they also just set up a real plan — that's evidence too, not only the shorter texts.
>
> The tool isn't about which read is nicer. It's about holding the read the size of what you've actually seen.

→ **Continue** → `t1` (rejoins the main handoff)

### 7 · `t1` — Teach / Handoff → Play **read-and-decide**
> That gap — between your first read and the new evidence — is exactly what this tool trains.
>
> It doesn't predict what they'll do. It helps your next move follow what you've actually seen.

Button: **Open the tool →** (hands off into *Read It, Then Decide*)

**On completion**, the persisted payload is the explicit fidelity outcome from the chosen reconsider response (e.g., response **c** → `{ evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" }`).

---

## Simulation B — What It Actually Means
`id: sim-wm-not-a-match` · signature **`conclusionNarrowing`** · start node `m1` · hands off to Play **what-it-actually-means**

**Signature presentation:** an **expand → narrow** view. The event is pinned at the top under “**What happened.**” The reader's chosen conclusion appears as a red “**…grew into**” chip; after narrowing, the smallest true thing appears as a green “**Narrowed to**” chip. Header label: *“How big did the story get?”*

### 1 · `m1` — Moment (role: event)
> After a few good dates, they say: “I had a great time, but I don't think we're a match.”

→ **Continue** → `c1`

### 2 · `c1` — Capture (expansion, role: expansion) · JIT hook → `lit-jit-globalizing` (“Related read”)
Prompt:
> In the moment, what did that start to turn into?

Choices (single-select — the reader's pick becomes the “…grew into” chip):
- This will happen with everyone
- It'll always be like this
- Something's wrong with me
- I'm not worth choosing

→ **Continue** → `d1`

### 3 · `d1` — Decision
Prompt:
> Which of these does the event actually establish?

Responses (educational feedback + narrow behavioural process tag):

**a) “Only that this one person didn't want to continue”**
- Process tag: `held_uncertainty`
- Feedback: *Right-sized. That's what the event supports — no more, no less.*
- → `r1`

**b) “That something's wrong with me”**
- Process tag: `jumped_to_conclusion`
- Feedback: *That's the jump — let's look at why one event can't carry it.*
- → `note-jump` (teaching branch)

**c) “That it'll always be like this”**
- Process tag: `jumped_to_conclusion`
- Feedback: *“Always” reaches past one event — let's look at why.*
- → `note-jump` (teaching branch)

### 3b · `note-jump` — Teaching branch (Note) *(only if response **b** or **c** chosen; then rejoins)*
> One event can't establish a claim about everyone, about forever, or about your worth.
>
> The event is real. The size of the conclusion is what to check.

→ **Continue** → `r1` (rejoins the main path)

### 4 · `r1` — Reveal (role: evidence) · authored label **“What this actually establishes”**
> This one person didn't want to continue. That's it — no more.

→ **Continue** → `rc1`

### 5 · `rc1` — Reconsider (role: narrowing)
Prompt:
> Narrow it back to the smallest true thing the event supports.

Responses:

**a) “This one person didn't want to keep dating me”**
- Feedback: *You kept the fact and dropped the verdict.*
- Fidelity: `evidence_reconsidered: demonstrated` · `interpretation_response_appropriate: demonstrated`
- *(Shows as the green “Narrowed to” chip.)*
- → `t1` (handoff)

**b) “I'll sit with the bigger version a while longer”**
- Feedback: *You weighed it — notice the event still only supports the small version.*
- Fidelity: `evidence_reconsidered: demonstrated` · `interpretation_response_appropriate: not_demonstrated`
- *(Unlike RD, holding the global verdict is not evidence-appropriate here.)*
- → `t1` (handoff)

### 6 · `t1` — Teach / Handoff → Play **what-it-actually-means**
> Keeping the story the size of the facts is the whole operation.
>
> It won't erase the sting. It keeps a hard moment from becoming a verdict about you.

Button: **Open the tool →** (hands off into *What It Actually Means*)

**On completion**, the persisted payload is the explicit fidelity outcome from the chosen reconsider response.

---

## Cross-simulation notes for review

- **Non-scoring:** no response is labelled correct/best; no branch predicts what the other person does. Branching only changes which **teaching** the reader receives.
- **Fidelity contrast (guardrail 1):** “hold” is `demonstrated` in RD (ambiguity genuinely remains) and `not_demonstrated` in WM (the global verdict outruns one event). This is authored from each scenario's evidence, not from the signature.
- **JIT hooks (guardrail 2):** `c1` in each simulation offers a **Related read** link (RD → “When a small change becomes a big story”; WM → “When one thing becomes everything”). Opening it is Exposure only; it never affects fidelity.
- **Process tags (guardrail 3):** only `held_uncertainty` / `jumped_to_conclusion` appear, describing the operation in the moment.
- **Reveal labels are authored per scenario:** “New evidence” (RD) vs “What this actually establishes” (WM).
- **What is persisted:** only the two explicit fidelity states from the chosen reconsider response. Interpretation/temptation choices are ephemeral (used for the on-screen chrome, not stored as narrative).
