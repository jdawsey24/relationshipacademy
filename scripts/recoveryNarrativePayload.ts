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

  // -------------------------------------------------------------------------
  // GOVERNANCE FIELDS — DERIVED, NOT TRANSCRIBED.
  //
  // Recovery's source document did not supply these six. They are derived from
  // Recovery's OWN authored canon (its governing truths, transformation pairs
  // and six distortion corrections) using the structure the author later
  // established for Renewal, so that the two phases are governed the same way.
  //
  // Provenance is marked per field. Anything not traceable to Recovery's own
  // text is labelled PROPOSED and needs the author's clinical judgement, not
  // merely their assent. record_status stays 'draft' and no public-use approval
  // is recorded, so none of this authorises publication on its own.
  // -------------------------------------------------------------------------

  // DERIVED from governing truths 1-6, 8 and 10, and from the six distortion
  // corrections. Each entry restates a prohibition Recovery already makes.
  prohibited_reductions: [
    "Forgetting what happened",
    "Forgiving the former partner",
    "Reconciliation",
    "The absence of grief",
    "Dating again",
    "Getting closure from the former partner",
    "Returning to who you were before",
    "Certainty about your own judgement",
    "Permanent suspicion of everyone",
    "Never having conflict again",
    "Getting the other person to admit what happened",
    "Complete independence",
    "Constant productivity",
    "Becoming an entirely different person",
    "Sexual or physical availability",
    "Permanently avoiding affection and touch",
    "Communicating better with your ex",
    "No longer caring about the relationship",
  ],

  // DERIVED from the consumer title, public descriptor, transformation-toward
  // list, the six storylines and their healthy-movement statements.
  approved_language: [
    "Getting back to yourself",
    "Healing after relational loss",
    "Carrying what happened without being consumed by it",
    "Trusting your own perception again",
    "Functioning without complete certainty",
    "Responding instead of reacting",
    "Reconstructing identity and agency",
    "Reorganising daily life and support",
    "Restoring ownership of your own body",
    "Finding words for what happened",
    "Learning to trust yourself again",
    "Stopping the relationship from continuing through conflict",
    "Making room for what you feel",
    "Building a life that fits who you are now",
    "Returning to ownership of your body",
    "Progress and pain can coexist",
    "Closure does not have to come from the former partner",
    "Healing restores functioning; it does not return you to who you were before",
  ],

  // PROPOSED. Recovery's document did not state a reading level. Set to match
  // Renewal so the two phases read consistently; the distinctions listed are
  // Recovery's own, taken from its governing truths and storylines.
  reading_level:
    "Approximately sixth-grade. Plain, direct, emotionally accurate and nonclinical, while preserving the " +
    "distinction between: healing and forgetting; healing and forgiveness; healing and reconciliation; " +
    "grief and dysfunction; self-trust and certainty; caution and permanent suspicion; boundaries and " +
    "punishment; disengagement and avoidance; affection and sexual readiness.",

  // DERIVED from governing truth 10 ("No competency requires unsafe contact,
  // disclosure, confrontation, or reconciliation") and from the prohibitions
  // implied by truths 1-6. The final escalation clause is PROPOSED, mirroring
  // Renewal's, and is the item most in need of clinical review.
  safety_boundaries: [
    "Recovery must never be used to pressure an individual to contact, respond to, or remain reachable by a former partner",
    "Recovery must never be used to pressure an individual to forgive anyone",
    "Recovery must never be used to pressure an individual to reconcile",
    "Recovery must never be used to pressure an individual to seek closure from the person who caused the harm",
    "Recovery must never be used to pressure an individual to disclose what happened before they choose to",
    "Recovery must never be used to pressure an individual to confront anyone",
    "Recovery must never be used to pressure an individual to stop grieving, or to grieve on any schedule",
    "Recovery must never be used to pressure an individual to date, or to treat dating as evidence of healing",
    "Recovery must never be used to pressure an individual to resume affection, touch, or sexual activity",
    "Recovery must never be used to pressure an individual to relinquish a boundary that remains protective",
    "Recovery must never be used to pressure an individual to interpret ongoing pain as failure to heal",
    "Recovery must never be used to pressure an individual to manage alone, or to treat needing support as a setback",
    "Where abuse, coercion, stalking, exploitation, immediate danger, severe impairment, or significant clinical symptoms are present, safety planning, legal support, medical care, or clinical treatment may take priority over ordinary Recovery practices.",
  ],

  // DERIVED in structure from Renewal's boundary; the permissions and
  // prohibitions are Recovery's own material. PROPOSED as a whole.
  public_or_clinical_boundary:
    "Public-facing Recovery education may explain the developmental movement from Expiration to Healing; help " +
    "individuals recognise being organised around a loss; teach communication, self-trust, disengagement, " +
    "emotional processing, identity and bodily-agency concepts; offer guided self-reflection and low-risk " +
    "practices; normalise nonlinear grief; and reinforce that closure need not come from the former partner. " +
    "Public-facing content must not diagnose trauma, attachment disorders, personality disorders, complicated " +
    "grief, or other clinical conditions; assess whether a specific person or relationship was abusive; " +
    "recommend contact, confrontation, disclosure, reconciliation, or forgiveness; provide safety planning in " +
    "place of individualised assessment; replace individualised clinical, legal, medical, or safety " +
    "assessment; present ordinary grief as pathology; treat continued pain as evidence that healing has " +
    "failed; or treat one behavioural marker as proof that Recovery has or has not occurred.",
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
