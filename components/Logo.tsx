// Brand logo — placeholder implementation.
//
// The Phase 2 spec calls for PNG assets in /public (RLC_logo_transparent.png,
// RLC_logomark_trans.png, RLC_white.png, RLCWordmark.png, RLC_monogram.png).
// Those binaries don't exist yet, so this renders an on-brand typographic logo
// instead — nothing 404s and the UI is complete. To switch to the real assets,
// replace the JSX in each variant with <img src="/RLC_*.png" .../> (or
// next/image). The variant↔file mapping is noted on each branch.

import Link from "next/link";

type Variant = "full" | "wordmark" | "mark" | "monogram";
type Tone = "navy" | "white";

interface LogoProps {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  /** When set, the logo links here. */
  href?: string;
}

const WORDMARK = "Relationship Life Cycle";

export default function Logo({
  variant = "full",
  tone = "navy",
  className = "",
  href,
}: LogoProps) {
  const textColor = tone === "white" ? "text-white" : "text-midnight-navy";
  const ringColor =
    tone === "white" ? "border-white/80" : "border-midnight-navy/70";

  // RLC_logomark_trans.png / RLC_monogram.png → the circular mark
  const Mark = (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border ${ringColor} ${textColor} aspect-square`}
      style={{ width: "1.9em", height: "1.9em" }}
      aria-hidden="true"
    >
      <span className="font-display font-semibold leading-none" style={{ fontSize: "0.7em" }}>
        RLC
      </span>
    </span>
  );

  // RLCWordmark.png → the words
  const Wordmark = (
    <span className={`font-display font-semibold tracking-tight ${textColor}`}>
      {WORDMARK}
      <sup className="ml-0.5 align-super text-[0.5em] font-normal">™</sup>
    </span>
  );

  let content: React.ReactNode;
  switch (variant) {
    case "mark": // RLC_logomark_trans.png
    case "monogram": // RLC_monogram.png
      content = Mark;
      break;
    case "wordmark": // RLCWordmark.png
      content = Wordmark;
      break;
    case "full": // RLC_logo_transparent.png (or RLC_white.png for tone="white")
    default:
      content = (
        <span className="inline-flex items-center gap-2">
          {Mark}
          {Wordmark}
        </span>
      );
  }

  const wrapperClass = `inline-flex items-center ${className}`;

  if (href) {
    return (
      <Link href={href} className={wrapperClass} aria-label="Relationship Life Cycle">
        {content}
      </Link>
    );
  }
  return (
    <span className={wrapperClass} aria-label="Relationship Life Cycle">
      {content}
    </span>
  );
}
