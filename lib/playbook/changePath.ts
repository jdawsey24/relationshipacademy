// Rev 3 Step 8 — Change Path orchestrator (pure, deterministic, no I/O, no LLM).
//
// Reads ONLY first-party functional interaction state and returns a prioritized surface of
// next-useful experiences + one plain-language "Your Next Step" line. It is an internal
// orchestration system, NOT a hidden assessment. See docs/playbook-architecture-rev3.md §4.
//
// INFERENTIAL BOUNDARY (enforced here):
//  • Uses only: recognition selections; declared focus; simulation completion + fidelity
//    states; play operations performed (outputs/play_states); mission selection + reported
//    attempt; structured Use-Review responses (performed/stuck/…); Keep/Update/Save (tool
//    review); current/prior focus.
//  • Content engagement (literature read) is NOT read here — reading never advances a stage
//    or a change claim.
//  • NEVER infers from: relationship outcomes, mood, emotional intensity, traits/personality,
//    attachment, partner motives, diagnosis, etiology, free text, completions-alone, time.
//  • OUTPUT is observation-not-trait: it describes what was demonstrated/reported in a
//    specific context, never what kind of person the reader is, and never overstates
//    capability from one interaction (no mastery claims). Absence is an invitation, not a verdict.

import type { PlaybookContent, PlaybookProgress, UseReviewSignals } from "@/lib/playbook/contentSchema";
import { simulationForPlay, missionForPlay } from "@/lib/playbook/rev3Flow";

export type PlayStage = "unrecognized" | "recognized" | "in_progress" | "practiced_in_app" | "attempted" | "reviewed";

const STAGE_RANK: Record<PlayStage, number> = {
  unrecognized: 0,
  recognized: 1,
  in_progress: 2,
  practiced_in_app: 3,
  attempted: 4,
  reviewed: 5,
};

export interface SurfacedItem {
  kind: "experience" | "practice" | "review" | "understand" | "explore";
  playId?: string;
  label: string;
}

export interface ChangePathResult {
  focusPlayId: string | null;
  /** The one "Your Next Step" line — context-bound, observation-not-trait; null when there's nothing to say yet. */
  nextStep: string | null;
  surfaced: SurfacedItem[];
}

/** A play's journey stage, derived ONLY from functional interaction state. */
export function playStage(content: PlaybookContent, progress: PlaybookProgress, playId: string): PlayStage {
  const recognizedPlay = content.recognitionCards.some((c) => c.pathwayPlayId === playId && progress.recognized.includes(c.id));
  const sim = simulationForPlay(content, playId);
  const simDone = sim ? Boolean(progress.simulation_state?.runs?.[sim.id]?.completed) : false;
  const ps = progress.play_states[playId];
  const performedInApp = ps === "in_my_plays" || ps === "used" || Boolean(progress.outputs[playId]);
  const mission = missionForPlay(content, playId);
  const ms = mission ? progress.practice_state?.missions?.[mission.id] : undefined;
  const attempted = ms?.state === "attempted";
  const reviewed = Boolean(progress.use_review_state?.reviews?.[playId]) || ms?.state === "reviewed";

  if (reviewed) return "reviewed";
  if (attempted) return "attempted";
  if (performedInApp) return "practiced_in_app";
  if (simDone || ps === "explored") return "in_progress";
  if (recognizedPlay) return "recognized";
  return "unrecognized";
}

function playName(content: PlaybookContent, playId: string): string {
  return content.plays.find((p) => p.playId === playId)?.name ?? playId;
}

/** Context-bound next-step line after a submitted Use Review. Observation-not-trait. */
function reviewedNextStep(content: PlaybookContent, playId: string, s: UseReviewSignals): string {
  const name = playName(content, playId);
  if (s.performed === "yes") {
    return `You've been using “${name}” in real life. When you're ready, a useful next area may be another pattern to work on — or keep this one going.`;
  }
  // partly / no / unset → point at the reported friction, as a next *practice*, never a verdict
  if (playId === "read-and-decide") {
    if (s.stuck === "Acting on what I already saw") {
      return "In your recent practice, you separated what you observed from what you were assuming. A useful next step may be deciding what to do with that information.";
    }
    return "In your recent practice, you were working the read. A useful next practice may be another round — separating what you saw from what you're guessing.";
  }
  // what-it-actually-means
  if (s.stuck === "The feeling made it feel true") {
    return "In your recent practice, you named the fact; the feeling made it loud. A useful next practice may be holding the fact while the feeling stays.";
  }
  return "In your recent practice, you were working the move. A useful next practice may be another round — naming the narrowest true thing.";
}

/** The prioritized surface + "Your Next Step" for the current functional state. */
export function changePath(content: PlaybookContent, progress: PlaybookProgress): ChangePathResult {
  const built = content.plays.map((p) => p.playId);
  const stages = built.map((pid) => ({ pid, stage: playStage(content, progress, pid) }));

  const understand: SurfacedItem = { kind: "understand", label: "Understand this pattern" };
  const explore: SurfacedItem = { kind: "explore", label: "Explore another area" };

  // Prefer an incomplete, engaged focus (furthest along); a declared focus wins if still active.
  const active = stages.filter((s) => s.stage !== "unrecognized" && s.stage !== "reviewed");
  const declared = progress.change_path_state?.currentFocus;
  const declaredActive = declared ? active.find((a) => a.pid === declared) : undefined;
  const focus =
    declaredActive ??
    [...active].sort((a, b) => STAGE_RANK[b.stage] - STAGE_RANK[a.stage])[0] ??
    undefined;

  if (focus) {
    const name = playName(content, focus.pid);
    switch (focus.stage) {
      case "recognized":
        return {
          focusPlayId: focus.pid,
          nextStep: `A good place to start is “${name}.”`,
          surfaced: [{ kind: "experience", playId: focus.pid, label: `Start “${name}”` }, understand, explore],
        };
      case "in_progress":
        return {
          focusPlayId: focus.pid,
          nextStep: `You started “${name}.” Picking it back up is the next step.`,
          surfaced: [{ kind: "experience", playId: focus.pid, label: `Continue “${name}”` }, understand, explore],
        };
      case "practiced_in_app":
        return {
          focusPlayId: focus.pid,
          nextStep: `You've worked through “${name}.” A useful next step is taking it into real life.`,
          surfaced: [{ kind: "practice", playId: focus.pid, label: "Practice this in real life" }, understand, explore],
        };
      case "attempted":
        return {
          focusPlayId: focus.pid,
          nextStep: "You tried this in real life. A quick, honest look at how it went is the next step.",
          surfaced: [{ kind: "review", playId: focus.pid, label: "Look at how it went" }, explore],
        };
    }
  }

  // No active focus. If a play has been reviewed, speak from its structured signals.
  const reviewed = stages.find((s) => s.stage === "reviewed");
  if (reviewed) {
    const signals = progress.use_review_state?.reviews?.[reviewed.pid] ?? {};
    const other = built.find((pid) => pid !== reviewed.pid && playStage(content, progress, pid) !== "reviewed");
    const surfaced: SurfacedItem[] = [];
    if (other && playStage(content, progress, other) !== "unrecognized") {
      surfaced.push({ kind: "experience", playId: other, label: `Start “${playName(content, other)}”` });
    }
    surfaced.push(understand, explore);
    return { focusPlayId: reviewed.pid, nextStep: reviewedNextStep(content, reviewed.pid, signals), surfaced };
  }

  // Nothing recognized/started yet — an INVITATION, never a verdict, never "you can't".
  return {
    focusPlayId: null,
    nextStep: progress.recognized.length
      ? "When you're ready, pick whichever area pulls at you — there's no wrong place to start."
      : null,
    surfaced: [{ kind: "explore", label: "See where you might start" }, understand],
  };
}
