# Relationship Companion — Safety Layer V2

**Status:** built behind the existing flag; **migration `0048` NOT yet run in production**;
response copy + resources **pending owner review** (this document). This is an
application-level safety system **around** the RLC framework — it does not modify any
RLC construct, competency, developmental task, domain score, phase, or assessment logic.

---

## 1. Architecture

```
learner free-text
  → normalize in memory (never persisted for safety)
  → SafetyEngine.classify()            [lib/companion/safetyEngine.ts — PURE, deterministic]
       · per-clause matching (negation / subject / temporality scoped LOCALLY)
       · multiple categories at once (array of findings, no single "winner")
       · immediacy = actionable disclosure + STRONG present-danger signal
  → routing decision (action_level 0–3, immediate_danger, categories)
  → authorized persistence of the learner's own entry (their content is theirs)
  → structured, version-stamped safety event   [METADATA ONLY — no raw text]
  → normal Companion processing only when action_level = 0
```

- **Engine (pure):** `lib/companion/safetyEngine.ts`. No DB, no I/O — so it is exhaustively unit-tested (`test/safety.test.ts`, 29 cases) and **never sends a disclosure anywhere**.
- **Server orchestration:** `lib/companion/safety.ts` — loads the versioned registry (60s cache), classifies, logs metadata, routes the response.
- **Registry (versioned, centralized):** `companion_safety_triggers` (+ V2 fields), `companion_safety_immediacy_terms` (new), `companion_safety_responses`, `companion_safety_resources`. No safety vocabulary is hard-coded in routes or components.
- **Surfaces screened (classify-before-process):** experience autosave, Blueprint, Planner, and Journey titles (titles only surface an interrupt at level ≥ 2 — item 15).

## 2. Severity (owner framework)

| Severity | Meaning |
|---|---|
| 1 | possible / ambiguous / context-sensitive signal |
| 2 | clear disclosure without evidence of acute/imminent danger |
| 3 | explicit serious harm, suicidal intent, severe violence, sexual assault/force, or credible threat |

Severity is **not** auto-assigned to 3 because a word appears. Acuity is a **separate flag**
(`immediate_danger`), set only when an actionable disclosure combines with a strong
present-danger signal (intent / active act / weapon / confinement / escalation). A bare
immediacy word ("right now", "tonight") never escalates on its own.

## 3. Response copy — OWNER-APPROVED (round 2), seeded via the registry

None assert what the relationship "is", none say the person is "safe", none diagnose,
each states the tool is not monitoring in real time, and the immediate-danger copy
preserves agency ("if you can do so safely") rather than implying law enforcement is
always safest. Stored in `companion_safety_responses` (see `registry.seed.json`).

**Level 1 — Possible concern (non-blocking unless another rule raises the level):**
> **Support is available.**
> Something you shared may be worth getting additional support around. You can keep going, or you can view support options at any time. You decide what feels right for you.

**Level 2 — Clear safety concern (acknowledge before routine RLC guidance continues):**
> **Let's pause here for a moment.**
> Something you shared raises a concern about your well-being or safety. You do not have to figure out what it means on your own. This tool cannot assess your safety or respond in real time, but you can connect with people who are trained to listen, help you think through what is happening, and discuss your options.
>
> You decide whether you want to contact a resource below.

**Level 3 — Serious safety concern:**
> **Let's pause and focus on your safety.**
> Something you shared may involve a serious risk of harm to you or someone else. This tool cannot assess the situation, provide crisis care, or monitor what is happening in real time. Please consider connecting with a trained crisis or safety resource below, or with someone you trust who can be with you and help you get support.

**Immediate-danger addendum (layered on L3; agency preserved):**
> **If someone may be in immediate danger:**
> Contact local emergency services if you can do so safely. In the United States, call 911. You can also use the support options below to connect with trained help.

**Digital-safety notice (shown when `digital_safety` is true — IPV / sexual coercion):**
> **Need privacy?**
> Someone with access to your device may be able to see your browsing activity. Nothing on this screen will automatically text, email, call, or notify anyone. You choose what you open. Use Quick Exit if you need to leave this screen quickly.

## 4. Quick Exit — APPROVED for V2 (discreet-mode interstitials only)

Approved for IPV / sexual-coercion discreet-mode safety interstitials **only** in V2
(not site-wide — that is a later UX/security decision). Requirements to implement in the
client-rendering stage:
- Exits **immediately** to a neutral destination; **no** confirmation modal first.
- Visually accessible without labeling the whole page as abuse-related; keyboard-activatable.
- Makes reasonable effort to prevent returning to the sensitive screen via Back
  (`location.replace()` + `history.replaceState`), **without** claiming it clears or
  erases browser history or removes evidence of the visit.
- Includes a discreet reminder that device/browser activity may still be visible to
  someone with device access.
- The digital-safety notice deliberately does **not** promise the screen "won't announce
  itself" (we cannot guarantee every browser/device behavior).
- Tested on major mobile + desktop browsers before production.

The routing/flag (`digital_safety`) is built; the Quick-Exit UI lands with the client
interstitial rendering (stage 7).

## 5. Resource routing (item 13)

Routed by `resource_kind` (`suicide_crisis` | `ipv` | `sexual_assault` | `emergency`) and
`jurisdiction` (default `US`, with a `GLOBAL` fallback; architecture is jurisdiction-aware
for non-US users later). A resource is treated as **verified only** with a real
`verified_at` + `verified_by` + `source` — seed presence is never verification.

**You still need to supply + legally review the actual contacts** (I will not fabricate crisis numbers). Minimum U.S. set:
- suicide/self-harm crisis (e.g. 988) · IPV hotline · sexual-assault hotline · emergency (911).

## 6. Privacy & logging (item 10)

Raw disclosures are **never** copied into events, analytics, URLs, console, or error
monitoring. Events store: `action_level`, `immediate_danger`, `categories[]`,
`immediacy_kinds[]`, `findings_meta` (structured per-finding: rule id, category, concept,
severity, subject, temporality), `context`, `situation_ref`, and the **`safety_engine_version`
+ `registry_version`** that produced them (for later false-pos/neg review).

## 7. "Absence is not safety" (item 14)

`action_level = 0` means **`no_safety_signal_detected`**, never "safe". There is no field,
copy, or analytic anywhere that equates no-trigger with safety.

## 8. Known limitations / edge cases for human review

- **Anaphora / paraphrase:** the engine matches the registry vocabulary. Pronominal references ("he does that to me") work only via explicit patterns; wholly novel phrasings won't match. Monitor false negatives via events; extend the registry (no code change needed).
- **Reversal heuristic:** "…never hit me, but he actually did" is re-activated correctly, but a later contrastive clause affirming a *different* concern can occasionally re-activate a negated concept. It errs toward **detection** (the safe direction) — flagged for tuning.
- **Hyperbole:** bare "kill him" now classifies at severity 1 (non-blocking L1) rather than as intent, so idiomatic use is tolerated; explicit intent ("I want to kill him") is severity 3.
- **Confinement + present cue:** a confinement disclosure ("won't let me leave") is a clear IPV concern (sev 2) but escalates to `immediate_danger` **only** when a present-tense cue co-occurs ("right now", "tonight", a current temporal marker) — a described ongoing pattern is not treated as a present emergency.
- **Ambiguous acute means:** a weapon + anaphoric intent with no determinable category stays **undetermined** (`category_undetermined`, `categories: []`) and routes to emergency + general crisis support — never defaulted to a specific category.
- **Self-harm vs accidental injury:** only intentional formulations classify; plain "I cut myself" does not — so a genuine intentional disclosure phrased only as "I cut myself" is a false negative by design (accidental-injury protection). Monitored via events.
- **Language/locale:** lexicons are English-only.

## 9. Staged rollout (item 16)

1. ✅ Engine + context modules + 29 tests (all pass; `npm test` green, `tsc` clean).
2. ✅ Migration `0048_safety_v2.sql` prepared (additive, RLS-locked) — **not run**.
3. ✅ Server routing + all surfaces wired (classify-before-process).
4. ✅ Proposed registry seed (`data/companion-safety/registry.seed.json`) + idempotent seed script.
5. ⏳ **Owner review:** severities in the seed · response copy above · IPV Quick-Exit scope · verified resources.
6. ✅ Owner ran `0048`; registry seeded (170 triggers / 38 immediacy / 5 approved responses); verified live.
7. ✅ Client rendering: L1 non-blocking banner · L2/L3 blocking interstitial · immediate-danger addendum · digital-safety notice + scoped Quick Exit. Browser-verified all 5 states.
8. ⏳ Admin CMS V2 authoring fields (maintain registry ongoing) — next stage.
9. ⏳ Owner explicitly approves client UX → enable `NEXT_PUBLIC_COMPANION_ENABLED` (still OFF).
