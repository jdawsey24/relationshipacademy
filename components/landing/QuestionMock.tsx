// A real-looking fragment of the assessment — mirrors the live /snapshot UI:
// a progress bar, "N of M", the constant prompt, statement choices, and the
// "None of these fit" escape. Not a 5-point frequency scale (that was the old
// RPI); the live Snapshot asks you to pick the statement that fits.
const OPTS = [
  "I keep waiting for something to go wrong, even when things are good.",
  "I hold part of myself back until I'm sure it's safe.",
  "I move all in quickly, then wonder if I misread things.",
];

export default function QuestionMock({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-light-gray/80 bg-white p-5 shadow-lg shadow-midnight-navy/10 ${className}`}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-gray">
        <div className="h-full w-2/5 rounded-full bg-midnight-navy" />
      </div>
      <p className="mt-2 text-right font-ui text-[11px] text-charcoal/45">4 of 10</p>
      <p className="mt-3 font-display text-base font-semibold text-midnight-navy">Which of these feels most true for you right now?</p>
      <div className="mt-4 space-y-2">
        {OPTS.map((o, i) => (
          <span
            key={o}
            className={`block rounded-xl border px-3.5 py-2.5 font-body text-xs leading-relaxed ${i === 0 ? "border-midnight-navy bg-midnight-navy/5 text-midnight-navy" : "border-light-gray text-charcoal/70"}`}
          >
            {o}
          </span>
        ))}
        <span className="block rounded-xl border border-dashed border-light-gray px-3.5 py-2 font-body text-xs text-charcoal/50">None of these fit</span>
      </div>
    </div>
  );
}
