// Structural-phase presentation data (self-select cards + results banner) and
// the shared color mappings used across the quiz/results UI. Card copy follows
// the Phase 2 spec; it is intentionally static brand copy, not DB-driven.
//
// IMPORTANT: Tailwind's JIT compiler only emits classes it can find as literal
// strings in source. So instead of building class names like `bg-${token}`,
// every color maps to an object of LITERAL class strings in COLOR_CLASSES.

export type StructuralSlug =
  | "exploration"
  | "exclusivity"
  | "expansion"
  | "expiration";

export interface PhaseCard {
  slug: StructuralSlug;
  name: string;
  color: ColorToken;
  description: string;
  examples: string;
}

export type ColorToken =
  | "coral-rose"
  | "plum"
  | "sage-green"
  | "slate-blue"
  | "soft-coral"
  | "amber-warm"
  | "deep-red"
  | "midnight-navy"
  | "dusty-plum"
  | "light-sage";

export interface ColorClasses {
  solidBg: string; // strong fill (badges, selected cards)
  solidText: string; // text color on solid fill
  tintBg: string; // light tint background (banners, selected card bg)
  border: string;
  text: string; // text in the accent color
  barFill: string; // progress-bar fill
}

export const COLOR_CLASSES: Record<ColorToken, ColorClasses> = {
  "coral-rose": { solidBg: "bg-coral-rose", solidText: "text-white", tintBg: "bg-coral-rose/10", border: "border-coral-rose", text: "text-coral-rose", barFill: "bg-coral-rose" },
  plum: { solidBg: "bg-plum", solidText: "text-white", tintBg: "bg-plum/10", border: "border-plum", text: "text-plum", barFill: "bg-plum" },
  "sage-green": { solidBg: "bg-sage-green", solidText: "text-white", tintBg: "bg-sage-green/10", border: "border-sage-green", text: "text-sage-green", barFill: "bg-sage-green" },
  "slate-blue": { solidBg: "bg-slate-blue", solidText: "text-white", tintBg: "bg-slate-blue/10", border: "border-slate-blue", text: "text-slate-blue", barFill: "bg-slate-blue" },
  "soft-coral": { solidBg: "bg-soft-coral", solidText: "text-white", tintBg: "bg-soft-coral/15", border: "border-soft-coral", text: "text-coral-rose", barFill: "bg-soft-coral" },
  "amber-warm": { solidBg: "bg-amber-warm", solidText: "text-white", tintBg: "bg-amber-warm/15", border: "border-amber-warm", text: "text-amber-warm", barFill: "bg-amber-warm" },
  "deep-red": { solidBg: "bg-deep-red", solidText: "text-white", tintBg: "bg-deep-red/10", border: "border-deep-red", text: "text-deep-red", barFill: "bg-deep-red" },
  "midnight-navy": { solidBg: "bg-midnight-navy", solidText: "text-white", tintBg: "bg-midnight-navy/10", border: "border-midnight-navy", text: "text-midnight-navy", barFill: "bg-midnight-navy" },
  "dusty-plum": { solidBg: "bg-dusty-plum", solidText: "text-white", tintBg: "bg-dusty-plum/10", border: "border-dusty-plum", text: "text-dusty-plum", barFill: "bg-dusty-plum" },
  "light-sage": { solidBg: "bg-light-sage", solidText: "text-midnight-navy", tintBg: "bg-light-sage/20", border: "border-light-sage", text: "text-sage-green", barFill: "bg-light-sage" },
};

export function classesFor(token: ColorToken): ColorClasses {
  return COLOR_CLASSES[token];
}

export const PHASE_CARDS: PhaseCard[] = [
  {
    slug: "exploration",
    name: "Exploration",
    color: "coral-rose",
    description: "We are not yet in an exclusive relationship.",
    examples: "Dating, talking stage, casual dating",
  },
  {
    slug: "exclusivity",
    name: "Exclusivity",
    color: "plum",
    description: "We have made a mutual commitment to be exclusive.",
    examples: "Boyfriend/girlfriend, committed partnership",
  },
  {
    slug: "expansion",
    name: "Expansion",
    color: "sage-green",
    description: "We have begun building a shared life together.",
    examples: "Living together, engaged, married, parenting together",
  },
  {
    slug: "expiration",
    name: "Expiration",
    color: "slate-blue",
    description: "Our relationship is experiencing significant decline.",
    examples: "Separation, breakup in progress, divorce in progress",
  },
];

/** Accent color token for a structural phase slug. */
export function phaseColor(slug: string): ColorToken {
  return PHASE_CARDS.find((p) => p.slug === slug)?.color ?? "midnight-navy";
}

/** Result-level color token (domain & competency cards). */
export function resultLevelColor(level: string): ColorToken {
  switch (level) {
    case "Strength":
      return "sage-green";
    case "Healthy Development":
      return "slate-blue";
    case "Growth Opportunity":
      return "soft-coral";
    case "Needs Attention":
      return "coral-rose";
    default:
      return "midnight-navy";
  }
}

/** Risk-level color token (expiration risk). */
export function riskLevelColor(riskLevel: string): ColorToken {
  switch (riskLevel) {
    case "Low Risk":
      return "sage-green";
    case "Some Risk Indicators":
      return "amber-warm";
    case "Elevated Risk":
      return "coral-rose";
    case "High Risk":
      return "deep-red";
    default:
      return "midnight-navy";
  }
}

/** Alignment status color token. */
export function alignmentColor(status: string): ColorToken {
  return status === "Congruent" ? "sage-green" : "coral-rose";
}
