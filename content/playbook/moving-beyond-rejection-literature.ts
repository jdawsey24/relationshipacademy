// Rev 3 Step 3 — Understand layer for Cluster 1 "Moving Beyond Rejection".
//
// FOR REVIEW (content gate). Authored, flag-gated, additive. Not wired into v0.
// Two deliverables:
//   MBR_LITERATURE      — navigable field-guide entries (cluster / play / jit).
//   MBR_STATEMENT_MAP    — the formal 101-statement content map (§5.1).
//
// Readability target ~5th grade with an adult, intelligent tone (plain != shallow).
// The 101 statements are a phenomenological personalization asset, NOT 101
// treatment targets: most resolve to recognition / literature / normalization;
// only some feed the two built Plays. `targets` reference real literature ids or a
// BUILT play id ("read-and-decide" | "what-it-actually-means") only.

import type { LiteratureEntry, StatementMapping, StatementFunction } from "@/lib/playbook/contentSchema";

const RD = "read-and-decide";
const WM = "what-it-actually-means";

// =============================================================================
// Literature entries
// =============================================================================

export const MBR_LITERATURE: LiteratureEntry[] = [
  // ---- Cluster: understanding the whole problem ----
  {
    id: "lit-what-is-dfc",
    version: 1,
    scope: "cluster",
    title: "What “difficulty feeling chosen” really is",
    body: [
      {
        body: [
          "Everyone wants to be wanted. That part is human, and it's fine.",
          "This gets hard when being chosen starts to carry too much. It can start to feel like proof of whether you're worth anything at all.",
          "When that happens, one text, one date, or one “no” can shape your whole mood — and your next move. This field guide is about loosening that grip, not about making you easier to pick.",
        ],
      },
    ],
    related: ["lit-being-chosen-weight", "lit-want-vs-worth", "lit-healthier"],
  },
  {
    id: "lit-being-chosen-weight",
    version: 1,
    scope: "cluster",
    title: "Why being chosen can start to carry too much",
    body: [
      {
        body: [
          "Being picked feels good. That's normal. The trouble starts when it becomes the main way you measure yourself.",
          "Then dating stops being “do I like this person?” and turns into “do they like me enough?” You end up auditioning instead of choosing.",
          "The weight is the problem, not the wish. You can still want a partner. The goal is to stop letting the fear of not being chosen run the show.",
        ],
      },
    ],
    related: ["lit-want-vs-worth", "lit-over-investing"],
  },
  {
    id: "lit-want-vs-worth",
    version: 1,
    scope: "cluster",
    title: "Wanting to be chosen vs. using it to prove your worth",
    body: [
      {
        body: [
          "There's a big difference between “I'd love for them to pick me” and “if they don't pick me, I'm not enough.”",
          "The first is a wish. The second turns another person's choice into a verdict about you.",
          "Their choice tells you about fit and timing. It does not measure your worth. You were already enough before they decided anything.",
        ],
      },
    ],
    related: ["lit-rejection-not-verdict", "lit-faq-not-enough"],
  },
  {
    id: "lit-wanted-vs-compatible",
    version: 1,
    scope: "cluster",
    title: "Being wanted vs. being a good fit",
    body: [
      {
        body: [
          "Someone can want you and still not be a good fit. Someone can be a great fit and not feel a spark right away.",
          "“Do they want me?” and “are we good for each other?” are two different questions. Feeling chosen answers the first. It doesn't answer the second.",
          "When you only chase being wanted, you can miss whether the fit is even there — for you.",
        ],
      },
    ],
    related: ["lit-kinds-of-signal", "lit-faq-backup-option"],
  },
  {
    id: "lit-rejection-not-verdict",
    version: 1,
    scope: "cluster",
    title: "A “no” is not a verdict on you",
    body: [
      {
        body: [
          "Rejection hurts. That's real, and it means you cared.",
          "But your mind can take one “no” and blow it up into a rule: “no one will ever want me,” “something's wrong with me.” That jump is the part to catch.",
          "One person saying “not a match” is one person, one time. It's not a report card on all of you, forever.",
        ],
      },
    ],
    related: ["lit-play-wm", "lit-jit-globalizing", "lit-faq-not-enough"],
  },
  {
    id: "lit-uncertainty",
    version: 1,
    scope: "cluster",
    title: "Why not knowing is so hard — and what it can and can't tell you",
    body: [
      {
        body: [
          "Early dating is full of gaps. You get small, mixed signals and not much to go on.",
          "Your mind hates that gap, so it fills it — often with your biggest fear or your biggest hope. Then the guess starts to feel like a fact.",
          "Uncertainty can tell you “I don't have enough yet.” It can't tell you what someone really means. The move is to notice what you actually know, and decide what you'd need to see next.",
        ],
      },
    ],
    related: ["lit-play-rd", "lit-see-vs-act", "lit-kinds-of-signal"],
  },
  {
    id: "lit-kinds-of-signal",
    version: 1,
    scope: "cluster",
    title: "Chemistry, attention, interest, fit, and effort are five different things",
    body: [
      {
        body: [
          "It's easy to lump everything into “do they like me?” But these are separate kinds of information:",
          "Chemistry is a feeling. Attention is how much they focus on you right now. Interest is whether they want more. Fit is whether you're actually good for each other. Effort is what they actually do.",
          "You can have chemistry with no effort. Lots of attention with no real interest. Sorting these apart keeps you from reading one as all of them.",
        ],
      },
    ],
    related: ["lit-play-rd", "lit-wanted-vs-compatible"],
  },
  {
    id: "lit-see-vs-act",
    version: 1,
    scope: "cluster",
    title: "Seeing what's true vs. acting on it",
    body: [
      {
        body: [
          "Sometimes you can already read the situation clearly — and still not act on it.",
          "You notice the effort isn't there. You notice you're the only one trying. But you stay, because leaving is hard and hope is loud.",
          "Reading the evidence is one skill. Acting on what you already know is a second one. Both matter, and they're not the same.",
        ],
      },
    ],
    related: ["lit-play-rd", "lit-over-investing"],
  },
  {
    id: "lit-over-investing",
    version: 1,
    scope: "cluster",
    title: "When you keep giving more than you get",
    body: [
      {
        body: [
          "Giving a lot isn't a flaw. Giving a lot to someone who keeps giving little, again and again, is worth a look.",
          "Sometimes you over-give to earn a spot — to make yourself too helpful to let go. It can feel like love, but it often comes from fear.",
          "This isn't about keeping score. It's about noticing when your effort isn't being met, and choosing what to do with that.",
        ],
      },
    ],
    related: ["lit-see-vs-act", "lit-faq-care-more"],
  },
  {
    id: "lit-self-editing",
    version: 1,
    scope: "cluster",
    title: "Shrinking yourself to stay likable",
    body: [
      {
        body: [
          "When being chosen feels like everything, it's tempting to hide the parts of you that might cost you the connection.",
          "You go along. You don't say the real thing. You become easy to like — and a little hard to actually know.",
          "The catch: if they pick the edited version, you never find out if they'd have picked you. And you don't get to feel truly chosen.",
        ],
      },
    ],
    related: ["lit-wanted-vs-compatible", "lit-healthier"],
  },
  {
    id: "lit-fatigue",
    version: 1,
    scope: "cluster",
    title: "Dating burnout and losing hope",
    body: [
      {
        body: [
          "Dating can wear you down. Getting your hopes up and being let down, over and over, is tiring. That's not weakness.",
          "Burnout can look like dread, going numb, or not wanting to open the apps at all. Those are signals, not failures.",
          "Sometimes the useful move is a real rest — not quitting on what you want, just stepping back so you're not running on empty.",
        ],
      },
    ],
    related: ["lit-loneliness", "lit-faq-tired-of-dating"],
  },
  {
    id: "lit-loneliness",
    version: 1,
    scope: "cluster",
    title: "Missing someone isn't a flaw",
    body: [
      {
        body: [
          "Wanting a partner is not a problem to fix. Missing someone, hating the quiet house, dreading the holidays — that's human.",
          "The desire for company isn't the issue here. It only matters for this work when it starts to push your choices — like staying somewhere that isn't good for you just to not be alone.",
          "You can honor the wish and still choose well.",
        ],
      },
    ],
    related: ["lit-what-is-dfc"],
  },
  {
    id: "lit-healthier",
    version: 1,
    scope: "cluster",
    title: "What healthier looks like here",
    body: [
      {
        body: [
          "Healthier isn't “never wanting to be chosen.” It's wanting it without being ruled by it.",
          "It looks like: reading real signals instead of stories; giving in a way that's met; showing the real you sooner; letting a “no” be one no.",
          "It also looks like still feeling the sting sometimes — and choosing well anyway. Comfort isn't the goal. Choosing from what's true is.",
        ],
      },
    ],
    related: ["lit-play-rd", "lit-play-wm"],
  },

  // ---- FAQ: question-led lived-experience entries ----
  {
    id: "lit-faq-why-nobody-chooses",
    version: 1,
    scope: "cluster",
    title: "“Why does nobody choose me?”",
    body: [
      {
        body: [
          "When it keeps not working out, this question feels like a fact. It isn't — it's a story the hurt is telling.",
          "“Nobody” and “never” are almost never true. They're the mind's shorthand for “this really hurts.”",
          "A more honest version is: “Some things haven't worked out, and I don't fully know why yet.” That's a place you can actually work from.",
        ],
      },
    ],
    related: ["lit-rejection-not-verdict", "lit-play-wm"],
  },
  {
    id: "lit-faq-not-enough",
    version: 1,
    scope: "cluster",
    title: "“What if I'm just not enough?”",
    body: [
      {
        body: [
          "This one feels true because it hurts. But hurt isn't proof.",
          "“Not enough” treats your worth like a score other people set. It isn't. A person choosing or not choosing you is about fit and timing, not your value.",
          "The work isn't to feel great about yourself on command. It's to stop handing strangers the power to decide if you're enough.",
        ],
      },
    ],
    related: ["lit-want-vs-worth", "lit-play-wm"],
  },
  {
    id: "lit-faq-backup-option",
    version: 1,
    scope: "cluster",
    title: "“Why do I always feel like the backup option?”",
    body: [
      {
        body: [
          "Feeling like a backup is painful, and sometimes the pattern is real — the effort really isn't coming back your way.",
          "Two things get tangled here: what's actually happening, and the verdict “I'm second-best.” Keep the first. Drop the second.",
          "If someone gives you just enough to keep you around, that's information. You get to decide what to do with it — not just wait to be upgraded.",
        ],
      },
    ],
    related: ["lit-wanted-vs-compatible", "lit-play-rd"],
  },
  {
    id: "lit-faq-are-they-interested",
    version: 1,
    scope: "cluster",
    title: "“How do I know if they're actually interested?”",
    body: [
      {
        body: [
          "You often can't know for sure early on — and trying to be sure can keep you stuck.",
          "Watch what they do over time, not just what they say once. Effort, follow-through, and plans tell you more than a single warm text.",
          "Instead of “are they into me?”, try: “what have I actually seen, and what would tell me more?”",
        ],
      },
    ],
    related: ["lit-play-rd", "lit-kinds-of-signal"],
  },
  {
    id: "lit-faq-care-more",
    version: 1,
    scope: "cluster",
    title: "“Why do I keep caring more?”",
    body: [
      {
        body: [
          "Caring a lot isn't the problem. Always being the one who cares more, and giving to earn a spot, is worth noticing.",
          "Sometimes we over-give because it feels safer than asking for anything back. If you never ask, you never risk a no.",
          "You're allowed to want it matched. Noticing the gap is the first step, not scorekeeping.",
        ],
      },
    ],
    related: ["lit-over-investing"],
  },
  {
    id: "lit-faq-tired-of-dating",
    version: 1,
    scope: "cluster",
    title: "“What if I'm just tired of dating?”",
    body: [
      {
        body: [
          "Then you're tired — and that's allowed. Being worn out doesn't mean something is wrong with you.",
          "There's a difference between “I need a break” and “I'm done for good.” You don't have to decide that today.",
          "Rest is a real choice, not giving up. Stepping back on purpose is different from quitting in defeat.",
        ],
      },
    ],
    related: ["lit-fatigue", "lit-loneliness"],
  },

  // ---- Play-scope: education directly supporting a built Play ----
  {
    id: "lit-play-rd",
    version: 1,
    scope: "play",
    playId: RD,
    title: "Behind “Read It, Then Decide”",
    body: [
      {
        body: [
          "Early dating is unclear. The signs are small and mixed. Your mind fills the gaps — often with fear or hope — and the guess starts to feel like a fact.",
          "Two moves help. First, keep what happened apart from what you think it means. Second, decide ahead of time what you'd need to see before you give more.",
          "This isn't about being suspicious or keeping score. It's about giving yourself real facts to work with.",
        ],
      },
      {
        heading: "A little deeper",
        body: [
          "When you're unsure, your mind fills the gap with what you expect — often shaped by old hurt. This move slows that step down.",
          "It won't make anyone like you more. It changes what you're reacting to, so your next choice follows what's real.",
          "Said plainly: these ideas come from research on how people read facts and make plans. Using them for dating is our best thinking. We haven't tested that part yet, and we won't pretend we have.",
        ],
      },
    ],
    related: ["lit-uncertainty", "lit-see-vs-act", "lit-kinds-of-signal"],
  },
  {
    id: "lit-play-wm",
    version: 1,
    scope: "play",
    playId: WM,
    title: "Behind “What It Actually Means”",
    body: [
      {
        body: [
          "Getting turned down hurts. So does watching something fade. That's not a flaw — it means you care.",
          "But one step happens fast: one event (“this didn't work with this person”) grows into a big claim (“I'm unlovable”). The claim feels true because it hurts. Hurt isn't proof.",
          "This isn't happy thinking or pretending you don't care. It's one honest question: what does this really show — and what does it not?",
        ],
      },
      {
        heading: "A little deeper",
        body: [
          "When something hurts, the mind tends to explain it in the biggest way — that it's all of you, and it'll always be true.",
          "A small step back keeps the story the right size, so your next move fits the facts. A real, repeating pattern is worth a look — but “I'm unlovable” is a verdict a pattern can't prove.",
          "Said plainly: these ideas come from research on how people handle painful events. Using them for dating is our best thinking, not a tested result.",
        ],
      },
    ],
    related: ["lit-rejection-not-verdict", "lit-faq-not-enough", "lit-jit-globalizing"],
  },

  // ---- Just-in-time: short, surfaced after a specific moment ----
  {
    id: "lit-jit-globalizing",
    version: 1,
    scope: "jit",
    anchor: "wm.expansion",
    title: "When one thing becomes everything",
    body: [
      {
        body: [
          "Notice the words “everyone,” “always,” “never,” “forever.” They're the sign that one event just became a rule about all of you.",
          "Bring it back to size: what happened, with this one person, this one time? Keep that. Drop the rest.",
        ],
      },
    ],
    related: ["lit-play-wm"],
  },
  {
    id: "lit-jit-ambiguity-spiral",
    version: 1,
    scope: "jit",
    anchor: "rd.reveal",
    title: "When a small change becomes a big story",
    body: [
      {
        body: [
          "A shorter text, a slower reply — small things can spin into “they're losing interest” before you have the facts.",
          "Pause on the actual evidence. What did you truly see? What are you guessing? What would really tell you?",
        ],
      },
    ],
    related: ["lit-play-rd"],
  },
  {
    id: "lit-jit-waiting-to-be-chosen",
    version: 1,
    scope: "jit",
    anchor: "rd.waiting",
    title: "When you're waiting to be picked",
    body: [
      {
        body: [
          "Waiting for someone to choose you can quietly become the whole relationship. Meanwhile, you stop asking whether you'd choose them.",
          "You don't have to wait to be upgraded. You can look at what you've actually seen and decide your own next step.",
        ],
      },
    ],
    related: ["lit-play-rd", "lit-faq-backup-option"],
  },
  {
    id: "lit-jit-hope-vs-hurt",
    version: 1,
    scope: "jit",
    anchor: "wm.pattern",
    title: "Hope without bracing for the worst",
    body: [
      {
        body: [
          "If things keep ending, it makes sense that you brace for it — you wait for the other shoe to drop.",
          "Bracing isn't proof it'll happen. A real pattern is worth watching, but keep it as “this has happened,” not “this always will.”",
        ],
      },
    ],
    related: ["lit-play-wm", "lit-uncertainty"],
  },
];

// =============================================================================
// 101-statement content map (§5.1)
// =============================================================================

const m = (
  statementId: string,
  text: string,
  functions: StatementFunction[],
  targets?: string[],
): StatementMapping => ({ statementId, text, functions, ...(targets ? { targets } : {}) });

export const MBR_STATEMENT_MAP: StatementMapping[] = [
  // --- Core "why me / what's wrong with me / not enough" (self-verdict) ---
  m("STM-0001", "Why am I still single?", ["recognition", "cluster_literature", "context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0002", "Why doesn't anyone choose me?", ["recognition", "faq_literature", "play_routing"], ["lit-faq-why-nobody-chooses", WM]),
  m("STM-0003", "I feel invisible.", ["recognition", "context_normalization"], ["lit-loneliness"]),
  m("STM-0004", "I always get rejected.", ["recognition", "play_literature", "play_routing"], ["lit-play-wm", WM]),
  m("STM-0005", "I never get past the talking stage.", ["recognition", "faq_literature"], ["lit-faq-are-they-interested", "lit-play-rd"]),
  m("STM-0006", "I always get friend-zoned.", ["recognition", "cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0007", "I don't know what's wrong with me.", ["recognition", "faq_literature", "play_routing", "context_normalization"], ["lit-faq-not-enough", WM]),
  m("STM-0008", "Everyone else finds love except me.", ["cluster_literature", "context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0009", "Dating makes me feel defeated.", ["recognition", "context_normalization"], ["lit-fatigue"]),
  m("STM-0010", "Maybe I'm just not attractive enough.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0011", "Maybe I'm too much.", ["cluster_literature", "context_normalization"], ["lit-self-editing"]),
  m("STM-0012", "Maybe I'm not enough.", ["recognition", "faq_literature", "play_literature", "play_routing"], ["lit-faq-not-enough", "lit-play-wm", WM]),
  m("STM-0013", "Nobody stays interested in me.", ["faq_literature", "play_routing"], ["lit-faq-why-nobody-chooses", WM]),
  m("STM-0014", "I always end up alone.", ["context_normalization", "cluster_literature"], ["lit-loneliness"]),
  m("STM-0015", "I feel behind everyone else.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0016", "I've never been in love.", ["context_normalization", "none"]),
  m("STM-0017", "I've never had a serious relationship.", ["context_normalization", "none"]),
  m("STM-0018", "I don't think I'll ever get married.", ["cluster_literature", "context_normalization"], ["lit-uncertainty"]),
  m("STM-0019", "I think I've missed my chance.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0020", "I feel like everyone else knows something I don't.", ["cluster_literature"], ["lit-what-is-dfc"]),

  // --- Self-worth / "the problem is me" / backup option ---
  m("STM-0140", "Maybe I'm too picky.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0141", "Maybe my standards are too high.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0142", "Maybe my standards are too low.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0143", "I think I'm the problem.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0144", "I don't know if I'm lovable.", ["faq_literature", "play_literature", "play_routing"], ["lit-faq-not-enough", "lit-play-wm", WM]),
  m("STM-0145", "I don't think I'm relationship material.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0146", "I always feel like the backup option.", ["recognition", "faq_literature"], ["lit-faq-backup-option", "lit-play-rd"]),
  m("STM-0147", "I never feel like the first choice.", ["faq_literature"], ["lit-faq-backup-option"]),
  m("STM-0148", "I feel like everyone settles for me.", ["faq_literature", "context_normalization"], ["lit-faq-backup-option"]),
  m("STM-0149", "I don't think people see my value.", ["cluster_literature", "play_routing"], ["lit-want-vs-worth", WM]),
  m("STM-0150", "I wish someone would choose me the way I choose them.", ["recognition", "context_normalization"], ["lit-want-vs-worth"]),
  m("STM-0151", "I don't think I'll ever be enough.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0152", "I'm tired of proving my worth.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0153", "I feel like I have to earn love.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0154", "I don't know why I'm never enough.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0155", "Maybe love just isn't meant for me.", ["context_normalization", "cluster_literature"], ["lit-uncertainty"]),
  m("STM-0156", "I feel broken.", ["faq_literature", "context_normalization", "support_signpost"], ["lit-faq-not-enough"]),
  m("STM-0157", "I wish relationships came easier for me.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0158", "I envy people who seem to find love effortlessly.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0159", "I don't know what I'm doing wrong.", ["faq_literature", "play_routing"], ["lit-faq-why-nobody-chooses", WM]),

  // --- Dating fatigue / discouragement / fear ---
  m("STM-0172", "I'm tired of trying.", ["recognition", "cluster_literature", "context_normalization"], ["lit-fatigue"]),
  m("STM-0173", "I'm exhausted by dating.", ["recognition", "cluster_literature"], ["lit-fatigue"]),
  m("STM-0174", "Every relationship ends the same way.", ["cluster_literature", "play_routing"], ["lit-jit-hope-vs-hurt", RD]),
  m("STM-0175", "I'm losing hope.", ["context_normalization", "cluster_literature"], ["lit-fatigue"]),
  m("STM-0176", "I don't get excited about dating anymore.", ["cluster_literature"], ["lit-fatigue"]),
  m("STM-0177", "I don't even want to download the apps again.", ["recognition", "cluster_literature", "support_signpost"], ["lit-faq-tired-of-dating"]),
  m("STM-0178", "I feel emotionally burned out.", ["cluster_literature", "support_signpost"], ["lit-fatigue"]),
  m("STM-0179", "I'm afraid to get my hopes up.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0180", "I expect disappointment now.", ["cluster_literature", "play_routing"], ["lit-jit-hope-vs-hurt", WM]),
  m("STM-0181", "I don't believe people mean what they say.", ["cluster_literature", "play_literature"], ["lit-kinds-of-signal", "lit-play-rd"]),
  m("STM-0182", "Love feels harder than it should.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0183", "I'm tired of investing in people who leave.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0184", "I'm afraid I'll end up alone.", ["context_normalization", "cluster_literature"], ["lit-loneliness"]),

  // --- Over-investment / self-editing / attachment / "almost enough" ---
  m("STM-0252", "Maybe I'm too independent.", ["cluster_literature", "none"]),
  m("STM-0253", "Maybe I'm too needy.", ["cluster_literature"], ["lit-self-editing"]),
  m("STM-0254", "Maybe I love too hard.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0255", "Maybe I don't love enough.", ["cluster_literature", "none"]),
  m("STM-0256", "I always care more than they do.", ["recognition", "faq_literature"], ["lit-faq-care-more", "lit-over-investing"]),
  m("STM-0257", "I feel like I'm always the one left behind.", ["cluster_literature", "context_normalization"], ["lit-over-investing"]),
  m("STM-0258", "I don't know why I get attached so quickly.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0259", "I don't know why people lose interest in me.", ["faq_literature", "play_literature"], ["lit-faq-why-nobody-chooses", "lit-play-rd"]),
  m("STM-0260", "I feel like I have to be perfect to be loved.", ["cluster_literature"], ["lit-self-editing"]),
  m("STM-0261", "I don't know who I am outside of relationships.", ["cluster_literature", "support_signpost"], ["lit-self-editing"]),
  m("STM-0262", "I keep changing myself for other people.", ["recognition", "cluster_literature"], ["lit-self-editing"]),
  m("STM-0263", "I don't know if people like the real me.", ["recognition", "cluster_literature"], ["lit-self-editing"]),
  m("STM-0264", "I wish I could stop caring so much.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0265", "I always feel replaceable.", ["faq_literature", "context_normalization"], ["lit-faq-backup-option"]),
  m("STM-0266", "I don't feel special to anyone.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0267", "I'm tired of being “almost enough.”", ["recognition", "faq_literature"], ["lit-faq-backup-option", "lit-over-investing"]),
  m("STM-0268", "I wonder if something is wrong with me.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0269", "I feel like love comes easily for everyone but me.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0270", "I don't know why I always feel unwanted.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0271", "I feel invisible even when I'm with people.", ["context_normalization", "support_signpost"], ["lit-loneliness"]),

  // --- Ambiguity / reading evidence / "keeping me as an option" (RD core) ---
  m("STM-0436", "I don't know if we're just friends.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-are-they-interested", RD]),
  m("STM-0437", "They say they're not ready for a relationship.", ["play_literature", "play_routing"], ["lit-play-rd", RD]),
  m("STM-0438", "They give me just enough attention to keep me around.", ["faq_literature", "simulation_cue", "play_routing"], ["lit-faq-backup-option", RD]),
  m("STM-0439", "I don't know if they're keeping me as an option.", ["faq_literature", "play_routing"], ["lit-faq-backup-option", RD]),
  m("STM-0440", "I feel like I'm waiting for them to choose me.", ["recognition", "jit_teaching", "simulation_cue", "play_routing"], ["lit-jit-waiting-to-be-chosen", RD]),
  m("STM-0441", "I don't know if I'm wasting my time.", ["faq_literature", "play_routing"], ["lit-faq-are-they-interested", RD]),
  m("STM-0442", "I keep hoping they'll change their mind.", ["cluster_literature", "play_routing"], ["lit-see-vs-act", RD]),
  m("STM-0443", "I don't know when to walk away.", ["recognition", "cluster_literature", "play_routing"], ["lit-see-vs-act", RD]),

  // --- Hope vs. hurt / expecting people to leave / hypervigilance ---
  m("STM-0522", "I thought they'd be different.", ["cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0523", "I keep getting my hopes up.", ["jit_teaching"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0524", "Every time I think it's going somewhere, it ends.", ["cluster_literature", "play_routing"], ["lit-jit-hope-vs-hurt", WM]),
  m("STM-0525", "I'm tired of being disappointed.", ["context_normalization", "cluster_literature"], ["lit-fatigue"]),
  m("STM-0526", "I don't know how to have hope without getting hurt.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0527", "I expect people to leave eventually.", ["cluster_literature", "play_routing"], ["lit-jit-hope-vs-hurt", WM]),
  m("STM-0528", "I don't believe good things last.", ["cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0529", "I don't trust when things are going well.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0530", "I wait for the other shoe to drop.", ["jit_teaching", "cluster_literature", "support_signpost"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0531", "I don't know how to enjoy a healthy relationship without worrying it'll end.", ["cluster_literature", "support_signpost"], ["lit-jit-hope-vs-hurt", "lit-healthier"]),

  // --- Loneliness / missing companionship (normalize — not interventions) ---
  m("STM-0563", "I miss having someone.", ["recognition", "context_normalization"], ["lit-loneliness"]),
  m("STM-0564", "I miss having my person.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0565", "I don't like coming home to an empty house.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0566", "I hate sleeping alone.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0567", "I miss being someone's favorite person.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0568", "Holidays are hard.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0569", "Weekends feel lonely.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0570", "I feel forgotten.", ["context_normalization", "support_signpost"], ["lit-loneliness"]),
  m("STM-0571", "I don't want to do life alone.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0572", "I wish someone would ask me how my day was.", ["context_normalization"], ["lit-loneliness"]),
];
