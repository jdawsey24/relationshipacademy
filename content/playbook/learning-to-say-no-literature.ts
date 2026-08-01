/**
 * Cluster 14 — "Difficulty Saying No"
 * The Relationship Playbook™ · Learning to Say No Without Guilt
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Expansion. Task = Integration.
 * Core Need: TO BECOME MY BEST RELATIONAL SELF.
 *
 * ⚠ HIGHEST BEHAVIOURAL DENSITY IN THE CORPUS — 10 of 20 statements are
 *   Self-Behaviour (50%). Compare Cluster 3 at 33%, Cluster 1 at 2%. The tools
 *   derive almost directly from what the reader already says they do.
 *
 * ⚠ SELF-BLAME GUARD. "People take advantage of me" and "I attract people who
 *   need fixing" put the cause in the reader's character and leave nothing to
 *   do about it. Handled explicitly in `lit-c14-not-who-you-are` — the pattern
 *   is described, the trait explanation refused.
 *
 * ⚠ NOT A "STOP BEING KIND" PLAYBOOK. Generosity is not the target. The target
 *   is the automatic yes, and the cost of never having said the other thing.
 *
 * ⚠ CLAIM SCOPE. May claim: notice the moment before the yes; say the smaller
 *   true thing; name one need out loud. MUST NOT CLAIM: that the guilt goes,
 *   that people will take it well, that saying no makes you less liked, or
 *   that the reader will stop being generous.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C14_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c14-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c14-the-gap", "lit-c14-guilt"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You already know what you do. That's unusual — most people arrive at something like this unsure what the pattern even is.",
          "You can list it: saying yes when you meant no, keeping the peace when you're unhappy, apologising too much, doing everything, not asking for what you need.",
        ],
      },
      {
        kind: "distinction",
        label: "Which means the problem isn't insight",
        body: [
          "You're not going to learn anything here about yourself that you didn't know this morning.",
          "The gap is between knowing and the half-second where the yes comes out anyway. That's where the work is, and it's much smaller and more specific than \u201clearn to set boundaries\u201d.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't about becoming less generous. Generosity isn't the problem, and people who try to fix this by becoming harder mostly end up unhappy and still doing everything.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-the-gap",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The half-second before the yes",
    related: ["lit-c14-what-this-is", "lit-c14-smaller-no"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The yes doesn't come from a decision. That's the thing worth knowing.",
          "Someone asks, and before any weighing has happened, the word is already out. Then you spend the next three days managing the consequences of an answer you never gave.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's fast because it's been practised. Thousands of times, and mostly it worked \u2014 it kept things smooth, it avoided the difficult face, it meant nobody was annoyed with you.",
          "Something that efficient doesn't get removed. But it can be slowed down.",
        ],
      },
      {
        kind: "distinction",
        label: "What slowing it looks like",
        body: [
          "Not saying no. Just not saying yes yet.",
          "\u201cLet me check and come back to you\u201d buys you the weighing that didn't happen. It's the whole intervention, and it works because it doesn't require you to refuse anyone in the moment.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "You'll still say yes to most of it. That's fine. The point is that some of them will now be decisions.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-guilt",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Guilt isn't evidence",
    related: ["lit-c14-the-gap", "lit-c14-faq-selfish"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel guilty setting boundaries.\u201d",
          "You probably will. That's worth saying plainly, because most advice implies that if you do it right the guilt won't come, and then when it does you conclude you've done something wrong.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things guilt can mean",
        body: [
          "You've done something wrong. Sometimes true, and worth listening to.",
          "You've done something unfamiliar. Also produces guilt, at similar intensity, and means nothing at all about whether it was right.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "For most people here, it's the second one. Declining something feels like a violation because it's never been done, not because it harmed anybody.",
          "The test isn't how bad you feel. It's what actually happened to the other person \u2014 and usually the answer is \u201cvery little\u201d.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The guilt tends to fade with repetition rather than with insight. Knowing this won't stop it. Doing it a few times sometimes does.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-smaller-no",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The smaller true thing",
    related: ["lit-c14-the-gap", "lit-c14-asking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "People imagine a boundary as a flat refusal, delivered calmly, to someone who takes it well.",
          "That's a high bar, and if it's the only version available you'll keep choosing the yes.",
        ],
      },
      {
        kind: "list",
        label: "There's usually something smaller and true",
        items: [
          "\u201cI can do part of that.\u201d",
          "\u201cNot this week \u2014 could it be next?\u201d",
          "\u201cI'd rather not, but I will if you're stuck.\u201d",
          "\u201cLet me think and come back to you.\u201d",
          "\u201cI can, but I'll be honest \u2014 it's a lot at the moment.\u201d",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of those are a no. All of them are more honest than the automatic yes, and every one of them is available to someone who can't yet manage a flat refusal.",
          "The point isn't to refuse more. It's to stop the answer being decided before you've had a say in it.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-cost",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What the yes actually costs",
    related: ["lit-c14-the-gap", "lit-c14-asking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI give too much.\u201d \u201cI always end up doing everything.\u201d \u201cI stay longer than I should.\u201d \u201cI ignore my own needs.\u201d",
          "Each individual yes is small and reasonable. That's why this accumulates without anyone noticing, including you.",
        ],
      },
      {
        kind: "distinction",
        label: "Two costs, and the second is the one people miss",
        body: [
          "The obvious one: time, energy, the thing you didn't do instead.",
          "The other one: nobody around you knows what you actually think. You've been agreeable for so long that your preferences have stopped being visible \u2014 including to people who would happily have accommodated them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That second cost is why this can quietly become resentment. You're carrying something nobody asked you to carry, because you never told them you were carrying it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't a case for keeping score. It's a case for being known \u2014 which is difficult when your only setting is agreeable.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-asking",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Not asking is the other half",
    related: ["lit-c14-cost", "lit-c14-faq-too-much"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't ask for what I need.\u201d \u201cI don't know how to advocate for myself.\u201d \u201cI'm afraid my needs are too much.\u201d",
          "Saying no and asking for something are the same muscle. Both require believing that what you want counts enough to put into the room.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most people in this position find the asking harder than the refusing. A no can be framed as practical \u2014 I'm busy, I can't this week. A request is naked. It says: I want something, and I'm telling you.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth noticing",
        body: [
          "\u201cMy needs are too much\u201d is almost never tested. It's a prediction, held confidently, about an experiment nobody ran.",
          "The people around you have mostly never been given the chance to find your needs reasonable, because they've never heard one.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-not-who-you-are",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "This isn't a fact about who you are",
    related: ["lit-c14-what-this-is", "lit-c14-faq-selfish"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cPeople take advantage of me.\u201d \u201cI attract people who need fixing.\u201d \u201cI confuse love with sacrifice.\u201d",
          "These are different from the rest, and worth handling separately, because they put the cause in your character.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to explain why you're like this. There are confident explanations available \u2014 about your family, your history, what kind of person you became \u2014 and we don't think any of them are established enough to hand you as fact.",
        ],
      },
      {
        kind: "distinction",
        label: "The practical problem with the trait version",
        body: [
          "\u201cI attract people who need fixing\u201d leaves nothing to do. It's a statement about magnetism, and you can't change your magnetism.",
          "\u201cI say yes before I've thought about it\u201d leaves something to do. Same pattern, different level, and only one of them is workable.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It may also be true that some people take more when it's freely given. That's a fact about them, not a verdict on you \u2014 and it changes what you'd do about it.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c14-faq-selfish",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Isn't this just being selfish?",
    related: ["lit-c14-guilt", "lit-c14-not-who-you-are"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's the question that keeps this in place, so it's worth answering properly rather than reassuringly.",
        ],
      },
      {
        kind: "distinction",
        label: "The honest position",
        body: [
          "Saying no to some things means someone else occasionally doesn't get what they wanted. That's real, and pretending otherwise would be dishonest.",
          "But you're currently at every-time. Moving from every-time to most-of-the-time isn't selfishness. It's a different point on the same scale, and it's a long way from the other end.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The version worth worrying about is the one where you take without giving. Nobody who has read this far is at risk of that.",
        ],
      },
    ],
  },

  {
    id: "lit-c14-faq-too-much",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if my needs really are too much?",
    related: ["lit-c14-asking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Almost nobody who asks this has needs anywhere near the top of the range. The people who genuinely ask a lot of others don't tend to wonder about it.",
        ],
      },
      {
        kind: "distinction",
        label: "A more useful question",
        body: [
          "Not: are my needs too much in general? There's no scale.",
          "But: have I actually said one, out loud, recently? Most people here haven't, and are holding a confident conclusion about an experiment they never ran.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If someone in your life genuinely responds badly to an ordinary request, that's information about them. It's the kind that only becomes available once you've asked.",
        ],
      },
    ],
  },
];
