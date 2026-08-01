# 10 — Testing & Acceptance Criteria

**Status:** AS BUILT. 33 playbook test files in `test/`. Latest reported total: **376/376 green**, `tsc --noEmit` clean, `npm run build` green (DECISION-LOG #52/#53).
**Runner:** `node:test` + `tsx` + `jsdom` / `@testing-library/react` (interaction tests). `SHARED` = reusable infra; `C1` = Cluster-1-specific content.

---

## 1. Test inventory by subsystem

### Content validation — **C1** (+ shared registry)
- `playbook-content.test.ts` — shipped content module structurally valid; approved screen-complete Play set; every Play produces an executable output; recognition route/validate cards; validator catches malformed content; keys registry decouples `playbook_key`↔`cluster_id` and round-trips.
- `playbook-literature.test.ts` — literature ids unique + valid depth/scope; three depths present; blocks valid; JIT surfaces at anchors not browse; **the 101-statement map covers each statement exactly once**; `none` exclusive; **only RD+WM are routed to**; expectancy statements do NOT auto-route; loneliness normalizes; not every statement is an intervention.
- `playbook-rev3copy.test.ts` — v0 content untouched by the copy transform; structure/logic preserved (wording only); Rule Builder guardrail unmistakable; WM keeps real-pattern-vs-global-verdict + emotion beat + signpost.

### Graph validation — **SHARED**
- `playbook-simulation.test.ts` — both authored sims validate; malformed graphs caught; fidelity aggregation explicit-state & revision-agnostic; `completionPayload` conforms to the event registry; teaching branches rejoin; `pathBefore` resume-safe; every decision teaches; **NON-SCORING (no score/correct/outcome keys)**; reveal labels authored; JIT ids real.
- `playbook-simulation-guardrails.test.ts` — **G1** fidelity authored per-scenario (never hardcoded by signature); **G2** JIT never contributes to fidelity; **G3** process tags stay behavioural (no trait/etiology); no-cycle constraint retained.

### Signature fidelity + reveal resolvers — **C1** (one per new signature)
- `playbook-dualattention.test.ts` — held-both+fit→both demonstrated; fit-but-collapse→stance not demonstrated; both-without-fit→not demonstrated; no-fit→both not_demonstrated; reveal `computedSummary` → both / evaluation-active / interest; valid graph; completion payload passes registry.
- `playbook-decisionroom.test.ts` — bounded read+stance→intentional+distinguished, stance captured; `pause_decision` legitimate; forever-but-distinguished→distinguished; re-asserted forever→not distinguished (non-punitive); no stance→default pause (no false positive); reveal stance summary (rest/pause); valid graph; completion payload (incl. `chosen_stance`) passes registry.
- `playbook-investmentview.test.ts` — increase only at mutual rounds→evidence-tied; increase at lull→not tied; increase+claim-nonexistent→not noticed; easing off not penalised; reveal `recap` per round; omits unanswered rounds; valid graph; payload passes registry.
- `playbook-communicationrehearsal.test.ts` — mostly clear→both signals; buried-in-apology states-but-not-avoids-erasure; mostly smoothing→neither; reaction spread shows 3 hypotheticals regardless of choice; recap reflects observed clarity-vs-erasure (not a grade); valid graph; payload passes registry.
- `playbook-simulation.interaction.test.ts` — **C1**: evidenceTimeline + conclusionNarrowing primitives (temptation beats rejoin the reveal; globalizing expands/narrows credits fidelity; bounded first read acknowledged; naming fact while feeling persists = fidelity); focus moves on transition; resume seeds mid-graph; JIT surfaces by id; bounded free text screens at advance; no single "correct relationship answer."

### Play schemas & walkthroughs — mixed
- `playbook-guardrails.test.ts` — **C1**: success never a relationship outcome; congruence not "actions beat words"; user-choice not scorekeeping/mirroring; WM not positive thinking ("their loss" = error); feeling ≠ failure; pattern branch preserves observed pattern without inventing a cause.
- `playbook-read-decide.interaction.test.ts` — **C1**: RD walkthrough produces executable output; sufficiency branches (enough / need-more with a real condition, no indefinite waiting); if/then set user-controlled & non-gamey.
- `playbook-what-it-means.interaction.test.ts` — **C1**: global self-verdict triggers correction; bounded conclusion built; Layer-B signpost content-driven.
- `playbook-playsequence.interaction.test.ts` — **SHARED**: the Play FOLLOWS its simulation; finishing records completion + hands into the Play; resume goes straight to the Play.

### Missions — **SHARED** (assert against built C1 plays)
- `playbook-mission.test.ts` — each built Play has a behaviorally-specific mission; NO gamification; never partner surveillance; `nextRung` is content ordering only; selecting sets ONE focus (no downgrade); attempt advances state + records eligibility, non-attempt factual.
- `playbook-missioncard.interaction.test.ts` — shows title/instruction/attempt-meaning/link/suitability; attempt distinct from success; non-attempt = "not a miss"; attempted → review (not a progression recommendation); no gamification/mastery claim.

### Use Reviews — **SHARED**
- `playbook-usereview.test.ts` — each built Play has a structured Use Review (bounded selects, no journaling); `recordUseReview` additive; accumulates multiple over time (newest last, timestamps); coerces legacy single-object; stores optional trimmed `experience` (bounded); `reviewEntries` tolerates all shapes; `markMissionReviewed`.
- `playbook-usereviewflow.interaction.test.ts` — bounded selects PLUS one optional free-text field; description passed to onComplete + crisis-screened on blur; empty description not screened; multi vs single selects; Update records tool_updated; Save vs Not-right-now.

### Change Path — **SHARED**
- `playbook-changepath.test.ts` — signals independent/composable; reviewed ≠ more-developed; routing differs by review contents (3 recommendations); first attempt vs accumulating Transfer distinguished; Transfer informs a stretch never a mastery/trait claim; literature changes surfacing only; **frozen focus priority** (declared > active mission > pending review > exploration > recognition); non-authoritative + Explore always available; **fail-soft** on stale/partial/obsolete state.
- `playbook-changepathhome.interaction.test.ts` — "A useful next step" routes primary CTA; full architecture in 3 buckets, never a clinical plan; active/attempted/reviewed mission states; no empty Integrate section; Home Log-a-Real-Life-Experience routes to review; running count; Home "View all" opens history.

### Process-state adjudication — **SHARED**
- `playbook-processstate.test.ts` — no signals → exposure floor; attempt+in-app-fidelity ladder; **tool-review alone never reaches Transfer**; **Transfer requires reported real-world enactment**; progression-advance is Transfer ONLY after real-world enactment; Developmental Application needs real-context evidence.

### Progress / persistence / sanitization — **SHARED**
- `playbook-progress.test.ts` — reducers (toggleRecognized, markExplored no-downgrade, recordOutput idempotent card); `sanitizeIncomingProgress` server-authoritative key/version + drops junk + tolerates non-object; **Phase D**: simulation_state carried + fidelity validated; invalid states/stances coerced; practice/use_review/change_path/literature carried + enum-validated; use_review keeps a LIST (bounds count + at, coerces legacy); absent/invalid stays absent.
- `playbook-rev3flow.test.ts` — **SHARED**: each built Play has a sim to follow; literature extracted (v0 untouched); play-scope literature resolves; `recordSimulationComplete` minimal + version-stamped.

### Events / idempotency — **SHARED**
- `playbook-events.test.ts` — valid event returns schema_version; missing action_id rejected; unknown event_type rejected; event_type must match object_type; payload must match per-event schema (unknown keys rejected); `use_reviewed` bounded values only; every event has a positive schema_version.
- `playbook-clientevents.test.ts` — builds validated idempotent minimal events; supplied action_id preserved (retry idempotency); non-conforming payload rejected; event/object mismatch rejected.

### Feature-flag isolation — **SHARED**
- `playbook-experience-rev3.interaction.test.ts` — flag ON first-time/returning landing; flag OFF v0 unchanged; entering a Play runs its sim first (ON) / straight to Play (OFF); completed sim not repeated; explored Play surfaces Practice; **flag OFF: no Practice affordance**; structured Use Review (ON) vs v0 Keep/Update dialog (OFF); Edit-this-Play opens editor; View-all history; opening review ≠ reviewed; library flows; JIT overlay preserves sim state; back-nav regressions.
- `playbook-experience.interaction.test.ts` — v0 shell: recognition→board; Explore never locks; "I handle this okay" skips; gate→Yes enters play; saved progress restores; My Plays render; Used→Keep/Update; **axe: no serious/critical violations** on recognition + board.

### Commerce / entitlement — **SHARED**
- `playbook-cta.interaction.test.ts` — shows the interactive Open only when the viewer owns an interactive playbook; owner sees Open + PDF secondary; non-owner sees buy button, never the interactive link.

### Accessibility (automated) — **SHARED**
- `playbook-a11y.test.ts` — SortEngine keyboard-operable (aria-pressed, not drag-only); buckets by text not color; item text in a labelled group; continue disabled until assigned.
- `playbook-sortengine.interaction.test.ts` + `playbook-sort.test.ts` — tap/keyboard assignment; continue gating; correction only on wrong criterion bucket; focus moves to correction.
- `playbook-fieldguide.interaction.test.ts` — Core/Question split; JIT "Previously surfaced"; entry blocks + focus to heading; related-link navigation refocuses index.
- Plus `axe` assertions embedded in `playbook-experience.interaction.test.ts`.

### Safety — **SHARED**
- `playbook-safety.interaction.test.ts` — Layer A crisis signal in free text surfaces resources + preserves input; Layer B signpost is content-driven (no crisis call); persistence sends only functional keys (no raw free-text channel).

### Build / type-check
- `npx tsc --noEmit` (clean) + `npm run build` (green) are the gate at each phase (DECISION-LOG each entry). **Note:** never run `npm run build` while `next dev` is running (corrupts `.next`).

---

## 2. Shared vs Cluster-1-specific tally
- **SHARED-infra (~22 files):** a11y, changepath, changepathhome, clientevents, cta, events, experience-rev3, experience, fieldguide, mission, missioncard, playsequence, processstate, progress, rev3flow, safety, simulation-guardrails, simulation, sort, sortengine, usereview, usereviewflow.
- **CLUSTER-1-specific (~11 files):** communicationrehearsal, content, decisionroom, dualattention, guardrails, investmentview, literature, read-decide, rev3copy, simulation.interaction, what-it-means.
- Several "shared" files assert against the two built Cluster-1 Plays as fixtures (mission, rev3flow, usereview, simulation.test) — they test reusable machinery, not cluster content.

---

## 3. What a future cluster MUST add (test parity)

For each new cluster, author **new C1-equivalent tests** (the SHARED infra tests should keep passing unchanged):
- **content**: a `<cluster>-content` test — module valid, screen-complete Plays, executable outputs, recognition routing, keys round-trip.
- **literature**: statement-map coverage (each statement once), routing constraints, `none` exclusivity, signpost rarity.
- **per-signature fidelity + reveal** tests for any *new* signature the cluster introduces (mirroring `dualattention`/`decisionroom`/…); if it reuses an existing signature, add a cluster-content sim-validity + completion-payload test.
- **guardrails**: success ≠ outcome; no scorekeeping/mirroring; feeling ≠ failure; per-Play misuse boundaries.
- **Play walkthroughs** for each Play (executable output built; branch behavior).
- **Use Reviews**: each Play has a structured review; reducers additive.
- **Missions** (if the cluster ships them): behaviorally specific; no gamification; no surveillance; non-attempt no-fault.
- **safety**: Layer A screening on the cluster's free-text fields; Layer B signposts content-driven.
- **flag isolation**: v0 unchanged with the flag off.
- **build/type-check** green.

---

## 4. Reusable next-cluster acceptance checklist

- [ ] `npx tsc --noEmit` clean.
- [ ] `npm test` green — all SHARED-infra tests pass unchanged; new cluster tests added per §3.
- [ ] `npm run build` green (dev server stopped).
- [ ] Every Play has: recognition gate, an `output` screen, `myPlaysTemplate` (5 fields), `fidelity` (correct/misuse/notMeaning), `portable`.
- [ ] Every Experience: `validateSimulation` returns `[]`; `teach.toPlayId` is a built Play; reveal renders (static body / computedSummary / recap / reactions as authored); fidelity computed from authored signal tags only.
- [ ] Each fidelity field's consumer claim is bounded to exactly what it establishes (per `05-…` §7 discipline).
- [ ] Every Play has a Use Review; Missions authored (if applicable).
- [ ] Change Path routes the cluster's Plays with the frozen priority; non-attempt is no-fault; discomfort never routes backward after fidelity.
- [ ] Persistence: sanitizers cover any new state fields (enum allow-lists + caps); no free text/partner data persisted beyond the bounded `experience` note.
- [ ] Free-text fields crisis-screened (Layer A); heavier material signposted (Layer B).
- [ ] Accessibility: keyboard-operable interactions; focus management on transitions; no serious/critical axe violations on key states.
- [ ] Flag isolation: v0 unchanged with `PLAYBOOK_REV3_ENABLED` off.
- [ ] Owner E2E (incl. authenticated persistence round-trip) completed and recorded.
- [ ] Deployment + flag-enable approved **separately**.
