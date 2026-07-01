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
  task: string; // developmental task (framework language)
  primaryFocus: string; // plain-language focus (consumer-facing)
  cardDescription: string; // one-sentence (consumer-facing)
  intro: string; // hero paragraph (manual)
  sections: PhaseSection[];
  fullyPopulated: boolean;
}

export const PHASES: FrameworkPhase[] = [
  {
    slug: "exploration",
    number: 1,
    name: "Exploration",
    color: "coral-rose",
    task: "Discernment",
    primaryFocus: "Getting to know each other",
    cardDescription:
      "The phase of discovery — learning who someone is before deciding to invest further.",
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
    primaryFocus: "Choosing each other intentionally",
    cardDescription:
      "The phase of commitment — building on attraction with trust, compatibility, and growing emotional investment.",
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
    primaryFocus: "Building a shared life",
    cardDescription:
      "The phase of integration — two lives becoming one, with all the complexity that brings.",
    intro:
      "If Exploration is the phase of discovery and Exclusivity is the phase of intentional investment, Expansion is the phase of integration. By the time a relationship reaches Expansion, compatibility has been assessed, trust has been developed, vulnerability has increased, attachment has deepened, and investment has been sustained. The relationship has demonstrated enough strength to justify deeper growth. Now a new question emerges: Can we build a life together?",
    fullyPopulated: true,
    sections: [
      {
        heading: "Purpose of This Phase",
        body: [
          `The purpose of Expansion is to determine whether a relationship can successfully function as a partnership. A relationship may thrive during dates, conversations, vacations, and romantic experiences. Expansion answers a different question: Can this relationship thrive within the practical demands of life itself?`,
          `Exploration asks, “Are we compatible?” Exclusivity asks, “Can we intentionally invest in one another?” Expansion asks, “Can we successfully build and sustain a life together?” Because healthy relationships require more than love. They require partnership.`,
        ],
      },
      {
        heading: "The Developmental Task",
        body: [
          `The developmental task of Expansion is Integration — the process of combining two individual lives in ways that increase connection, cooperation, and interdependence while preserving the identity and autonomy of each person. Many people assume relationships naturally become partnerships over time. They do not. Partnership is developed through integration.`,
          `Healthy integration creates partnership without creating fusion. The relationship develops a stronger sense of “we” while preserving a healthy sense of “me.” Too little integration often creates emotional distance; too much creates enmeshment. Healthy Expansion requires interdependence — a state in which two people remain individually healthy while functioning effectively as a team.`,
        ],
      },
      {
        heading: "Healthy Development",
        body: [
          `Healthy Expansion is characterized by increasing partnership, balanced integration, shared responsibility, collaborative decision-making, adaptability, and a growing sense of shared purpose. The strongest indicator is not the achievement of specific milestones — it is the development of a partnership that becomes more resilient, more collaborative, and more effective as life becomes increasingly interconnected.`,
          `Summarized in a single statement: life becomes more integrated without the relationship becoming more fragile. As responsibilities increase and integration deepens, the partnership becomes stronger rather than weaker.`,
        ],
      },
      {
        heading: "Common Challenges",
        body: [
          `Not all difficulties during Expansion are caused by incompatibility. Many are caused by mistakes in how integration occurs — often because couples assume that commitment automatically produces partnership. In reality, partnership requires intentional development: communication, adaptation, collaboration, and shared responsibility.`,
          `Perhaps the greatest challenge of Expansion is maintaining the relationship while simultaneously building a life. Many couples become so focused on responsibilities that they neglect connection. Tasks get completed and bills get paid, yet emotional intimacy begins eroding. Building a life should strengthen connection, not replace it.`,
        ],
      },
      {
        heading: "Readiness for the Next Phase",
        body: [
          `By the end of Expansion, the relationship has undergone significant transformation. The question becomes whether it has developed the capacity to sustain itself over time — to maintain connection, trust, partnership, adaptability, and shared purpose despite the challenges of everyday life. Lasting relationships are not defined by the absence of challenges. They are defined by the ability to grow through them together.`,
        ],
      },
    ],
  },
  {
    slug: "expiration",
    number: 4,
    name: "Expiration",
    color: "slate-blue",
    task: "Acceptance",
    primaryFocus: "Facing hard truths",
    cardDescription:
      "The phase of honest reckoning — when a relationship reaches a crossroads and decisions must be made.",
    intro:
      "Every relationship eventually reaches a point of transition. For some, that transition leads to deeper commitment. For others, it marks the end of the relationship's current form. This is the phase of Expiration. Most relationships do not end in a moment — they end through a process. Expiration is not simply about relationships ending; it is about individuals confronting the reality that a relationship's current form can no longer continue.",
    fullyPopulated: true,
    sections: [
      {
        heading: "Purpose of This Phase",
        body: [
          `The purpose of Expiration is not to end relationships. Its purpose is to help individuals recognize, accept, and navigate relational endings in a psychologically healthy way. Rather than asking, “How do I prevent this relationship from ending?” Expiration asks, “How do I respond wisely when this relationship's current form is changing or ending?”`,
          `Beneath every purpose of this phase lies a single unifying objective: Expiration exists to help individuals align themselves with reality. Human beings cannot always control the changes relationships bring. What they can control is how they respond.`,
        ],
      },
      {
        heading: "The Developmental Task",
        body: [
          `The developmental task of Expiration is Acceptance — the ability to acknowledge reality as it exists, even when that reality is painful, unexpected, or different from what we hoped. It may appear passive, but it is one of the most psychologically demanding tasks in the entire Relationship Life Cycle. Acceptance requires relinquishing the relationship we imagined in order to engage the relationship that actually exists.`,
          `A common misconception is that acceptance means agreeing with what happened. It does not. Acceptance does not mean believing the ending was fair or feeling emotionally ready. It simply means acknowledging that something is true. It is not agreement. It is acknowledgment.`,
        ],
      },
      {
        heading: "Healthy Development",
        body: [
          `Because Expiration centers on loss, many people assume there is no such thing as a healthy ending. This is not true. Healthy Expiration is not defined by the absence of pain — it is defined by the presence of healthy development. People can experience profound grief while navigating Expiration in a psychologically healthy way.`,
          `Signs of healthy Expiration include acknowledging reality, growing acceptance, experiencing grief rather than avoiding it, tolerating ambiguity, reorganizing identity, and establishing healthy boundaries. It is not measured by how quickly someone moves on, but by how honestly they engage reality.`,
        ],
      },
      {
        heading: "Common Challenges",
        body: [
          `The mistakes people make during Expiration are rarely driven by a lack of love. More often, they are driven by fear — of loss, regret, loneliness, uncertainty, and beginning again. As a result, people often respond to changing realities by trying to delay, deny, or negotiate them.`,
          `Most mistakes share a common theme: they represent attempts to avoid pain rather than engage reality. People cling to potential because reality hurts; they avoid grief because grief hurts. These responses are deeply human — but resisting reality often prolongs the very suffering people are trying to avoid.`,
        ],
      },
      {
        heading: "Readiness for the Next Phase",
        body: [
          `The movement toward what comes next begins when an individual's internal reality starts aligning with external reality. Earlier in Expiration, people often know what is happening intellectually while struggling to accept it emotionally. Over time, the individual gradually shifts from asking, “How do I stop this from happening?” to “How do I move through what is happening?”`,
        ],
      },
    ],
  },
  {
    slug: "recovery",
    number: 5,
    name: "Recovery",
    color: "dusty-plum",
    task: "Healing",
    primaryFocus: "Healing after loss",
    cardDescription:
      "The phase of restoration — processing the end of a relationship and rebuilding emotional wellbeing.",
    intro:
      "If Expiration is the phase of accepting that a relationship's current form is ending, Recovery is the phase of healing from that ending. It is the process through which individuals adapt, rebuild, integrate, and move forward following relational loss. Healthy recovery is about learning how to carry the experience without allowing the experience to carry you.",
    fullyPopulated: true,
    sections: [
      {
        heading: "Purpose of This Phase",
        body: [
          `The purpose of Recovery is to help individuals heal, adapt, integrate their experiences, and rebuild life after relational loss. Many people assume recovery is about getting over the relationship and returning to who they were before. Within this framework, Recovery has a deeper purpose: it is not about returning to the person you were before the relationship — it is about becoming the person you are after it.`,
          `Expiration asks individuals to accept reality. Recovery helps them learn how to live within that reality. Because while endings change our lives, they do not end our lives.`,
        ],
      },
      {
        heading: "The Developmental Task",
        body: [
          `The developmental task of Recovery is Healing — the process of restoring emotional, psychological, relational, and personal well-being following relational loss. Healing is often far more complex than simply feeling better, because relationships do not only leave memories. They leave impact.`,
          `One of the greatest misconceptions is the belief that healing means no longer hurting. Pain and healing frequently coexist. A person can be healing while still grieving. The question is not, “Does this still hurt?” The question is, “Am I learning how to carry the hurt differently?”`,
        ],
      },
      {
        heading: "Healthy Development",
        body: [
          `Healthy recovery is not defined by the absence of pain. It is defined by the presence of adaptation, growth, integration, and increasing engagement with life. Recovery tends to unfold gradually, often through small shifts rather than dramatic breakthroughs.`,
          `It is characterized by increasing acceptance, emotional regulation, self-trust, identity clarity, meaning-making, hope, and future orientation. The relationship remains part of the story. The loss remains part of the story. But neither remains the entire story. Healing is not the removal of the wound — it is the restoration of the person carrying it.`,
        ],
      },
      {
        heading: "Common Challenges",
        body: [
          `Recovery is often portrayed as a straightforward journey. In reality, individuals are often rebuilding multiple aspects of their lives simultaneously while grieving what has been lost. Many enter Recovery believing they are grieving a single loss when they are grieving several at once — the relationship, the future, the identity, the attachment, the security. This often explains why recovery feels heavier than expected.`,
          `Most mistakes stem from one common issue: attempting to escape the work of healing. People try to avoid grief, uncertainty, discomfort, reflection, and vulnerability. Yet healing often requires moving toward difficult experiences rather than away from them. The work cannot be skipped. It can only be postponed.`,
        ],
      },
      {
        heading: "Readiness for the Next Phase",
        body: [
          `One of the most common mistakes is assuming that the end of Recovery automatically means readiness for Renewal. Readiness for Renewal is the point at which healing has progressed enough that a person can engage the future without being primarily driven by unresolved wounds from the past. The question is no longer, “Am I hurting?” but “Am I prepared to move forward in a healthy way?”`,
        ],
      },
    ],
  },
  {
    slug: "renewal",
    number: 6,
    name: "Renewal",
    color: "light-sage",
    task: "Reengagement",
    primaryFocus: "Starting again",
    cardDescription:
      "The phase of re-emergence — stepping back into connection with greater clarity and self-awareness.",
    intro:
      "By the time individuals reach Renewal, they have explored possibilities, made commitments, built partnerships, experienced endings, processed losses, and engaged in the work of healing. Yet Recovery is not the final destination. Healing was never meant to become a permanent residence — it was meant to prepare us for reengagement. Renewal is the phase in which individuals begin turning their attention toward life again.",
    fullyPopulated: true,
    sections: [
      {
        heading: "Purpose of This Phase",
        body: [
          `The purpose of Renewal is to help individuals reengage with life, apply what they have learned, and intentionally move toward future possibilities. At its core, Renewal is about participation — not survival, not healing, participation. While Recovery helps people restore themselves, Renewal helps them express themselves. Healing creates capacity. Renewal creates momentum.`,
          `Recovery asks, “How do I heal?” Renewal asks, “How do I live?” Because healing is not the final destination of relational development. Living is.`,
        ],
      },
      {
        heading: "The Developmental Task",
        body: [
          `The developmental task of Renewal is Reengagement — the process of intentionally participating in life again after healing from relational loss. It is the work of reopening oneself to possibility, connection, purpose, growth, and future experiences. Healing prepares the individual for life. Reengagement invites the individual back into life.`,
          `Many individuals successfully process grief and rebuild identity, yet remain hesitant to fully engage life again. They become comfortable healing but uncomfortable living. Life, relationships, and hope all require vulnerability. Renewal asks individuals to move beyond protection and toward participation.`,
        ],
      },
      {
        heading: "Healthy Development",
        body: [
          `Healthy Renewal is not found in the absence of pain, nor in the presence of a new relationship. It is reflected in how individuals engage themselves, others, and the future — visible through increasing openness, confidence, purpose, flexibility, and participation.`,
          `One of the clearest signs is a shift in attention. The individual becomes increasingly interested in what is possible, what is next, and where they are going. The past remains important; it simply stops occupying the center of their life. Hope becomes believable again, and that belief fuels engagement.`,
        ],
      },
      {
        heading: "Common Challenges",
        body: [
          `Renewal is often portrayed as the easy part of the journey. In reality, participation requires vulnerability, possibility requires uncertainty, and hope requires courage. The very things that make Renewal meaningful are also the things that make it challenging. The individual is no longer struggling primarily with the past — they are learning how to navigate the future.`,
          `These challenges often revolve around a single question: “Am I willing to engage life despite uncertainty?” The future cannot be guaranteed. Relationships cannot be guaranteed. Yet meaningful living requires participation anyway. Renewal is ultimately the practice of choosing engagement over avoidance.`,
        ],
      },
      {
        heading: "The Cycle Continues",
        body: [
          `Relational development never truly ends. As long as people continue forming connections, they will continue encountering developmental tasks — discernment, intentional investment, integration, acceptance, healing, and reengagement. Relationships are cyclical, not linear.`,
          `The goal is not avoiding future cycles. The goal is moving through them with increasing wisdom and awareness. Relationships are not a straight road with a final destination — they are an ongoing journey of growth, change, loss, healing, and renewal. And every cycle offers another opportunity to become.`,
        ],
      },
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
  { title: "Relationships develop over time.", body: "Every relationship moves through recognizable phases, each with its own purpose, focus, and opportunities for growth.", color: "coral-rose" },
  { title: "Every phase has a primary focus.", body: "The work of one phase is not the same as the work of another. Understanding the difference is where growth begins.", color: "plum" },
  { title: "Context changes everything.", body: "Good advice applied at the wrong stage can create more confusion than clarity. The framework helps you apply the right tools at the right time.", color: "sage-green" },
  { title: "The framework is a map, not a judgment.", body: "It doesn't tell you where you should be — it helps you understand where you are.", color: "slate-blue" },
  { title: "Every phase serves a purpose.", body: "Even the hardest phases — expiration, recovery, renewal — are not failures. They are part of the developmental journey.", color: "dusty-plum" },
];

// --- Framework overview prose (verbatim, manual Ch.1) -----------------------

export const FRAMEWORK_OVERVIEW: string[] = [
  "Most people are taught how to start relationships. Few people are taught how relationships actually develop.",
  "We are given advice about attraction, dating, communication, conflict, marriage, and even breakups. Yet these conversations often happen in isolation, as though each relationship challenge exists independently from the larger journey.",
  "Relationships are dynamic systems. They evolve. They change. They grow, contract, adapt, and sometimes end. The needs of a relationship during its earliest stages are not the same as its needs ten years later. Likewise, the skills required after a divorce are different from those required during courtship.",
  "One of the greatest sources of relational distress occurs when individuals misunderstand where they are in the developmental process. The Relationship Life Cycle™ was created to address this gap — providing a map for where you are, why it matters, and what your relationship needs next.",
];
