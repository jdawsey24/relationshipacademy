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
          "Your illness changed the relationship. That's a fact rather than a failing, and it's usually carried as though it were the second.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different difficulties, often confused",
        body: [
          "What the illness actually requires \u2014 practical, and it has specialists.",
          "What has happened between you because of it \u2014 the asking, the guilt, the intimacy, the fear. That has almost nothing written for it, which is what this is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is medical, makes any assumption about your condition, or has a view on what you're capable of. There is also a companion piece written from your partner's side. If you're both reading, reading each other's is often more useful than reading your own.",
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
          "We're not going to tell you that you aren't. Being argued out of it doesn't work, and it usually adds a second layer about being unreasonable on top of the first.",
          "What's worth looking at is what the belief does.",
        ],
      },
      {
        kind: "distinction",
        label: "The specific cost",
        body: [
          "It suppresses asking. If every request adds to a total you're already ashamed of, then the sensible move is to ask for less \u2014 and most people here have got very good at that.",
          "Which makes things harder for both of you, because your partner is then working from incomplete information and often getting it wrong.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't want them to feel trapped\u201d comes from the same place, and it usually results in managing their experience for them \u2014 deciding in advance what they can bear, without asking.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some of what you're carrying may be accurate. Care has costs, and pretending it doesn't would be its own dishonesty. The point isn't that the belief is wrong \u2014 it's that acting on it silently makes things worse rather than better.",
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
          "\u201cI don't know how to ask for what I need.\u201d Two things make this harder than ordinary asking.",
        ],
      },
      {
        kind: "distinction",
        label: "What's different about it",
        body: [
          "The volume. There's more to ask for than there used to be, and each request feels like it's being added to a running total.",
          "The refusability. Ordinary requests can be declined easily. These often can't be, which means asking can feel like requiring rather than asking.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "One thing that reliably helps is separating what you need from how it gets met. \u201cI need help getting to appointments\u201d has one solution and it's them. \u201cI need to not be doing this alone\u201d has several, and only some of them involve your partner.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Asking less doesn't reduce the load. It relocates it \u2014 into their guessing, into things being done at the wrong time, and into you managing without something you needed.",
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
          "The last one is the least discussed and one of the most common, and almost nothing written about relationships and illness goes anywhere near it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that get treated as one",
        body: [
          "What your body can do. Between you and people who know about your condition, and it isn't what this is about.",
          "Whether it can be talked about. That's the part that stalls, and it stalls in a specific way: both people avoid it to protect the other, and the avoiding becomes the problem.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Feeling unattractive is worth separating too. It's usually about how you feel in your body rather than what your partner thinks \u2014 which matters, because reassurance from them doesn't reach it, and both of you may have concluded the reassurance failed.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here suggests intimacy can be restored, or that it should look like it used to. What's workable is whether the subject can be opened at all.",
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
          "One of the clearest things anyone says in this material, and it's worth taking literally rather than as a sentiment.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The practical version: how much of what passes between you is about the illness? Appointments, symptoms, medication, how you're doing. All necessary, and it can expand until there isn't much else.",
          "\u201cI miss who I used to be\u201d is partly about the body and partly about that \u2014 being related to as a person with things going on rather than as a condition being managed.",
        ],
      },
      {
        kind: "distinction",
        label: "What sometimes helps",
        body: [
          "Not less discussion of the illness. It's necessary and reducing it doesn't serve anyone.",
          "Something in the week that has nothing to do with it. Small, ordinary, and about something else entirely.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI worry they'll leave because of my health\u201d is a fear we're not going to reassure you about. Some partners do leave, and being told otherwise by a text that doesn't know either of you would be worth nothing. What's true is that it's a fear about the future rather than information about the present.",
        ],
      },
    ],
  },
];
