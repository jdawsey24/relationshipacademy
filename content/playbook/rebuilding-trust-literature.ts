/**
 * Cluster 16 — "Difficulty Trusting Again After Betrayal"
 * The Relationship Playbook™ · Rebuilding Trust After Betrayal
 * Field Guide literature. 8 Core Guides + 3 Question Reads.
 *
 * Track: Expiration. Task = Acceptance. Core Need: TO FEEL SECURE.
 *
 * ⚠⚠ THE READER IS TORN, AND THE PLAYBOOK MUST NOT PUSH. Owner-ruled: the
 *   challenge is working out which path they want to be on. Nothing here may
 *   lean toward staying or toward leaving — not in the copy, not in the
 *   framing, not in which option appears first.
 *
 * ⚠ BRANCHING STRUCTURE. An orienting Play names both paths openly, then the
 *   reader chooses. Two tools are stay-path; one applies to either. Recognition
 *   cards are the primary branch mechanism, because Play.routing supports only
 *   a single onward route.
 *
 * ⚠ FORGIVENESS DOES NOT REQUIRE STAYING. STM-0615 asks this directly and it is
 *   the most load-bearing correction in the cluster. You can forgive and leave.
 *   You can stay and not have forgiven.
 *
 * ⚠ ADDICTION IS OUT OF SCOPE. PE-7 (support vs enabling, exhaustion from
 *   worrying) routes to a signpost, not a tool. Living alongside someone's
 *   recovery needs specialist support — Al-Anon, a therapist who works with
 *   families — and a relationship Playbook is the wrong instrument.
 *
 * ⚠ CHECKING BEHAVIOUR IS NOT PATHOLOGISED. Looking for signs after a betrayal
 *   is what anyone does. The content addresses what it costs, never whether the
 *   reader is entitled to it.
 *
 * ⚠ CLAIM SCOPE. May claim: work out which question you're asking; see what
 *   the checking costs; check whether anything has actually changed; work out
 *   what forgiving would require. MUST NOT CLAIM: that trust returns, that
 *   they've changed, that staying or leaving is right, or that forgiveness is
 *   achievable.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const C16_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c16-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c16-two-questions", "lit-c16-checking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Something happened. You're still here, and you don't know whether you're staying.",
          "That's the actual situation, underneath the checking and the questions and the images that won't stop. Not \u201chow do I trust again\u201d \u2014 that comes later, and only on one of the two paths.",
        ],
      },
      {
        kind: "distinction",
        label: "Two questions that get tangled",
        body: [
          "Do I want to be in this? A decision, and yours alone.",
          "Can trust come back? A different question, and only worth answering if the first one is yes.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most people work on the second while the first is still open. That's exhausting, and it doesn't get anywhere. Trying to rebuild something you haven't decided to keep is a lot of effort aimed at a question you haven't asked.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here leans toward staying or leaving. Both are real choices, and you can get through either one. Anybody certain about your situation from the outside is telling you about themselves.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-two-questions",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cIs staying weakness? Is leaving giving up?\u201d",
    related: ["lit-c16-what-this-is", "lit-c16-faq-should-i"],
    body: [
      {
        kind: "paragraph",
        body: [
          "These two arrive together, and they're doing the same job: turning a decision into a judgement about who you are.",
        ],
      },
      {
        kind: "distinction",
        label: "Neither is true",
        body: [
          "Staying isn't weakness. It's often harder than leaving \u2014 it means living with what happened instead of moving away from it.",
          "Leaving isn't giving up. It's a decision that something can't be fixed, or isn't worth fixing — which is you making a call, not giving up.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Here's why this matters in real life: as long as one choice means you're weak and the other means you failed, you can't weigh them. You're not choosing between two paths, you're choosing between two accusations.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "People will tell you which one is which. They'll be confident. Most of them are describing what they think they'd do, from a place where they have nothing to lose.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-checking",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The checking",
    related: ["lit-c16-images", "lit-c16-what-changed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI keep looking for signs they'll cheat.\u201d \u201cI can't stop checking their phone.\u201d \u201cI keep asking questions that don't bring peace.\u201d",
          "First thing worth saying: this is what people do after a betrayal. It isn't a character flaw and you aren't being unreasonable.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's also doing something specific. Checking is a way to try to turn not-knowing into knowing for sure \u2014 to find the thing that would settle it either way. And it doesn't work, and there's a built-in reason why: finding nothing doesn't prove anything. It only proves nothing was found today.",
        ],
      },
      {
        kind: "distinction",
        label: "Which is why it keeps growing",
        body: [
          "A clean check gives you relief for a few hours, and then the same uncertainty comes back, so you have to do it again.",
          "And the questions that \u201cdon't bring peace\u201d are the same thing in words \u2014 each answer leads to the next question, because no answer can do the job you need it to.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will tell you to stop checking by sheer willpower. What's worth knowing is what it costs and what it can't deliver, so if you keep doing it, at least it's a real choice.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-images",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The images that won't stop",
    related: ["lit-c16-checking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to stop imagining what happened.\u201d \u201cI compare myself to the other person.\u201d",
          "Unwanted images after a betrayal are very common, and it's one of the parts people are most ashamed of, which keeps them quiet about it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Some of it is your mind trying to fill a gap. You have only some of the information about something that mattered a huge amount, and your mind keeps trying to finish the picture. More detail usually makes this worse, not better \u2014 which is why the questions that bring no peace often make the images sharper.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If the images are constant, or you're not sleeping, or they come as though it's happening now \u2014 that's worth taking to a therapist rather than handling alone. It's a known response to this kind of wound, and there is specific help for it.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-what-changed",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI don't know if they've really changed\u201d",
    related: ["lit-c16-checking", "lit-c16-can-trust-return"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You can't see inside someone. That's the honest starting point, and it's why this question feels impossible to answer.",
          "But change has an outside, and you can check the outside.",
        ],
      },
      {
        kind: "list",
        label: "What you can usually see when something has really changed",
        items: [
          "They did something that cost them \u2014 ended a friendship, changed a job, started therapy and kept going.",
          "They offer the reassurance instead of waiting to be asked for it.",
          "They can talk about what happened without it becoming about how hard it's been for them.",
          "Time has passed and it's held \u2014 not weeks, longer.",
          "They don't push you to be finished with it.",
        ],
      },
      {
        kind: "distinction",
        label: "What isn't evidence, no matter how sincere",
        body: [
          "Remorse. Real, and it isn't change \u2014 people can be truly devastated and do it again.",
          "Promises, no matter how specific. They become evidence once they've been kept for a while.",
          "\u201cI wonder if they regret it\u201d \u2014 almost certainly yes, and it tells you very little about what happens next.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of this predicts. Someone can do all five and it can still happen again, and someone can do none of them and never do it again. It's the best information there is, not a guarantee \u2014 and if you're waiting for a guarantee, that's worth knowing, because there isn't one.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-forgiveness",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Forgiveness doesn't mean staying",
    related: ["lit-c16-two-questions", "lit-c16-can-trust-return"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if forgiveness means staying.\u201d It doesn't, and this is probably the most useful thing in this Playbook.",
        ],
      },
      {
        kind: "distinction",
        label: "Four combinations, and all of them are real",
        body: [
          "Forgive and stay. The one everyone pictures.",
          "Forgive and leave. Common, and people rarely realise it's an option \u2014 you can stop carrying it and still not want the relationship.",
          "Stay and not forgive. Also common, and it's the one that tends to wear things down.",
          "Leave and not forgive. A real choice, though it's the heaviest to carry afterwards.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if forgiveness means forgetting\u201d has an easier answer: no. You won't forget, and being asked to is unfair. Forgiving is closer to deciding to stop charging interest \u2014 the debt stays, you just stop adding to it every day.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It also usually takes something first, and that's worth being honest about. Forgiving something that was never really owned up to is a great deal to ask of anyone. If you can't get there, that may be why, rather than a failing of yours.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-can-trust-return",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Can trust come back?",
    related: ["lit-c16-what-changed", "lit-c16-forgiveness"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Sometimes. Not always. And not the same trust \u2014 that one is gone and isn't coming back, and anyone promising its return is selling something.",
        ],
      },
      {
        kind: "distinction",
        label: "What replaces it, when it works",
        body: [
          "The old trust was an assumption. You didn't think about it; it was the background.",
          "What can be built afterwards is a decision, made again and again, based on evidence. Less comfortable. You're more aware of it. Some people find it more solid because it's chosen on purpose, and others find having to think about it all the time unbearable.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which of those it would be for you is worth thinking about, because it's a real difference in what you'd be signing up for \u2014 and it's more useful than asking whether trust can return as a general question.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know if I'll ever feel safe again\u201d is worth taking seriously, not brushing aside with reassurance. For some people the answer is no in this relationship and yes in a later one. That isn't a failure of effort.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-tired",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI love them, but I'm tired\u201d",
    related: ["lit-c16-two-questions", "lit-c16-faq-another-chance"],
    body: [
      {
        kind: "paragraph",
        body: [
          "One of the truest sentences people say here, and one of the least useful to be argued with.",
          "Love isn't the question. It's usually still there, which is what makes this so hard \u2014 if it had gone, the decision would be simple.",
        ],
      },
      {
        kind: "distinction",
        label: "What tiredness is actually telling you",
        body: [
          "Not that you don't love them. That what things take right now is more than you have to give.",
          "Which tells you about whether you can keep it up, not about how you feel \u2014 and whether you can keep it up is what decides these, more often than love does.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if I have another chance left in me\u201d is the same thing, said more exactly. It's worth answering honestly, not with what you wish were true. Having no more chances left is a real answer, and it isn't the same as not loving someone.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c16-faq-should-i",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Should I stay or should I go?",
    related: ["lit-c16-two-questions", "lit-c16-what-changed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We won't answer that, and we'd be wary of anyone who does. Both paths are real choices, you can get through either one, and the people most confident about your situation have the least to lose in it.",
        ],
      },
      {
        kind: "distinction",
        label: "What's worth knowing instead",
        body: [
          "Nobody needs a good enough reason to leave after a betrayal. \u201cI don't want to\u201d is enough, and people spend a long time trying to justify a decision they're allowed to make anyway.",
          "And nobody needs to leave to have self-respect. Staying is a choice, not a failure of one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If there's any part of this where you're frightened of them, or being pressured about what you decide \u2014 that's a different situation and this Playbook doesn't cover it. Please talk to someone.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-faq-another-chance",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How many chances is too many?",
    related: ["lit-c16-tired", "lit-c16-what-changed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's no number, and anyone offering one is guessing.",
        ],
      },
      {
        kind: "distinction",
        label: "More useful than counting",
        body: [
          "Was anything different about this chance? Not the promise \u2014 the conditions. Did something actually change in how it was set up?",
          "Do you have another one in you? An honest question about what you have left, and the answer is allowed to be no.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "A chance given because you couldn't face the alternative isn't really a chance. It's just putting it off, and it tends to come around again looking the same.",
        ],
      },
    ],
  },

  {
    id: "lit-c16-faq-recovery",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if it's addiction?",
    related: ["lit-c16-tired", "lit-c16-what-changed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Then this Playbook is the wrong tool, and we'd rather say so than half-help.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know where support ends and enabling begins\u201d is a real and specific question, and there's a whole field of knowledge behind it that a relationship Playbook doesn't have. So does \u201cI'm exhausted from worrying\u201d, which is a known experience with known support.",
        ],
      },
      {
        kind: "list",
        label: "Worth looking into",
        items: [
          "Al-Anon or a similar family group \u2014 specifically for people alongside someone else's addiction.",
          "A therapist who works with families affected by addiction, not a couples therapist.",
          "Your GP, if the worrying is affecting your sleep or your health.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some of what's here will still apply \u2014 the checking, the images, the question of whether anything has changed. But the support-versus-enabling question needs people who know that territory, and anything less would let you down.",
        ],
      },
    ],
  },
];
