// A polished, real-looking preview of the Snapshot results — built from the
// actual results styling (bands + bars + next step), not decorative art.
const ROWS = [
  { name: "Communication", label: "Strength", tint: "bg-sage-green", chip: "bg-sage-green/15 text-sage-green", pct: 86 },
  { name: "Trust", label: "Healthy", tint: "bg-dusty-plum", chip: "bg-dusty-plum/15 text-dusty-plum", pct: 72 },
  { name: "Conflict", label: "Growth area", tint: "bg-soft-coral", chip: "bg-coral-rose/15 text-coral-rose", pct: 54 },
];

export default function ResultsPreviewMock({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-light-gray/70 bg-white p-4 shadow-xl shadow-midnight-navy/15 ${className}`}>
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">Your Snapshot</p>
      <p className="mt-0.5 font-display text-lg font-semibold text-midnight-navy">Where you are now</p>
      <div className="mt-3 space-y-2.5">
        {ROWS.map((r) => (
          <div key={r.name}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-ui text-xs text-charcoal/80">{r.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.chip}`}>{r.label}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-light-gray">
              <div className={`h-full rounded-full ${r.tint}`} style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-warm-ivory p-2.5">
        <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">Your next step</p>
        <p className="mt-0.5 font-body text-xs leading-relaxed text-charcoal/85">A little more attention to how you handle conflict this week.</p>
      </div>
    </div>
  );
}
