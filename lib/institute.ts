// Client-safe Professional Institute constants, types, and built-in defaults.
// NO server imports (admin client components import this).

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
