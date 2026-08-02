/**
 * Cluster 13 — "Fear of Trying Again"
 * The Relationship Playbook™ · Opening Your Heart Again
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: RENEWAL — first Renewal cluster built. Task = Reengagement.
 * Core Need: TO MOVE FORWARD.
 * Competencies from Recovery_and_Renewal_Competency_Manual_v0_1.
 *
 * ⚠⚠ THE NAME IS WRONG FOR THE MATERIAL. The cluster is called "Fear of Trying
 *   Again" and exactly ONE of its 36 statements is fear (STM-0193). Twenty-one
 *   are Needs. Seven are Experiences describing progress already underway.
 *   This reader is not afraid — they are recovering well and want not to repeat
 *   themselves. The subtitle, "Opening Your Heart Again", describes it far
 *   better. Content is written to readiness, not to fear.
 *
 * ⚠ MOST OF THIS CLUSTER NEEDS NO INTERVENTION. Eleven statements are the
 *   reader stating what they know and what they want. Those are validated, not
 *   worked on. The workable part is narrow: turning "differently" into
 *   something specific enough to do.
 *
 * ⚠ DO NOT PATHOLOGISE PROGRESS. "I'm learning to enjoy my own company again"
 *   and "I'm starting to dream again" are reports of recovery working. Nothing
 *   may reframe them as avoidance, as substitutes for a relationship, or as
 *   incomplete.
 *
 * ⚠ COMPETENCY MAPPING (Renewal set)
 *   PE-1 → Pattern Interruption
 *   PE-2 → Adaptive Responding
 *   PE-5/6 → Purpose Cultivation, Growth Maintenance, Joy Receptivity
 *   PE-7 → Relational Risk Engagement, Active Role Engagement
 *
 * ⚠ CLAIM SCOPE. May claim: name the pattern specifically enough to catch it;
 *   turn "differently" into one behaviour; build a life alongside the looking;
 *   take a proportionate risk while still uncertain. MUST NOT CLAIM: that the
 *   pattern won't recur, that this time will be different, that readiness
 *   guarantees anything, or that anyone is obliged to date again.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C13_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c13-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c13-youre-not-afraid", "lit-c13-differently-how"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've done a lot of work. You know what you want. You can name what went wrong before. And you're rebuilding more than just your relationships.",
          "What you're carrying isn't quite fear. It's one specific worry: that knowing better won't be enough, and you'll end up somewhere familiar anyway.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that sound the same",
        body: [
          "\u201cI want to do it differently.\u201d That's true, and you mean it. But it's not something you can act on yet \u2014 it doesn't tell you what to do on a Tuesday.",
          "\u201cWhen X happens, I'll do Y instead.\u201d Small, specific, and available.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Almost everything in this Playbook is about that gap. Not because your intentions are the problem \u2014 they're unusually clear. It's because intentions and patterns work on different levels, and only one of them shows up when things get familiar.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says you should be dating, or dating yet. \u201cWith or without a partner\u201d is a whole position on its own. And several of the tools work whether or not anyone else is involved.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-youre-not-afraid",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "You're further along than the label suggests",
    related: ["lit-c13-what-this-is", "lit-c13-a-life-not-a-search"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Worth saying plainly, because people in this position rarely get told it.",
        ],
      },
      {
        kind: "list",
        label: "Things you've said that most people can't",
        items: [
          "I finally know what I want.",
          "I believe healthy love is possible.",
          "I'm learning who I am outside of being someone's partner.",
          "I'm rediscovering what I actually enjoy, separate from any relationship.",
          "I want to build a life I'm proud of, with or without a partner.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That isn't the language of someone stuck. It's the language of someone whose recovery has worked. And it's a much better position than most people are in when they start dating again.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't reassurance. It's a correction to the framing. The useful work here is narrow and specific, because most of the ground has already been covered.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-the-pattern",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Naming the pattern specifically",
    related: ["lit-c13-differently-how", "lit-c13-faq-repeat"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't want to repeat my past\u201d is a direction. It isn't yet something you could notice happening.",
          "Patterns don't announce themselves as patterns. They show up as an ordinary moment that feels a little familiar. By the time you can recognise it, it's usually well underway.",
        ],
      },
      {
        kind: "distinction",
        label: "What makes one catchable",
        body: [
          "Knowing the shape isn't enough. Most people can describe their pattern in general terms and still be inside it.",
          "What you can catch is the early cue: the small, specific thing that happens first, before it's obviously the pattern. Usually something you do rather than something they do.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Your part is the useful half, because it's the half you can do something about. \u201cThey started pulling away\u201d isn't a cue you can act on. \u201cI started explaining myself more\u201d is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some patterns can't be stopped from one side. But noticing one you can't change is still worth something \u2014 it tells you what to do about the situation rather than about yourself.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-differently-how",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cDifferently\u201d isn't a plan",
    related: ["lit-c13-the-pattern", "lit-c13-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cHow do I date differently this time?\u201d is the right question. But it usually gets answered too broadly \u2014 be more careful, take it slower, know your worth.",
          "None of those tell you what to do when a specific thing happens on a specific evening.",
        ],
      },
      {
        kind: "distinction",
        label: "Two failure modes, and the second is less obvious",
        body: [
          "Doing the same thing. It's familiar, and it's what the worry is about.",
          "Doing the exact opposite. Also common after a bad ending, but it isn't real judgement \u2014 it's the same script flipped. Someone who over-explained everything, now explaining nothing, has changed the behaviour without gaining any judgement.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What's actually different is choosing a response that fits the situation right now. Sometimes that's the old response \u2014 when the old response is right for what's in front of you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That's a harder, less satisfying target than a rule. Rules are appealing exactly because they don't ask you to weigh the situation. Which is also why they repeat the problem.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-a-life-not-a-search",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "A life, not a search",
    related: ["lit-c13-youre-not-afraid", "lit-c13-joy"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want to feel excited about my life again, not just my love life.\u201d \u201cI'm putting energy into my work again instead of just surviving.\u201d \u201cI want to build a life I'm proud of, with or without a partner.\u201d",
          "These aren't consolation prizes. And nothing here treats them as filler until someone shows up.",
        ],
      },
      {
        kind: "distinction",
        label: "Why this matters practically as well as in itself",
        body: [
          "A full life changes what a relationship has to carry. When it's your only source of meaning, every wobble in it feels huge.",
          "It also changes what you can turn down. People with somewhere else to be can walk away from things that aren't right. People without can't afford to.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That second one is the quiet engine behind a lot of \u201cchoosing better\u201d. It isn't only good judgement \u2014 it's having enough in your life that a bad option is one you can truly turn down.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't a plan for becoming attractive. Building a life just to be chosen is the same setup as before, in nicer clothes.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-joy",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Enjoying it, not just surviving it",
    related: ["lit-c13-a-life-not-a-search", "lit-c13-saying-yes"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want to stop surviving relationships and start enjoying them.\u201d \u201cI'm learning to enjoy my own company again.\u201d \u201cI'm starting to dream again about my future.\u201d",
          "Enjoyment is often the last thing to come back. And it comes back unevenly \u2014 in odd moments rather than as a steady state.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It can also feel unearned or shaky. People well into recovery often report a small alarm when something is simply good, as if enjoying it invites something.",
          "That tends to fade with practice rather than insight. Which is unsatisfying, but it also means there's nothing to figure out \u2014 only to notice.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI want peace instead of chaos\u201d is worth taking seriously as a real preference, not just a phase. After a stretch of intensity, some people find calm dull and decide something is missing. It's worth giving calm more time than the first read.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-saying-yes",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Saying yes while still uncertain",
    related: ["lit-c13-joy", "lit-c13-faq-ready"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want to say yes to new experiences, even if I'm still a little scared.\u201d That's one of the more precise things anyone says in this material \u2014 notice the *even if*, not the *once I'm not*.",
        ],
      },
      {
        kind: "distinction",
        label: "Two kinds of caution, and only one is information",
        body: [
          "Evidence-based: something specific about this situation or this person calls for care.",
          "Leftover: the alarm is about the last time, and it shows up before there's anything to weigh.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Both feel exactly the same, which is why waiting to feel ready doesn't work \u2014 leftover caution doesn't go away by being waited out. It fades, if at all, through small bits of experience that show it's wrong.",
          "So right-sized steps, taken while you're still unsure, are how it works \u2014 not the reward for having finished.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Right-sized is doing a lot of work in that sentence. This is not an argument for ignoring warning signs. And \u201cstill a little scared\u201d is a very different report from \u201csomething about this is wrong\u201d.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c13-faq-repeat",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I repeat the same mistakes anyway?",
    related: ["lit-c13-the-pattern", "lit-c13-differently-how"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You might, partly. That's the honest answer, and it's less alarming than it sounds.",
        ],
      },
      {
        kind: "distinction",
        label: "What changing a pattern actually looks like",
        body: [
          "Not never doing it again. Almost nobody gets that. And expecting it makes the first time it happens again feel like proof that nothing changed.",
          "Noticing sooner. First you notice a year later. Then a month later. Then while it's happening. Then just before. That path is what change looks like from the inside, and it's slow enough to be easy to miss.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Catching it three months in rather than three years in is a huge difference in outcome — and a barely noticeable difference in how it feels. Worth knowing, so you don't brush it off when it happens.",
        ],
      },
    ],
  },

  {
    id: "lit-c13-faq-ready",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I know if I'm ready?",
    related: ["lit-c13-saying-yes", "lit-c13-youre-not-afraid"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's no finish line, and readiness isn't a state you reach and then keep.",
        ],
      },
      {
        kind: "distinction",
        label: "Two more useful questions",
        body: [
          "Can I say no to something that isn't right? That's a better sign than confidence. And it depends more on what else is in your life than on how healed you feel.",
          "Is my caution about this person, or about the last one? Not a test you pass \u2014 something to check each time.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI'm ready, but I want to do it right\u201d is a good position. Just notice that the second half can quietly put off the first forever. There's no version of doing it right that removes the risk.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's also completely fine not to want to yet. Several of the tools here are about building a life rather than finding a partner, and they don't require you to be looking.",
        ],
      },
    ],
  },
];
