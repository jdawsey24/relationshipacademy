// Framework content for the public site. Phase-detail prose is verbatim from
// the Relationship Life Cycle™ Framework Manual (Chapters 1–7); domain
// descriptions and card copy follow the Phase 4 spec. Exploration and
// Exclusivity are fully populated; Expansion/Expiration/Recovery/Renewal carry
// the manual's opening definition with deeper sections marked "coming soon".

import type { ColorToken } from "@/lib/phases";

export interface PhaseSection {
  heading: string;
  body: string[]; // paragraphs
  comingSoon?: boolean;
}

export interface FrameworkPhase {
  slug: string;
  number: number;
  name: string;
  color: ColorToken;
  task: string; // developmental task (manual)
  cardDescription: string; // one-sentence (spec)
  intro: string; // hero paragraph (manual)
  sections: PhaseSection[];
  fullyPopulated: boolean;
}

const COMING_SOON = "Full content from the Relationship Life Cycle™ Framework Manual is being prepared for this section.";

export const PHASES: FrameworkPhase[] = [
  {
    slug: "exploration",
    number: 1,
    name: "Exploration",
    color: "coral-rose",
    task: "Discernment",
    cardDescription:
      "The phase of discovery — gathering information to determine whether a deeper investment in the relationship is warranted.",
    intro:
      "Exploration is the first phase of the Relationship Life Cycle. It is the phase in which individuals gather information, observe patterns, evaluate compatibility, and determine whether a deeper investment in the relationship is appropriate. Regardless of attraction, chemistry, or initial impressions, every new relationship begins with incomplete information.",
    fullyPopulated: true,
    sections: [
      {
        heading: "Purpose of This Phase",
        body: [
          "The purpose of Exploration is discernment. More specifically, the purpose of Exploration is to gather enough information to determine whether a deeper investment in the relationship is appropriate. Many individuals enter relationships without fully understanding the role this phase is intended to serve. As a result, they often expect Exploration to provide things it was never designed to provide. They seek certainty when the phase is designed for discovery. They seek commitment before compatibility has been established. They seek attachment before trust has been earned.",
          "The primary purpose of Exploration is compatibility assessment. Compatibility refers to the degree to which two individuals can realistically build and sustain a healthy relationship together. Many people confuse compatibility with attraction. Others confuse compatibility with chemistry. While attraction, chemistry, and common interests may contribute to connection, compatibility extends much further.",
        ],
      },
      {
        heading: "The Developmental Task",
        body: [
          "The developmental task of Exploration is discernment. Discernment is the ability to accurately perceive reality and make decisions based on what is true rather than what is hoped for, feared, assumed, or imagined. Stated differently, discernment is the process of seeing people as they are rather than as we wish them to be.",
          "This may sound simple, but it is one of the most difficult tasks in relationship development. Human beings are not objective observers. We bring our histories, insecurities, desires, expectations, and experiences into every interaction. The challenge of Exploration is learning how to separate observation from interpretation.",
        ],
      },
      {
        heading: "Healthy Development",
        body: [
          "Perhaps the simplest way to understand Exploration is to view it as a period of evidence gathering. Every interaction provides information. Every conversation provides information. The goal is not to interrogate another person or search for perfection. The goal is to collect enough evidence to determine whether compatibility exists.",
          "Many individuals make decisions based primarily on promises, intentions, or potential. Healthy Exploration places greater emphasis on demonstrated behavior. When words, actions, and patterns align, trust begins to develop. When they repeatedly conflict, caution becomes appropriate. One of the most important skills developed during Exploration is learning to pay attention not only to what people say, but also to what they consistently do.",
        ],
      },
      {
        heading: "Common Challenges",
        body: [
          "Human beings do not enter relationships as neutral observers. We enter with emotions, desires, fears, expectations, attachment patterns, and personal histories. As a result, Exploration is often influenced by factors that interfere with accurate assessment. These mistakes are rarely the result of ignorance or poor intentions. More often, they occur because individuals prioritize comfort over clarity, certainty over curiosity, or attachment over discernment.",
          "Perhaps the most common mistake during Exploration is assuming that strong chemistry indicates strong compatibility. Chemistry is often immediate. Compatibility is often revealed gradually. Two people can experience extraordinary chemistry while possessing fundamentally incompatible values, goals, lifestyles, or relational capacities. Exploration requires individuals to recognize that chemistry may justify curiosity, but it does not justify conclusions.",
        ],
      },
      {
        heading: "Readiness for the Next Phase",
        body: [
          "Readiness for Exclusivity is not determined by time. It is not determined by chemistry. It is not determined by pressure. It is not determined by fear. Readiness is determined by whether the developmental task of Exploration has been sufficiently completed. In other words: has enough information been gathered to justify deeper investment?",
          "This is the central question, because Exclusivity changes the nature of the relationship. The focus shifts from assessment to investment. As a result, the decision to enter Exclusivity should be intentional rather than automatic.",
        ],
      },
    ],
  },
  {
    slug: "exclusivity",
    number: 2,
    name: "Exclusivity",
    color: "plum",
    task: "Intentional Investment",
    cardDescription:
      "The phase of focused commitment — determining whether compatibility can withstand deeper emotional and relational investment.",
    intro:
      "If Exploration is the phase of discovery, Exclusivity is the phase of intentional investment. It is the phase in which two individuals intentionally shift from assessment to investment and begin exploring the potential of the relationship through focused relational commitment. It is the phase where two people stop asking whether a relationship should continue and begin discovering what happens when they actively participate in building it.",
    fullyPopulated: true,
    sections: [
      {
        heading: "Purpose of This Phase",
        body: [
          "The purpose of Exclusivity is to determine whether compatibility can withstand intentional investment. Many people assume that once compatibility has been established, the future of the relationship is largely determined. In reality, compatibility is only the beginning. Compatibility identifies potential. Exclusivity evaluates whether that potential can be developed into something sustainable.",
          "One of the most common misconceptions about relationships is the belief that compatibility guarantees success. It does not. Healthy relationships require more than compatibility. They require investment. A relationship can possess tremendous potential and still fail if neither person consistently invests in its growth.",
        ],
      },
      {
        heading: "The Developmental Task",
        body: [
          "The developmental task of Exclusivity is Intentional Investment — the deliberate allocation of time, energy, attention, effort, vulnerability, and relational resources toward the development of the relationship. In simple terms, it is the process of choosing to invest in the relationship on purpose.",
          "Relationships do not grow simply because people like one another. They do not grow because attraction exists. Relationships grow because people invest. Compatibility creates opportunity. Investment creates growth. For this reason, Exclusivity is not primarily a phase of assessment. It is a phase of participation.",
        ],
      },
      {
        heading: "Healthy Development",
        body: [
          "If investment is the developmental task of Exclusivity, trust is one of its most important outcomes. Trust serves as the foundation upon which emotional intimacy, vulnerability, commitment, and future integration are built. While trust often begins during Exploration, Exclusivity is where trust is tested, strengthened, and expanded.",
          "Trust is the belief that another person's future behavior is likely to be consistent with what they have demonstrated in the past. Blind trust ignores evidence. Healthy trust incorporates evidence. This distinction is important because trust is not an act of optimism. It is a response to experience.",
        ],
      },
      {
        heading: "Common Challenges",
        body: [
          "During Exploration, mistakes often involve discernment. Exclusivity introduces a different challenge. The relationship is no longer primarily about assessment — it is about investment. As a result, the mistakes of Exclusivity often occur when individuals either invest improperly, invest prematurely, invest unevenly, or fail to invest at all. Many relationships do not struggle due to a lack of compatibility. They struggle because compatibility is not supported by healthy relational behavior.",
          "Many people unconsciously view Exclusivity as an achievement rather than a developmental phase. In reality, Exclusivity is not the end of relationship development. It is the beginning of deeper relationship development. People who view Exclusivity as the destination often stop investing in the very relationship they worked so hard to establish. Healthy Exclusivity recognizes that commitment increases responsibility rather than eliminating it.",
        ],
      },
      {
        heading: "Readiness for the Next Phase",
        body: [
          "The question is no longer “Are we compatible?” Nor is it “Can we intentionally invest in one another?” The question becomes “Have we demonstrated enough relational strength to begin building a more integrated life together?”",
          "Readiness for Expansion is not determined by time. It is not determined by relationship status. It is not determined by social expectations. It is determined by what the relationship has demonstrated through intentional investment.",
        ],
      },
    ],
  },
  {
    slug: "expansion",
    number: 3,
    name: "Expansion",
    color: "sage-green",
    task: "Integration",
    cardDescription:
      "The phase of shared life building — integrating two lives into a functional, interdependent partnership.",
    intro:
      "If Exploration is the phase of discovery and Exclusivity is the phase of intentional investment, Expansion is the phase of integration. By the time a relationship reaches Expansion, compatibility has been assessed, trust has been developed, vulnerability has increased, attachment has deepened, and investment has been sustained. The relationship has demonstrated enough strength to justify deeper growth. Now a new question emerges: Can we build a life together?",
    fullyPopulated: false,
    sections: [
      { heading: "The Developmental Task", body: ["The developmental task of Expansion is Integration."] },
      { heading: "Purpose of This Phase", body: [COMING_SOON], comingSoon: true },
      { heading: "Healthy Development", body: [COMING_SOON], comingSoon: true },
      { heading: "Common Challenges", body: [COMING_SOON], comingSoon: true },
    ],
  },
  {
    slug: "expiration",
    number: 4,
    name: "Expiration",
    color: "slate-blue",
    task: "Acceptance",
    cardDescription:
      "The phase of honest reckoning — acknowledging relational realities and making informed decisions about the future.",
    intro:
      "Every relationship eventually reaches a point of transition. For some, that transition leads to deeper commitment. For others, it marks the end of the relationship's current form. This is the phase of Expiration. Most relationships do not end in a moment — they end through a process. Expiration is not simply about relationships ending; it is about individuals confronting the reality that a relationship's current form can no longer continue.",
    fullyPopulated: false,
    sections: [
      { heading: "The Developmental Task", body: ["The developmental task of Expiration is Acceptance."] },
      { heading: "Purpose of This Phase", body: [COMING_SOON], comingSoon: true },
      { heading: "Healthy Development", body: [COMING_SOON], comingSoon: true },
      { heading: "Common Challenges", body: [COMING_SOON], comingSoon: true },
    ],
  },
  {
    slug: "recovery",
    number: 5,
    name: "Recovery",
    color: "dusty-plum",
    task: "Healing",
    cardDescription:
      "The phase of restoration — processing loss and rebuilding emotional functioning after relational dissolution.",
    intro:
      "If Expiration is the phase of accepting that a relationship's current form is ending, Recovery is the phase of healing from that ending. It is the process through which individuals adapt, rebuild, integrate, and move forward following relational loss. Healthy recovery is about learning how to carry the experience without allowing the experience to carry you.",
    fullyPopulated: false,
    sections: [
      { heading: "The Developmental Task", body: ["The developmental task of Recovery is Healing."] },
      { heading: "Purpose of This Phase", body: [COMING_SOON], comingSoon: true },
      { heading: "Healthy Development", body: [COMING_SOON], comingSoon: true },
      { heading: "Common Challenges", body: [COMING_SOON], comingSoon: true },
    ],
  },
  {
    slug: "renewal",
    number: 6,
    name: "Renewal",
    color: "light-sage",
    task: "Reengagement",
    cardDescription:
      "The phase of re-emergence — developing a renewed sense of identity, purpose, and readiness for future connection.",
    intro:
      "By the time individuals reach Renewal, they have explored possibilities, made commitments, built partnerships, experienced endings, processed losses, and engaged in the work of healing. Yet Recovery is not the final destination. Healing was never meant to become a permanent residence — it was meant to prepare us for reengagement. Renewal is the phase in which individuals begin turning their attention toward life again.",
    fullyPopulated: false,
    sections: [
      { heading: "The Developmental Task", body: ["The developmental task of Renewal is Reengagement."] },
      { heading: "Purpose of This Phase", body: [COMING_SOON], comingSoon: true },
      { heading: "Healthy Development", body: [COMING_SOON], comingSoon: true },
      { heading: "Common Challenges", body: [COMING_SOON], comingSoon: true },
    ],
  },
];

export function getPhase(slug: string): FrameworkPhase | undefined {
  return PHASES.find((p) => p.slug === slug);
}

// --- Six Universal Domains (descriptions per Phase 4 spec) ------------------

export interface FrameworkDomain {
  name: string;
  description: string;
}

export const DOMAINS_CONTENT: FrameworkDomain[] = [
  { name: "Communication", description: "The primary mechanism through which partners exchange information, construct shared meaning, and navigate each developmental phase." },
  { name: "Trust", description: "The degree to which partners demonstrate reliability, honesty, accountability, and emotional safety over time." },
  { name: "Emotional Intimacy", description: "The depth of emotional connection, vulnerability, and mutual understanding between partners." },
  { name: "Conflict Management", description: "The ability to navigate disagreement constructively, repair relational ruptures, and use conflict as a source of growth." },
  { name: "Relational Functioning", description: "How well partners coordinate shared responsibilities, expectations, and roles within the relationship." },
  { name: "Physical Intimacy", description: "The presence, quality, and communication surrounding physical connection and affection." },
];

// --- Core principles (Framework page, per spec) -----------------------------

export interface Principle {
  title: string;
  body: string;
  color: ColorToken;
}

export const PRINCIPLES: Principle[] = [
  { title: "Relationships are developmental systems.", body: "They evolve through predictable phases, each with its own purpose and demands.", color: "coral-rose" },
  { title: "Every phase has a developmental task.", body: "Success isn't measured by whether the relationship continues — it's measured by whether the task of the current phase is completed.", color: "plum" },
  { title: "Developmental mismatch creates distress.", body: "Most relationship problems aren't caused by bad people. They're caused by expecting one phase to perform the work of another.", color: "sage-green" },
  { title: "The framework is a map, not a judgment.", body: "It doesn't determine where you should be — it helps you understand where you are.", color: "slate-blue" },
  { title: "All six phases serve a purpose.", body: "Even Expiration, Recovery, and Renewal are not failures. They are necessary parts of the developmental journey.", color: "dusty-plum" },
];

// --- Framework overview prose (verbatim, manual Ch.1) -----------------------

export const FRAMEWORK_OVERVIEW: string[] = [
  "Most people are taught how to start relationships. Few people are taught how relationships actually develop.",
  "We are given advice about attraction, dating, communication, conflict, marriage, and even breakups. Yet these conversations often happen in isolation, as though each relationship challenge exists independently from the larger journey.",
  "Relationships are dynamic systems. They evolve. They change. They grow, contract, adapt, and sometimes end. The needs of a relationship during its earliest stages are not the same as its needs ten years later. Likewise, the skills required after a divorce are different from those required during courtship.",
  "One of the greatest sources of relational distress occurs when individuals misunderstand where they are in the developmental process. The Relationship Life Cycle™ was created to address this gap — providing a map for where you are, why it matters, and what your relationship needs next.",
];
