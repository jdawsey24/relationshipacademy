/**
 * Cluster 18 — "Feeling Like Money and Work Are Pulling Us Apart"
 * The Relationship Playbook™ · Staying Connected Through Life's Pressures
 * Field Guide literature. 8 Core Guides + 2 Question Reads.
 *
 * Track: Expansion. Task = Integration. Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠ SAFETY CARD INCLUDED. Unlike Clusters 10 and 14, this cluster needs it.
 *   "I don't trust how they handle money" and "I feel like I'm carrying us
 *   financially" fit a reckless partner AND fit someone being financially
 *   controlled. Financial control is a recognised form of abuse and is already
 *   named in the shared card. Imported, not re-authored.
 *
 * ⚠ ZERO Tier 1. All 20 statements are Relational Condition, Thought/Belief,
 *   Experience or Fear. Nobody describes doing anything. Everything routes
 *   Tier 3.
 *
 * ⚠ TWO HALVES, ONE CLUSTER. 10 statements about money, 10 about work and
 *   ambition. They overlap but they are not the same problem, and the content
 *   treats them as two halves rather than forcing them together.
 *
 * ⚠ NO FINANCIAL ADVICE. This is a relationship Playbook. It does not tell
 *   anyone how to budget, invest, split bills, or manage debt. It works on the
 *   conversation and the compatibility question only.
 *
 * ⚠ CLAIM SCOPE. May claim: have the conversation you've been avoiding; work
 *   out what the disagreement is actually about; name what you need to keep.
 *   MUST NOT CLAIM: financial compatibility, that they'll change how they
 *   handle money, that careers stop competing, or that the future resolves.
 */

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
import type { LiteratureEntry } from "@/lib/playbook/contentSchema";
import { SAFETY_GUIDE } from "./shared/safety-not-safe";

export const C18_LITERATURE: LiteratureEntry[] = [
  SAFETY_GUIDE, // shared — financial control is named in it. Do not re-author.

  {
    id: "lit-c18-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c18-money-isnt-money", "lit-c18-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "On the surface it's two separate problems — money, and the fact that work keeps winning.",
          "Underneath, they're the same question. And it's bigger than both: are we building the same thing?",
        ],
      },
      {
        kind: "distinction",
        label: "Why that's the real subject",
        body: [
          "Money arguments are rarely about the amount. They're about what you each think it's for, and what safety looks like to you.",
          "Career arguments are rarely about the hours. They're about whose life is the one being built.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the fixes people reach for — a spreadsheet, a date night — usually don't touch it. They're good ideas aimed at the wrong thing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here tells you how to budget or split bills. That's a different kind of help and worth getting separately. This is about the conversation and the compatibility question.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-money-isnt-money",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Money isn't about money",
    related: ["lit-c18-both-right", "lit-c18-the-conversation"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Two people can look at the same bank balance and feel completely different things about it. And both reactions can make sense, given what each of them learned.",
        ],
      },
      {
        kind: "list",
        label: "What money usually stands for",
        items: [
          "Safety. For some people, a set amount of savings is the line between fine and not fine, and spending it feels like risk.",
          "Freedom. For others, money is only useful once it's spent — saving it feels like a life put on hold.",
          "Fairness. Who earns, who decides, and whether what each person gives is measured in pounds.",
          "Status, or the choice to reject it.",
          "What you grew up with. Growing up with too little and growing up with plenty both leave marks, in opposite directions.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So \u201cwe have different financial priorities\u201d is often a short way of saying something much bigger that neither of you has said out loud \u2014 partly because you may not have the words for it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This is why the spreadsheet doesn't fix it. A spreadsheet settles the numbers. The argument was never about the numbers.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-both-right",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "You're probably both right",
    related: ["lit-c18-money-isnt-money", "lit-c18-the-conversation"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The uncomfortable thing about most money disagreements is that neither side is wrong.",
          "Saving harder makes sense. Spending on a life you're actually living makes sense too. There's no right answer that one of you is just missing.",
        ],
      },
      {
        kind: "distinction",
        label: "Which changes what you're trying to do",
        body: [
          "Not: convince them. That's what's been happening, and it doesn't work, because they're not being unreasonable.",
          "But: find out what it means to them, and tell them what it means to you. Then decide something, knowing both.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't trust how they handle money\u201d is worth looking at closely, because it can mean two very different things. Sometimes it means they're simply okay with more risk than you are. Sometimes it means something has actually gone wrong \u2014 debt you found out about late, decisions made without you.",
          "Those need different responses, and only the first one is a compatibility conversation.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If money is being controlled rather than disagreed about — if you don't have access, or you have to explain everything you spend, or decisions are made and told to you — that isn't a compatibility question. Please read \u201cIf you don't feel safe\u201d.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-the-conversation",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The conversation you're avoiding",
    related: ["lit-c18-both-right", "lit-c18-carrying-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe avoid talking about finances.\u201d Most couples do. It's one of the most-avoided subjects there is \u2014 more than sex, in some surveys.",
        ],
      },
      {
        kind: "list",
        label: "Why it's avoided",
        items: [
          "It's never a neutral topic, so there's no easy moment.",
          "It usually comes up when something has gone wrong, which means every conversation about it is already an argument.",
          "One of you may feel judged about earning, and the other about spending.",
          "It shows what you actually want your life to look like, which is a bigger subject than either of you signed up for on a Tuesday.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Two things really help. Doing it when nothing has gone wrong \u2014 a planned, boring, low-pressure talk beats one you have in the heat of the moment every time. And starting with what it means rather than what it costs.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There isn't a version of this that's comfortable. Getting through it is the goal, not doing it gracefully.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-carrying-it",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When you're carrying it",
    related: ["lit-c18-the-conversation"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel like I'm carrying us financially.\u201d",
          "Sometimes that's just the math — you earn more, or you cover more. Sometimes it's about the worrying, not the paying: one of you carries the anxiety about whether it's all okay, and the other doesn't.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth separating",
        body: [
          "Carrying the money. Easy to count, and often nobody's fault \u2014 incomes differ.",
          "Carrying the worry. Invisible, and much more tiring. It's possible to earn less and carry more of this.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one is rarely said out loud, so the other person often has no idea it's happening. They're not being careless \u2014 they've simply never been told that somebody is doing this work.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-work-wins",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When work keeps winning",
    related: ["lit-c18-different-rates", "lit-c18-without-disappearing"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel like work always comes first.\u201d \u201cWe never have time together.\u201d",
          "Work has something the relationship doesn't: deadlines, other people waiting, consequences for not showing up. The relationship has none of that, and so it loses \u2014 not because it matters less, but because nothing forces it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two versions, and they need different things",
        body: [
          "A season. Something is really demanding right now and it will end. You can get through it, if it's named as temporary and actually is.",
          "An arrangement. This is just how it is now, and nobody decided it. That one doesn't get fixed by waiting.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most people call theirs a season for several years. Worth being honest about which one you have, because the answer to a season is patience and the answer to an arrangement is a conversation.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-different-rates",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Growing at different rates",
    related: ["lit-c18-work-wins", "lit-c18-faq-dealbreaker"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cOne of us is growing while the other feels stuck.\u201d \u201cSuccess has changed our relationship.\u201d",
          "This is one of the least-talked-about things that happens to long relationships, and it's uncomfortable in both directions.",
        ],
      },
      {
        kind: "distinction",
        label: "It's uncomfortable for both people",
        body: [
          "The one moving ahead often feels guilty, and can't say so without it sounding like boasting.",
          "The one who feels stuck often feels ashamed, and can't say so without it sounding like they resent the other's success.",
          "So neither says anything, and the distance grows in silence.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Success also changes the day-to-day things — time, money, who's available, whose schedule wins. Those changes get treated as personal when they're often just about how life is set up now.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Growing apart in ambition is real, and it doesn't automatically mean the relationship is wrong. What usually matters is whether it can be talked about without either of you having to apologise for where you are.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-without-disappearing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Supporting them without disappearing",
    related: ["lit-c18-different-rates", "lit-c18-faq-slow-down"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to support them without losing myself.\u201d \u201cI feel unsupported in my goals.\u201d",
          "Those two show up together more often than you'd expect, sometimes from the same person about different parts of life.",
        ],
      },
      {
        kind: "distinction",
        label: "The thing worth knowing about support",
        body: [
          "Support isn't a set amount you split up. Two people can both be supported, and two people can both feel unsupported while each one believes they're doing all the giving.",
          "What usually causes the second is that support was never spelled out. You each supported them the way you'd want to be supported, which often isn't the way they needed.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cLosing myself\u201d is worth taking seriously, and worth being specific about. Which part of yourself? Time, ambition, the thing you'd have done instead, the version of your life you'd pictured? Naming it lets you protect one piece rather than resenting the whole arrangement.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c18-faq-dealbreaker",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Can money actually end a relationship?",
    related: ["lit-c18-both-right", "lit-c18-different-rates"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's one of the things couples name again and again, so yes — though usually not in the way people fear.",
        ],
      },
      {
        kind: "distinction",
        label: "What tends to matter",
        body: [
          "Not how much you have. Couples with very little and couples with a lot both manage and both fail.",
          "Whether it can be talked about. The relationships that struggle are usually the ones where the subject is untouchable, so the disagreement builds up, unspoken, for years.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI worry money will become the reason we don't make it\u201d is a common fear, and a reasonable one. The most useful thing you can do about it is make the subject something you can talk about \u2014 a smaller and more doable goal than agreeing.",
        ],
      },
    ],
  },

  {
    id: "lit-c18-faq-slow-down",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Should one of us slow down?",
    related: ["lit-c18-without-disappearing", "lit-c18-work-wins"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We can't answer that, and we'd be careful about anyone who tells you a relationship should always come first, or that ambition should never be given up. Both are just slogans.",
        ],
      },
      {
        kind: "distinction",
        label: "Two better questions",
        body: [
          "Has either of you actually said what you'd need? Most people in this spot are bargaining with a guess instead of a real person.",
          "Is this a season or an arrangement? If it's a season, when does it end — and does the other person know that date?",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Somebody slowing down because they were asked is very different from somebody slowing down because they decided they had no choice. The second one tends to turn into resentment later.",
        ],
      },
    ],
  },
];
