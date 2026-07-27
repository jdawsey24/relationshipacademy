"use client";

// Rev 3 Step 8 — the resuming home. Change Path is INTERNAL orchestration; the home reads
// as a plain, non-clinical landing (not a treatment plan). A returning reader lands here on
// their current focus + "Your Next Step" + entry points — not the onboarding opening.
// Flag-gated at the call site; v0 never renders this.

import type { PlaybookContent, PlaybookProgress } from "@/lib/playbook/contentSchema";
import { changePath, type SurfacedItem } from "@/lib/playbook/changePath";
import { missionForPlay } from "@/lib/playbook/rev3Flow";
import { currentInstruction } from "@/lib/playbook/mission";

const primaryBtn = "inline-flex min-h-[48px] items-center rounded-full bg-coral-rose px-6 font-ui text-sm font-medium text-white transition hover:opacity-90";
const tile = "w-full rounded-2xl bg-white/70 px-4 py-3 text-left font-ui text-sm text-midnight-navy transition hover:bg-white";

export interface ChangePathHomeProps {
  content: PlaybookContent;
  progress: PlaybookProgress;
  displayName: string;
  onSurfaced: (item: SurfacedItem) => void;
  onUnderstand: () => void;
  onWhereToStart: () => void;
  onMyPlays: () => void;
  onExplore: () => void;
}

export default function ChangePathHome({ content, progress, displayName, onSurfaced, onUnderstand, onWhereToStart, onMyPlays, onExplore }: ChangePathHomeProps) {
  const cp = changePath(content, progress);
  const primary = cp.surfaced.find((s) => s.kind === "experience" || s.kind === "practice" || s.kind === "review");

  // "What I'm practicing" — the one current mission, if any.
  const currentMissionId = progress.practice_state?.currentMissionId;
  const currentMission = currentMissionId ? content.missions?.find((m) => m.id === currentMissionId) : undefined;
  const currentMissionState = currentMissionId ? progress.practice_state?.missions?.[currentMissionId] : undefined;

  return (
    <section className="mx-auto max-w-2xl px-5 py-10">
      <p className="font-ui text-xs uppercase tracking-wide text-charcoal/45">{displayName}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-midnight-navy">Welcome back</h1>

      {/* Your Next Step (internal Change Path; shown plainly, never as a clinical plan) */}
      {cp.nextStep && (
        <div className="mt-6 rounded-3xl bg-white/70 p-6">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Your next step</p>
          <p className="mt-2 font-body text-[17px] leading-relaxed text-charcoal/90">{cp.nextStep}</p>
          {primary && (
            <button type="button" className={`${primaryBtn} mt-4`} onClick={() => onSurfaced(primary)}>{primary.label} →</button>
          )}
        </div>
      )}

      {/* What I'm practicing — one active focus at a time */}
      {currentMission && currentMissionState && currentMissionState.state !== "reviewed" && (
        <div className="mt-5 rounded-3xl bg-sage-green/10 p-6">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">What I'm practicing</p>
          <p className="mt-1 font-display text-lg text-midnight-navy">{currentMission.title}</p>
          <p className="mt-1 font-body text-[15px] text-charcoal/80">{currentInstruction(currentMission, currentMissionState.rungId)}</p>
          <button
            type="button"
            className={`${primaryBtn} mt-3`}
            onClick={() => onSurfaced({ kind: "practice", playId: currentMission.playId, label: "Practice this" })}
          >
            Open my practice →
          </button>
        </div>
      )}

      {/* Entry points */}
      <nav className="mt-8 grid gap-2 sm:grid-cols-2" aria-label="Playbook sections">
        <button type="button" className={tile} onClick={onUnderstand}>Understand this pattern</button>
        <button type="button" className={tile} onClick={onWhereToStart}>Where you might start</button>
        {progress.my_plays.length > 0 && <button type="button" className={tile} onClick={onMyPlays}>My Plays ({progress.my_plays.length})</button>}
        <button type="button" className={tile} onClick={onExplore}>Explore another area</button>
      </nav>
    </section>
  );
}
