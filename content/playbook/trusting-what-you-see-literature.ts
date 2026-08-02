/**
 * Cluster 5 — "Difficulty Trusting Your Own Judgment"
 * The Relationship Playbook™ · Trusting What You See
 * Field Guide literature. 10 Core Guides + 3 Question Reads.
 *
 * Authored 29 Jul 2026. Derived against Framework Version 1.9.
 * Part B Instance 3 rulings applied: single phase (Exploration); the
 * ambition block describes WANTS and routes to Recognition/Context; PE-8
 * split on Context-Validity; standards reframed as fit-to-self.
 *
 * BINDING CONSTRAINTS
 *  - Distrust of one's own judgement, after genuinely misjudging, is ACCURATE.
 *    Never challenge it. Only the wise-vs-fearful discrimination is workable.
 *  - "Your standards are too high" is other people's claim, not a finding.
 *    The question is whether the standards fit who the reader actually is.
 *  - Attraction to unavailable people is never explained as pathology, damage,
 *    or attachment type. Describe the pattern; do not diagnose its origin.
 *  - No claim that the reader will start choosing well.
 *
 * ⚠ Safety: this cluster carries self-blame and "I attract bad people" risk.
 *   All signpost copy requires clinical review before publish.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const C5_LITERATURE: LiteratureEntry[] = [
  // ───────────────────────────────────────────────── CORE GUIDES ──
  {
    id: "lit-c5-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c5-distrust-is-fair", "lit-c5-you-usually-knew"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You're not short of information. That's the thing most people get wrong about this.",
          "You noticed. You usually notice. What happens next is the problem — you talk yourself out of it, or you wait to be certain, or you decide you're being unfair, and by the time you act the decision has made itself.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that get called the same thing",
        body: [
          "Not seeing it. Rare, in our experience, for people who end up here.",
          "Seeing it and pushing it aside. Much more common, and a completely different problem with a completely different fix.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So this isn't about learning to spot red flags. You can spot them. It's about what you do in the gap between noticing and acting.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will make you certain. Certainty won't come in the time you need it. What you can have is a way of deciding that doesn't need it.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-distrust-is-fair",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Sometimes not trusting yourself is fair",
    related: ["lit-c5-wise-or-scared", "lit-c5-faq-trust-again"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We want to say this before anything else. Most advice for people like you starts by telling them to trust their gut. That's not obviously good advice for someone whose gut has been wrong.",
        ],
      },
      {
        kind: "list",
        label: "These are not distortions",
        items: [
          "I don't trust my judgment.",
          "I don't trust my instincts anymore.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "If you have really misread people more than once, then trusting your reading less is the right response. That's not damage. That's learning.",
          "We're not going to tell you to trust yourself more. That would be asking you to ignore your own evidence, which is the exact habit we're trying to break.",
        ],
      },
      {
        kind: "distinction",
        label: "There is a different sentence that causes trouble",
        body: [
          "\u201cMy read has been wrong before, so I'll check it against something\u201d is a position you can work with.",
          "\u201cI can't trust anything I think\u201d is a different thing. That one leaves you with nothing to decide with, and it hands the decision to whoever is most confident in the room.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Keep the caution. What's worth building is a way of checking, so the caution has something to do besides freeze you.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-wise-or-scared",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Wise, or scared?",
    related: ["lit-c5-distrust-is-fair", "lit-c5-you-usually-knew"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is the question everything here turns on, and there is a usable answer.",
          "Not a perfect one. A usable one.",
        ],
      },
      {
        kind: "list",
        label: "A read is probably about them if",
        items: [
          "You can point at the specific thing. A moment, a sentence, a thing that happened.",
          "It's recent, and about this person rather than a type.",
          "You could describe it to someone else and they'd understand why you noticed.",
          "It didn't arrive before you'd met them.",
        ],
      },
      {
        kind: "list",
        label: "It's probably about you if",
        items: [
          "It's the same feeling you had about the last three people.",
          "It arrived early, before there was much to go on.",
          "It gets stronger the better things are going.",
          "When you try to say what it's about, you end up describing a pattern rather than a person.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Neither list settles it. Sometimes fear is right and sometimes a specific thing turns out to be nothing. What the lists do is give you something to check against, which is better than choosing between trusting yourself completely and not at all.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-you-usually-knew",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "You usually knew",
    related: ["lit-c5-one-more-chance", "lit-c5-wise-or-scared"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI saw the red flags but stayed anyway.\u201d \u201cI knew something was wrong.\u201d \u201cI ignored my intuition.\u201d",
          "Notice that these are all in the past tense, and all of them contain the word knew. The information was there. It got pushed aside.",
        ],
      },
      {
        kind: "list",
        label: "The usual ways it gets pushed aside",
        items: [
          "Waiting for proof. The concern is real but not certain, so you set it aside until it is \u2014 and by then it's a bigger decision.",
          "Deciding it says something bad about you. Being suspicious feels unkind, so you drop the suspicion rather than check it.",
          "Explaining it away with something true. They're stressed, they're busy, it's early. All possibly true, and none of them tests the concern.",
          "Giving it one more chance, and then another, because each one is small.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The move is smaller than it sounds. Not act on every concern \u2014 that would be no way to live. Just don't let a concern disappear without doing something with it. Name it, and give it something to look for.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-one-more-chance",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why \u201cone more chance\u201d never ends",
    related: ["lit-c5-you-usually-knew", "lit-c5-standards-fit"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Every single chance makes sense. That's what makes this hard.",
          "Nobody stays five years because of one big decision. They stay because of forty small ones, each of which was easy to defend on the day.",
        ],
      },
      {
        kind: "distinction",
        label: "Why a chance with no end isn't really a chance",
        body: [
          "A chance with no end can't be failed. If there's always another one, nothing is ever settled and you never have to decide.",
          "A chance with an end tells you something. Either the thing changes by then, or it doesn't, and you learn something either way.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The whole difference is a deadline you set before you need it. Not a threat, not an ultimatum, not something you tell them. Just a point at which you look.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The deadline is for you. It isn't a promise to leave, and it isn't a promise to stay. It's a promise to look on a particular day.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-anxiety-isnt-chemistry",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Anxiety isn't chemistry",
    related: ["lit-c5-steady-feels-flat", "lit-c5-unavailable-pull"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Physically, wanting someone and being unsettled by them feel almost the same. Racing pulse, can't stop thinking about them, checking your phone, the sense that something is at stake.",
          "You can't tell them apart by how they feel, because they feel the same.",
        ],
      },
      {
        kind: "distinction",
        label: "What does tell them apart",
        body: [
          "Chemistry is about them \u2014 how they talk, what they notice, how it is being near them. It's steady whether or not you've heard from them today.",
          "The other thing is about the uncertainty. It jumps when you don't know where you stand, and it drops when you do. If it disappears the moment they're steadily interested, it wasn't about them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "This is why \u201cchemistry\u201d is such a bad thing to go by. It isn't that the feeling is fake. It's that the same feeling comes from two very different situations.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not saying attraction doesn't matter, or that you should date someone you feel nothing for. We're saying how strong the feeling is isn't evidence about the person.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-steady-feels-flat",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why steady can feel flat",
    related: ["lit-c5-anxiety-isnt-chemistry", "lit-c5-unavailable-pull"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cHealthy relationships feel boring.\u201d \u201cI lose interest when someone is healthy.\u201d \u201cI miss the excitement, not necessarily the person.\u201d",
          "This is one of the most confusing things people notice about themselves, because it seems to say something terrible \u2014 that you don't want good things.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Here's a plainer reading. Uncertainty creates a lot of activity. Wondering, analysing, waiting, hoping. That activity feels like being involved.",
          "When someone is simply available, all of that stops. And the quiet can feel like no feeling \u2014 when really it's just no anxiety.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth separating",
        body: [
          "Nothing is happening \u2014 genuinely not interested, nothing to build on.",
          "Nothing is going wrong \u2014 which is quiet, and unfamiliar, and easy to mistake for the first one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't an instruction to date people you don't like. It's a suggestion that the first read on a steady person is often taken too early, before there's anything to feel.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-unavailable-pull",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why the unavailable ones pull hardest",
    related: ["lit-c5-anxiety-isnt-chemistry", "lit-c5-faq-doing-it-again"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI only want people who don't want me.\u201d \u201cI keep chasing unavailable people.\u201d \u201cI don't know why bad relationships feel familiar.\u201d",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're going to describe this pattern and not explain it. There are a lot of confident explanations out there \u2014 about your childhood, your attachment style, what's wrong with you \u2014 and we don't think any of them are solid enough to give you as fact. Notice the word familiar in that last sentence, though. Familiar means you've been here before. That's worth knowing without needing a theory about it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What you can actually see: someone unavailable never becomes ordinary. There's always a next thing to find out, always a reason it hasn't settled. The wanting doesn't run out, because it never gets what it's after.",
          "Someone available becomes ordinary quite fast. Not less good \u2014 just more settled.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which means the pull you feel isn't measuring how right someone is. It may be measuring how unresolved they are.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-standards-fit",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Your standards, and whether they fit you",
    related: ["lit-c5-what-i-need-held", "lit-c5-faq-too-picky"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cEveryone tells me my standards are too high.\u201d",
          "That's something other people are saying. It isn't a fact, and we're not going to treat it as one.",
        ],
      },
      {
        kind: "distinction",
        label: "The question worth asking instead",
        body: [
          "Not: are my standards too high in general? There's no general.",
          "But: do my standards fit the life I actually have and the person I actually am?",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "If you've built something demanding \u2014 a career, a family, a way of living you're not willing to give up \u2014 then wanting someone who can hold that isn't high standards. It just adds up. The person has to fit the actual life.",
          "And that cuts both ways. Some requirements are load-bearing: without them the thing genuinely doesn't work. Others came from somewhere else \u2014 a film, a family, an idea you formed at twenty-two \u2014 and have never been looked at.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nobody outside you can sort those two piles, which is why \u201cyou're too picky\u201d is unhelpful even when it's well meant. Only you know which requirements are load-bearing.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-what-i-need-held",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What you actually need someone to be able to hold",
    related: ["lit-c5-standards-fit"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some of what you've said isn't a problem to solve. It's a description of what you need, and it's worth writing down that way.",
        ],
      },
      {
        kind: "list",
        label: "Things people in this position say",
        items: [
          "I don't want to shrink myself to be loved.",
          "I want someone who celebrates my success rather than competing with it.",
          "I don't want to choose between love and purpose.",
          "I want someone who grows with me.",
          "I don't know if people want me or what I have.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of those are problems with judgement. They're requirements. And they're the starting point for the standards question \u2014 you can't work out whether your standards fit you until you've said plainly what you need.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There's no tool here, and that's on purpose. This is a thing to know about yourself, not a thing to fix.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c5-faq-too-picky",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Am I too picky?",
    related: ["lit-c5-standards-fit", "lit-c5-steady-feels-flat"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Probably the wrong question, and it's the one everyone asks.",
        ],
      },
      {
        kind: "distinction",
        label: "Two better ones",
        body: [
          "Which of my requirements are load-bearing \u2014 the ones without which it genuinely doesn't work?",
          "Am I ruling people out on requirements, or on how they made me feel in the first hour?",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one catches something the 'too picky' idea misses. Most people who worry about being too picky aren't using strict rules. They're going on a fast gut feeling and then finding reasons afterwards.",
          "Which is a different problem, and it isn't solved by lowering your standards.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-faq-trust-again",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Will I ever be able to trust myself again?",
    related: ["lit-c5-distrust-is-fair", "lit-c5-wise-or-scared"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Possibly not in the way you mean, and we'd rather say so than promise you something.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The version people usually want is a feeling \u2014 a steady inner sense that tells you when someone is safe. We don't think that's coming back whenever you want it, and we're not sure it was ever as reliable as it felt.",
          "What you can have instead is a way of deciding that doesn't depend on the feeling. You notice something, you name it, you give it something to look for, and you look on a particular day. That works whether or not you trust yourself.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If the question is heavier than dating \u2014 if you don't trust your judgement about anything, or the sense that you just can't tell what's real has spread \u2014 that's worth taking to someone. Not because of anything to do with relationships.",
        ],
      },
    ],
  },

  {
    id: "lit-c5-faq-doing-it-again",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I'm just doing it again?",
    related: ["lit-c5-unavailable-pull", "lit-c5-wise-or-scared"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You might be. That's a real possibility and pretending otherwise wouldn't help.",
        ],
      },
      {
        kind: "distinction",
        label: "What's different this time, if anything",
        body: [
          "Last time, the concern went unnamed. This time you could write it down.",
          "Last time, there was no point at which you'd look. This time you could set one.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's a smaller difference than \u201cI've changed\u201d and a more reliable one. You don't have to be a different person. You have to leave yourself something to check against.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI attract toxic people\u201d is a sentence worth being careful with. It puts the cause in you and leaves nothing to do about it. What you can work on is what happens after you notice \u2014 which is a much smaller and much more moveable thing.",
        ],
      },
    ],
  },
];
