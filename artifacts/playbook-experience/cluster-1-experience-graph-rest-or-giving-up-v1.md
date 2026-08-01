# Experience Content Graph — "Rest, or Giving Up?" (`decisionRoom`) — v1 (final)

**Status:** PRODUCTION COPY, APPROVED after 10 final revisions. Authoring artifact only — **no code,
no migration, no wiring, no deploy.** Second of four (order: Is This Right for You? ✅ → **Rest, or
Giving Up? ✅** → How Much to Put In → Say the Real Thing). The other two graphs are **not** authored
yet. The two existing Experiences and the RLC framework are unchanged.

**Play:** Rest, or Giving Up? · **Signature:** `decisionRoom` · **Provisional sim id:**
`sim-rgu-decision-room` (v1) · **Handoff Play id:** `rest-or-giving-up` *(Play not built yet —
provisional).*

Built entirely from existing node primitives (`moment` · `decision` · `note` · `reconsider` ·
`reveal` · `teach`) — **no new node kinds** (owner decision #7). **The only Cluster 1 Experience with
no other person in it.** No free-text surface (the optional return-conditions capture was removed —
re-entry conditions belong to the Play, not the simulation).

**10 final revisions applied:** (1) stance `reacting` → **`pause_decision`** (never labels the
user's state "reacting"); (2) fidelity `deliberate_decision_made` → **`intentional_stance_selected`**
(so intentionally postponing legitimately satisfies the operation); (3) **adaptive** reconsideration
— bounded reads (rest/not-now) are not challenged as merely emotional; the stronger temporal
intervention is **primarily for the forever-conclusion** read; (4) removed "often a wise one"; (5)
removed the invented "somewhere better to put your energy" — reason stays **user-owned**; (6) "full
stop, not a question mark" → **"a complete choice for now"**; (7) "chasing" → **"without actively
pursuing right now"**; (8) **removed** the free-text return-conditions capture; (9) **persist the
signature-specific fidelity pair** alongside `chosen_stance`; (10) explicit note that the ordinary
"never going to happen" read **does not** independently trigger a support signpost.

---

## 1. Premise & teaching target

The user is put *inside* a low, common moment of **dating fatigue / discouragement / loneliness /
dread / low motivation** — named plainly, honored, never pathologized. The pull is to let a hard
feeling quietly make (and permanently fix) the decision: *"I'm done, it's never going to happen."*
The Experience helps the user **distinguish the transient feeling from a chosen, revisitable stance**
and select an **intentional** stance from present capacity and intention — where *intentionally
postponing the decision* is itself a legitimate stance.

Non-negotiables baked into every branch:
- **The system never pushes toward dating.** Rest, not-now, and pausing the decision are **complete,
  co-equal outcomes** — never treated as lesser than staying open.
- **Intentional rest is valid; a break is not a failure; loneliness is not a diagnosis.**
- **No other person, no partner beats, no outcome scoring, no trait/etiology inference.**
- **Bounded reads (rest / not-now) are not challenged as though they might merely be emotional.** The
  stronger temporal intervention is reserved primarily for the forever-conclusion read.
- **Support escalation only via the already-approved criteria** (persistence / pervasiveness and
  Layer-A crisis rules). Selecting the ordinary, dating-specific *"never going to happen"* read does
  **not** independently trigger a signpost (§7).
- Uses the tightened phrasing: *"that's a forever conclusion showing up in a discouraged moment,"*
  never "that's the discouragement talking."

---

## 2. Node index (adaptive flow)

```
rgu-n1 (moment: the felt entry — the app ping, the tired)
   → rgu-c1 (decision: "Right now, what's most true?")
        ├ (a) rest / (b) not_now / (c) discouraged / (d) lightly_open / (e) return_later
        │        → rgu-note-ack → rgu-c2        (bounded / present reads — NOT challenged as merely emotional)
        └ (f) "I'm done / never going to happen"
                 → rgu-note-forever → rgu-r1    (the stronger temporal intervention, primarily here)
   → rgu-r1 (reconsider — forever-conclusion path only: decide-for-now / let-settle / hold-never)
        ├ "decide, just for now"   →                          ─┐
        ├ "let the feeling settle" → rgu-note-settle          ─┤→ rgu-c2
        └ "it's not just-for-now…" → rgu-note-hold-forever    ─┘
   → rgu-c2 (decision: "For right now — not forever — what do you want to do?")  [sets chosen_stance]
        ├ rest           → rgu-note-rest    ─┐
        ├ not_now        → rgu-note-notnow  ─┤
        ├ lightly_open   → rgu-note-lightly ─┼→ rgu-reveal
        ├ return_later   → rgu-note-return  ─┤
        └ pause_decision → rgu-note-pause   ─┘
   → rgu-reveal (reflect the chosen, revisitable stance — no push, no verdict)
   → rgu-teach (terminal handoff → "Rest, or Giving Up?" Play)
```

*(Whoever wants to defer selects **`pause_decision`** at `rgu-c2` — a full, intentional stance, not a
non-answer. `rgu-r1` is reached **only** by the forever-conclusion read, per revision #3.)*

---

## 3. Every node — exact consumer copy

### rgu-n1 — `moment` (the felt entry)
> The app pings — a new match, or just the icon sitting there on your screen. You look at it for a
> second and feel… tired. Not heartbroken. Just done-for-now tired. Another week, another round of
> this.

`next → rgu-c1` · **JIT hook available** (see §6): *"Dating fatigue isn't a verdict."*

### rgu-c1 — `decision` ("Right now, what's most true?")
| Option | Inline feedback | → |
|---|---|---|
| (a) "I need a rest." | "That's allowed." | `rgu-note-ack` |
| (b) "I don't want to date right now." | "That's a complete answer." | `rgu-note-ack` |
| (c) "I'm just discouraged — that last one stung." | "Makes sense." | `rgu-note-ack` |
| (d) "I want to stay a little open, without actively pursuing anything." | "Real stance." | `rgu-note-ack` |
| (e) "I might come back to it later, when it's on my terms." | "Also allowed." | `rgu-note-ack` |
| (f) "Honestly? I'm done. It's never going to happen for me." | "Let's slow that one down." | `rgu-note-forever` |

*(Loneliness JIT is available here too. The read informs
`discouragement_distinguished_from_conclusion` — see §5.)*

### rgu-note-ack — `note`
> That's a real read, and it's yours to have. Nothing here is going to nudge you back toward dating —
> the only thing we're doing is making sure it's *you* deciding, and not just the tired.

`next → rgu-c2`

### rgu-note-forever — `note` (the tightened distinguishing teaching)
> That's a forever conclusion showing up in a discouraged moment — and the feeling is real. Notice
> it's answering a *forever* question with *tonight's* feeling. You don't have to call it forever
> right now.

`next → rgu-r1` · **JIT hook available** (see §6): *"Rest is not giving up."*

### rgu-r1 — `reconsider` (forever-conclusion path only)
> So — is this something you want to *decide* right now, or a feeling you want to let *settle*
> first? Both are fine.

| Option | `discouragement_distinguished_from_conclusion` | → |
|---|---|---|
| "I want to decide something — just for now." | demonstrated | `rgu-c2` |
| "I want to let the feeling settle before I decide anything." | demonstrated | `rgu-note-settle` |
| "Honestly, it doesn't feel like just-for-now — it feels like it's just not going to happen." | not_demonstrated | `rgu-note-hold-forever` |

### rgu-note-settle — `note`
> Letting it settle is a decision too. You can set the whole question down for now and come back to
> it when your head's clearer. Nothing's expiring.

`next → rgu-c2`

### rgu-note-hold-forever — `note` (honors the read, no push, keeps it revisitable)
> Okay — you don't have to talk yourself out of how it feels tonight. Just one thing to hold:
> "never" is a big word for one hard stretch. You're allowed to leave it open even if it doesn't
> *feel* open right now. Nothing you pick here is permanent.

`next → rgu-c2`

### rgu-c2 — `decision` ("For right now — not forever — what do you want to do?") — **sets `chosen_stance`**
| Option | `chosen_stance` | → |
|---|---|---|
| "Rest. I'm setting it down for a while." | `rest` | `rgu-note-rest` |
| "Not now. I don't want to date right now." | `not_now` | `rgu-note-notnow` |
| "Stay lightly open — around, without actively pursuing right now." | `lightly_open` | `rgu-note-lightly` |
| "Come back to it later, on conditions I choose." | `return_later` | `rgu-note-return` |
| "I'm not deciding yet — I want to let it settle." | `pause_decision` | `rgu-note-pause` |

*(All five are co-equal; none is privileged. Reaching any of them — including `pause_decision` —
= `intentional_stance_selected: demonstrated`, see §5.)*

### rgu-note-rest — `note`  *(reason stays user-owned — revision #5)*
> Rest is a real choice, not giving up. Setting it down for a while isn't a failure — it's you
> deciding, for your own reasons, that now isn't the time. You can pick it back up whenever you want.

`next → rgu-reveal`

### rgu-note-notnow — `note`
> "Not now" is a complete answer. You don't owe the apps — or anyone — a reason. It stays your call,
> and you can change it whenever you want.

`next → rgu-reveal`

### rgu-note-lightly — `note`  *(revision #7)*
> Lightly open is a real stance, not a lukewarm one — open to what comes, without actively pursuing
> anything right now. That's a perfectly good place to be.

`next → rgu-reveal`

### rgu-note-return — `note`  *(re-entry conditions belong to the Play — revision #8)*
> Later, on your terms — the door stays open, on conditions you'll set when the time feels right.
> Nothing to pin down tonight.

`next → rgu-reveal`

### rgu-note-pause — `note`  *(never labels the state "reacting" — revision #1)*
> Letting it settle it is. You've chosen *not to decide from a low moment* — which is its own kind of
> steady. Come back to it whenever you want.

`next → rgu-reveal`

### rgu-reveal — `reveal` (reflect the chosen, revisitable stance — no push, no verdict)
> Here's where you landed — on purpose, for now, and yours to change:
>
> **{stance summary — one authored line, see below}**
>
> Not giving up, not a failure, not forever unless you decide it is. Whatever you chose — rest,
> later, lightly open, or just not tonight — it's a decision you made from where you actually are,
> and you can revisit it anytime.

**Stance summary — exactly one line, by `chosen_stance`:**
- `rest` → *"Rest — you're setting dating down for a while."*
- `not_now` → *"Not now — you're not dating right now. That's a complete choice for now."*
- `lightly_open` → *"Lightly open — around, without actively pursuing right now."*
- `return_later` → *"Later, on your terms — the door's open on conditions you choose."*
- `pause_decision` → *"Not deciding yet — you're letting a low moment settle before you call anything."*

`next → rgu-teach`

### rgu-teach — `teach` (terminal handoff)
> Out in real life, this is the tool: when dating feels heavy, make the call *on purpose* — from
> your capacity and what you actually want — instead of letting a hard week decide for you. Whatever
> you choose, including setting it down, is yours, and it's revisitable. Here's the Play.

`toPlayId → rest-or-giving-up` *(provisional — Play not yet built).* Terminal, no `next`.

---

## 4. Teaching-branch summary

- **`note-ack`** validates any bounded/present read and states the no-push guarantee — and does
  **not** re-challenge it as though it might merely be emotional (revision #3).
- **`note-forever`** applies the temporal distinction *primarily* to the "never" read — observation,
  not correction.
- **`rgu-r1`** (forever-conclusion path only) is the reaction-vs-conclusion split; **all three
  options route forward** — even holding the "never" framing is honored with no coercion.
- **`note-rest / notnow / lightly / return / pause`** each validate a co-equal intentional stance;
  reasons stay user-owned; rest/not-now/pause are never framed as lesser than staying open.

---

## 5. Fidelity model (signature-tagged; owner decision #1)

`FidelityOutcome` for `decisionRoom` (discriminated by `signature: "decisionRoom"`) carries exactly
two fields, each `demonstrated | not_demonstrated | not_applicable`. **No score.**

| Signal | `demonstrated` when… | `not_demonstrated` when… | `not_applicable` |
|---|---|---|---|
| `intentional_stance_selected` | the user lands **any** stance at `rgu-c2` from present capacity/intention — **including `pause_decision`** (intentionally postponing is a legitimate stance, not a failure to decide), and **rest/not-now count identically to staying open** | the user exits before reaching a stance at `rgu-c2` | never in v1 (the flow always reaches `rgu-c2`) |
| `discouragement_distinguished_from_conclusion` | the user **never** picked the forever-conclusion (f), **or** picked it but at `rgu-r1` chose "decide just for now" / "let it settle" | at `rgu-r1` the user re-asserts the forever framing ("it's just not going to happen") | never in v1 (the flow is always resolvable) |

Notes:
- **`intentional_stance_selected`** (renamed from `deliberate_decision_made`) is satisfied by
  *intentionally postponing* — it never falsely claims an engagement/rest decision was made
  (revision #2).
- Rest/not-now/pause are **not** lower scores than engagement.
- `not_demonstrated` is **non-punitive** — it never scolds, blocks, or pushes; it only informs
  in-session reflection / Play context and (optionally) literature surfacing.
- JIT views never change a signal (Exposure only).

---

## 6. JIT literature hooks (Exposure only — proposed anchors)

| Anchor node | Proposed JIT entry id | Working title | Function |
|---|---|---|---|
| `rgu-n1` / `rgu-c1` | `lit-jit-fatigue-not-verdict` | "Dating fatigue isn't a verdict" | normalizes fatigue without pathologizing |
| `rgu-c1` (loneliness-adjacent) | `lit-jit-loneliness-signal` | "Loneliness is a signal, not a diagnosis" | de-pathologizes loneliness |
| `rgu-note-forever` | `lit-jit-rest-not-giving-up` | "Rest is not giving up" | separates intentional rest from defeat |

Exposure only — optional, never required, never advances Attempt / Technique Fidelity / Transfer.
Entry ids are proposals; literature authored later.

---

## 7. Safety & escalation boundary

- **In scope (no escalation):** ordinary dating fatigue, discouragement, loneliness, dread, low
  motivation — handled entirely within this decision-room, with rest/not-now/pause validated as
  complete.
- **The ordinary "never going to happen" read (`rgu-c1` option f) does NOT independently trigger a
  support signpost.** It is a common, dating-specific discouraged read; the graph responds with the
  temporal distinction, not a signpost. **Escalation is governed *only* by the already-approved
  persistence / pervasiveness and Layer-A crisis rules** — this Experience adds **no new detection
  logic** and persists **no raw disclosure** (metadata-only posture unchanged).
- **No free-text surface.** The optional return-conditions capture was removed (revision #8); all
  inputs are bounded selects. Re-entry conditions are handled later in the **Play**, not here.

---

## 8. Minimal persistence payload  *(revision #9 — fidelity pair persisted)*

Persists the bounded `chosen_stance` enum **and** the signature-specific fidelity pair, matching the
approved discriminated `FidelityOutcome` architecture (decisions #1 + #9).

```
{
  object_type: "simulation",
  object_id:   "sim-rgu-decision-room",   // provisional
  object_version: 1,
  signature: "decisionRoom",
  completed: true,
  chosen_stance: "rest" | "not_now" | "lightly_open" | "return_later" | "pause_decision",
  fidelity: {
    intentional_stance_selected:                  "demonstrated" | "not_demonstrated" | "not_applicable",
    discouragement_distinguished_from_conclusion: "demonstrated" | "not_demonstrated" | "not_applicable"
  }
}
```

- **Ephemeral / never persisted:** all felt content, the reveal text, any JIT views. **No free text
  exists anywhere** in this Experience. **Never exists:** any mood score, any diagnosis, any partner
  data.

---

## 9. Conceptual-drift guards checked (this graph)

- ✅ **No other person / partner beats** — a true decision-room; the object is the user's own state.
- ✅ **No push toward dating** — rest, not-now, and pause are co-equal, fully validated outcomes.
- ✅ **Bounded reads are not challenged as merely emotional** (adaptive flow; `rgu-r1` is
  forever-conclusion-only).
- ✅ **The state is never labeled "reacting"** — the postpone stance is `pause_decision`.
- ✅ **Reasons stay user-owned** — no invented motive ("somewhere better to put your energy" removed).
- ✅ **Loneliness/fatigue not pathologized; break ≠ failure** — stated in copy, not just intent.
- ✅ **Not a mood tracker** — only a bounded stance enum + the two fidelity signals are stored.
- ✅ **The ordinary "never" read is not, by itself, a signpost trigger** — escalation only via the
  already-approved persistence/pervasiveness + Layer-A crisis rules.
- ✅ **Observation-not-trait; no scoring; JIT Exposure only; no free-text surface.**

---

## 10. Open items surfaced by authoring (for owner note — not blockers)

1. **Handoff Play id + sim id** provisional; finalized when the Play is built.
2. **Three JIT entry ids** (`lit-jit-fatigue-not-verdict`, `lit-jit-loneliness-signal`,
   `lit-jit-rest-not-giving-up`) are proposals to author in the literature layer.
3. **Re-entry conditions** now live in the eventual **Play** (removed from the simulation per
   revision #8) — a note for Play authoring, not a blocker here.

**Next (on approval of this graph):** author **How Much to Put In** (`investmentView`) — still
design/copy only, one graph at a time. No code, migration, wiring, or deploy until you approve the
full set.
