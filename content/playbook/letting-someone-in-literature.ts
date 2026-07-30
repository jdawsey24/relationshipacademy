/**
 * Cluster 3 — "Fear of Being Fully Known"
 * The Relationship Playbook™ · Letting Someone In
 * Field Guide literature. 10 Core Guides + 3 Question Reads.
 *
 * Authored 29 Jul 2026. Derived against Framework Version 1.9.
 *   PE-6a → Perceptual Lens, ACCURATE, exits to Recognition/Context
 *   PE-4c → Personal Capacity Regulation (RLC-FR-002), NOT a competency
 *   Structural History (RLC-FR-006) is a standard input — see lit-c3-where-this-came-from
 *
 * BINDING CONSTRAINTS
 *  - Fear of being hurt after being hurt is ACCURATE. Never challenge it.
 *  - "Closeness costs more than you have" is CAPACITY, not deficit. No copy
 *    may imply the reader lacks the ability to be close.
 *  - No claim that letting someone in will go well. It may not.
 *  - Pacing is not avoidance and avoidance is not pacing — hold the line.
 *
 * ⚠ Safety: this cluster carries self-worth and isolation risk. All signpost
 *   copy requires clinical review before publish.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C3_LITERATURE: LiteratureEntry[] = [
  // ───────────────────────────────────────────────── CORE GUIDES ──
  {
    id: "lit-c3-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c3-fear-is-accurate", "lit-c3-where-this-came-from"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You can do the early part. Meeting people, being interesting, being liked — that mostly works.",
          "It's the next bit. The point where someone starts to actually see you, and something in you moves away from it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things are true at once",
        body: [
          "Being known is genuinely risky. Someone who knows you can leave with better information. That isn't paranoia — it's arithmetic.",
          "And the protection has a cost. Every time you pull back before they can get close, you keep the risk down and you also keep the thing from happening at all.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "This isn't about becoming an open book. It's about noticing the moment you move away, and deciding — that once — whether you want to.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will tell you that letting someone in works out. Sometimes it doesn't. What we can offer is that you'd be finding out, rather than deciding in advance.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-fear-is-accurate",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Some of this fear is just accurate",
    related: ["lit-c3-where-this-came-from"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We want to say this early, because most things written for people like you skip it.",
          "Being afraid of getting hurt, after you've been hurt, is not a distortion. It's a correct reading of something that actually happened.",
        ],
      },
      {
        kind: "list",
        label: "None of these needs fixing",
        items: [
          "I'm afraid of getting hurt.",
          "I'm afraid I'll get hurt again.",
          "I want love, but I'm scared of it.",
          "I'm afraid to be vulnerable.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Those are accurate. Vulnerability does carry risk. Wanting something you're frightened of is an ordinary human position, not a malfunction. We're not going to try to talk you out of any of it.",
        ],
      },
      {
        kind: "distinction",
        label: "There's a different sentence that does cause trouble",
        body: [
          "\u201cI'm afraid this person might hurt me\u201d is a reasonable thing to hold while you find out.",
          "\u201cI don't trust anyone\u201d and \u201cI always expect people to leave\u201d are different. Those have stopped being about anyone in particular.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Keep the fear. It's doing a job. The only thing worth looking at is where it's answering questions before they've been asked.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-where-this-came-from",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Where this came from",
    related: ["lit-c3-fear-is-accurate", "lit-c3-why-good-feels-wrong"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Nobody arrives at guardedness from nowhere.",
          "Notice the words that show up when you describe it. Hurt \u2014 again. Chaos feels \u2014 familiar. I don't trust \u2014 peace. Every one of those is pointing backwards.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What happened before doesn't change where you are now. But it does shape what you do here, and it's worth naming rather than treating as a personality trait you were born with.",
        ],
      },
      {
        kind: "example",
        body: [
          "If calm has previously meant the quiet before something, then calm now will read as a warning rather than as calm. That's not irrational. It's a pattern that was accurate somewhere else and has come along with you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to ask you to go back through it. Naming that it came from somewhere is enough for what we're doing here. If you want to go further into it, that's work for a person, not a Playbook.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-why-you-leave-first",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why you leave first",
    related: ["lit-c3-why-good-feels-wrong"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Leaving first isn't cowardice. It's the only move that guarantees the outcome.",
          "If you go before they do, you know how it ends. You wrote the ending. It's worse than the good version and better than the version where you're blindsided.",
        ],
      },
      {
        kind: "distinction",
        label: "What it costs",
        body: [
          "You never find out. Every exit is a data point you didn't collect — about them, and about whether the thing you were bracing for was going to happen at all.",
          "And it accumulates. Enough exits and \u201cthey all leave\u201d becomes true, in a way, because you keep being the one who did.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The move isn't to stop leaving. Sometimes leaving is right. The move is to put a gap between deciding and doing, and use the gap to look at what's actually happening.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If someone has treated you badly, leaving isn't a pattern to examine. It's the correct response. This is about the exits that happen when nothing has actually gone wrong.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-why-good-feels-wrong",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why good can feel wrong",
    related: ["lit-c3-where-this-came-from", "lit-c3-interest-collapse"],
    body: [
      {
        kind: "paragraph",
        body: [
          "One of the strangest things people describe is this: things are going well, and that's exactly when the urge to wreck it shows up.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It makes more sense than it looks. If steady has historically been unfamiliar, then steady doesn't register as safe — it registers as unreadable. And unreadable is uncomfortable enough that ending it can feel like relief.",
          "\u201cI don't trust peace\u201d is a very precise description of that.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different things that look identical from outside",
        body: [
          "Finding something genuinely wrong. Happens, and worth acting on.",
          "Finding something because the not-knowing is unbearable. Also happens, and produces the same behaviour.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "You often can't tell which one you're in from the inside, in the moment. That's what the gap is for.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-testing-doesnt-answer",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Testing doesn't get you the answer",
    related: ["lit-c3-what-being-known-costs"],
    body: [
      {
        kind: "paragraph",
        body: [
          "When you can't ask directly, you find out sideways. Go quiet and see if they notice. Mention someone else. Wait longer than you need to. Hope they'll work it out without being told.",
        ],
      },
      {
        kind: "distinction",
        label: "Why it doesn't work",
        body: [
          "A test tells you how someone responds to a test. It doesn't tell you what they'd have done if you'd just said the thing.",
          "And if they pass, you don't believe it — because you know it was a test. So it never settles anything.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Asking is worse in one specific way: they might say something you don't want to hear. That's the entire cost, and it's the reason testing exists.",
          "It's also the reason testing can't do the job. The information you want is only available if you risk getting the other answer.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-what-being-known-costs",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What being known actually costs",
    related: ["lit-c3-testing-doesnt-answer", "lit-c3-letting-it-land"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's a version of this advice that says be your authentic self and everything follows. That's not what we're going to say, because it isn't true.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Letting someone see something real does two things at once. It gives them the chance to accept it, which is what you want. And it gives them better information for leaving, which is what you're afraid of.",
          "Both are real. Anyone pretending only the first one exists is selling something.",
        ],
      },
      {
        kind: "distinction",
        label: "What changes the maths",
        body: [
          "Size. One true thing, said to one person, is survivable in a way that all of it, said to everyone, is not.",
          "Order. You get to watch what happens to the small thing before deciding about the next one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This is not a technique for being accepted. It's a technique for finding out, in increments small enough that finding out doesn't cost everything.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-closeness-costs",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Closeness asks more of you",
    related: ["lit-c3-letting-it-land", "lit-c3-faq-always-like-this"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some of what reads like fear isn't fear. It's cost.",
          "Being close to someone takes something. Attention, honesty, being reachable, tolerating not knowing. Those aren't free, and the closer it gets the more they cost.",
        ],
      },
      {
        kind: "distinction",
        label: "This is the important distinction in this guide",
        body: [
          "\u201cI can't do closeness\u201d is a statement about ability, and we don't think it's true of you.",
          "\u201cCloseness currently costs more than I've got\u201d is a statement about resources, and it might be exactly true.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI feel trapped when it gets serious\u201d and \u201cI crave space all the time\u201d read very differently under the second reading. Not someone who can't be close. Someone for whom closeness is currently expensive.",
          "That changes what helps. You don't need to learn to be close. You need it to cost less, or you need more available, or you need to go at a rate you can actually afford.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Pacing is not avoidance. Avoidance takes you out. Pacing keeps you in, slower. If what you're doing removes you from the thing entirely, that's the other one.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-letting-it-land",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Letting something land",
    related: ["lit-c3-closeness-costs", "lit-c3-interest-collapse"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some people find being cared for harder than being left. If that sounds absurd, it probably isn't your one. If it sounds obvious, read on.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Receiving is its own thing, separate from giving, and it's less practised in most people. It asks you to sit still while something happens to you, without deflecting it, improving it, or immediately returning it.",
        ],
      },
      {
        kind: "list",
        label: "The usual moves for not receiving",
        items: [
          "Making a joke of it.",
          "Correcting them \u2014 pointing out why the nice thing isn't quite accurate.",
          "Giving something back immediately so the balance is restored.",
          "Changing the subject.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of those are character flaws. They're all ways of shortening an uncomfortable moment. Noticing which one is yours is most of the work.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-interest-collapse",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When wanting stops the moment it's returned",
    related: ["lit-c3-letting-it-land", "lit-c3-why-good-feels-wrong"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI like people until they like me back.\u201d \u201cI lose interest when someone likes me.\u201d \u201cI like being chased more than being in a relationship.\u201d",
          "This one confuses people about themselves more than any other, so it's worth naming plainly rather than explaining away.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Wanting someone at a distance is safe. Nothing is asked of you, nothing can be lost, and the version of them you're wanting is partly one you've constructed.",
          "The moment it's returned, all of that changes at once. It becomes real, it becomes reciprocal, and it becomes something you could lose.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to tell you this means you're afraid of intimacy, or anything else about why. We don't know why, and neither does anyone who says it confidently. What's useful is knowing that the drop is predictable, and that it arrives at a specific moment rather than because something changed about them.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c3-faq-always-like-this",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Will I always be like this?",
    related: ["lit-c3-closeness-costs", "lit-c3-where-this-came-from"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We can't tell you. Anyone who can is guessing.",
          "What we can say is that guardedness isn't a fixed trait. It moves with what's being asked of you, what happened recently, and how much you've got available. People are more open in some years than others, and that's not backsliding.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If this question is really the heavier one underneath \u2014 whether you're the kind of person this works out for \u2014 that's worth saying to someone who can stay with it. Not because something's wrong with you. Because it's too big to answer alone.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-faq-if-they-leave",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I let someone in and they leave anyway?",
    related: ["lit-c3-what-being-known-costs", "lit-c3-fear-is-accurate"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Then they leave, and you were right that it could happen. That's the honest answer.",
        ],
      },
      {
        kind: "distinction",
        label: "What's different about it",
        body: [
          "They left knowing who you were, which is information you couldn't otherwise have had.",
          "And you'd have found out what happens when you don't pull back \u2014 which is the question underneath all of this, and it doesn't get answered any other way.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to claim it hurts less. It might hurt more. What it isn't is the thing you've been avoiding finding out.",
        ],
      },
    ],
  },

  {
    id: "lit-c3-faq-guarded-or-wise",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I tell guarded from sensible?",
    related: ["lit-c3-fear-is-accurate", "lit-c3-why-you-leave-first"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The most useful question we know: is this about them, or is it about everyone?",
        ],
      },
      {
        kind: "distinction",
        label: "Roughly",
        body: [
          "Sensible responds to something this person did. It's specific, it's recent, and you could point at it.",
          "Guarded arrives before they've done anything. It's the same in every relationship, and it would be true of whoever was standing there.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's not a clean test and it won't settle every case. But if you can't name the specific thing, it's worth at least considering that the caution came with you rather than from them.",
        ],
      },
    ],
  },
];
