# Cluster 1 — Change Path + Home (Step 8, final)

**Status:** FOR REVIEW. Flag-gated; v0 unchanged. No deploy, no migration.
**Source of truth:** `lib/playbook/changePath.ts` (orchestrator) + `components/playbook/ChangePathHome.tsx` (home).

Change Path is the **internal** orchestrator. Rev 3 is **composable** — there is no global developmental ladder. Each operation is described by **independent functional signals**; a routing helper picks a focus by a **frozen priority** and routes from those signals **and the Use-Review contents**. `reviewed` is never "more developed" than `attempted`, and reaching review never auto-advances anything. Output is non-authoritative.

## Independent functional signals (per operation)
`recognized · simulationExposed · inAppOperationAttempted · savedOutput · missionSelected · missionAttempted · missionReviewed · techniqueFidelity(yes/partly/no) · transferEvidence(attemptCount ≥ 2) · reviewStuck · lastMissionReport` — all derived independently; none implies the others.

## Frozen focus priority (item 6)
1. **explicit** current-focus selection (`change_path_state.currentFocus`, if the op is engaged)
2. **active real-world mission** (selected, not yet attempted)
3. **pending Use Review** (attempted, not reviewed)
4. **recent deliberate exploration** (simulation/explored/saved/**reviewed**)
5. **recognition-based** recommendation

Explore Another Area never silently changes the focus (focus is recorded only when the reader follows the next-step CTA).

## Decision table (exact next-step lines, non-authoritative)

| Focus signals | "Your Next Step" |
|---|---|
| recognized only | "Based on what sounded familiar, you might start with “[Play].”" |
| simulation exposed only | "You've seen how “[Play]” works. You might try it on a real situation of yours." |
| in-app operation / saved output | "You've worked through “[Play].” You might take it into real life when a moment comes up." |
| mission selected (no report) | "Your practice is set. You might give it a try when a fitting moment comes up." |
| mission selected + `no_opportunity` | "No chance to try it yet — that's completely fine. It's ready whenever a moment comes up." |
| mission selected + `opportunity_not_taken` | "A moment came up and you didn't take it — no problem at all. You might rehearse it once more…" |
| mission selected + `unsuitable` | "You judged it wasn't the right moment — that's the skill working… meanwhile you might explore another area." *(primary = Explore)* |
| mission attempted (not reviewed) | "You tried this in real life — you might take a quick, honest look at how it went." |
| reviewed · stuck = **acting** (RD) | "…you separated what you saw from what you were assuming. A useful next step might be deciding what to do with that information." |
| reviewed · **feeling** loud · fidelity **shown** | "You used the move closely, and the feeling was still loud — that's expected, and it doesn't undo the work. You might keep using it as the feeling settles." *(forward — never backward)* |
| reviewed · **feeling** loud · fidelity not shown | "You named the fact, and the feeling made it loud. You might practice holding the fact while the feeling stays." |
| reviewed · stuck = reading/naming · fidelity not shown | "The reading part is where it caught this time. You might run another round — separating what you saw from what you're guessing." |
| reviewed · fidelity **yes** · **first** attempt | "Based on what you practiced, the move is working for you. You might take it into the next situation when one comes up." |
| reviewed · fidelity **yes** · **Transfer** (≥2 contexts) | "…you've used “[Play]” in more than one real situation. You might stretch it a little further — or bring your attention to another pattern when you're ready." |
| nothing started | *null* (no verdict) |

## Boundary (enforced in code + tests)
- **Composable:** signals independent; `reviewed` is tier-4, never above an active mission (tier 2) or pending review (tier 3) of another op; a lone reviewed op does not auto-jump to another play.
- **Route from review contents,** not merely `reviewed=true` — three materially different recs are tested (closely+acting → the acting step; not-really+reading → re-practice the read; feeling-loud+closely → forward, never backward).
- **Transfer explicit:** first Attempt (`attemptCount 1`) vs accumulating use (`≥2`) are distinguished; Transfer informs a stretch, never a mastery/trait claim.
- **Non-attempt outcomes distinct & no-fault:** `no_opportunity` neutral · `opportunity_not_taken` invitation to rehearse (never inability/avoidance) · `unsuitable` respected (never "just repeat it").
- **Literature engagement → surfacing only:** reading never advances a stage/fidelity/Transfer/claim; it only steers which read is surfaced (avoids the already-read one).
- **Non-authoritative** phrasing ("a useful next step", "you might", "based on what you practiced"); Explore always offered.
- **Fail-soft:** saved output with incomplete play state, historic/v0 output, mission/review version mismatch, missing focus, and obsolete content references never crash, are never read as negatives, and never discard saved work.
- Observation-not-trait; absence is an invitation, never inability/avoidance.

## Home / IA (resuming, non-clinical)
Returning readers resume on the **home** (first-time users still see the opening). It shows **Your Next Step** + a single CTA, **What I'm Practicing** (one active focus, hidden once reviewed), and non-clinical entry points — **Understand this pattern** (field guide), **Where you might start**, **My Plays**, **Explore another area** (always available). Flag OFF → the v0 opening flow is unchanged.

## Remaining product ambiguity (surfaced, not resolved)
- **Recency tie-break:** priority-4 ("most recent deliberate exploration") currently tie-breaks by content order — no per-op timestamps are stored, so "most recent" is approximated deterministically. If true recency matters, it needs a timestamp on the state objects (a schema addition) — flagged for a later decision, not assumed.
- **Transfer capture is minimal:** Transfer is inferred from repeated reported attempts (`attemptCount ≥ 2`, capturable via "I used this again in another situation"). A richer, explicitly-authentic-context capture would strengthen eventual validation — deferred.

## Gates
No gamification/mastery/surveillance/diagnosis/plan framing; no deploy; no migration; no Snapshot/scoring/commerce/framework changes; remaining four Plays not authored.
