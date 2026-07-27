// Rev 3 Step 6 — Practice layer: authored real-world missions for "Moving Beyond
// Rejection". FOR REVIEW (content gate). Additive, flag-gated, not wired into v0.
//
// A mission is a behaviorally specific real-world assignment tied to a Play's operation.
// Rules (owner decision 8): NO levels/XP/streaks/ranks/badges/completion %. Progression is
// authored "progressive Developmental Application" — offered as an optional next stretch,
// never a level, and never a mastery claim. No partner-monitoring. Suitability boundaries
// where needed. Consumer copy: "Try this next." / "Ready to stretch this a little further?"

import type { Mission } from "@/lib/playbook/contentSchema";

export const MBR_MISSIONS: Mission[] = [
  {
    id: "mission-rd-read-before-react",
    version: 1,
    playId: "read-and-decide",
    title: "Read it before you react",
    instruction:
      "The next time a text — or a change in how they're acting — starts turning into a story, stop before you react. Write down what you actually saw, what you're only guessing, and the one thing that would actually tell you.",
    linkToOperation: "This is the saw-it / guessing / what-would-tell-me move — out in real life, before the story decides for you.",
    attemptMeaning: "You've tried it if you paused and separated what you saw from what you were guessing — even once. It doesn't have to go well, or feel finished.",
    suitability:
      "This is for ambiguity, not safety. If the real question is whether someone is treating you badly, you don't need more evidence — trust that, and step back.",
    progression: [
      {
        id: "decide",
        instruction:
          "Next time, don't just read it — decide. Run your “if I see ___, I'll ___,” and make one clear move from the evidence.",
      },
    ],
  },
  {
    id: "mission-wm-narrowest-true-thing",
    version: 1,
    playId: "what-it-actually-means",
    title: "Name the narrowest true thing",
    instruction:
      "The next time a letdown starts turning into a sentence about you — “what's wrong with me,” “this always happens” — pause and name the narrowest true thing the event actually shows, before the story hardens.",
    linkToOperation: "This is the establish / doesn't-establish move — keeping the conclusion the size of the evidence, out in real life.",
    attemptMeaning: "You've tried it if you caught the story starting and named the smaller, truer version — even if the bigger story still felt loud.",
    suitability:
      "If this feels bigger than one dating moment — heavy for a long time, or a belief that follows you everywhere — that deserves more than a dating tool. Talking with a mental health professional can help.",
    progression: [
      {
        id: "hold-with-feeling",
        instruction:
          "Next time, notice you can name the narrowest true thing even while the bigger story still feels true. The feeling can stay — it just isn't the evidence.",
      },
    ],
  },
];
