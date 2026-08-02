/**
 * ADD-ON — "When You Grieve Differently"
 * Derived from Cluster 20: Infertility & Pregnancy Loss (10 statements).
 * Field Guide literature. 4 Core Guides + 1 Question Read. (Add-on scale.)
 *
 * Track: Expansion. Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠⚠ DELIBERATELY SCOPED — READ THIS BEFORE EDITING. Of the ten source
 *   statements, only the RELATIONAL ones are worked on here:
 *     • "We don't grieve the same way"
 *     • "I don't know how to support my partner"
 *     • "Our relationship feels different now"
 *     • "I feel alone in this experience"
 *     • "I'm tired of everyone asking when we're having kids"
 *
 *   The following are SIGNPOSTED, NOT WORKED ON, and must stay that way unless
 *   a clinician reviews and extends the scope:
 *     • "I don't know how to grieve what never happened"
 *     • "My body has failed me"
 *     • "Every pregnancy announcement hurts"
 *     • "I don't know how to have hope anymore"
 *     • "I don't know how to move forward"
 *
 *   Those belong to specialist bereavement and fertility support. A relationship
 *   add-on attempting them would be half-helping in the area where half-helping
 *   is least acceptable.
 *
 * ⚠ NO MEDICAL CONTENT OF ANY KIND. No claims about causes, treatment,
 *   likelihood, or what anyone should do next. No assumption about whether
 *   they are still trying, have stopped, or what they have lost.
 *
 * ⚠ NO ASSUMPTION ABOUT WHICH PARTNER THE READER IS, or whose body is involved.
 *   Content must work for either.
 *
 * ⚠ NEVER SUGGEST AN ALTERNATIVE. Adoption, surrogacy, "there's still time",
 *   "you could always" — none of these appear. They are the most common
 *   unhelpful response and they are not this add-on's business.
 *
 * ⚠ "MY BODY HAS FAILED ME" IS NOT ARGUED WITH. It is acknowledged once, in the
 *   signpost, and left to people qualified to sit with it.
 *
 * ⚠ CLAIM SCOPE. May claim: recognise that two people grieve differently;
 *   understand what the other's response is doing; have a line ready for the
 *   question. MUST NOT CLAIM: anything medical, that the grief resolves, that
 *   the relationship recovers, or that grieving differently can be aligned.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const ADDON_GRIEVING_DIFFERENTLY_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-grievediff-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this is for, and what it isn't",
    related: ["lit-grievediff-two-ways", "lit-grievediff-different-now"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is about what has happened between the two of you. Not about the loss itself. That needs people who work with it, and we'd rather say so plainly than give you something thinner.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different weights",
        body: [
          "The grief. That's yours, and it isn't something a relationship guide should be handling. Fertility counsellors and pregnancy loss services are there for exactly this, and they're a lot better at it than anything written for people in general.",
          "What it has done to the two of you. The different ways you're each responding. The distance that's opened. The questions from other people. That part has very little written for it, and it's what's here.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here suggests another option, brings up what else you could do, or has a view about what happens next. Those are the most common things people say, and they're not this add-on's business.",
        ],
      },
    ],
  },

  {
    id: "lit-grievediff-two-ways",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWe don't grieve the same way\u201d",
    related: ["lit-grievediff-what-this-is", "lit-grievediff-supporting"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is one of the most common things couples say after a loss like this. It's also one of the most damaging. Not because either way of grieving is wrong, but because each person reads the other's way as a judgment.",
        ],
      },
      {
        kind: "distinction",
        label: "What each one usually decides about the other",
        body: [
          "The one who talks about it hears the silence as not caring, or as having moved on.",
          "The one who doesn't hears the talking as not being able to let it rest, and often stays quiet on purpose, to avoid making it worse.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Each of you may be reading the other without enough to go on, and both of you are acting reasonably, given what you think is happening. That's why it can build. Each response seems to confirm what the other already believes.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Grieving differently isn't a problem to line up. Nothing here will suggest you grieve the same way, or that one of you should change. What can change is what each of you decides from the other's way.",
        ],
      },
    ],
  },

  {
    id: "lit-grievediff-supporting",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI don't know how to support my partner\u201d",
    related: ["lit-grievediff-two-ways", "lit-grievediff-different-now"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Often said by both people, about each other, at the same time. That's worth knowing on its own.",
        ],
      },
      {
        kind: "distinction",
        label: "Why the usual way stalls",
        body: [
          "Most people support someone the way they'd want to be supported. If you need to talk, you ask questions. If you need quiet, you give space.",
          "When two people need different things, each one offers something the other doesn't want. And both are then hurt that their offer wasn't taken.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The version that helps is plain: asking instead of guessing. Not \u201chow are you\u201d, which gets you \u201cfine\u201d, but what they'd actually want when it's bad. Most couples have never asked each other that directly.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's also worth accepting that you may not be able to support each other well through this. Two people grieving the same loss are both worn down, and sometimes the support has to come from outside. That isn't a failure of the relationship.",
        ],
      },
    ],
  },

  {
    id: "lit-grievediff-different-now",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cOur relationship feels different now\u201d",
    related: ["lit-grievediff-supporting", "lit-grievediff-the-question"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It probably is. Something happened to both of you, and relationships don't come through that unchanged.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Some of what's different is grief, which is temporary in shape if not in fact. Some is the built-up effect of months of each of you misreading the other. And some is that the future you'd both been expecting stopped being available. That's its own loss, and it's rarely named as one.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth keeping apart, because they don't move together",
        body: [
          "The grief changes at its own pace. It can't be forced or scheduled. Still, support and the ways you look after yourself may affect how it's carried.",
          "The misreading is the part that responds to anything, and it's the part this can work on.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI feel alone in this experience\u201d is often true even when both people are there. Being in the same house as someone who's grieving the same thing in a different way is its own kind of alone. It isn't evidence that either of you has pulled away.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READ ──
  {
    id: "lit-grievediff-the-question",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cI'm tired of everyone asking when we're having kids\u201d",
    related: ["lit-grievediff-different-now"],
    body: [
      {
        kind: "paragraph",
        body: [
          "A small thing that lands hard, repeatedly, from people who have no idea what they're asking.",
        ],
      },
      {
        kind: "distinction",
        label: "The two costs of it",
        body: [
          "The moment itself. Being asked, and having to come up with something.",
          "The bracing. Once it's happened a few times, you weigh whole occasions ahead of time for whether the question will come up. That's more tiring than the question.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Having a line ready mostly takes care of the second. Not because the answer matters, but because knowing what you'll say removes the need to brace for it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's also worth agreeing with each other what gets said, and to whom. Couples often get caught out when one of them has told someone and the other didn't know. That's a small thing, but it lands as a betrayal when everything is already raw.",
        ],
      },
    ],
  },
];
