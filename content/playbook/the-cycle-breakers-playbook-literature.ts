/**
 * Cluster 26 — "Fear of Repeating What I Inherited"
 * The Relationship Playbook™ · A Different Legacy
 * Field Guide literature. 5 Core Guides + 2 Question Reads.
 *
 * Track: Renewal. Task = Reengagement.
 * Core Need: TO BECOME MY BEST RELATIONAL SELF.
 *
 * ⚠ SLUG COLLISION. The canonical subtitle is "Breaking the Cycle", which is
 *   already Cluster 7's Playbook (`how-to-stop-having-the-same-fight`, about arguing). Using
 *   `the-cycle-breakers-playbook` here. Owner decision needed on display names — two
 *   Playbooks called the same thing would be confusing in a catalogue.
 *
 * ⚠ SMALLEST CLUSTER IN THE CORPUS. Ten statements, eight of them Needs, zero
 *   Self-Behaviour. Most of it is a clearly-held set of values, not a
 *   difficulty. Two tools only, and the rest is validated rather than worked on.
 *
 * ⚠ NOT PARENTING ADVICE. This is a relationship Playbook. Nothing here tells
 *   anyone how to raise children. The workable material is what a relationship
 *   demonstrates, which is the reader's own domain.
 *
 * ⚠ DO NOT PATHOLOGISE THE FAMILY OF ORIGIN. The reader may love their parents,
 *   may still be close to them, and may have had a mostly good childhood with
 *   one pattern they don't want to repeat. Nothing may assume otherwise, assign
 *   blame, or invite an account of what went wrong.
 *
 * ⚠ WORKS WITHOUT CHILDREN. Some readers have children, some are anticipating,
 *   some won't. Content must not assume any of those.
 *
 * ⚠ CLAIM SCOPE. May claim: name the inherited pattern specifically; notice
 *   what a relationship demonstrates rather than states. MUST NOT CLAIM: that
 *   the pattern stops with you, that children won't repeat it, that intention
 *   is sufficient, or anything about how to parent.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const C26_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c26-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c26-values-not-problem", "lit-c26-demonstrated"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've noticed something that ran in the family you grew up in, and you don't want it to keep running.",
          "That's most of what's here \u2014 not a problem you're stuck in, but a direction you've chosen, and a worry about whether choosing is enough.",
        ],
      },
      {
        kind: "distinction",
        label: "The gap this Playbook works on",
        body: [
          "\u201cI want to break generational patterns\u201d is a direction. Sincere, and not yet something you could do this week.",
          "Naming the specific thing, and noticing what a relationship actually shows rather than says \u2014 those are small enough to act on.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is about how to raise children, and nothing assumes you have any. It also doesn't assume your family was bad. Most people in this spot had a childhood with a lot of good in it, and just one pattern they'd rather not carry forward.",
        ],
      },
    ],
  },

  {
    id: "lit-c26-values-not-problem",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Most of this isn't a problem",
    related: ["lit-c26-what-this-is", "lit-c26-faq-enough"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Worth saying, because there's very little here that needs fixing.",
        ],
      },
      {
        kind: "list",
        items: [
          "I want my children to see a healthy relationship.",
          "I want to leave a different legacy than I inherited.",
          "I want my relationships to reflect my values.",
          "I want to build something that lasts beyond me.",
          "I want my story to change direction.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Those are values, clearly held, by someone who has thought about it. Most people never put any of them into words, and plenty never notice the pattern at all.",
          "Noticing is the hard part to learn, and you've already done it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "So this is a short Playbook, on purpose. Two tools, because most of what you'd need has already happened.",
        ],
      },
    ],
  },

  {
    id: "lit-c26-inherited-pattern",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Naming what you actually inherited",
    related: ["lit-c26-demonstrated", "lit-c26-faq-blame"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't want dysfunction to become normal\u201d names a whole category. It doesn't tell you what to watch for.",
          "Inherited patterns are hard to see for a specific reason: they were the water. Whatever happened in your house was, for years, simply what happens \u2014 and that background feeling stays with you long after you can name it as a pattern.",
        ],
      },
      {
        kind: "distinction",
        label: "Two levels, and only one you can work with",
        body: [
          "\u201cThere was a lot of conflict\u201d or \u201cnobody talked about anything\u201d \u2014 a description of the climate. True, and too broad to act on.",
          "\u201cWhen someone was upset, everyone left the room\u201d or \u201cyou apologised by making a joke\u201d \u2014 a specific move, repeated. That's a thing you could catch yourself doing.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The specific version is nearly always something small and about what you actually did. What happened at the moment of difficulty \u2014 who spoke, who left, what got said instead of the real thing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't a review of your parents, and it doesn't ask you to decide anything about them. Plenty of people name a pattern they don't want to repeat and still think their parents did well.",
        ],
      },
    ],
  },

  {
    id: "lit-c26-demonstrated",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What gets demonstrated, not what gets said",
    related: ["lit-c26-inherited-pattern", "lit-c26-faq-enough"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want my children to see a healthy relationship.\u201d The key word is *see*.",
          "Whatever anyone is told about relationships, what gets taken in is what's shown \u2014 and mostly not the good moments, which get noticed and enjoyed. What gets taken in is what happens when something goes wrong.",
        ],
      },
      {
        kind: "distinction",
        label: "The thing worth watching",
        body: [
          "Not whether the relationship looks happy. That's visible and it isn't the lesson.",
          "What happens at the point of difficulty. Whether a disagreement gets repaired, whether anyone apologises, whether the room goes cold, whether it's ever mentioned again.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "This is surprisingly good news. It means you don't need a relationship without conflict \u2014 you couldn't have one \u2014 and a repaired disagreement shows more than an avoided one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This is true whether or not anyone is watching. What gets shown is also what gets practised, and it's the practice that carries forward.",
        ],
      },
    ],
  },

  {
    id: "lit-c26-longer-than-you",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cSomething that lasts beyond me\u201d",
    related: ["lit-c26-values-not-problem", "lit-c26-faq-enough"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want future generations to benefit from the work I'm doing now.\u201d It's an unusual thing to say and worth taking at face value.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It also sets a timeline you can't check. You won't find out whether it worked, which makes it a strange thing to be working on \u2014 no feedback, no proof, and the results arrive somewhere you won't be.",
        ],
      },
      {
        kind: "distinction",
        label: "What you can check instead",
        body: [
          "Not: has the pattern stopped. You can't know that in your lifetime.",
          "But: did I do the specific thing differently, this week, in this house. That you can check, and it's the only part that was ever yours.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here can promise the pattern stops with you. People break patterns, and their children develop new ones. What's true is that the specific thing you change is really changed — and that's a smaller claim than legacy, and one you can stand behind.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c26-faq-enough",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is wanting to change it enough?",
    related: ["lit-c26-demonstrated", "lit-c26-longer-than-you"],
    body: [
      {
        kind: "paragraph",
        body: [
          "No, and you already suspect that \u2014 it's most of what brought you here.",
        ],
      },
      {
        kind: "distinction",
        label: "Why intention and pattern work at different levels",
        body: [
          "Intention is there when you're thinking about it, which is usually when things are calm.",
          "Patterns arrive at the moment of difficulty, which is exactly when you're not thinking about intentions.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which is why the specific version matters so much. \u201cI want to do it differently\u201d isn't there in the moment. \u201cWhen someone's upset, I stay in the room\u201d is small enough to survive the moment you need it.",
        ],
      },
    ],
  },

  {
    id: "lit-c26-faq-blame",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Does this mean blaming my family?",
    related: ["lit-c26-inherited-pattern"],
    body: [
      {
        kind: "paragraph",
        body: [
          "No, and it works fine without it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Naming a pattern is a description, not a judgment. Plenty of people can name something they don't want to carry forward and also think their parents did well with what they had \u2014 those two things can both be true.",
          "It's also worth remembering that whoever taught you the pattern was almost certainly taught it too. That doesn't excuse anything that needs excusing, and it does make the pattern look less like a choice someone made about you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If what you inherited was truly harmful rather than just unhelpful, that's a heavier thing, and worth having someone alongside you for. A Playbook is a fine place to work on a habit, and the wrong place to work on that.",
        ],
      },
    ],
  },
];
