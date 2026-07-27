"use client";

// Rev 3 Step 6 — Practice layer. Presents a real-world mission tied to a Play's operation,
// and tracks its state (assigned → attempted → advanced). NO gamification: no levels, XP,
// streaks, ranks, badges, or completion %. Progression is an authored "next stretch", never
// a mastery claim. Flag-gated at the call site; not used by v0.

import type { Mission, MissionState } from "@/lib/playbook/contentSchema";
import { currentInstruction, nextRung } from "@/lib/playbook/mission";

const primaryBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90";
const ghostBtn = "rounded-full border border-midnight-navy px-5 py-2 font-ui text-sm text-midnight-navy";

export interface MissionCardProps {
  mission: Mission;
  state?: MissionState;
  rungId?: string;
  onSelect: () => void;
  onAttempt: () => void;
  onAdvance: (rungId: string) => void;
  onExit?: () => void;
}

export default function MissionCard({ mission, state, rungId, onSelect, onAttempt, onAdvance, onExit }: MissionCardProps) {
  const instruction = currentInstruction(mission, rungId);
  const next = nextRung(mission, rungId);
  const selected = state === "assigned" || state === "attempted" || state === "advanced" || state === "reviewed";

  return (
    <section className="mx-auto max-w-2xl px-5 py-8" aria-label="Practice this">
      <div className="mb-4 flex items-center justify-between">
        {onExit && <button type="button" onClick={onExit} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Back</button>}
        <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">Practice this</span>
      </div>

      <div className="rounded-3xl bg-white/60 p-6 sm:p-8 space-y-5">
        <p className="font-body text-[17px] leading-relaxed text-charcoal/85">{instruction}</p>

        <p className="rounded-2xl bg-warm-ivory px-4 py-3 font-body text-[14px] text-charcoal/75">
          <span className="font-medium">How it connects:</span> {mission.linkToOperation}
        </p>

        {mission.suitability && (
          <p className="rounded-2xl bg-amber-warm/15 px-4 py-3 font-body text-[14px] text-charcoal/85" role="note">{mission.suitability}</p>
        )}

        {/* State-driven actions ------------------------------------------------ */}
        {!selected && (
          <button type="button" className={primaryBtn} onClick={onSelect}>Try this next</button>
        )}

        {(state === "assigned" || state === "advanced") && (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={primaryBtn} onClick={onAttempt}>I tried this in real life</button>
            {onExit && <button type="button" className="font-ui text-sm text-charcoal/55 underline" onClick={onExit}>Not yet</button>}
          </div>
        )}

        {state === "attempted" && (
          <div className="space-y-4">
            <p className="rounded-2xl bg-sage-green/12 px-4 py-3 font-body text-[15px] text-charcoal/85" role="status">
              You took it into the real world. That's the point — trying the move, not getting it perfect.
            </p>
            {next && (
              <div className="border-t border-light-gray pt-4">
                <p className="font-body text-[15px] text-charcoal/85">Ready to stretch this a little further?</p>
                <p className="mt-1 font-body text-[14px] text-charcoal/70">A useful next practice may be:</p>
                <p className="mt-2 font-body text-[15px] text-charcoal">{next.instruction}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button type="button" className={ghostBtn} onClick={() => onAdvance(next.id)}>Try the next one</button>
                  {onExit && <button type="button" className="font-ui text-sm text-charcoal/55 underline" onClick={onExit}>Maybe later</button>}
                </div>
              </div>
            )}
            {!next && onExit && (
              <button type="button" className={ghostBtn} onClick={onExit}>Done for now</button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
