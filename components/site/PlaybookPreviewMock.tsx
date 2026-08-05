import type { CSSProperties } from "react";

// A real-looking preview of what's actually inside a Playbook — the sales page
// claims "an interactive walk-through, not a PDF", and this is the proof.
//
// Mirrors the live `scenarioSort` screen (the signature interaction): a short
// situation, then sorting the pieces into what you SAW, what you're GUESSING,
// and what you don't know yet. Drawn in code rather than screenshotted so it can
// never go stale, costs no image weight, and takes each Playbook's own hue.
// Same pattern as components/landing/ResultsPreviewMock.
//
// Illustrative example copy — deliberately generic, not lifted from any one
// Playbook, so nothing here spoils purchased content.

const PIECES: { text: string; bucket: "saw" | "guess" | "unknown" }[] = [
  { text: "Their texts got shorter this week", bucket: "saw" },
  { text: "They're losing interest", bucket: "guess" },
  { text: "Whether something else is going on", bucket: "unknown" },
];

const BUCKETS: Record<string, { label: string; tone: "hue" | "sage" | "muted" }> = {
  saw: { label: "Saw it", tone: "sage" },
  guess: { label: "Guessing", tone: "hue" },
  unknown: { label: "Don't know yet", tone: "muted" },
};

const SAGE = "#8A9D8F";

export default function PlaybookPreviewMock({ hue, className = "" }: { hue: string; className?: string }) {
  const chipStyle = (tone: "hue" | "sage" | "muted"): CSSProperties =>
    tone === "sage"
      ? { backgroundColor: `${SAGE}1f`, color: "#5c6b60" }
      : tone === "hue"
        ? { backgroundColor: `${hue}1f`, color: hue }
        : { backgroundColor: "rgba(51,51,51,0.06)", color: "rgba(51,51,51,0.55)" };

  return (
    <div
      className={`rounded-2xl border border-light-gray/70 bg-white p-5 shadow-xl shadow-midnight-navy/10 ${className}`}
      aria-label="Preview of an exercise inside the Playbook"
    >
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: hue }}>
        Inside the Playbook
      </p>
      <p className="mt-1.5 font-body text-sm leading-relaxed text-charcoal/85">
        Put each piece in a pile.
      </p>

      {/* The situation */}
      <div className="mt-3 rounded-xl bg-warm-ivory/70 p-3.5">
        <p className="font-body text-[13px] leading-relaxed text-charcoal/80">
          You had a great date. Over the next few days their texts got shorter — then they wrote to make a plan
          for next week.
        </p>
      </div>

      {/* The sort */}
      <div className="mt-3.5 space-y-2">
        {PIECES.map((piece) => {
          const b = BUCKETS[piece.bucket];
          return (
            <div key={piece.text} className="flex items-center justify-between gap-3 rounded-lg border border-light-gray/70 px-3 py-2">
              <span className="font-body text-[13px] leading-snug text-charcoal/85">{piece.text}</span>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={chipStyle(b.tone)}
              >
                {b.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3.5 font-body text-[12px] leading-relaxed text-charcoal/55">
        Then you decide what to do — based on what you actually saw.
      </p>
    </div>
  );
}
