// Client-safe Professional Institute constants, types, and built-in defaults.
// NO server imports (admin client components import this). ContentField is a
// type-only import (erased at build) so no server code is pulled in.
import type { ContentField } from "@/lib/siteContent";

export type InstituteSectionKey =
  | "ce_courses"
  | "workshops"
  | "certifications"
  | "professional_resources"
  | "research"
  | "events";

export const INSTITUTE_SECTIONS: { key: InstituteSectionKey; label: string; path: string }[] = [
  { key: "ce_courses", label: "CE Courses", path: "/institute/ce-courses" },
  { key: "workshops", label: "Workshops", path: "/institute/workshops" },
  { key: "certifications", label: "Certifications", path: "/institute/certifications" },
  { key: "professional_resources", label: "Professional Resources", path: "/institute/professional-resources" },
  { key: "research", label: "Research", path: "/institute/research" },
  { key: "events", label: "Events", path: "/institute/events" },
];

export const OFFERING_STATUSES = ["draft", "in_development", "available"] as const;
export type OfferingStatus = (typeof OFFERING_STATUSES)[number];

export interface InstituteOffering {
  id?: string;
  section: InstituteSectionKey;
  title: string;
  description: string | null;
  status: OfferingStatus;
  cta_label?: string | null;
  cta_url?: string | null;
  sort_order?: number;
}

export function sectionLabel(key: string): string {
  return INSTITUTE_SECTIONS.find((s) => s.key === key)?.label ?? key;
}

// Built-in defaults shown when a section has no published offerings yet, so the
// public pages are never empty. Mirrors the launch content.
const d = (
  section: InstituteSectionKey,
  items: [string, string][]
): InstituteOffering[] =>
  items.map(([title, description]) => ({ section, title, description, status: "in_development" }));

export const DEFAULT_OFFERINGS: Record<InstituteSectionKey, InstituteOffering[]> = {
  ce_courses: d("ce_courses", [
    ["CE-accredited workshops", "Live and recorded workshops eligible for continuing education credit."],
    ["On-demand CE courses", "Self-paced courses you can complete on your own schedule, with certificates of completion."],
    ["Framework foundations", "A grounding in the Relationship Life Cycle™ model and its clinical relevance."],
    ["Applied practice modules", "Focused modules on applying the framework to specific presentations and populations."],
  ]),
  workshops: d("workshops", [
    ["Framework intensives", "Deep-dive sessions on the phases, domains, and developmental logic of the model."],
    ["Clinical application workshops", "How to translate the framework into assessment, treatment planning, and sessions."],
    ["Population-specific sessions", "Workshops focused on couples, families, faith communities, and workplace settings."],
    ["Cohort workshops", "Small-group live cohorts for practitioners who want guided implementation."],
  ]),
  certifications: d("certifications", [
    ["Framework Certification", "Core certification in the Relationship Life Cycle™ model and its application."],
    ["Clinical Implementation Certification", "For clinicians integrating the framework into assessment and treatment."],
    ["Assessment Certification", "Training and credentialing in administering and interpreting the assessments."],
    ["Facilitator Certification", "For those leading groups, courses, or workshops using the framework."],
  ]),
  professional_resources: d("professional_resources", [
    ["Implementation toolkits", "Step-by-step guides for integrating the framework into your practice."],
    ["Assessment instruments", "Professional versions of the Relationship Life Cycle™ assessments and scoring guides."],
    ["Client-facing materials", "Handouts, worksheets, and psychoeducational materials to use with clients."],
    ["Case consultation groups", "Ongoing peer consultation groups to support applied use of the framework."],
  ]),
  research: d("research", [
    ["Framework white papers", "Foundational papers detailing the developmental model and its constructs."],
    ["Applied research", "Studies on outcomes and application across clinical and educational settings."],
    ["Publications library", "A curated library of articles and references for professional readers."],
    ["Contribute to research", "Opportunities for practitioners to participate in ongoing research."],
  ]),
  events: d("events", [
    ["Annual conference", "A flagship gathering for professionals using the framework (future)."],
    ["Special events & summits", "Focused events on emerging topics and applications."],
    ["Guest lectures & panels", "Sessions with leaders across the helping professions."],
    ["Community networking", "Connect with a growing network of certified professionals."],
  ]),
};

// --- Editable section + landing copy (defaults; overridable via site_content) ---
export interface SectionCopy {
  eyebrow: string;
  title: string;
  intro: string;
  note: string;
}

export const SECTION_COPY: Record<InstituteSectionKey, SectionCopy> = {
  ce_courses: {
    eyebrow: "Continuing Education",
    title: "CE Courses",
    intro: "Continuing education for licensed professionals — workshops and on-demand courses grounded in the Relationship Life Cycle™ Framework, designed to count toward your professional development.",
    note: "CE accreditation details and credit hours will be published as each course is finalized.",
  },
  workshops: {
    eyebrow: "Live Training",
    title: "Professional Workshops",
    intro: "Live, interactive workshops where helping professionals learn to use the Relationship Life Cycle™ Framework in real practice — with room for questions, discussion, and case examples.",
    note: "Workshop dates and registration will open here as they are scheduled.",
  },
  certifications: {
    eyebrow: "Credentialing",
    title: "Certification Programs",
    intro: "Formal certification in the Relationship Life Cycle™ Framework for professionals who want to demonstrate proficiency and integrate the model deeply into their practice.",
    note: "Certification requirements, curricula, and pricing will be published as each program launches.",
  },
  professional_resources: {
    eyebrow: "Toolkits & Tools",
    title: "Professional Resources",
    intro: "Practical implementation resources that help professionals put the Relationship Life Cycle™ Framework to work — toolkits, assessment instruments, and ready-to-use materials.",
    note: "Resources and case consultation groups will be made available to enrolled and certified professionals.",
  },
  research: {
    eyebrow: "Scholarship",
    title: "Research & Publications",
    intro: "The scholarly foundation of the Relationship Life Cycle™ Framework — research, white papers, and publications that inform professional practice and advance the model.",
    note: "Publications and research participation opportunities will be posted here as they become available.",
  },
  events: {
    eyebrow: "Community & Gatherings",
    title: "Conferences & Events",
    intro: "Opportunities to gather, learn, and connect with the professional community around the Relationship Life Cycle™ Framework — conferences, summits, and special events.",
    note: "Events are planned for a future phase of the Institute. Register your interest to be notified first.",
  },
};

export const LANDING_COPY = {
  eyebrow: "The Professional Education Division",
  headline: "Train in the Relationship Life Cycle™ Framework",
  subhead:
    "The Professional Institute equips therapists, coaches, educators, clergy, and other helping professionals to apply the Relationship Life Cycle™ Framework in their work — through professional training, certification, and implementation resources.",
};

// Admin field manifests (ContentEditor + site_content, draft/publish aware).
export function sectionCopyFields(section: InstituteSectionKey): ContentField[] {
  const c = SECTION_COPY[section];
  return [
    { key: `institute.${section}.eyebrow`, label: "Eyebrow", type: "text", default: c.eyebrow },
    { key: `institute.${section}.title`, label: "Title", type: "text", default: c.title },
    { key: `institute.${section}.intro`, label: "Intro", type: "textarea", default: c.intro },
    { key: `institute.${section}.note`, label: "Footnote", type: "textarea", default: c.note },
  ];
}

export const INSTITUTE_LANDING_FIELDS: ContentField[] = [
  { key: "institute.landing.eyebrow", label: "Hero eyebrow", type: "text", default: LANDING_COPY.eyebrow },
  { key: "institute.landing.headline", label: "Hero headline", type: "textarea", default: LANDING_COPY.headline },
  { key: "institute.landing.subhead", label: "Hero subhead", type: "textarea", default: LANDING_COPY.subhead },
];
