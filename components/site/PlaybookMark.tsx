import type { CSSProperties, ReactNode } from "react";

// Per-playbook visual identity: an abstract line-glyph + a hue drawn from the
// brand palette, keyed by cluster_id. Gives the catalog a designed system rather
// than a uniform list. Unmapped clusters fall back to a generic mark with a hue
// cycled from the palette, so new clusters are never unstyled.

type GlyphKey = "openCircle" | "door" | "horizon" | "eye" | "ripple" | "loop" | "fork" | "default";

// brand palette (tailwind.config.ts)
const HUE_CYCLE = ["#D9777D", "#8A9D8F", "#6B7C97", "#9C7A97", "#C9A96E", "#E7A2A4", "#7B5878", "#B7C4B5"];

const VISUALS: Record<number, { hue: string; glyph: GlyphKey }> = {
  1: { hue: "#D9777D", glyph: "openCircle" }, // Moving Beyond Rejection — coral-rose
  3: { hue: "#8A9D8F", glyph: "door" }, //        Letting Someone In — sage-green
  4: { hue: "#6B7C97", glyph: "horizon" }, //     Learning to Date Without Losing Hope — slate-blue
  5: { hue: "#9C7A97", glyph: "eye" }, //         Trusting What You See — dusty-plum
  6: { hue: "#C9A96E", glyph: "ripple" }, //      Finding Security — amber-warm
  7: { hue: "#E7A2A4", glyph: "loop" }, //        Breaking the Cycle — soft-coral
  24: { hue: "#7B5878", glyph: "fork" }, //       Lean In or Let Go — plum
};

export function playbookVisual(clusterId: number): { hue: string; glyph: GlyphKey } {
  return VISUALS[clusterId] ?? { hue: HUE_CYCLE[clusterId % HUE_CYCLE.length], glyph: "default" };
}

export function playbookHue(clusterId: number): string {
  return playbookVisual(clusterId).hue;
}

const GLYPHS: Record<GlyphKey, ReactNode> = {
  // an open circle, not quite closed — worth, still forming
  openCircle: (
    <>
      <path d="M20 12a8 8 0 0 0-8-8 8 8 0 0 0-8 8" />
      <path d="M4.6 15.5A8 8 0 0 0 12 20" />
      <circle cx="17.4" cy="17.4" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  // a door held ajar — letting someone in
  door: (
    <>
      <rect x="5" y="4" width="11" height="16" rx="1.5" />
      <path d="M16 4l3 2.4v13L16 20" />
      <circle cx="8.4" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // a small sun on the horizon — hope, held
  horizon: (
    <>
      <path d="M3 17h18" />
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0" />
      <path d="M12 8.5V6" />
      <path d="M16.5 9.5l1.4-1.4" />
      <path d="M7.5 9.5L6.1 8.1" />
    </>
  ),
  // an eye — reading what's actually there
  eye: (
    <>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  // settling ripples — security that holds
  ripple: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 7a5 5 0 0 1 5 5" />
      <path d="M12 4a8 8 0 0 1 8 8" />
    </>
  ),
  // a loop with a break in it — the cycle, interrupted
  loop: (
    <>
      <path d="M18.5 7.2A8 8 0 1 0 20 13" />
      <path d="M20 6v4h-4" />
    </>
  ),
  // a fork — lean in, or let go
  fork: (
    <>
      <path d="M12 20v-6" />
      <path d="M12 14l-5.5-6.5" />
      <path d="M12 14l5.5-6.5" />
      <circle cx="6" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="18" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  // generic: a centred node reaching outward — a pattern
  default: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
    </>
  ),
};

export function PlaybookMark({
  clusterId,
  className,
  style,
}: {
  clusterId: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { glyph } = playbookVisual(clusterId);
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
