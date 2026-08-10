# 08 — Safety & Suitability Boundaries

**Status:** AS BUILT (working tree) for the mechanisms; the R-tier suitability *labels* are a design/content concept (see §1 naming note).
**Primary sources:** `lib/playbook/crisisSafety.ts`, `lib/companion/safety*` (the frozen Safety V2 engine), `app/api/playbook/[key]/screen/route.ts`, Play `supportSignposts` + `suitability` content, the approved Experience graphs & Play specs.

---

## 1. ⚠️ Naming note: two different "R1/R2/R3" vocabularies

There is a naming collision the reader must not conflate:

- **In the RLC framework (the theory / this task's request):** `R1 = self-guided`, `R2 = supported/facilitated`, `R3 = clinician-dependent`, plus an **excluded/safety route**. These are *intervention-readiness/suitability tiers*. **They are not a code enum** — they are expressed in content (`suitability` strings, `supportSignposts`, routing) and in the approved Play/Experience specs.
- **In the codebase comments:** `R1/R2/R3/R4` are **release-phase markers** — `R1` = stable keys/ids, `R2` = versioning, `R3` = current-state persistence, `R4` = Layer A crisis safety (e.g. `contentSchema.ts:1`, `progress.ts:5`, `crisisSafety.ts:1`). **These have nothing to do with the suitability tiers.**

This document uses "R1/R2/R3 suitability" to mean the *framework* tiers, and calls the code markers "release-phase R-numbers" where relevant.

---

## 2. The two safety layers (as built)

The Playbook implements a **two-layer** safety model:

### Layer A — Crisis Safety Detection (shared, content-agnostic) — `crisisSafety.ts`
- A thin adapter over the **frozen deterministic Safety V2 engine** (`lib/companion/safety`). "Content-agnostic: identical behavior in any Play or cluster." (`crisisSafety.ts:1-6`).
- `screenPlaybookText(userId, text)` (`:17-31`): trims; empty → no interrupt; else calls `screenText(text, { userId, context: "playbook" })`. On interrupt, returns `{ interrupt, heading, message, resources }` — **only clinician-authored copy + resource labels/values; the user's text is never echoed back**.
- **Non-blocking by design**: the caller surfaces resources but does not prevent the reader continuing.
- **Where it fires:** every bounded free-text field routes through it on advance/blur — the simulation `capture` shortText, the Play `ownTurn` fields, and the Use Review `experience` note. The `/screen` route fails open and persists nothing.

**The detection model (Safety V2 engine)** uses an **`action_level` 0–3** severity, *not* the R1/R2/R3 tiers:
- Per-clause context analysis (subject/media/hypothetical suppression, per-clause negation with contrastive-reversal recovery, temporality).
- `action_level = 3` (`immediate_danger`) requires **an actionable disclosure AND a strong present-danger immediacy signal**; otherwise `action_level` = max severity of actionable findings; `0` = no signal.
- **Absence of a trigger is never treated as "safe."**
- **Metadata-only logging:** findings are logged to `companion_safety_events` as **concept-level metadata** (`matched_pattern` = canonical concept, category, severity, temporality, subject) — **never the raw user text**, never to analytics/URLs/the event store.

### Layer B — Play support signposts (content-driven, per Play)
- `supportSignposts` on a Play (`PlaySupportSignpost { id, heading, body }`) surface **content-authored** guidance for heavier material. They are **not** a crisis screening call.
- Cluster 1 has one: `severe-self-worth` on `what-it-actually-means` (`finding-love-that-feels-mutual.ts:429-436`; its Rev 3 body swapped by `rev3Play`). It signposts a mental-health professional when a dating letdown is signalling something bigger than one moment.
- Verified distinct from Layer A: `playbook-safety.interaction.test.ts` — "Layer B: the Play support signpost is content-driven — it does NOT emit a crisis screening call."

---

## 3. Suitability model as implemented (R1/R2/R3 → content)

The framework's suitability tiers are expressed through concrete content mechanisms, **not** a code enum:

| Framework concept | As-built expression |
|---|---|
| **R1 (self-guided)** | The default Playbook experience — every Play is a self-guided tool. All six Cluster 1 Plays are R1-scoped by design (the specs state "strictly R1/low-risk" where relevant, e.g. Say the Real Thing). |
| **R2 (supported/facilitated)** | Not a runtime state; surfaced as **Layer B support signposts** and `suitability` copy that point toward supported settings when material is heavier. |
| **R3 (clinician-dependent)** | Surfaced via signpost copy toward a mental-health professional (e.g. `severe-self-worth`), and via the `suitability` boundary on missions (WM: "…mental health professional"). |
| **Excluded / safety route** | Layer A crisis detection (immediate danger → resources) + authored exclusions in the Experience graphs (e.g. mistreatment/coercion routed out, not treated as an ordinary fit trade-off). |

Mission `suitability` strings are the explicit runtime suitability signals (`finding-love-that-feels-mutual-missions.ts:22, 41`): RD "for ambiguity, not safety…"; WM "bigger than one dating moment… mental health professional."

---

## 4. Hard safety/framework prohibitions (as built)

The implementation makes — and the tests enforce — these guarantees:

- **No diagnosis.** No diagnostic label anywhere.
- **No attachment classification.** No attachment-style typing.
- **No motive or etiology inference.** Process tags are "narrowly behavioural/operational (no trait/etiology language)" (`playbook-simulation-guardrails.test.ts` G3).
- **No relationship-health score.** No numeric score exists in `FidelityOutcome` or anywhere (`playbook-simulation.test.ts` "NON-SCORING: no option carries score/correct/outcome keys").
- **No partner monitoring / surveillance.** No type or column accepts partner data; missions "never prompt partner surveillance/monitoring" (`playbook-mission.test.ts`); no free-text journaling channel (`playbook-safety.interaction.test.ts`).
- **Relationship outcome never determines Technique Fidelity** (`playbook-guardrails.test.ts`).
- **Ordinary discomfort does not trigger support.** Ordinary fatigue / loneliness / discouragement / worry are in-scope, non-escalating: `support_signpost_candidate` is "rare, never a trigger, and off ordinary fatigue/loneliness/worry" (`playbook-literature.test.ts`); the ordinary "never going to happen" dating read does **not** trigger a signpost (DECISION-LOG #21).
- **Mistreatment / respect boundary.** A single mild dismissive moment is *not* classified as established mistreatment; coercion/intimidation/abuse stays excluded/safety-routed (DECISION-LOG #19, Is This Right for You? exclusion beat).

---

## 5. Per-pathway suitability & safety boundary

| Pathway | Suitability | Safety boundary (as authored/approved) |
|---|---|---|
| **What It Actually Means** (`conclusionNarrowing`) | R1 self-guided | `severe-self-worth` **Layer B signpost** → mental-health professional when a letdown signals something bigger; not positive thinking; "their loss" flagged as an error (DECISION-LOG #10, `playbook-guardrails.test.ts`). |
| **Read It, Then Decide** (`evidenceTimeline`) | R1 self-guided | Mission `suitability`: "for ambiguity, **not safety**." Discernment ≠ passive waiting; not scorekeeping/testing (`playbook-guardrails.test.ts`). |
| **Is This Right for You?** (`dualAttention`) | R1 self-guided | Exclusion beat: respect/treatment ≠ ordinary fit; one event ≠ character; coercion/abuse excluded & safety-routed (DECISION-LOG #19). Mirror reports observed choices, never a fit-score/verdict. |
| **Rest, or Giving Up?** (`decisionRoom`) | R1 self-guided | Ordinary fatigue/discouragement in-scope, **not** pathologized; the ordinary "never going to happen" read does **not** trigger a signpost; escalation only via the approved persistence/pervasiveness + Layer-A crisis rules (DECISION-LOG #21). "This isn't a diagnosis." |
| **How Much to Put In** (`investmentView`) | R1 self-guided | Excluded vocabulary (mirroring/withholding/response-time-matching/pursuit-tests/scorekeeping) never modeled; the control-check forbids it; other person's beats independent of the reader's investment (DECISION-LOG #24, #35). |
| **Say the Real Thing** (`communicationRehearsal`) | **Strictly R1 / low-risk only** | Three low-risk moments only; higher-risk/confrontational material routed to approved supported/excluded settings; success is never "did they like it" (DECISION-LOG #26, #37). |

---

## 6. Persistence/pervasiveness gate

Support escalation beyond ordinary discomfort is governed only by the already-approved **structured-persistence / pervasiveness** criteria plus the Layer-A crisis rules (DECISION-LOG #17, #21). In content terms: a single event or an ordinary difficult read is never a trigger; only a repeated, structured, cross-context pattern (or a Layer-A immediacy signal) escalates. The Change Path routing preserves this — remaining discomfort after demonstrated fidelity never routes backward, and non-attempt reports are no-fault.

---

## 7. Attorney review

**Not represented in the repository.** No attorney sign-off artifact exists here. Treat legal/attorney review as **not evidenced** — do not claim it has been performed. (For the related Companion product, project memory records attorney review as explicitly *not performed*; the Playbook's status is simply un-evidenced in-repo.) See `14-…`.
