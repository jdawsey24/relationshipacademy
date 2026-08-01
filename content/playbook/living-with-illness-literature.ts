/**
 * ADD-ON — "When Your Body Changes the Relationship"
 * Derived from Cluster 20: Chronic Illness & Disability (10 statements).
 * Field Guide literature. 4 Core Guides + 1 Question Read. (Add-on scale.)
 *
 * Track: Expansion. Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠ ADD-ON, NOT A PLAYBOOK. Not quiz-detectable — reached by signpost or a
 *   life-situation menu. `addon-` prefix on playbookKey.
 *
 * ⚠ PAIRED WITH `addon-caregiving`. Same situation, other side. This is the
 *   person living with the illness. Each routes to the other.
 *
 * ⚠ WRITTEN FROM THE INSIDE. The reader is ill. Nothing may address them as a
 *   burden to be managed, describe their illness from the partner's
 *   perspective, or treat their needs as an imposition to be minimised.
 *
 * ⚠ NOT MEDICAL GUIDANCE OF ANY KIND. No claims about illness, prognosis,
 *   treatment, adaptation, or what anyone is capable of. No assumption about
 *   which condition, whether it progresses, or whether it is visible.
 *
 * ⚠ "I FEEL LIKE A BURDEN" IS NOT ARGUED WITH. Being told you aren't one does
 *   not work and adds a second layer about being unreasonable. What is workable
 *   is what the belief costs — specifically, that it suppresses asking, which
 *   makes the relationship harder for both people.
 *
 * ⚠ THE FEAR OF BEING LEFT MAY BE ACCURATE. Some partners do leave. Nothing may
 *   promise otherwise. Context-Validity applies.
 *
 * ⚠ INTIMACY — no assumptions about capability, desire, or what anyone's body
 *   does. The material works on the conversation, never on function.
 *
 * ⚠ CLAIM SCOPE. May claim: notice what the burden belief suppresses; ask for
 *   one specific thing; open the conversation about what has changed. MUST NOT
 *   CLAIM: that they won't leave, that you aren't a burden, that intimacy can be
 *   restored, or anything about the illness.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const ADDON_ILLNESS_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-ill-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this is for",
    related: ["lit-ill-burden", "lit-ill-more-than"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Your illness changed the relationship. That's a fact, not a failing. And it's usually treated as the second thing, not the first.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different hard things, often mixed up",
        body: [
          "What the illness actually needs \u2014 practical, and there are specialists for it.",
          "What has happened between you because of it \u2014 the asking, the guilt, the intimacy, the fear. That has almost nothing written for it, which is what this is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is medical. Nothing here assumes anything about your condition, or has a view on what you can do. There is also a paired Playbook written from your partner's side. If both of you want to, reading it may help each of you understand the other's side — share or discuss only what each of you is comfortable sharing.",
        ],
      },
    ],
  },

  {
    id: "lit-ill-burden",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI feel like a burden\u201d",
    related: ["lit-ill-what-this-is", "lit-ill-asking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We're not going to tell you that you aren't. Being argued out of it doesn't work. It usually just adds a second layer on top of the first — now you feel unreasonable too.",
          "What's worth looking at is what the belief does.",
        ],
      },
      {
        kind: "distinction",
        label: "The specific cost",
        body: [
          "It stops you asking. If every request adds to a total you're already ashamed of, then asking for less makes sense \u2014 and most people here have got very good at that.",
          "Which makes things harder for both of you, because your partner is then working from only part of the picture and often getting it wrong.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't want them to feel trapped\u201d comes from the same place. It usually means managing their experience for them \u2014 deciding ahead of time what they can handle, without asking.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some of what you're carrying may be true. Care has costs, and pretending it doesn't would be its own kind of lie. The point isn't that the belief is wrong \u2014 it's that acting on it in silence makes things worse, not better.",
        ],
      },
    ],
  },

  {
    id: "lit-ill-asking",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Asking for what you need",
    related: ["lit-ill-burden", "lit-ill-connected"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to ask for what I need.\u201d Two things make this harder than everyday asking.",
        ],
      },
      {
        kind: "distinction",
        label: "What's different about it",
        body: [
          "The amount. There's more to ask for than there used to be, and each request feels like it's added to a running total.",
          "How easy it is to say no. Everyday requests can be turned down easily. These often can't be, which means asking can feel like demanding rather than asking.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "One thing that reliably helps is separating what you need from how it gets met. \u201cI need help getting to appointments\u201d has one answer, and it's them. \u201cI need to not be doing this alone\u201d has several, and only some of them involve your partner.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Asking for less doesn't lower the load. It just moves it \u2014 into their guessing, into things being done at the wrong time, and into you going without something you needed.",
        ],
      },
    ],
  },

  {
    id: "lit-ill-connected",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Staying connected when everything has changed",
    related: ["lit-ill-asking", "lit-ill-more-than"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to stay connected when everything has changed.\u201d \u201cI don't feel attractive anymore.\u201d \u201cI don't know how to navigate intimacy now.\u201d",
          "The last one is the least talked-about and one of the most common, and almost nothing written about relationships and illness goes anywhere near it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that get treated as one",
        body: [
          "What your body can do. Between you and people who know about your condition, and it isn't what this is about.",
          "Whether it can be talked about. That's the part that gets stuck, and it gets stuck in a certain way: both people avoid it to protect the other, and the avoiding becomes the problem.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Feeling unattractive is worth pulling apart too. It's usually about how you feel in your body, not what your partner thinks \u2014 which matters, because their reassurance doesn't reach it, and both of you may have decided the reassurance failed.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says intimacy can be brought back, or that it should look like it used to. What can be worked on is whether the subject can be opened at all.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READ ──
  {
    id: "lit-ill-more-than",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cI want to feel like more than my diagnosis\u201d",
    related: ["lit-ill-what-this-is", "lit-ill-connected"],
    body: [
      {
        kind: "paragraph",
        body: [
          "One of the clearest things anyone says in this material, and it's worth taking literally, not as a nice sentiment.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The practical version: how much of what goes on between you is about the illness? Appointments, symptoms, medication, how you're doing. All of it needed, and it can grow until there isn't much else.",
          "\u201cI miss who I used to be\u201d is partly about the body and partly about that \u2014 being treated as a person with a life, not as a condition being managed.",
        ],
      },
      {
        kind: "distinction",
        label: "What sometimes helps",
        body: [
          "Not less talk about the illness. It's needed, and cutting it back doesn't help anyone.",
          "Something in the week that has nothing to do with it. Small, everyday, and about something else entirely.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI worry they'll leave because of my health\u201d is a fear we're not going to talk you out of. Some partners do leave, and being told otherwise by a text that doesn't know either of you would be worth nothing. What's true is that it's a fear about the future, not a fact about right now.",
        ],
      },
    ],
  },
];
