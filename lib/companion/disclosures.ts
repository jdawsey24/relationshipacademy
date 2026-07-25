// Versioned Companion disclosure content (client + server importable — no I/O).
// The version is tied to the disclosure's effective date; bump it when the text
// changes and every user is re-prompted to accept the new version.
//
// This mirrors the Relationship Companion "Informed Use & Safety Disclosure"
// (legal-inbound/). It is PENDING legal approval — the acceptance gate is inert
// until the Companion is enabled. Keep this text in sync with the approved
// document and bump DISCLOSURE_VERSION whenever it materially changes.

export const DISCLOSURE_KEY = "companion_informed_use";
export const DISCLOSURE_VERSION = "2026-07-25";
export const DISCLOSURE_TITLE = "Relationship Companion — Informed Use & Safety Disclosure";
export const ACCEPT_LABEL = "I have read and understand the Relationship Companion Informed Use & Safety Disclosure.";
export const ACCEPT_EVENT = "i_understand_continue";

// Prominent "Before you begin" summary — the material points, shown at the top.
export const DISCLOSURE_SUMMARY =
  "The Relationship Companion is an educational tool, not therapy or emergency care. No one is monitoring your responses in real time. Automated safety features may provide resources when certain language is detected, but they cannot determine whether you are safe.";

// A block is a paragraph (string) or a bullet list (string[]).
export type Block = string | string[];
export interface Section { heading: string; blocks: Block[] }

export const DISCLOSURE_INTRO =
  "The Relationship Companion is designed to help you reflect on your relationships, recognize patterns, and apply relationship education to your real-life experiences. Because you may choose to share personal or sensitive information while using the Companion, we want you to understand what this tool can and cannot do before you begin. Please read this disclosure carefully.";

export const DISCLOSURE_SECTIONS: Section[] = [
  { heading: "1. The Relationship Companion Is an Educational Wellness Tool", blocks: [
    "The Relationship Companion is part of the Relationship Life Cycle™ educational ecosystem. It provides relationship education, guided reflection, structured exercises, and personalized educational experiences based on the information you choose to provide.",
    "The Relationship Companion is not psychotherapy, counseling, medical care, legal advice, crisis intervention, or emergency services.",
    "Using the Relationship Companion does not create a therapist-client, physician-patient, attorney-client, or other professional treatment relationship with Symmetricly, its owners, clinicians, employees, contractors, or affiliates.",
    "Even if content within the Companion was developed or reviewed by licensed professionals, your use of the Companion is educational and does not constitute individual clinical care.",
  ] },
  { heading: "2. The Companion Does Not Replace Professional Care", blocks: [
    "The Relationship Companion may help you think more intentionally about your relationships, but it cannot evaluate your complete circumstances or determine what decisions are best for you.",
    "Information provided by the Companion should not be used as a substitute for individualized care from an appropriately qualified professional.",
    "If you need psychotherapy, medical treatment, legal advice, crisis intervention, or another professional service, you should seek assistance from an appropriate professional.",
  ] },
  { heading: "3. The Companion Is Not Monitored in Real Time", blocks: [
    "No person is continuously monitoring what you type into the Relationship Companion.",
    "Do not use the Companion as a way to request emergency assistance or assume that someone from Symmetricly will see a disclosure and contact you.",
    "The Companion cannot dispatch emergency services, conduct a real-time safety assessment, physically intervene, or guarantee that someone will respond to information you enter.",
    "If you believe you or another person may be in immediate danger, seek appropriate emergency or crisis assistance when you can do so safely.",
  ] },
  { heading: "4. Automated Safety Detection", blocks: [
    "The Relationship Companion includes automated safety features designed to recognize certain language that may indicate concerns such as:",
    ["thoughts of suicide or self-harm;", "violence, threats, intimidation, or coercive control involving a partner;", "sexual assault or sexual coercion;", "thoughts or statements about seriously harming another person; or", "circumstances suggesting possible immediate danger."],
    "When certain language is detected, the Companion may pause or modify the normal experience and display safety information or support resources.",
    "These features are intended to provide an additional layer of support. They are not a professional safety assessment.",
  ] },
  { heading: "5. Automated Safety Detection Has Limitations", blocks: [
    "Automated systems can make mistakes. The Relationship Companion may:",
    ["fail to recognize language indicating a safety concern;", "interpret harmless or hypothetical language as concerning;", "misunderstand context, humor, slang, figurative language, or indirect statements;", "incorrectly interpret who or what a statement refers to; or", "provide a safety message when one is not needed."],
    "The absence of a safety message does not mean that the Companion has determined that you are safe.",
    "Likewise, receiving a safety message does not constitute a diagnosis or definitive determination about you, another person, or your relationship.",
    "You should use your own judgment and seek appropriate human assistance whenever you believe you may need support.",
  ] },
  { heading: "6. Safety Resources", blocks: [
    "When the Companion detects certain safety-related language, it may provide contact information for crisis, domestic violence, sexual assault, emergency, or other support resources.",
    "You decide whether to contact these resources.",
    "Unless clearly stated otherwise, Symmetricly does not operate these third-party services and cannot guarantee their availability, response times, services, confidentiality practices, or outcomes.",
    "Resources may vary depending on your location. Resources displayed for one country or jurisdiction may not be appropriate in another.",
  ] },
  { heading: "7. Relationship Violence and Sexual Safety", blocks: [
    "Relationship difficulties and abuse are not the same thing.",
    "The Relationship Life Cycle™ Framework is designed to help people understand relationship development and functioning. It is not intended to explain away, normalize, or minimize violence, coercion, threats, sexual assault, or other serious safety concerns as ordinary relationship-development problems.",
    "When the Companion detects certain safety-related language, safety information may take precedence over ordinary Relationship Life Cycle™ guidance.",
    "The Companion cannot determine whether a relationship is abusive or whether remaining in or leaving a relationship is the safest decision for you.",
  ] },
  { heading: "8. Privacy and Device Safety", blocks: [
    "Some people may use the Relationship Companion while another person has access to or monitors their phone, computer, browser, accounts, or internet activity.",
    "If privacy is a concern, consider whether the device you are using is appropriate for entering sensitive information.",
    "For certain safety-related experiences, the Companion may provide a Quick Exit feature designed to help you leave the sensitive screen quickly.",
    "Quick Exit does not erase your browser history, device history, network activity, account activity, or other evidence that you visited the website.",
    "Someone with access to your device or accounts may still be able to discover your activity.",
    "The Companion will not automatically call, text, email, or notify another person simply because a safety-related statement is detected.",
  ] },
  { heading: "9. Information You Choose to Share", blocks: [
    "The usefulness of the Relationship Companion may depend in part on the information you choose to provide.",
    "You are not required to disclose information that you do not want to enter into the Companion.",
    "Because relationship experiences can involve highly personal information, consider what you are comfortable recording digitally before entering details about yourself or another person.",
    "Information you submit is handled according to the applicable Symmetricly Privacy Policy and any additional privacy disclosures presented with the Relationship Companion.",
  ] },
  { heading: "10. Educational Interpretations Are Not Diagnoses", blocks: [
    "The Relationship Companion may provide educational prompts, reflections, guided experiences, or other educational observations based on the Relationship Life Cycle™ Framework and the information you choose to provide.",
    "These interpretations are not mental-health diagnoses, medical diagnoses, predictions of relationship success or failure, determinations of abuse, legal conclusions, or professional evaluations.",
    "Human relationships are complex. No automated tool can fully understand a relationship from the information entered into a digital experience.",
  ] },
  { heading: "11. You Remain in Control of Your Decisions", blocks: [
    "The Relationship Companion is intended to support reflection and learning, not make major life decisions for you.",
    "You remain responsible for decisions concerning your relationships, health, safety, finances, family, legal matters, and other aspects of your life.",
    "When circumstances involve significant risk, uncertainty, or potential harm, consider obtaining individualized assistance from an appropriately qualified professional or support service.",
  ] },
  { heading: "12. Your Acknowledgment", blocks: [
    "By continuing to the Relationship Companion, you acknowledge that:",
    [
      "you understand that the Companion is an educational relationship-wellness tool and not therapy or professional treatment;",
      "you understand that no person is continuously monitoring your responses;",
      "you understand that the Companion is not an emergency or crisis-response service;",
      "you understand that automated safety detection can miss concerns or generate incorrect alerts;",
      "you understand that receiving or not receiving a safety message is not a professional safety assessment;",
      "you understand that Quick Exit does not erase browsing or device activity;",
      "you understand that third-party support resources are separate from Symmetricly;",
      "you understand that information you enter will be handled according to the applicable Privacy Policy; and",
      "you agree to use the Relationship Companion subject to these disclosures and the applicable Terms of Use and Privacy Policy.",
    ],
  ] },
];
