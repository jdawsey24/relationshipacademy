// A real-looking fragment of the assessment: progress bar + one question on the
// 5-point frequency scale, mirroring the live /snapshot UI.
const OPTS = ["Almost Never", "Rarely", "Sometimes", "Often", "Almost Always"];

export default function QuestionMock({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-light-gray/80 bg-white p-5 shadow-lg shadow-midnight-navy/10 ${className}`}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-gray">
        <div className="h-full w-2/5 rounded-full bg-midnight-navy" />
      </div>
      <p className="mt-2 font-ui text-[11px] text-charcoal/45">Section 2 of 6 · Communication</p>
      <p className="mt-4 font-body text-[15px] leading-relaxed text-charcoal">
        When something feels off between us, I say so instead of letting it pass.
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {OPTS.map((o, i) => (
          <span
            key={o}
            className={`rounded-lg border px-3 py-1.5 text-xs ${i === 3 ? "border-midnight-navy bg-midnight-navy text-white" : "border-light-gray text-charcoal/70"}`}
          >
            {o}
          </span>
        ))}
      </div>
    </div>
  );
}
