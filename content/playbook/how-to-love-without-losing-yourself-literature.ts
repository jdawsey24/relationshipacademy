/**
 * Cluster 22 — "Fear of Losing Myself"
 * The Relationship Playbook™ · Staying Yourself While Growing Together
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Exclusivity — the ONLY cluster in this track. Task = Intentional
 * Investment. Core Need: TO BELONG.
 *
 * ⚠ THE INDEPENDENCE HALF IS NOT A PROBLEM. Six of twenty statements are
 *   clearly stated values — "I want a relationship that adds to my life",
 *   "I don't want love to become my whole identity", "I've worked too hard to
 *   give everything up". Treating those as fear would tell the reader their
 *   healthy position is a symptom. They route to Recognition/Context.
 *
 * ⚠ WHAT IS WORKABLE is the control half: needing a plan, bracing before
 *   anything happens, feeling responsible for whether the whole thing works.
 *
 * ⚠ NO "JUST LET GO" ADVICE. This reader has heard it. It isn't actionable and
 *   it implies the control is a character flaw rather than something that has
 *   worked for them.
 *
 * ⚠ CLAIM SCOPE. May claim: work out what's actually at risk; notice what the
 *   planning is for; separate what's yours to carry from what isn't. MUST NOT
 *   CLAIM: that commitment won't change your life, that the uncertainty gets
 *   comfortable, that you'll stop planning, or that any relationship is safe.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C22_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c22-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c22-not-the-problem", "lit-c22-what-youre-losing"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've built something. A life that works, that you know the shape of, that you got to on your own.",
          "And now there's a person. The question under everything is whether letting them in means taking any of it apart.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that show up together and aren't the same",
        body: [
          "Wanting to keep your life. That's a stand, and a fair one. It isn't a fear to work on.",
          "Needing to know ahead of time how it goes. That's the part that costs you. It can't be met, and it makes the not-knowing harder, not easier.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Almost everything written for people in your spot tries to promise them that commitment won't change their life. We're not going to do that. It isn't true, and you'd know it wasn't.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're also not going to tell you to let go and trust the process. You've heard it. It gives you nothing to do, and it treats your planning as a flaw instead of something that has worked for you.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-not-the-problem",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Your independence isn't the problem",
    related: ["lit-c22-what-this-is", "lit-c22-faq-still-myself"],
    body: [
      {
        kind: "paragraph",
        body: [
          "A lot of what people say here isn't a problem at all. It's a clearly held stand.",
        ],
      },
      {
        kind: "list",
        items: [
          "I don't want to lose my independence.",
          "I've worked too hard to give everything up.",
          "I enjoy my peace too much.",
          "I don't want to compromise who I am.",
          "I want a relationship that adds to my life.",
          "I don't want love to become my whole identity.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Those are boundaries, said plainly, by someone who knows what they want. Most people come to a relationship unable to say any of that.",
          "We're not going to call them a fear of intimacy. There's a version of this material that does, and it's wrong.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The one thing worth checking is whether a stand is being used so early and so fully that nothing gets to happen. A boundary you'd defend when someone is actually pushing on it is one thing. A boundary you defend against a person who hasn't asked for anything yet is doing a different job.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-what-youre-losing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What you're actually afraid of losing",
    related: ["lit-c22-making-room", "lit-c22-not-the-problem"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI'm afraid commitment means losing myself\u201d is the sentence. It's also very general, and a general fear can't be checked.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth getting specific about",
        body: [
          "Some things really do go. Time alone, mostly. Full say over your evenings, your money, and where you live. Those losses are real, and worth grieving rather than denying.",
          "Some things don't go unless you hand them over. Your work, your friendships, your opinions, what you do with a free Saturday, who you are when nobody's watching.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "People mix the two up, and then defend the whole set at once. That's exhausting, and it means the things you could bend on get the same energy as the things you won't.",
          "Naming which is which makes the fear smaller. Not gone. Smaller and more specific, which is a different thing to carry.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If the honest answer is that everything on your list is non-negotiable, that's worth knowing too. It may mean this isn't the moment, and that's a real finding, not a failure.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-making-room",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Making room without dismantling",
    related: ["lit-c22-what-youre-losing", "lit-c22-not-yours-to-carry"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to let someone into the life I've built.\u201d \u201cI don't know if I have room for someone else.\u201d",
          "Both assume the same thing: that room has to be made by taking something out.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Sometimes that's true. Time is limited, and something does have to give. But a lot of what feels like a space problem is really a control problem in different clothes. The discomfort isn't that there's no room. It's that someone else will now have a say in its shape.",
        ],
      },
      {
        kind: "distinction",
        label: "Two questions that get mixed up",
        body: [
          "Do I have room? Practical, checkable, and sometimes the honest answer is no for now.",
          "Am I willing to have less say over how my own life is set up? A different question, harder, and usually the one underneath.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Neither has to be answered all at once. Room can be made in one area and not another, and most people find the second question easier once the first has been honestly answered.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-the-plan",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What the plan is actually for",
    related: ["lit-c22-bracing", "lit-c22-not-yours-to-carry"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI always need a plan.\u201d \u201cI like knowing what to expect.\u201d \u201cI struggle when things feel uncertain.\u201d",
          "Planning is not a flaw, and it has almost certainly worked for you. Most people who describe themselves this way have built something with it.",
        ],
      },
      {
        kind: "distinction",
        label: "Where it stops working",
        body: [
          "In most areas, more planning gives you more control. Effort in, certainty out. That link is real, and it's why the habit exists.",
          "In relationships, more planning doesn't give you more certainty. Another person is involved, and you don't control them. So the effort goes in and nothing comes back, and the natural response is to plan harder.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's the loop worth seeing. Not that planning is bad. It's that in this one area the usual payoff isn't there, and the effort keeps growing because it feels like it should work.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will tell you to stop planning. It points to noticing which parts of a relationship you can actually plan, so the rest of the effort can go somewhere it pays off.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-bracing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Bracing costs more than it saves",
    related: ["lit-c22-the-plan", "lit-c22-faq-relax"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI prepare for disappointment before it happens.\u201d",
          "The logic makes sense: if you've already imagined it, it can't hit as hard. And it does work \u2014 a little, sometimes.",
        ],
      },
      {
        kind: "distinction",
        label: "What it costs to run",
        body: [
          "You pay for the disappointment whether or not it arrives. Bracing for six months costs six months of bracing, and if nothing goes wrong you've paid it for nothing.",
          "And it shows. Someone being braced against usually feels it, even if neither of you names it \u2014 and that can create the very distance you were preparing for.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The saving is also smaller than it feels. Being partly ready for something painful makes it a bit less shocking. It doesn't make it much less painful — and less painful was the thing you were buying.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't an argument for optimism. It's just math: a small saving, paid for the whole time, against a cost that arrives whether or not the thing does.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-not-yours-to-carry",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Whether it works isn't yours alone",
    related: ["lit-c22-the-plan", "lit-c22-faq-relax"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel responsible for making everything work.\u201d \u201cI struggle when I can't fix things.\u201d \u201cI don't like depending on anyone.\u201d",
          "These three show up together often enough to be one thing: if it's all on you, then it's all in your control \u2014 and that's the pull of it, even though it's exhausting.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Depending on someone means their choices affect how things turn out for you. That's the real objection, and it makes sense. It's just also the very thing a relationship is.",
        ],
      },
      {
        kind: "distinction",
        label: "What's genuinely yours",
        body: [
          "Yours: what you put in, what you're honest about, whether you show up, what you'll accept.",
          "Not yours: whether they do the same. Whether it lasts. Whether it turns out to have been the right call.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Carrying the second set doesn't make it more likely to go well. It just makes you tired, and it quietly lets the other person off the hook for things that were theirs.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c22-faq-still-myself",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Can I commit and still be myself?",
    related: ["lit-c22-what-youre-losing", "lit-c22-not-the-problem"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Mostly, and not entirely, and we'd rather say that than reassure you.",
        ],
      },
      {
        kind: "distinction",
        label: "The honest version",
        body: [
          "You will have less say over your life on your own. That's not a risk, it's the deal, and anyone who tells you otherwise is describing something else.",
          "Whether you lose yourself is a different question. It depends much more on what you hand over than on what commitment takes on its own.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "People who lose themselves in relationships usually do it slowly and by choice \u2014 a string of small trade-offs, none of which felt like much. That's worth watching for. It isn't the same as commitment taking it from you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Being able to name what you won't give up is most of the protection. You can already do that, which puts you ahead of most people who ask this.",
        ],
      },
    ],
  },

  {
    id: "lit-c22-faq-relax",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I relax into it?",
    related: ["lit-c22-bracing", "lit-c22-the-plan"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Probably not by trying to. Relaxing doesn't respond to being told to, and being told to do it tends to add a second job on top of the first.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What does sometimes shift is smaller. Noticing which parts of this you can actually plan, and putting the effort there. Noticing that you're paying for bracing the whole time. Working out which things are genuinely yours to carry, and setting the rest down \u2014 not out of trust, but because carrying them wasn't doing anything.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of that is relaxing. It's just cheaper, and cheaper is available in a way that relaxed isn't.",
        ],
      },
    ],
  },
];
