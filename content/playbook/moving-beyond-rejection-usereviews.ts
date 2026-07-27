// Rev 3 Step 7 — Integrate layer: structured Use Reviews for "Moving Beyond Rejection".
// FOR REVIEW (content gate, revised). Additive, flag-gated, not wired into v0.
//
// A Use Review is the structured functional return after a real-world attempt. Bounded
// selects only — NOT journaling, and NOT a checklist score. It collects only what supports
// fidelity, behavioral transfer, updating/saving the tool, and (in Step 8) selecting the
// next focus. The fidelity prompt is phrased as "how closely did you use the move" (non-
// evaluative) but still maps to the internal yes/partly/no Technique-Fidelity states. The
// only user-authored free text lives in the Keep/Update editor (the Play's own output).

import type { UseReview } from "@/lib/playbook/contentSchema";

export const MBR_USE_REVIEWS: UseReview[] = [
  {
    id: "review-read-and-decide",
    version: 1,
    playId: "read-and-decide",
    didDifferently: {
      label: "What did you actually do differently? (choose any that fit)",
      multi: true,
      options: [
        "I separated what I saw from what I was guessing",
        "I named what I didn't know yet",
        "I figured out what would actually tell me more",
        "I made a clear move from the evidence",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "How closely did you use the move: what I saw, what I was guessing, and what would actually tell me more?",
      options: ["Pretty closely", "Some of it", "Not really this time"],
    },
    becameClearer: {
      label: "What got clearer? (choose any that fit)",
      multi: true,
      options: [
        "What I actually know vs. what I'm guessing",
        "What I'd need to see next",
        "That I already have enough to decide",
        "Nothing yet — still murky",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck most?",
      options: [
        "Reading it — telling saw-it from guessing",
        "Acting on what I already saw",
        "The feeling got loud",
        "I didn't really get stuck",
      ],
    },
  },
  {
    id: "review-what-it-actually-means",
    version: 1,
    playId: "what-it-actually-means",
    didDifferently: {
      label: "What did you actually do differently? (choose any that fit)",
      multi: true,
      options: [
        "I caught the story starting",
        "I named the narrowest true thing",
        "I kept the fact and dropped the verdict",
        "I let the feeling stay without treating it as evidence",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "How closely did you use the move: what this establishes, and what it doesn't establish?",
      options: ["Pretty closely", "Some of it", "Not really this time"],
    },
    becameClearer: {
      label: "What got clearer? (choose any that fit)",
      multi: true,
      options: [
        "What the event actually establishes",
        "What it can't establish about me",
        "That a real pattern is separate from a verdict",
        "Nothing yet — still heavy",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck most?",
      options: [
        "Catching the story before it hardened",
        "Naming the narrowest true thing",
        "The feeling made it feel true",
        "I didn't really get stuck",
      ],
    },
  },
];
