// What she's asking for, as buttons.
//
// Until now the only way to ask for satire was to type "do this one as satire"
// into a note and hope. These are the same choices, made explicit, and each one
// carries the exact instruction that reaches the model — so what the button says
// and what the model is told cannot drift apart.
//
// "Let it pick" is first and is the default on every axis. The families are a
// palette, and a screen full of required choices would turn them into a form,
// which is the thing this rebuild was getting away from. Choosing nothing is a
// legitimate answer and produces the range she was getting before.

export interface Direction {
  value: string;
  label: string;
  /** Verbatim instruction. Empty means say nothing and let it choose. */
  instruction: string;
}

/** How the piece is built. One at a time — these are different videos. */
export const FORMS: Direction[] = [
  { value: "", label: "Let it pick", instruction: "" },
  {
    value: "satire",
    label: "Satire",
    instruction:
      "Write these as satire. Follow the satire skeleton exactly, all ten numbered items, " +
      "every one carrying the \"unless you want\" construction, and let it run as long as it runs.",
  },
  {
    value: "story",
    label: "Story, no list",
    instruction:
      "No list in these. Tell it as something that happened and let the insight fall out of the telling.",
  },
  {
    value: "questions",
    label: "Questions I'd ask",
    instruction:
      "Build these around the questions she'd ask before deciding what a situation means. " +
      "Her expertise shows in what she thinks to ask, not in what she concludes.",
  },
  {
    value: "moment_pattern",
    label: "Moment vs pattern",
    instruction:
      "Build these on the difference between one thing that happened and a thing that keeps happening, " +
      "and what each one has earned the right to mean.",
  },
  {
    value: "three_things",
    label: "Three things to do",
    instruction:
      "Land these on three things she can actually do, in order, each one getting her something " +
      "the one before it couldn't.",
  },
  {
    value: "grant_it",
    label: "Let's say that's true",
    instruction:
      "Grant the popular explanation in these, then show it still doesn't tell her what to do next.",
  },
  {
    value: "confusing",
    label: "Things we confuse",
    instruction:
      "Build these on two or three things people collapse into one, separated out and named plainly.",
  },
];

/** The register. Not the content. */
export const TONES: Direction[] = [
  { value: "", label: "Let it pick", instruction: "" },
  {
    value: "funny",
    label: "Funnier",
    instruction:
      "Lean into the humour. Dry reactions, not constructed jokes, and never at the expense of " +
      "anybody watching.",
  },
  {
    value: "blunt",
    label: "More direct",
    instruction:
      "Say it straighter. Fewer softeners, shorter sentences, and get to the real thing sooner.",
  },
  {
    value: "warm",
    label: "Warmer",
    instruction:
      "Softer. She's talking to somebody who's tired, not somebody who needs correcting.",
  },
  {
    value: "serious",
    label: "No jokes",
    instruction:
      "Play this one straight. The subject doesn't want a punchline anywhere in it.",
  },
];

/** How it opens on screen. Useful when she already has a clip. */
export const OPENINGS: Direction[] = [
  { value: "", label: "Let it pick", instruction: "" },
  { value: "to_camera", label: "To camera", instruction: "Open all of these to camera. She's just talking." },
  { value: "stitch", label: "Stitch the clip", instruction: "Open all of these as a stitch: the clip runs, then cut to her mid-reaction." },
  { value: "cold_open", label: "Cold open", instruction: "Open all of these cold. No greeting, already mid-thought." },
  { value: "flash_forward", label: "Promise the payoff", instruction: "Open all of these by promising what's coming and making them wait for it." },
];

export const AXES = [
  { key: "form", label: "Shape", options: FORMS },
  { key: "tone", label: "Tone", options: TONES },
  { key: "opening", label: "Opens with", options: OPENINGS },
] as const;

export type AxisKey = (typeof AXES)[number]["key"];

/**
 * The instruction block for whatever she chose.
 *
 * Only chosen axes appear. An unchosen axis contributes nothing rather than
 * "tone: any", which would spend words telling the model to ignore something.
 */
export function directionText(brief: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const axis of AXES) {
    const chosen = String(brief[axis.key] ?? "");
    if (!chosen) continue;
    const found = axis.options.find((o) => o.value === chosen);
    if (found?.instruction) lines.push(`- ${found.instruction}`);
  }
  return lines.length
    ? lines.join("\n")
    : "Nothing specified. Choose the shape, the tone and the opening that suit what she gave you.";
}

/** Reject anything not on the list, so a stray value can't reach the prompt. */
export function isValidChoice(axis: string, value: string): boolean {
  if (!value) return true;
  const found = AXES.find((a) => a.key === axis);
  return !!found?.options.some((o) => o.value === value);
}
