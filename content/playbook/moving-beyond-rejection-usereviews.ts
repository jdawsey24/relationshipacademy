// Rev 3 Step 7 — Integrate layer: structured Use Reviews for "Moving Beyond Rejection".
// FOR REVIEW (content gate, revised). Additive, flag-gated, not wired into v0.
// All six Cluster-1 Plays now have a Use Review: the two original (read-and-decide,
// what-it-actually-means) plus the four new ones (is-this-right-for-you, rest-or-giving-up,
// how-much-to-put-in, say-the-real-thing) — each anchored to its Play's operation, its
// fidelity "correct" line, and its misuse boundaries.
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
  {
    id: "review-is-this-right-for-you",
    version: 1,
    playId: "is-this-right-for-you",
    didDifferently: {
      label: "What did you actually do differently? (choose any that fit)",
      multi: true,
      options: [
        "I kept my own question open — not just whether they're into me",
        "I named something I learned about whether this fits me",
        "I enjoyed them without letting it answer whether this fits",
        "I treated a respect/treatment thing as its own kind of information",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "How closely did you use the move: enjoying them, and still keeping your own question — is this right for me — open?",
      options: ["Pretty closely", "Some of it", "Not really this time"],
    },
    becameClearer: {
      label: "What got clearer? (choose any that fit)",
      multi: true,
      options: [
        "Something I'm actually learning about whether this fits me",
        "That being wanted isn't the same as being a fit",
        "That respect and how I'd be treated is its own kind of information",
        "Nothing yet — still mostly about whether they like me",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck most?",
      options: [
        "Keeping my own question open when I really liked them",
        "Telling 'they're into me' apart from 'this fits me'",
        "Letting a fit thing stay in view instead of explaining it away",
        "I didn't really get stuck",
      ],
    },
  },
  {
    id: "review-rest-or-giving-up",
    version: 1,
    playId: "rest-or-giving-up",
    didDifferently: {
      label: "What did you actually do differently? (choose any that fit)",
      multi: true,
      options: [
        "I chose a stance on purpose, for right now",
        "I kept it revisitable — not a forever decision",
        "I told 'I'm discouraged' apart from 'it's never going to happen'",
        "I let myself rest without calling it giving up",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "How closely did you use the move: choosing an intentional stance for now, and keeping it yours to change?",
      options: ["Pretty closely", "Some of it", "Not really this time"],
    },
    becameClearer: {
      label: "What got clearer? (choose any that fit)",
      multi: true,
      options: [
        "What I actually want to do with dating right now",
        "That resting is a choice, not a failure",
        "That a hard week isn't a verdict on all of it",
        "Nothing yet — still worn out",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck most?",
      options: [
        "Choosing on purpose instead of just drifting into it",
        "Telling discouragement apart from a real conclusion",
        "Letting rest be okay without guilt",
        "I didn't really get stuck",
      ],
    },
  },
  {
    id: "review-how-much-to-put-in",
    version: 1,
    playId: "how-much-to-put-in",
    didDifferently: {
      label: "What did you actually do differently? (choose any that fit)",
      multi: true,
      options: [
        "I named the evidence before changing what I put in",
        "I noticed my effort creeping up without anything new",
        "I tied my move to something I actually observed",
        "I let a quiet stretch be quiet — not a reason to chase",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "How closely did you use the move: naming the evidence first, then deciding what to put in on purpose?",
      options: ["Pretty closely", "Some of it", "Not really this time"],
    },
    becameClearer: {
      label: "What got clearer? (choose any that fit)",
      multi: true,
      options: [
        "What I actually have to go on, vs. what I'm filling in",
        "When my effort was outrunning the evidence",
        "That a repeated pattern can be evidence too",
        "Nothing yet — still hard to read",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck most?",
      options: [
        "Naming the evidence before I changed anything",
        "Not putting in more just to fill the quiet",
        "Telling a real pattern from a story I'm filling in",
        "I didn't really get stuck",
      ],
    },
  },
  {
    id: "review-say-the-real-thing",
    version: 1,
    playId: "say-the-real-thing",
    didDifferently: {
      label: "What did you actually do differently? (choose any that fit)",
      multi: true,
      options: [
        "I said the real thing clearly, once",
        "I skipped burying it in apology or over-explaining",
        "I didn't smooth myself over to keep it easy",
        "I took their response as information, not a grade",
        "Honestly, not much this time",
      ],
    },
    performedOperation: {
      label: "How closely did you use the move: saying the real thing clearly and kindly, without burying it?",
      options: ["Pretty closely", "Some of it", "Not really this time"],
    },
    becameClearer: {
      label: "What got clearer? (choose any that fit)",
      multi: true,
      options: [
        "That saying it plainly was enough",
        "How often I soften or apologize when I don't need to",
        "That their reaction is information, not a verdict on me",
        "Nothing yet — still felt risky",
      ],
    },
    stuckWhere: {
      label: "Where did you get stuck most?",
      options: [
        "Saying it without softening it away",
        "Skipping the apology or the long explanation",
        "Taking the response as information, not a grade",
        "I didn't really get stuck",
      ],
    },
  },
];
