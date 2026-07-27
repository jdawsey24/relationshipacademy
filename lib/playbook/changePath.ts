// Rev 3 Step 8 — Change Path orchestrator (pure, deterministic, no I/O, no LLM).
//
// Internal orchestration — NOT an assessment. It reads only first-party functional state and
// returns a prioritized surface + one NON-AUTHORITATIVE "Your Next Step" line. See §4.
//
// Rev 3 is COMPOSABLE: there is no global developmental ladder. Each focus/operation is
// described by INDEPENDENT functional signals; a routing helper picks a focus by a frozen
// priority and routes from those signals + the Use-Review contents. "reviewed" is NOT "more
// developed" than "attempted", and reaching review never auto-advances anything.
//
// BOUNDARY (enforced + tested):
//  • Uses only: recognition; declared focus; simulation exposure + fidelity; in-app operation
//    + saved output; mission selected/attempted/reviewed + attempt count (Transfer); Use-Review
//    responses; tool review; current/prior focus.
//  • Literature engagement influences LITERATURE SURFACING ONLY — never advances process state,
//    Technique Fidelity, Transfer, or any change claim.
//  • Never infers from outcomes, mood, emotional intensity, traits, attachment, motives,
//    diagnosis, etiology, free text, completions-alone, or time.
//  • Observation-not-trait; absence is an invitation, never inability/avoidance; no mastery.
//  • Fail-soft: missing/stale/obsolete state never crashes, and is never read as a negative.

import type { PlaybookContent, PlaybookProgress, MissionReport, UseReviewSignals } from "@/lib/playbook/contentSchema";
import { simulationForPlay, missionForPlay, useReviewForPlay } from "@/lib/playbook/rev3Flow";

export type FocusReason = "declared" | "active_mission" | "pending_review" | "recent_exploration" | "recognition";

/** Independent functional signals for one operation (NOT a single ordered stage). */
export interface OperationSignals {
  playId: string;
  recognized: boolean;
  simulationExposed: boolean;
  inAppOperationAttempted: boolean;
  savedOutput: boolean;
  missionSelected: boolean;
  missionAttempted: boolean;
  missionReviewed: boolean;
  techniqueFidelity?: "yes" | "partly" | "no"; // from the Use Review (performed)
  transferEvidence: boolean; // used across >1 authentic context (attemptCount ≥ 2)
  reviewStuck?: string;
  lastMissionReport?: MissionReport;
}

export interface SurfacedItem {
  kind: "experience" | "practice" | "review" | "understand" | "explore";
  playId?: string;
  literatureId?: string;
  label: string;
}

export interface ChangePathResult {
  focusPlayId: string | null;
  focusReason: FocusReason | null;
  /** Non-authoritative next-step line; null when there's nothing to say yet. */
  nextStep: string | null;
  surfaced: SurfacedItem[];
}

function playName(content: PlaybookContent, playId: string): string {
  return content.plays.find((p) => p.playId === playId)?.name ?? playId;
}

/** Derive the INDEPENDENT signals for one operation. Fail-soft: every read is guarded. */
export function operationSignals(content: PlaybookContent, progress: PlaybookProgress, playId: string): OperationSignals {
  const recognized = content.recognitionCards.some((c) => c.pathwayPlayId === playId && progress.recognized?.includes(c.id));
  const sim = simulationForPlay(content, playId);
  const simulationExposed = sim ? Boolean(progress.simulation_state?.runs?.[sim.id]?.completed) : false;
  const ps = progress.play_states?.[playId];
  const savedOutput = Boolean(progress.outputs?.[playId]); // independent of play_state (historic/v0 ok)
  const inAppOperationAttempted = ps === "explored" || ps === "in_my_plays" || ps === "used" || savedOutput;
  const mission = missionForPlay(content, playId);
  const ms = mission ? progress.practice_state?.missions?.[mission.id] : undefined;
  const missionSelected = Boolean(ms);
  const missionAttempted = ms?.state === "attempted";
  const review = useReviewForPlay(content, playId);
  const rv: UseReviewSignals | undefined = progress.use_review_state?.reviews?.[playId];
  const missionReviewed = ms?.state === "reviewed" || Boolean(rv && review);
  const transferEvidence = (ms?.attemptCount ?? 0) >= 2;
  return {
    playId,
    recognized,
    simulationExposed,
    inAppOperationAttempted,
    savedOutput,
    missionSelected,
    missionAttempted,
    missionReviewed,
    techniqueFidelity: rv?.performed,
    transferEvidence,
    reviewStuck: rv?.stuck,
    lastMissionReport: ms?.lastReport,
  };
}

/** Frozen focus priority (item 6). Higher tier wins; explicit selection outranks inference. */
function focusTier(s: OperationSignals, declared?: string): { t: number; reason: FocusReason | null } {
  const engaged = s.recognized || s.simulationExposed || s.inAppOperationAttempted || s.savedOutput || s.missionSelected || s.missionReviewed;
  if (declared === s.playId && engaged) return { t: 5, reason: "declared" };
  if (s.missionSelected && !s.missionAttempted && !s.missionReviewed) return { t: 4, reason: "active_mission" };
  if (s.missionAttempted && !s.missionReviewed) return { t: 3, reason: "pending_review" };
  if (s.inAppOperationAttempted || s.savedOutput || s.simulationExposed || s.missionReviewed) return { t: 2, reason: "recent_exploration" };
  if (s.recognized) return { t: 1, reason: "recognition" };
  return { t: 0, reason: null };
}

interface Routed { nextStep: string; primary?: SurfacedItem }

/** Non-attempt mission outcomes are handled distinctly — never a generic failure branch. */
function nonAttemptRouting(s: OperationSignals, name: string): Routed {
  switch (s.lastMissionReport) {
    case "no_opportunity":
      return { nextStep: "No chance to try it yet — that's completely fine. It's ready whenever a moment comes up.", primary: { kind: "practice", playId: s.playId, label: "Open my practice" } };
    case "opportunity_not_taken":
      return { nextStep: "A moment came up and you didn't take it — no problem at all. You might rehearse it once more, so it feels a little readier next time.", primary: { kind: "experience", playId: s.playId, label: `Rehearse “${name}”` } };
    case "unsuitable":
      return { nextStep: "You judged it wasn't the right moment — that's the skill working. When a fitting one comes, it's here; meanwhile you might explore another area.", primary: { kind: "explore", label: "Explore another area" } };
    default:
      return { nextStep: "Your practice is ready whenever you are.", primary: { kind: "practice", playId: s.playId, label: "Open my practice" } };
  }
}

/** Route from the Use-Review CONTENTS (not merely reviewed=true). Remaining discomfort never
 *  routes backward when Technique Fidelity was demonstrated. Transfer may inform a stretch. */
function reviewedRouting(content: PlaybookContent, s: OperationSignals, name: string): Routed {
  const rd = s.playId === "read-and-decide";
  const feeling = s.reviewStuck === "The feeling got loud" || s.reviewStuck === "The feeling made it feel true";
  const fidelityShown = s.techniqueFidelity === "yes";
  const other = content.plays.find((p) => p.playId !== s.playId)?.playId;

  // 1) The reported FRICTION drives the next practice, regardless of overall fidelity.
  if (rd && s.reviewStuck === "Acting on what I already saw") {
    return { nextStep: "In your recent practice, you separated what you saw from what you were assuming. A useful next step might be deciding what to do with that information.", primary: { kind: "practice", playId: s.playId, label: "Practice deciding from the evidence" } };
  }
  if (feeling) {
    // Remaining discomfort NEVER routes backward when Technique Fidelity was demonstrated.
    if (fidelityShown) {
      return { nextStep: "You used the move closely, and the feeling was still loud — that's expected, and it doesn't undo the work. You might keep using it as the feeling settles.", primary: { kind: "practice", playId: s.playId, label: "Keep practicing" } };
    }
    return rd
      ? { nextStep: "You did the read, and the feeling got loud. You might pair it with naming the narrowest true thing next time.", primary: { kind: "practice", playId: s.playId, label: "Keep practicing" } }
      : { nextStep: "You named the fact, and the feeling made it loud. You might practice holding the fact while the feeling stays.", primary: { kind: "practice", playId: s.playId, label: "Practice holding the fact" } };
  }
  if (!fidelityShown && (s.reviewStuck === "Reading it — telling saw-it from guessing" || s.reviewStuck === "Catching the story before it hardened" || s.reviewStuck === "Naming the narrowest true thing")) {
    return rd
      ? { nextStep: "The reading part is where it caught this time. You might run another round — separating what you saw from what you're guessing.", primary: { kind: "experience", playId: s.playId, label: `Rehearse “${name}”` } }
      : { nextStep: "Naming the smallest true thing is where it caught this time. You might run another round of it.", primary: { kind: "experience", playId: s.playId, label: `Rehearse “${name}”` } };
  }

  // 2) Fidelity shown, no blocking friction.
  if (fidelityShown) {
    if (s.transferEvidence) {
      return {
        nextStep: `Based on what you've practiced, you've used “${name}” in more than one real situation. You might stretch it a little further — or bring your attention to another pattern when you're ready.`,
        primary: other ? { kind: "experience", playId: other, label: `Look at “${playName(content, other)}”` } : { kind: "practice", playId: s.playId, label: "Keep practicing" },
      };
    }
    return { nextStep: "Based on what you practiced, the move is working for you. You might take it into the next situation when one comes up.", primary: { kind: "practice", playId: s.playId, label: "Practice it again" } };
  }

  // 3) Partly / not really, no specific friction named → a gentle forward re-practice.
  return { nextStep: `You've had a first go at “${name}.” You might run the move again when a moment comes up.`, primary: { kind: "practice", playId: s.playId, label: "Practice it again" } };
}

/** Route for one operation from its independent signals (used for any chosen focus). */
function routeForOp(content: PlaybookContent, s: OperationSignals): Routed {
  const name = playName(content, s.playId);
  // A reported non-attempt outcome on a selected (not-yet-attempted) mission takes precedence.
  if (s.missionSelected && !s.missionAttempted && !s.missionReviewed && s.lastMissionReport && s.lastMissionReport !== "attempted") {
    return nonAttemptRouting(s, name);
  }
  if (s.missionReviewed) return reviewedRouting(content, s, name);
  if (s.missionAttempted) return { nextStep: "You tried this in real life — you might take a quick, honest look at how it went.", primary: { kind: "review", playId: s.playId, label: "Look at how it went" } };
  if (s.missionSelected) return { nextStep: "Your practice is set. You might give it a try when a fitting moment comes up.", primary: { kind: "practice", playId: s.playId, label: "Open my practice" } };
  if (s.savedOutput || s.inAppOperationAttempted) return { nextStep: `You've worked through “${name}.” You might take it into real life when a moment comes up.`, primary: { kind: "practice", playId: s.playId, label: "Practice this in real life" } };
  if (s.simulationExposed) return { nextStep: `You've seen how “${name}” works. You might try it on a real situation of yours.`, primary: { kind: "experience", playId: s.playId, label: `Continue “${name}”` } };
  if (s.recognized) return { nextStep: `Based on what sounded familiar, you might start with “${name}.”`, primary: { kind: "experience", playId: s.playId, label: `Start “${name}”` } };
  return { nextStep: "" };
}

/** Literature surfacing uses ONLY read-state to avoid re-recommending the same read (item 5).
 *  It never advances any process state. Returns an unread, relevant entry id (or undefined). */
function surfacedLiterature(content: PlaybookContent, progress: PlaybookProgress, focusPlayId: string | null): string | undefined {
  const read = new Set(progress.literature_state?.read ?? []);
  const lit = content.literature ?? [];
  const relevant = focusPlayId ? lit.filter((e) => e.scope === "play" && e.playId === focusPlayId) : [];
  const pool = [...relevant, ...lit.filter((e) => e.scope === "cluster")];
  return pool.find((e) => !read.has(e.id))?.id ?? pool[0]?.id;
}

export function changePath(content: PlaybookContent, progress: PlaybookProgress): ChangePathResult {
  const declared = progress.change_path_state?.currentFocus;
  const ops = content.plays.map((p) => operationSignals(content, progress, p.playId));
  const tiered = ops.map((s) => ({ s, ...focusTier(s, declared) }));

  const best = tiered.filter((x) => x.t > 0).sort((a, b) => b.t - a.t)[0]; // ties keep content order

  const understand: SurfacedItem = { kind: "understand", label: "Understand this pattern" };
  const litId = surfacedLiterature(content, progress, best?.s.playId ?? null);
  if (litId) understand.literatureId = litId;
  const explore: SurfacedItem = { kind: "explore", label: "Explore another area" };

  if (!best) {
    // Nothing recognized/started — an INVITATION, never a verdict.
    return {
      focusPlayId: null,
      focusReason: null,
      nextStep: progress.recognized?.length ? "There's no wrong place to start — pick whichever area pulls at you." : null,
      surfaced: [{ kind: "explore", label: "See where you might start" }, understand],
    };
  }

  const routed = routeForOp(content, best.s);
  const surfaced: SurfacedItem[] = [];
  if (routed.primary) surfaced.push(routed.primary);
  surfaced.push(understand, explore);

  return {
    focusPlayId: best.s.playId,
    focusReason: best.reason,
    nextStep: routed.nextStep || null,
    surfaced,
  };
}
