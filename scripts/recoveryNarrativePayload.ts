// The authored Recovery narrative foundation, transcribed for import.
//
// THIS IS IMPORT TOOLING, NOT A RUNTIME CONTENT SOURCE. The public site never
// reads this file. It exists so the transcription of the framework author's
// document happens exactly once, and so the seeder and the tests cannot drift
// apart. At runtime the Knowledge Base tables are the only source; after seeding,
// scripts/verifyRecoveryNarrative.ts confirms the database still matches this
// payload.
//
// Data only. No side effects — importing this file must never write anything.

export const PHASE = "Recovery";
export const PROVENANCE = "Framework author, Recovery narrative foundation, 2026-08-06";

export const PHASE_NARRATIVE = {
  phase: PHASE,
  developmental_task: "Healing",
  primary_unit_of_analysis: "individual",

  // Naming decision, 2026-08-06. "Getting Back to Yourself" is a consumer
  // TRANSLATION of Recovery, not a replacement phase name. `phase` stays the
  // stored phase name, route identity, framework reference and mapping value.
  consumer_phase_name: "Getting Back to Yourself",
  public_descriptor: "Healing after relational loss",

  core_human_question:
    "How do I heal from what ended without allowing the loss to define who I am, how I live, or what I believe is possible next?",

  core_tension:
    "Recovery holds two truths at once: something meaningful ended or changed, and your life still has to continue. " +
    "The person is not simply trying to “get over” a relationship. They are learning how to carry what happened " +
    "without remaining emotionally, behaviorally, practically, or physically organized around it.",

  transformation_from: [
    "Being organized around the loss",
    "Needing the former partner to provide closure",
    "Distrusting personal judgment",
    "Reacting automatically to reminders and triggers",
    "Defining the self through the former relationship",
    "Living inside systems built for a relationship that no longer exists",
    "Feeling disconnected from bodily signals, boundaries, or intimate identity",
  ],
  transformation_toward: [
    "Integrating what happened without being consumed by it",
    "Trusting personal perception and judgment again",
    "Functioning without complete certainty",
    "Responding intentionally rather than reactively",
    "Reconstructing identity and agency",
    "Reorganizing daily life and support",
    "Restoring bodily ownership, safety, and self-definition",
  ],

  // Invariants. QC reads this directly — every consumer translation, script,
  // lesson, recommendation and personalized narrative must preserve them.
  governing_narrative_truths: [
    "Healing is not forgetting.",
    "Healing is not forgiveness.",
    "Healing is not reconciliation.",
    "Healing is not the absence of grief.",
    "Healing is not proven by dating again.",
    "Closure does not have to come from the former partner.",
    "Progress and pain can coexist.",
    "Recovery restores functioning; it does not return someone to who they were before.",
    "The individual is the primary unit of development.",
    "No competency requires unsafe contact, disclosure, confrontation, or reconciliation.",
  ],

  source_provenance: PROVENANCE,
  framework_status: "canonical",
  record_status: "draft",
};

export interface DomainSeed {
  domain: string;
  domain_storyline: string;
  emotional_experience: string;
  internal_questions: string[];
  /** Required. A storyline without a stated distortion is one QC cannot defend. */
  common_distorted_interpretation: string;
  competency_names_display: string[];
}

export const DOMAIN_NARRATIVES: DomainSeed[] = [
  {
    domain: "Communication",
    domain_storyline: "Finding words for what happened",
    emotional_experience:
      "Recovery often begins with experiences that feel too tangled, painful, contradictory, or private to explain.",
    internal_questions: [
      "Can I put words around my experience, understand the story I am carrying, ask for the support I need, and communicate the limits that protect my healing?",
    ],
    common_distorted_interpretation:
      "That this storyline means learning to communicate better with your ex. It does not. It is about putting words " +
      "around your own experience, understanding the story you are carrying, asking for support, and communicating the " +
      "limits that protect your healing.",
    competency_names_display: [
      "Emotional Articulation",
      "Narrative Integration",
      "Support-Seeking Communication",
      "Boundary Communication",
    ],
  },
  {
    domain: "Trust",
    domain_storyline: "Learning to trust yourself again",
    emotional_experience:
      "After relational loss, people often question what they saw, what they ignored, what they believed, and whether they can make good decisions in the future.",
    internal_questions: [
      "Can I take my perceptions seriously without believing every fear, use evidence without becoming hypervigilant, and make decisions without requiring guarantees?",
    ],
    common_distorted_interpretation:
      "Recovery requires either trusting yourself without question or distrusting others until they prove perfect safety. " +
      "Self-trust is not certainty, and wise caution is not permanent suspicion. Recovery involves taking one’s perceptions " +
      "seriously while remaining open to correction, evaluating relational evidence, extending trust in degrees, and " +
      "continuing to function when guarantees are unavailable.",
    competency_names_display: [
      "Self-Trust",
      "Trust Calibration",
      "Relational Discernment",
      "Uncertainty Navigation",
    ],
  },
  {
    domain: "Conflict Management",
    domain_storyline: "Stopping the relationship from continuing through conflict",
    emotional_experience:
      "A relationship may have ended structurally while continuing through arguments, retaliation, repeated explanations, checking, blame, guilt, or emotional activation.",
    internal_questions: [
      "Can I understand what activates me, take responsibility for what belongs to me, maintain necessary boundaries, and stop participating in conflict that keeps me tied to what ended?",
    ],
    common_distorted_interpretation:
      "Recovery means avoiding every conflict, cutting off every difficult person, or finally getting the other person to " +
      "admit what happened. Recovery does not require the final word. It involves recognizing activation, differentiating " +
      "responsibility accurately, maintaining protective boundaries, and ending participation in repetitive or harmful " +
      "conflict while continuing to handle necessary responsibilities.",
    competency_names_display: [
      "Trigger Navigation",
      "Responsibility Differentiation",
      "Boundary Maintenance",
      "Constructive Disengagement",
    ],
  },
  {
    domain: "Emotional Intimacy",
    domain_storyline: "Making room for what you feel",
    emotional_experience:
      "Recovery does not require someone to stop grieving, stop caring, or turn the relationship into something that meant nothing.",
    internal_questions: [
      "Can I experience and understand my emotions without suppressing them, becoming controlled by them, or punishing myself for having them?",
    ],
    common_distorted_interpretation:
      "That recovery requires someone to stop grieving, stop caring, or turn the relationship into something that meant " +
      "nothing. It does not. It involves experiencing and understanding emotions without suppressing them, becoming " +
      "controlled by them, or self-punishment for having them.",
    competency_names_display: [
      "Emotional Processing",
      "Emotional Regulation",
      "Grief Integration",
      "Self-Compassion",
    ],
  },
  {
    domain: "Role Functioning",
    domain_storyline: "Building a life that fits who you are now",
    emotional_experience:
      "The end of a relationship can disrupt identity, routines, responsibilities, finances, parenting, social connection, and one’s sense of direction.",
    internal_questions: [
      "Who am I now, what choices still belong to me, and what practical and relational systems will support the life I have now?",
    ],
    common_distorted_interpretation:
      "Recovery is proven by complete independence, constant productivity, or becoming an entirely different person. " +
      "Healing does not require doing everything alone or erasing the identity that existed during the relationship. " +
      "It involves reconstructing a coherent sense of self, exercising meaningful agency, reorganizing life around " +
      "present reality, and developing sustainable support.",
    competency_names_display: [
      "Identity Reconstruction",
      "Personal Agency",
      "Life Reorganization",
      "Support-System Development",
    ],
  },
  {
    domain: "Physical Intimacy",
    domain_storyline: "Returning to ownership of your body",
    emotional_experience:
      "Recovery can affect bodily safety, sleep, tension, desire, affection, touch, sexual identity, and confidence in physical boundaries.",
    internal_questions: [
      "Can I hear what my body is communicating, respond to it with care, protect my physical agency, and define intimacy for myself rather than through pressure, rejection, or relationship status?",
    ],
    common_distorted_interpretation:
      "Recovery is demonstrated by becoming physically or sexually available again, or by permanently avoiding affection, " +
      "touch, and intimacy. No particular level of physical or sexual participation proves healing. Recovery involves " +
      "noticing bodily information, regulating physiological activation, protecting physical agency, and defining intimacy " +
      "according to present values, needs, boundaries, and readiness.",
    competency_names_display: [
      "Embodied Self-Attunement",
      "Embodied Regulation",
      "Physical Boundary Agency",
      "Intimacy Self-Definition",
    ],
  },
];
