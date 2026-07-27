// Rev 3 Step 7 — Integrate layer: structured Use Reviews for "Moving Beyond Rejection".
// FOR REVIEW (content gate). Additive, flag-gated, not wired into v0.
//
// A Use Review is the structured functional return after a real-world attempt. Bounded
// selects only — NOT journaling. It collects only what supports fidelity, behavioral
// transfer, updating the saved Play, and selecting the next focus. `performed` is the
// Technique-Fidelity signal (yes/partly/no) — attempt is NOT the same as correct use.
// The user-authored free text lives only in the Keep/Update editor (the intervention's own
// output), not here.

import type { UseReview } from "@/lib/playbook/contentSchema";

export const MBR_USE_REVIEWS: UseReview[] = [
  {
    id: "review-read-and-decide",
    version: 1,
    playId: "read-and-decide",
    didDifferently: {
      label: "What did you actually do differently?",
      options: [
        "I separated what I saw from what I was guessing",
        "I named what I didn't know yet",
        "I waited for the one thing that would tell me",
        "I made a clear move from the evidence",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "Did you run the move the way it's meant to work — saw-it / guessing / what-would-tell-me?",
      options: ["Yes", "Partly", "Not really"],
    },
    becameClearer: {
      label: "What got clearer?",
      options: [
        "What I actually know vs. what I'm guessing",
        "What I'd need to see next",
        "That I already have enough to decide",
        "Nothing yet — still murky",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck, if anywhere?",
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
      label: "What did you actually do differently?",
      options: [
        "I caught the story starting",
        "I named the narrowest true thing",
        "I kept the fact and dropped the verdict",
        "I let the feeling stay without treating it as evidence",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "Did you run the move the way it's meant to work — establish / doesn't-establish?",
      options: ["Yes", "Partly", "Not really"],
    },
    becameClearer: {
      label: "What got clearer?",
      options: [
        "What the event actually establishes",
        "What it can't establish about me",
        "That a real pattern is separate from a verdict",
        "Nothing yet — still heavy",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck, if anywhere?",
      options: [
        "Catching the story before it hardened",
        "Naming the narrowest true thing",
        "The feeling made it feel true",
        "I didn't really get stuck",
      ],
    },
  },
];
