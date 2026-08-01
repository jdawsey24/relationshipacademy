import type { CSSProperties, ReactNode } from "react";

// Visual identity for the 5 Snapshot markers — the same line-glyph + palette-hue
// language as components/site/PlaybookMark, so the picker belongs to the same
// system. Each marker is a life-cycle phase, and its glyph gestures at that
// relationship stage. Keyed by assessment id, with a neutral fallback.

type GlyphKey = "single" | "meeting" | "bond" | "linked" | "apart" | "renew" | "default";

const VISUALS: Record<string, { hue: string; glyph: GlyphKey }> = {
  single: { hue: "#6B7C97", glyph: "single" }, //                    umbrella for the two "single" states
  single_but_dating: { hue: "#D9777D", glyph: "meeting" }, //        Exploration — coral
  in_a_relationship: { hue: "#6B7C97", glyph: "bond" }, //           Exclusivity — slate-blue
  married_or_long_term: { hue: "#8A9D8F", glyph: "linked" }, //      Expansion — sage
  recent_divorce_breakup: { hue: "#C9A96E", glyph: "apart" }, //     Recovery — amber
  single_contemplating_dating: { hue: "#9C7A97", glyph: "renew" }, // Renewal — dusty-plum
};

export function markerHue(id: string): string {
  return VISUALS[id]?.hue ?? "#6B7C97";
}

const GLYPHS: Record<GlyphKey, ReactNode> = {
  // one — the umbrella "single" state
  single: (
    <>
      <circle cx="12" cy="8.5" r="3.3" />
      <path d="M6 19a6 6 0 0 1 12 0" />
    </>
  ),
  // two, approaching — dating / exploring
  meeting: (
    <>
      <circle cx="7.5" cy="12" r="3.2" />
      <circle cx="16.5" cy="12" r="3.2" />
      <path d="M11.2 12h1.6" />
    </>
  ),
  // two, overlapping — a defined, exclusive bond
  bond: (
    <>
      <circle cx="9.5" cy="12" r="4" />
      <circle cx="14.5" cy="12" r="4" />
    </>
  ),
  // interlocked links — a long, committed bond
  linked: (
    <>
      <ellipse cx="9.5" cy="12" rx="3" ry="4.4" />
      <ellipse cx="14.5" cy="12" rx="3" ry="4.4" />
    </>
  ),
  // two, pulling apart — an ending, in recovery
  apart: (
    <>
      <circle cx="7" cy="12" r="3" />
      <circle cx="17" cy="12" r="3" />
      <path d="M13 9.5l-2 5" />
    </>
  ),
  // a fresh direction out of a whole — contemplating again
  renew: (
    <>
      <circle cx="12" cy="14.5" r="4.6" />
      <path d="M12 9.9V4.5" />
      <path d="M9.6 6.9 12 4.5l2.4 2.4" />
    </>
  ),
  default: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    </>
  ),
};

export function MarkerMark({
  id,
  className,
  style,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
}) {
  const glyph = VISUALS[id]?.glyph ?? "default";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {GLYPHS[glyph]}
    </svg>
  );
}
