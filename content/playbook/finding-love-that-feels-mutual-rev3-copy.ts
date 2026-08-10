// Rev 3 Step 5 (UX gate) — flag-gated readability pass for the Rev 3 Play screens ONLY.
//
// This is a COPY transform. It changes wording only — never structure, ids, correctBucket
// values, buckets, actions, fidelity, scenarios, or theoretical meaning. v0 keeps the
// original screens verbatim (this module is applied only on the Rev 3 path, in PlaySequence),
// so the deployed v0 experience is unchanged.
//
// Scope of the pass (owner-directed): shorter sentences / lower cognitive load in Shift,
// teaching feedback (scenario-sort corrections), scenario notes, real-world-use, safety
// language, and the Rule Builder guardrail (made unmistakable: a plan for the USER'S own
// behaviour based on what they observe — not controlling the other person, deadlines, or
// making someone chase). What It Actually Means keeps the real-pattern-vs-global-verdict
// distinction: a painful pattern is never called imaginary.

import type { Play, Screen } from "@/lib/playbook/contentSchema";

// Rule Builder guardrail — unmistakable.
export const RD_CONTROL_CHECK_REV3 =
  "This is a plan for what YOU do, based on what you actually see. It's not a way to control them, make them chase, or set a secret deadline.";

const WM_SIGNPOST_BODY_REV3 =
  "This Play is for the sting of one dating moment. If what you feel is a belief about yourself that follows you everywhere — or something that's been heavy a long time — that's real. It deserves more than a dating tool. Talking with a mental health professional can genuinely help.";

function withCorrections(items: Extract<Screen, { kind: "scenarioSort" }>["items"], map: Record<string, string>) {
  return items.map((it) => (map[it.id] ? { ...it, correction: map[it.id] } : it));
}

// ---- Read It, Then Decide -----------------------------------------------------
function tightenRD(s: Screen): Screen {
  switch (s.kind) {
    case "shift":
      return {
        ...s,
        body: [
          "Right now, one unclear signal can turn into a whole story fast. And the story decides what you do.",
          "This helps you do something different. Tell what you've seen from what you're guessing. Notice what you still don't know. Then pick a clear next move — so your choice follows the evidence, not the fear or the hope.",
        ],
      };
    case "learn":
      return {
        ...s,
        body: [
          "Three buckets. When a story starts forming, sort it:",
          "Saw it — what actually happened. Guessing — what you think it means (might be right; still a guess). Don't know yet — what this can't tell you.",
          "Then one question: what would actually tell me?",
        ],
      };
    case "scenarioSort":
      if (s.items.some((i) => i.id === "s3")) {
        return {
          ...s,
          prompt: "Try it on someone else's situation first. Put each piece in a bucket.",
          note: "See it? The only ‘losing interest’ evidence is shorter texts. And they just made a real plan. The story ran ahead of what you saw.",
          items: withCorrections(s.items, {
            s3: "That's a guess, not something you saw. The shorter texts are what you saw. What they mean is still open.",
          }),
        };
      }
      if (s.items.some((i) => i.id === "w3")) {
        return {
          ...s,
          prompt: "One more. This time it's words vs. actions.",
          note: "When someone's words and their actions don't line up, that gap is information. It doesn't mean their words are fake. It means the gap is worth watching.",
        };
      }
      return s;
    case "ownTurn":
      return { ...s, intro: "Now a real one of yours. Keep it to one specific thing." };
    case "sufficiency":
      return {
        ...s,
        needMoreIntro: "Good — “I need more information” is a real answer. Name the one thing that would move this forward. That keeps it from turning into waiting forever.",
      };
    case "ruleBuilder":
      return {
        ...s,
        intro: "Now turn that into a move. Decide it now, so you're not deciding in the moment from fear or hope.",
        controlCheck: RD_CONTROL_CHECK_REV3,
      };
    case "output":
      return { ...s, body: "Here's what you've got. Keep it, or save it to My Plays." };
    case "realWorldUse":
      return {
        ...s,
        useWhen: "a text or a change in how they act starts turning into a story — or when you're not sure whether to stay, ask, ease off, or leave.",
        doThis: "Run the five lines before you react. Then watch for the one thing that would actually tell you.",
        safetyNote: "If what you're ‘waiting to be sure about’ is whether someone is treating you badly or unsafely — you don't need more proof. Trust it.",
      };
    default:
      return s;
  }
}

// ---- What It Actually Means ---------------------------------------------------
function tightenWM(s: Screen): Screen {
  switch (s.kind) {
    case "shift":
      return {
        ...s,
        body: [
          "When something doesn't work out, your mind can do something quick and unfair. It takes one thing that happened and turns it into a verdict about you. One person's ‘no’ becomes ‘I'm not enough.’",
          "This Play keeps the conclusion the size of the evidence. A hard moment stays a hard moment — not a definition of you. It won't make the sting go away. It just stops the sting from writing a story the evidence doesn't back.",
        ],
      };
    case "learn":
      return {
        ...s,
        body: [
          "When a letdown starts becoming a verdict, ask three things:",
          "What does this actually establish? What does it not establish? What's the narrowest true thing I can say?",
          "The trick is separating this happened from this is who I am. Let's try one on someone else first.",
        ],
      };
    case "scenarioSort":
      if (s.items.some((i) => i.id === "a3")) {
        return {
          ...s,
          note: "A hint on each: is this about this one person, or everyone? This time, or forever? What happened, or who you are?",
          items: withCorrections(s.items, {
            a3: "That's the story, not the evidence. What did the event actually show? That this one person didn't want to continue. The rest is the leap we're catching.",
          }),
        };
      }
      if (s.items.some((i) => i.id === "b4")) {
        return {
          ...s,
          note: "Your reaction is valid. We're checking only the big claim here, not the feeling.",
          items: withCorrections(s.items, {
            b4: "‘Nobody’ and ‘ever’ are the leap. One person going quiet can't prove a rule about everyone.",
          }),
        };
      }
      if (s.items.some((i) => i.id === "c2")) {
        // Real-pattern case — the distinction MUST hold: the pattern is not imaginary.
        return {
          ...s,
          prompt: "This one's different. There might be a real pattern — we won't tell you it's imaginary. Two things are getting tangled; sort them.",
          note: "Keep the observation. Drop the verdict. A real pattern is worth looking at — on its own, as evidence.",
          items: withCorrections(s.items, {
            c2: "That's a big claim the pattern can't prove. Keep the observation; drop the verdict.",
          }),
        };
      }
      return s;
    case "sentenceBuilder":
      return { ...s, helper: "Build it from what the event actually establishes. Keep it true, not flattering." };
    case "emotionBeat":
      return {
        ...s,
        body: [
          "Bounding the conclusion doesn't mean you're fine. It doesn't mean you didn't want it, or that it didn't matter.",
          "You can hold both: your narrowest true thing — and this can still hurt. You just did the hard part. You kept the fact and dropped the verdict.",
        ],
      };
    case "realWorldUse":
      return {
        ...s,
        useWhen: "a letdown starts turning into a sentence about you — ‘what's wrong with me,’ ‘this always happens,’ ‘I'm not enough.’",
        doThis: "Run the three questions before the story hardens. Keep the fact. Drop the verdict. Keep the feeling.",
        safetyNote: "If this feels bigger than a dating moment — a belief about yourself that follows you everywhere, or something that's been heavy a long time — that's real. It deserves more than a dating tool. Talking with a mental health professional can genuinely help.",
      };
    default:
      return s;
  }
}

/** The literature-extracted, copy-tightened Play for the Rev 3 path. Structure/ids/logic
 *  are preserved (spread of the original screen); only wording changes. */
export function rev3Play(play: Play): Play {
  const patch = play.playId === "read-and-decide" ? tightenRD : play.playId === "what-it-actually-means" ? tightenWM : (x: Screen) => x;
  const screens = play.screens.filter((s) => s.kind !== "literature").map(patch);
  const supportSignposts = play.supportSignposts?.map((sp) => (sp.id === "severe-self-worth" ? { ...sp, body: WM_SIGNPOST_BODY_REV3 } : sp));
  return { ...play, screens, supportSignposts };
}
