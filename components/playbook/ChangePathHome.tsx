"use client";

// Rev 3 — the resuming home. Change Path is INTERNAL orchestration, surfaced as ONE plain,
// non-clinical "A useful next step" card. BELOW it, the FULL Playbook architecture stays
// visibly available, grouped into three consumer buckets (Learn · Work on it · Keep & explore)
// so the home scans easily WITHOUT exposing the internal five-layer architecture. No layer is
// hidden just because a state is empty (state-dependent presentation instead). Flag-gated at the
// call site; v0 never renders this. Section labels are consumer copy CANDIDATES, not frozen.
//
// Click behavior:
//   Understand the Pattern → Field Guide (education)
//   See It Play Out        → Simulation library (Experience)
//   Use a Tool             → Play library (available Plays)
//   Practice in Real Life  → Mission layer (active/available real-world practice)
//   Look at How It Went    → pending Use Review (Integrate) — only when one is pending
//   My Plays               → saved portable Plays
//   Explore Another Area   → recognition-based alternate pathway picker

import type { PlaybookContent, PlaybookProgress } from "@/lib/playbook/contentSchema";
import { changePath, operationSignals, type SurfacedItem } from "@/lib/playbook/changePath";
import { missionForPlay, useReviewForPlay } from "@/lib/playbook/rev3Flow";
import { reviewEntries } from "@/lib/playbook/progressActions";
import { currentInstruction } from "@/lib/playbook/mission";

const primaryBtn = "inline-flex min-h-[48px] items-center rounded-full bg-coral-rose px-6 font-ui text-sm font-medium text-white transition hover:opacity-90";
const rowBtn = "flex w-full flex-col rounded-2xl bg-white/70 px-5 py-4 text-left transition hover:bg-white";
const rowLabel = "font-ui text-[15px] font-medium text-midnight-navy";
const rowDesc = "mt-0.5 font-body text-[13px] leading-snug text-charcoal/60";
const bucket = "mt-8 font-ui text-xs font-semibold uppercase tracking-wide text-charcoal/45";

export interface ChangePathHomeProps {
  content: PlaybookContent;
  progress: PlaybookProgress;
  displayName: string;
  onSurfaced: (item: SurfacedItem) => void;
  onUnderstand: () => void;
  onSeeItPlayOut: () => void;
  onUseATool: () => void;
  onMyPlays: () => void;
  onExplore: () => void;
}

export default function ChangePathHome({ content, progress, displayName, onSurfaced, onUnderstand, onSeeItPlayOut, onUseATool, onMyPlays, onExplore }: ChangePathHomeProps) {
  const cp = changePath(content, progress);
  const primary = cp.surfaced.find((s) => s.kind === "experience" || s.kind === "practice" || s.kind === "review");

  const plays = content.plays;
  const focusPlayId = cp.focusPlayId;
  const hasSimulation = (content.simulations?.length ?? 0) > 0;

  // Practice — a Play with a real-world mission (prefer the current focus).
  const practicePlayId = (focusPlayId && missionForPlay(content, focusPlayId)) ? focusPlayId : plays.find((p) => missionForPlay(content, p.playId))?.playId;

  // ONE active real-world practice = a SELECTED (not-yet-attempted, not-reviewed) mission.
  // Attempted → pending review (Integrate); reviewed → no active card (offer another practice).
  const currentMissionId = progress.practice_state?.currentMissionId;
  const currentMission = currentMissionId ? content.missions?.find((m) => m.id === currentMissionId) : undefined;
  const currentMissionState = currentMissionId ? progress.practice_state?.missions?.[currentMissionId] : undefined;
  const activeMission = currentMission && currentMissionState?.state === "selected" ? currentMission : undefined;

  // Integrate ("Look at how it went") — surfaced ONLY when a real-world attempt awaits review.
  const pendingReviewPlayId = plays
    .map((p) => operationSignals(content, progress, p.playId))
    .find((s) => s.missionAttempted && !s.missionReviewed)?.playId;

  // Persistent real-life logging — a tool that's been met AND has a Use Review can be logged
  // repeatedly over time (prefer the current focus). Suppressed when the same Play is already
  // prompting via the pending "Look at How It Went" or the primary next-step review.
  const isLoggable = (pid: string): boolean => {
    const st = progress.play_states[pid];
    return (st === "explored" || st === "in_my_plays" || st === "used") && Boolean(useReviewForPlay(content, pid));
  };
  const logPlayId = (focusPlayId && isLoggable(focusPlayId)) ? focusPlayId : plays.find((p) => isLoggable(p.playId))?.playId;
  const logCount = logPlayId ? reviewEntries(progress, logPlayId).length : 0;
  const logPlayName = logPlayId ? plays.find((p) => p.playId === logPlayId)?.name : undefined;
  const showLogRow = Boolean(logPlayId) && logPlayId !== pendingReviewPlayId && !(primary?.kind === "review" && primary.playId === logPlayId);

  return (
    <section className="mx-auto max-w-2xl px-5 py-10">
      <p className="font-ui text-xs uppercase tracking-wide text-charcoal/45">{displayName}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-midnight-navy">Welcome back</h1>

      {/* A useful next step — the personalized top card (Change Path shown plainly). */}
      {cp.nextStep && (
        <div className="mt-6 rounded-3xl bg-white/70 p-6">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">A useful next step</p>
          <p className="mt-2 font-body text-reading text-charcoal/90">{cp.nextStep}</p>
          {primary && (
            <button type="button" className={`${primaryBtn} mt-4`} onClick={() => onSurfaced(primary)}>{primary.label} →</button>
          )}
        </div>
      )}

      {/* LEARN — the education layer + rehearsal. */}
      <h2 className={bucket}>Learn</h2>
      <div className="mt-3 space-y-2" role="navigation" aria-label="Learn">
        <button type="button" className={rowBtn} onClick={onUnderstand}>
          <span className={rowLabel}>Understand the Pattern</span>
          <span className={rowDesc}>Read what's going on underneath — at your own pace, whatever pulls at you.</span>
        </button>
        {hasSimulation && (
          <button type="button" className={rowBtn} onClick={onSeeItPlayOut}>
            <span className={rowLabel}>See It Play Out</span>
            <span className={rowDesc}>Step through a realistic situation and practice noticing what happens — before you decide anything.</span>
          </button>
        )}
      </div>

      {/* WORK ON IT — tools, real-world practice, and reviewing how it went. */}
      <h2 className={bucket}>Work on it</h2>
      <div className="mt-3 space-y-2" role="navigation" aria-label="Work on it">
        <button type="button" className={rowBtn} onClick={onUseATool}>
          <span className={rowLabel}>Use a Tool</span>
          <span className={rowDesc}>Open the moves you can actually use when a moment comes up.</span>
        </button>

        {/* Practice — ALWAYS discoverable; state-dependent label. */}
        {activeMission && currentMissionState ? (
          <button type="button" className={rowBtn} onClick={() => onSurfaced({ kind: "practice", playId: activeMission.playId, label: "Practice this" })}>
            <span className={rowLabel}>What I'm Practicing</span>
            <span className={rowDesc}>{activeMission.title} — {currentInstruction(activeMission, currentMissionState.rungId)}</span>
          </button>
        ) : practicePlayId ? (
          <button type="button" className={rowBtn} onClick={() => onSurfaced({ kind: "practice", playId: practicePlayId, label: "Practice in real life" })}>
            <span className={rowLabel}>Practice in Real Life</span>
            <span className={rowDesc}>Take a move into a real moment of your own, when one comes up.</span>
          </button>
        ) : null}

        {/* Integrate — contextual: only when a real-world attempt is waiting to be reviewed. */}
        {pendingReviewPlayId && (
          <button type="button" className={rowBtn} onClick={() => onSurfaced({ kind: "review", playId: pendingReviewPlayId, label: "Look at how it went" })}>
            <span className={rowLabel}>Look at How It Went</span>
            <span className={rowDesc}>You tried this in real life — take a quick, honest look at how it actually went. No score.</span>
          </button>
        )}

        {/* Log a real-life experience — persistent, repeatable (accumulates over time). */}
        {showLogRow && logPlayId && (
          <>
            <button type="button" className={rowBtn} onClick={() => onSurfaced({ kind: "review", playId: logPlayId, label: "Log a real-life experience" })}>
              <span className={rowLabel}>Log a Real-Life Experience</span>
              <span className={rowDesc}>
                {logCount > 0
                  ? `You've logged ${logCount} experience${logCount > 1 ? "s" : ""} with “${logPlayName}” — add another whenever a moment comes up.`
                  : "Used one of these moves for real? Add what happened — no score."}
              </span>
            </button>
            {logCount > 0 && (
              <button type="button" onClick={() => onSurfaced({ kind: "history", playId: logPlayId, label: "View all experiences" })} className="pl-5 text-left font-ui text-xs text-slate-blue underline">View all →</button>
            )}
          </>
        )}
      </div>

      {/* KEEP & EXPLORE — the personal toolkit + the non-locking pathway escape hatch. */}
      <h2 className={bucket}>Keep &amp; explore</h2>
      <div className="mt-3 space-y-2" role="navigation" aria-label="Keep and explore">
        {progress.my_plays.length > 0 && (
          <button type="button" className={rowBtn} onClick={onMyPlays}>
            <span className={rowLabel}>My Plays ({progress.my_plays.length})</span>
            <span className={rowDesc}>Your saved moves, ready to reuse.</span>
          </button>
        )}
        <button type="button" className={rowBtn} onClick={onExplore}>
          <span className={rowLabel}>Explore Another Area</span>
          <span className={rowDesc}>Look at a different part of the pattern — its reading, its scenario, its move — whenever you want.</span>
        </button>
      </div>
    </section>
  );
}
