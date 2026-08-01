import type { CSSProperties } from "react";

// A polished, real-looking preview of the Snapshot result — mirrors the live
// results page: a named pattern, a strength + a blind spot, and a matched next
// step. Illustrative example copy, not tied to a specific cluster.
const HUE = "#7B5878"; // plum

export default function ResultsPreviewMock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-light-gray/70 bg-white p-4 shadow-xl shadow-midnight-navy/15 ${className}`}
      style={{ "--hue": HUE } as CSSProperties}
    >
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: HUE }}>The pattern we found</p>
      <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-midnight-navy">Bracing for the Letdown</p>
      <div className="mt-3 space-y-1.5">
        <div className="flex gap-2 font-body text-xs leading-relaxed text-charcoal/80">
          <span className="mt-px shrink-0 text-sage-green" aria-hidden="true">✓</span>
          <span>Honest with yourself about what you feel</span>
        </div>
        <div className="flex gap-2 font-body text-xs leading-relaxed text-charcoal/80">
          <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: HUE }} aria-hidden="true" />
          <span>Brace for disappointment before there&apos;s a sign of it</span>
        </div>
      </div>
      <div className="mt-3 rounded-lg p-2.5" style={{ backgroundColor: `${HUE}14` }}>
        <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: HUE }}>Your next step</p>
        <p className="mt-0.5 font-body text-xs leading-relaxed text-charcoal/85">Learning to Trust What&apos;s Going Well</p>
      </div>
    </div>
  );
}
