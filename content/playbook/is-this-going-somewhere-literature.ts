/**
 * Cluster 24 — "Difficulty Knowing Whether to Invest" — VOLUME I
 * The Relationship Playbook™ · Deciding Whether to Lean In or Let Go
 * Field Guide literature. 8 Core Guides + 3 Question Reads.
 *
 * Track: Exploration (24 of 32 statements). Task = Discernment.
 * Core Need: TO FIND CLARITY (shared with Cluster 4).
 *
 * ⚠ THIS CLUSTER IS MOSTLY QUESTIONS. Seven statements end in a question mark;
 *   twelve begin "I don't know". Every other cluster has people describing a
 *   pattern; this one has someone asking for answers.
 *
 * ⚠ THE CENTRAL HONESTY. Most of those questions have no answer. "How long
 *   should I wait" has none. "Am I settling" has no external answer. So this
 *   Playbook cannot supply answers — it swaps unanswerable questions for
 *   answerable ones. That is the operation, and the content says so plainly
 *   rather than pretending otherwise.
 *
 * ⚠ TWO VOLUMES (Cluster 15 precedent). The 8 Exclusivity statements are
 *   POST-commitment doubt — "I said yes and now I'm not sure" — which is a
 *   different problem from pre-commitment uncertainty. Routed out via
 *   `rec-c24-already-committed`. Volume II deferred.
 *
 * ⚠ INBOUND ROUTE. Cluster 15's `rec-c15-still-chasing` points here. Those 11
 *   statements (unreciprocated pursuit, "should I keep trying or walk away")
 *   belong to this Exploration half thematically.
 *
 * ⚠ NO PRESCRIPTIONS. No timeframes, no rules about when to define things, no
 *   number of dates. Those are the answers the reader wants and they do not
 *   exist. Anything that looks like one is a claim we cannot support.
 *
 * ⚠ CLAIM SCOPE. May claim: replace an unanswerable question with an
 *   answerable one; work out what you'd need to see; name your own terms;
 *   decide on evidence rather than on certainty. MUST NOT CLAIM: that the
 *   uncertainty resolves, that you'll know, that any timeframe is correct, or
 *   that a right choice is identifiable in advance.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const C24_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c24-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c24-unanswerable", "lit-c24-what-you-can-know"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Almost everything people say here is a question. Where is this going. How long should I wait. How do I know if they're serious. Should I ask what we are.",
          "That's unusual, and it tells you something: you're not stuck in a pattern. You're stuck in a decision.",
        ],
      },
      {
        kind: "distinction",
        label: "Which changes what would help",
        body: [
          "Most Playbooks help you see something you couldn't see before. You can see this one clearly.",
          "What you're missing is a way to decide without being sure — because the sureness you've been waiting for isn't coming.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "We'll be straight with you: this isn't going to answer your questions. Several of them have no answer, and the ones that do only have part of one.",
          "What it can do is swap the questions that can't be answered for ones that can. That's a smaller offer, and an honest one.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-unanswerable",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The questions with no answers",
    related: ["lit-c24-what-this-is", "lit-c24-what-you-can-know"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's worth going through these directly, because waiting for answers that don't exist is where the time goes.",
        ],
      },
      {
        kind: "list",
        label: "No answer exists",
        items: [
          "How long should I wait? There's no right number of weeks. Anyone who gives you one is just guessing, confidently.",
          "Am I settling? There's no outside standard to measure 'settling' against. There are only your own terms — and you'd have to name those yourself.",
          "Is there someone better? Almost certainly — and also beside the point \u2014 there's always someone better at something. The question is built so it can never be answered.",
          "Is love supposed to feel different? Different from what? What people feel varies hugely, and none of it is the standard.",
          "Am I asking too much, or too little? There's no scale. Both questions are asking for a normal that isn't there.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "We're not saying these are silly questions. They're the natural ones to ask. We're saying you can hold them for years without ever getting an answer — and the holding is what costs you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The point isn't to stop caring about the answers. It's to notice that you're waiting for information that isn't going to arrive, and to decide on something else instead.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-what-you-can-know",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What you can actually find out",
    related: ["lit-c24-unanswerable", "lit-c24-ask-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some of it you really can find out. Less than you'd like, and more than nothing.",
        ],
      },
      {
        kind: "list",
        label: "Answerable",
        items: [
          "What are we? You can find out, by asking. Uncomfortable, and still something you can find out.",
          "Do they want the same things I do? You can find out, by asking — and it's worth doing before a year passes, not after.",
          "Are they putting in effort I can point at? You can watch for it over a few weeks.",
          "Does what they say match what they do? You can watch for it — and it's the single most useful thing on this list.",
          "What would I need to see to feel differently about this? You can answer it yourself — and almost nobody has.",
        ],
      },
      {
        kind: "distinction",
        label: "The swap",
        body: [
          "\u201cHow long should I wait?\u201d becomes \u201cWhat would I need to see, and by when?\u201d",
          "\u201cAre they serious?\u201d becomes \u201cWhat have they actually done in the last month?\u201d",
          "\u201cAm I settling?\u201d becomes \u201cWhat are my actual terms, and are they being met?\u201d",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of these make you certain. They give you a basis for deciding, which is what's on offer.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-ask-it",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cShould I ask what we are?\u201d",
    related: ["lit-c24-what-you-can-know", "lit-c24-faq-too-soon"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Yes. That's the short answer, and it's worth saying plainly, because there's a lot of advice out there saying you shouldn't.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The reasons people give against asking are usually that it seems needy, or it'll scare them off, or you should be able to tell. All three assume the question costs you something.",
          "What it actually costs is finding out. If someone is put off by a direct question about what you're doing together, that tells you something — it's not a mistake you made.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different asks",
        body: [
          "\u201cWhere is this going?\u201d asks them to guess what you want to know, and gets a vague answer.",
          "\u201cAre we seeing other people?\u201d or \u201cAre you looking for something serious?\u201d can be answered yes or no.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There's no right week to ask. If it's on your mind enough to be reading this, it's on your mind enough to ask.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-your-terms",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Your terms, rather than the standard",
    related: ["lit-c24-unanswerable", "lit-c24-faq-settling"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cAm I settling?\u201d \u201cI don't know if this is enough.\u201d \u201cI don't know if I'm asking for too much.\u201d",
          "All three ask the same thing: is there a standard, and am I above or below it? There isn't one — which is why the question never gets settled.",
        ],
      },
      {
        kind: "distinction",
        label: "What replaces it",
        body: [
          "Not a standard. Your terms \u2014 the specific things this doesn't work without.",
          "Most people have never written them down, which is why \u201cis this enough\u201d has nothing to be measured against.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Terms are usually fewer than people expect, and more specific. Not \u201ckindness\u201d \u2014 something like \u201csomeone who tells me when they're annoyed instead of going quiet\u201d.",
          "Once you have them,\u201cam I settling\u201d becomes a question you can check, not just an anxious one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Naming your terms may tell you that they're met and you're still uneasy. That's also useful, and it means the unease is about something else.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-someone-better",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cIs there someone better?\u201d",
    related: ["lit-c24-your-terms", "lit-c24-wrong-choice"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Yes. Almost certainly. There's someone funnier, someone more successful, someone who'd fit you better in some way you haven't even thought of.",
          "That's not a gloomy answer \u2014 it's about how the question is built. It's set up so it can never be answered no, which means you can ask it forever.",
        ],
      },
      {
        kind: "distinction",
        label: "A question that can be answered",
        body: [
          "Not: is there someone better?",
          "But: is there something specific missing here that I need? Which has an answer, and the answer might be yes.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know when to stop looking\u201d comes from the same place. There's no point where the looking is finished, because looking isn't a task with an end. It ends when you decide it does.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of this means stay with someone who isn't right. It means \u201csomeone better exists\u201d isn't the test \u2014 \u201csomething I need is missing\u201d is.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-wrong-choice",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Being afraid of the wrong choice",
    related: ["lit-c24-someone-better", "lit-c24-faq-know"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI'm afraid I'll choose the wrong person.\u201d \u201cI'm afraid of wasting more time.\u201d",
          "Both are reasonable. And both, unhelpfully, push you the same way: don't decide yet.",
        ],
      },
      {
        kind: "distinction",
        label: "What the fear hides",
        body: [
          "Not deciding is also a decision, and it costs time in exactly the way you're trying to avoid.",
          "Two years of not-quite-deciding is still two years, gone — and you'll have less to go on at the end than a clear attempt would have given you.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's also no version of this where you can't be wrong. Choosing has risk. So does waiting. So does leaving. The choice isn't between risk and safety — it's about which risk.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI keep second-guessing relationships\u201d is worth noticing as a pattern, not a verdict on any one person. If it's happened with several, the useful question is about the deciding, not about them.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-what-effort-looks-like",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What serious actually looks like",
    related: ["lit-c24-what-you-can-know", "lit-c24-ask-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cHow do I know if they're serious?\u201d This one has part of an answer, which is better than most.",
        ],
      },
      {
        kind: "list",
        label: "Worth weighing",
        items: [
          "They start things sometimes, instead of only responding.",
          "What they said would happen, happened.",
          "It's held up over more than a few weeks.",
          "They've made a plan about the future, not just the weekend.",
        ],
      },
      {
        kind: "list",
        label: "Worth weighing less than it feels",
        items: [
          "Warmth. Cheap, pleasant, and not evidence.",
          "Strong feelings early on. Not about you yet.",
          "Saying the right things with nothing behind them.",
          "How well you get along. It matters, but it's nowhere near enough.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This tells you whether they're showing up now. It doesn't tell you how it ends, and nothing does.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c24-faq-too-soon",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is it too soon to ask?",
    related: ["lit-c24-ask-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Probably not. And be wary of anyone who tells you there's a right week.",
        ],
      },
      {
        kind: "distinction",
        label: "Two ways to think about timing",
        body: [
          "The one people use: how long is normal before this talk? There's no answer, it varies a lot, and waiting for the normal moment is how a year passes.",
          "The more useful one: is not knowing costing me something? If it's taking up your attention, that's the cost — and you're already paying it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The fear underneath is usually that asking will end it. Sometimes it does \u2014 and if a direct question ends something, that something was more fragile than the asking.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-faq-settling",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I know if I'm settling?",
    related: ["lit-c24-your-terms", "lit-c24-someone-better"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You can't, in the way you want to. There's no outside standard, and nobody can tell you where the line is.",
        ],
      },
      {
        kind: "distinction",
        label: "What you can check instead",
        body: [
          "Are the things you actually need here? That means having named them first, which most people haven't.",
          "Would you be relieved if it ended? A blunt question, and one that tells you a lot.",
          "Are you staying for a reason, or staying because leaving would mean deciding? Those feel the same, but they're not.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The word \u201csettling\u201d does a lot of damage here. It suggests there's a scale everyone gets placed on, and there isn't one. What's real is whether this particular setup works for you.",
        ],
      },
    ],
  },

  {
    id: "lit-c24-faq-know",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Shouldn't I just know?",
    related: ["lit-c24-wrong-choice", "lit-c24-unanswerable"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's the belief underneath most of this Playbook, and it's worth looking at instead of just reassuring you.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Some people do say they just knew. Plenty of people who say that turn out to have been wrong, and plenty who were unsure for a year turn out fine. Feeling sure isn't a reliable sign about the relationship \u2014 it's more a sign about the person who feels it.",
        ],
      },
      {
        kind: "distinction",
        label: "Which means",
        body: [
          "Waiting to know may be waiting for something that isn't coming — and even when it does come, it doesn't reliably tell you the truth.",
          "Deciding on evidence \u2014 what they've done, whether your terms are met \u2014 is something you can do now, and it's a better basis than a feeling.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That isn't a reason to ignore your gut. It's a reason not to treat not-being-sure as an answer.",
        ],
      },
    ],
  },
];
