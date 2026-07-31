"use client";

// Rev 3 Step 6 — Practice layer. Presents ONE real-world mission tied to a Play's operation
// and records what happened, factually. NO gamification, NO mastery claim, and NO progression
// recommendation here — a reported attempt LEADS INTO Use Review (Step 7), which (with Change
// Path) owns the decision to repeat / adjust / change focus / offer a stretch. Suitability is
// actionable: the reader can say a situation wasn't appropriate without it being a failure.
// Flag-gated at the call site; not used by v0.

import type { Mission, MissionState, MissionReport } from "@/lib/playbook/contentSchema";
import { currentInstruction } from "@/lib/playbook/mission";

const primaryBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90";
const ghostBtn = "rounded-full border border-midnight-navy px-5 py-2 font-ui text-sm text-midnight-navy";
const linkBtn = "font-ui text-sm text-charcoal/55 underline hover:text-charcoal";

export interface MissionCardProps {
  mission: Mission;
  state?: MissionState;
  rungId?: string;
  lastReport?: MissionReport;
  onSelect: () => void;
  onReport: (report: MissionReport) => void;
  onReview?: () => void; // Step 7 Use Review (may be absent until wired)
  onExit?: () => void;
}

export default function MissionCard({ mission, state, rungId, lastReport, onSelect, onReport, onReview, onExit }: MissionCardProps) {
  const instruction = currentInstruction(mission, rungId);
  const selected = state === "selected";
  const attempted = state === "attempted";
  const nonAttemptReport = selected && lastReport && lastReport !== "attempted";

  return (
    <section className="mx-auto max-w-2xl px-5 py-8" aria-label="Practice this">
      <div className="mb-4 flex items-center justify-between">
        {onExit && <button type="button" onClick={onExit} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Back</button>}
        <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">What I'm practicing</span>
      </div>

      <div className="rounded-3xl bg-white/60 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-midnight-navy">{mission.title}</h2>
        <p className="font-body text-reading text-charcoal/85">{instruction}</p>

        <p className="rounded-2xl bg-warm-ivory px-4 py-3 font-body text-[14px] text-charcoal/75">
          <span className="font-medium">How it connects:</span> {mission.linkToOperation}
        </p>
        {mission.attemptMeaning && (
          <p className="font-body text-[14px] text-charcoal/70"><span className="font-medium">What counts as trying it:</span> {mission.attemptMeaning}</p>
        )}
        {mission.suitability && (
          <p className="rounded-2xl bg-amber-warm/15 px-4 py-3 font-body text-[14px] text-charcoal/85" role="note">{mission.suitability}</p>
        )}

        {/* Not yet the current focus */}
        {!state && (
          <button type="button" className={primaryBtn} onClick={onSelect}>Try this next</button>
        )}

        {/* Current focus — report what happened (attempt, or a no-fault outcome) */}
        {selected && (
          <div className="space-y-3">
            {nonAttemptReport && (
              <p className="rounded-2xl bg-warm-ivory px-4 py-3 font-body text-[14px] text-charcoal/75" role="status">
                Got it — this one didn't fit this time. That's not a miss. Keep it, or explore another area whenever you like.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={primaryBtn} onClick={() => onReport("attempted")}>I tried this in real life</button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              <button type="button" className={linkBtn} onClick={() => onReport("no_opportunity")}>The right moment hasn't come up yet</button>
              <button type="button" className={linkBtn} onClick={() => onReport("opportunity_not_taken")}>It came up, but I didn't try it</button>
              {mission.suitability && (
                <button type="button" className={linkBtn} onClick={() => onReport("unsuitable")}>It didn't feel right or safe for this</button>
              )}
              {onExit && <button type="button" className={linkBtn} onClick={onExit}>Not now</button>}
            </div>
          </div>
        )}

        {/* Reported an attempt — this leads into the review, not a stretch recommendation */}
        {attempted && (
          <div className="space-y-4" role="status">
            <p className="rounded-2xl bg-sage-green/12 px-4 py-3 font-body text-[15px] text-charcoal/85">
              You tried this in real life. Now we can look at what happened in the practice itself.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {onReview ? (
                <button type="button" className={primaryBtn} onClick={onReview}>Look at how it went →</button>
              ) : (
                <span className="font-body text-[14px] italic text-charcoal/60">A short review comes next.</span>
              )}
              {onExit && <button type="button" className={ghostBtn} onClick={onExit}>Done for now</button>}
            </div>
          </div>
        )}

        {state === "reviewed" && (
          <div className="space-y-3" role="status">
            <p className="font-body text-[14px] text-charcoal/70">You've reviewed this practice.</p>
            {/* Using it again in another real situation is a Transfer signal — no mastery implied. */}
            <button type="button" className={ghostBtn} onClick={() => onReport("attempted")}>I used this again in another situation</button>
          </div>
        )}
      </div>
    </section>
  );
}
