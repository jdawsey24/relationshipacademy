/**
 * Cluster 7 — "Difficulty Communicating Without It Becoming a Fight"
 * The Relationship Playbook™ · Breaking the Cycle of the Same Arguments
 * Field Guide literature. 8 Core Guides + 3 Question Reads.
 *
 * FIRST EXPANSION-PHASE CLUSTER. Task = Integration. 26 Expansion
 * competencies apply. Nothing carries over from Clusters 3-6.
 *
 * ⚠⚠ SAFETY — HIGHEST OF ANY CLUSTER TO DATE.
 *   Owner ruling: "I don't feel emotionally safe" routes OUT of the tools,
 *   never into one. Every tool here involves raising difficult things and
 *   staying in the conversation. That is the wrong instruction for someone
 *   frightened of their partner. `lit-shared-if-you-dont-feel-safe` is a
 *   dedicated exit guide and is surfaced first for anyone who taps that card.
 *   NOTHING in this cluster may frame intimidation, contempt, or control as a
 *   communication problem.
 *
 * ⚠ SCOPE — "YOUR HALF". Owner ruling. 16 of 30 statements describe the
 *   couple, not the reader. The Playbook has one reader. Every tool works on
 *   what that reader controls, and the content states plainly that the other
 *   half is not theirs to move. No copy may promise the pattern will change.
 *
 * ⚠ CLAIM SCOPE. May claim: raise something without it becoming the fight;
 *   stop being the only one who raises things; notice when it turns and slow
 *   it; go back afterwards. MUST NOT CLAIM: that the arguments will stop, that
 *   the other person will change, that the relationship will improve, or that
 *   better communication fixes a relationship that isn't safe.
 */

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

import { SAFETY_GUIDE } from "./shared/safety-not-safe";

export const C7_LITERATURE: LiteratureEntry[] = [
  SAFETY_GUIDE, // shared — do not re-author per cluster

  {
    id: "lit-c7-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c7-your-half", "lit-c7-same-argument"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You know how it goes before it even starts. Something needs saying. You can already picture the next hour, and you decide it isn't worth it.",
          "Or you say it, and within four minutes you're arguing about something else, and the first thing never gets talked about.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that look like one",
        body: [
          "The issue: the actual thing that needed saying. Usually fixable, often quite small.",
          "The pattern: what happens when either of you tries to raise anything. Settling the issue won't fix it, which is why settling issues hasn't helped.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cWe solve the issue but never the pattern\u201d is the most exact sentence in this cluster. The issues do get solved. The next one goes the same way.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-your-half",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Your half",
    related: ["lit-c7-what-this-is", "lit-c7-faq-am-i-the-problem"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Most of what people say about this is in the plural — 'we'. We keep having the same argument. We don't know how to disagree. We apologise but nothing changes.",
          "That's true — it is a two-person pattern. That creates a real problem for something like this, and we'd rather name it than work around it.",
        ],
      },
      {
        kind: "distinction",
        label: "What this can and can't do",
        body: [
          "It can work on your half: how you raise something, whether you're always the one raising it, what you do when it turns, whether you go back afterwards.",
          "It can't change their half. Nothing you do here makes them listen, stop shutting down, or stop blowing up. We're not going to pretend otherwise.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's less than you probably wanted. It's also not nothing. A two-person pattern usually has two people holding it up, and changing your side does change what the pattern has to work with.",
          "But it might not be enough. And if it isn't, that doesn't mean you failed at this.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you find yourself doing all of this and nothing changes, the answer probably isn't trying harder on your own. It's the two of you, with someone in the room.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-same-argument",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why the same argument keeps coming back",
    related: ["lit-c7-raising-it", "lit-c7-repair"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe fight about the same things every week.\u201d \u201cWe have the same conversation over and over.\u201d",
          "An argument that keeps coming back isn't unresolved. It gets resolved again and again, the same way each time, and the fix doesn't hold.",
        ],
      },
      {
        kind: "distinction",
        label: "Usually because the argument isn't about what it's about",
        body: [
          "The surface: the bins, the phone, being late, whose turn it was.",
          "Underneath: something about how much you're each carrying, or whether you matter, or who gets to decide. That part never gets raised, so it never gets settled.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So solving the surface version is a real win that changes nothing. You'll be back next week with a different set of bins.",
          "The move — and it's uncomfortable — is to raise the pattern once, rather than the incident again.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Raising the pattern is a bigger conversation, and it goes wrong more often. It's worth doing when things are calm, not in the middle of the fourth blow-up.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-raising-it",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Raising it without starting it",
    related: ["lit-c7-same-argument", "lit-c7-when-it-turns"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to bring things up without starting a fight.\u201d \u201cI avoid difficult conversations because they're exhausting.\u201d",
          "Avoiding it here isn't cowardice. It's a choice you've weighed, and often the right one — the conversation really does cost more than the thing you'd be raising.",
        ],
      },
      {
        kind: "list",
        label: "What tends to make the difference",
        items: [
          "Timing. Not in the moment, not late at night, not while either of you is already annoyed.",
          "One thing. Not the whole pile, however tempting.",
          "Specific and recent. \u201cOn Tuesday, when\u201d rather than \u201cyou always\u201d.",
          "Say what you want, not just what's wrong. A complaint invites defence; a request invites an answer.",
          "Shorter than feels like enough. The longer the opening, the more there is to argue with.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of these make it go well. They change the odds. And they mean that if it goes badly, you'll know it wasn't how you said it.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-when-it-turns",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When it starts turning",
    related: ["lit-c7-raising-it", "lit-c7-repair"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's usually a moment. The conversation is still a conversation, and then it isn't. Afterward you can both point to roughly when.",
          "Most people notice it. Very few do anything about it right then, because by then it's rolling on its own.",
        ],
      },
      {
        kind: "list",
        label: "Common signs it's turning",
        items: [
          "The subject changes to something older.",
          "One of you starts explaining instead of listening.",
          "Absolute words show up \u2014 always, never, every time.",
          "You notice you're building your reply while they're still talking.",
          "Your body gets there before you do \u2014 chest, jaw, voice.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Your half of this is small and specific: name it, and stop. Not win it, not fix it, not explain why it turned. \u201cThis is going the usual way — can we come back to it?\u201d",
          "It works about as often as it doesn't. Which is a big improvement on nothing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Pausing is only pausing if you come back. A pause that turns into never mentioning it again is just avoidance in nicer clothes.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-repair",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Repair is a separate skill",
    related: ["lit-c7-when-it-turns", "lit-c7-shutting-down"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe don't know how to repair after arguments.\u201d \u201cWe apologise but nothing changes.\u201d",
          "Those two sentences point at the same thing: an apology closes off what happened. It doesn't reconnect anybody.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different jobs",
        body: [
          "Apology: I'm sorry for the thing I did. It's needed, and it ends the argument.",
          "Repair: coming back to each other afterward. Naming what happened, checking you're both still here, sometimes just being in the same room with nothing to settle.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most couples who fight the same fight forever are decent at apologising and have no repair at all. The argument ends and then there's a gap, and the gap is where the next one gets built.",
          "Repair is also the part you can do a lot of on your own. Going back is one-sided until it isn't.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-shutting-down",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When one of you goes quiet",
    related: ["lit-c7-repair", "lit-c7-your-half"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cThey shut down.\u201d \u201cOne of us always shuts down.\u201d \u201cI stop talking because nothing changes.\u201d",
          "Notice that the last one is the same thing, just described from the inside. Whoever goes quiet usually has a reason that makes sense to them.",
        ],
      },
      {
        kind: "distinction",
        label: "What it usually is",
        body: [
          "It's not that they don't care, even though that's how it looks from the outside.",
          "Usually it's overload, or they've decided that speaking makes it worse. Both lead to silence, and silence is the most maddening thing to be on the other side of.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "If it's them, there's very little you can do in the moment. Pushing harder almost always makes it last longer.",
          "If it's you, the useful thing isn't forcing yourself to keep talking. It's saying that you've gone quiet and you'll come back — which is one sentence, not a whole conversation.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Silence used on purpose to punish someone is a different thing from being overwhelmed, and it isn't covered here. If that's what's happening, read \u201cIf you don't feel safe\u201d.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c7-faq-is-this-normal",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is this normal, or is something actually wrong?",
    related: ["lit-c7-same-argument", "lit-shared-if-you-dont-feel-safe"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Arguing is normal. Arguing about the same thing over and over is very common. Neither tells you much about whether a relationship is in trouble.",
        ],
      },
      {
        kind: "distinction",
        label: "More useful signs",
        body: [
          "Can you recover? Couples who fight often and reconnect afterwards tend to do better than couples who fight rarely and stay distant for days.",
          "Is there contempt in it? Eye-rolling, mockery, talking about each other instead of to each other. That one matters more than how loud it gets.",
          "Do you feel safe? If not, that isn't a communication question at all.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We can't tell you whether your relationship is in trouble, and we wouldn't try. What we can say is that how often you argue isn't the signal people assume it is.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-faq-therapy",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Should we see someone?",
    related: ["lit-c7-your-half"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Possibly, and earlier than most people do. Couples often wait years, and by then there's a lot more to sort out.",
        ],
      },
      {
        kind: "list",
        label: "Reasons to think about it now rather than later",
        items: [
          "You've both tried and the same thing keeps happening.",
          "The pattern is the problem, and the pattern needs both of you in the room.",
          "One of you has started managing the other instead of talking to them.",
          "You've been doing your half for a while and nothing has changed.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This Playbook works on one person's half. That's a real limit, not us being modest. If your half isn't enough, the next step is the two of you with someone \u2014 not you trying harder.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-faq-am-i-the-problem",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I'm the problem?",
    related: ["lit-c7-your-half", "lit-c7-shutting-down"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's rarely one person, and the question usually isn't as useful as it feels.",
          "Patterns take two. Even when one person is clearly doing more of the difficult stuff, the shape it settles into is built by both.",
        ],
      },
      {
        kind: "distinction",
        label: "A better question",
        body: [
          "Not: whose fault is this?",
          "But: what's my move in it? Everyone has one — avoiding, over-explaining, going quiet, keeping score, being the only one who raises things.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Knowing your move is really useful, because it's the only part you can do anything with. Deciding you're the problem isn't the same thing. Mostly it just makes raising anything harder.",
        ],
      },
    ],
  },
];
