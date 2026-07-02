import { getSupabaseAdminClient } from "@/lib/supabase";
import { PHASES, DOMAINS_CONTENT, type FrameworkPhase, type FrameworkDomain } from "@/lib/frameworkContent";

// Editable-content system. Public pages render `get(map, key, default)` so they
// always work — DB overrides win, otherwise the built-in default shows.

export interface ContentField {
  key: string;
  label: string;
  type: "text" | "textarea" | "toggle";
  default: string;
}

// --- Announcement banner (global) ------------------------------------------
export const ANNOUNCEMENT_FIELDS: ContentField[] = [
  { key: "announcement.enabled", label: "Show banner", type: "toggle", default: "false" },
  { key: "announcement.text", label: "Banner text", type: "text", default: "" },
  { key: "announcement.link", label: "Link URL (optional)", type: "text", default: "" },
];

// --- Per-page editable copy (extend page by page) --------------------------
export const HOME_FIELDS: ContentField[] = [
  { key: "home.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "The Relationship Life Cycle™" },
  { key: "home.hero.headline", label: "Hero headline", type: "text", default: "Every relationship has a season." },
  { key: "home.hero.subhead", label: "Hero subhead", type: "textarea", default: "Every relationship has different needs at different points in its journey. The first step is understanding where you are." },
];

export const FRAMEWORK_FIELDS: ContentField[] = [
  { key: "framework.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "The Relationship Life Cycle™ Framework" },
  { key: "framework.hero.headline", label: "Hero headline", type: "text", default: "Relationships have seasons. This is the map." },
  { key: "framework.hero.subhead", label: "Hero subhead", type: "textarea", default: "Every relationship has different needs at different points in its journey. The Relationship Life Cycle™ gives you the context to understand where you are — and what comes next." },
];

export const ASSESSMENT_FIELDS: ContentField[] = [
  { key: "assessment.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "The Relationship Snapshot™" },
  { key: "assessment.hero.headline", label: "Hero headline", type: "text", default: "Understand where your relationship is — and what it needs next." },
  { key: "assessment.hero.subhead", label: "Hero subhead", type: "textarea", default: "The Relationship Snapshot™ is a free assessment designed to help you better understand your relationship, recognize what's going well, and identify opportunities for growth." },
];

export const PROFESSIONALS_FIELDS: ContentField[] = [
  { key: "professionals.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "For Professionals" },
  { key: "professionals.hero.headline", label: "Hero headline", type: "text", default: "A developmental framework that gives relationship work a clearer foundation." },
  { key: "professionals.hero.subhead", label: "Hero subhead", type: "textarea", default: "The Relationship Life Cycle™ doesn't replace the models you already use. It provides the developmental context that helps you understand where a relationship is — and what it needs — at every stage." },
];

export const SPEAKING_FIELDS: ContentField[] = [
  { key: "speaking.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "Speaking & Keynotes" },
  { key: "speaking.hero.headline", label: "Hero headline", type: "text", default: "Your audience will leave thinking about relationships differently." },
  { key: "speaking.hero.subhead", label: "Hero subhead", type: "textarea", default: "Janelle Dawsey brings the Relationship Life Cycle™ Framework to conferences, organizations, healthcare systems, legal professionals, and faith communities — creating experiences that are educational, transformative, and immediately applicable." },
];

export const ABOUT_FIELDS: ContentField[] = [
  { key: "about.story.opening", label: "Opening line (story)", type: "textarea", default: "After years of sitting with couples in therapy, a pattern became impossible to ignore." },
];

export const CONTACT_FIELDS: ContentField[] = [
  { key: "contact.hero.heading", label: "Heading", type: "text", default: "How can we help?" },
  { key: "contact.hero.subhead", label: "Subhead", type: "textarea", default: "Whether you have a question, want to explore the framework, or are ready to work together — you're in the right place." },
];

export const SETTINGS_FIELDS: ContentField[] = [
  { key: "settings.contact_email", label: "Contact email", type: "text", default: "info@symmetricly.co" },
  { key: "settings.social.instagram", label: "Instagram URL", type: "text", default: "https://instagram.com/theejanellexoxo" },
  { key: "settings.social.tiktok", label: "TikTok URL", type: "text", default: "https://tiktok.com/@theejanellexoxo" },
  { key: "settings.social.facebook", label: "Facebook URL", type: "text", default: "" },
  { key: "settings.social.linkedin", label: "LinkedIn URL", type: "text", default: "" },
  { key: "settings.footer_note", label: "Footer copyright note", type: "text", default: "© 2026 Relationship Life Cycle™ | A Symmetricly Framework" },
  { key: "settings.ga_id", label: "Google Analytics ID", type: "text", default: "" },
  { key: "settings.meta_pixel_id", label: "Meta Pixel ID", type: "text", default: "" },
];

export const PAGE_MANIFESTS: Record<string, { label: string; fields: ContentField[] }> = {
  home: { label: "Home", fields: HOME_FIELDS },
  framework: { label: "Framework", fields: FRAMEWORK_FIELDS },
  assessment: { label: "Assessment", fields: ASSESSMENT_FIELDS },
  professionals: { label: "Professionals", fields: PROFESSIONALS_FIELDS },
  speaking: { label: "Speaking", fields: SPEAKING_FIELDS },
  about: { label: "About", fields: ABOUT_FIELDS },
  contact: { label: "Contact", fields: CONTACT_FIELDS },
};

/** Read all content overrides into a Map. Resilient: returns an empty Map if
 * the table doesn't exist yet or the read fails, so callers use defaults. */
export async function getSiteContentMap(): Promise<Map<string, string>> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return new Map();
    return new Map(data.map((r) => [r.key, r.value ?? ""]));
  } catch {
    return new Map();
  }
}

/** Override value if present and non-empty, else the provided default. */
export function get(map: Map<string, string>, key: string, fallback: string): string {
  const v = map.get(key);
  return v !== undefined && v !== "" ? v : fallback;
}

// --- Framework editor: phase card copy + domain descriptions ---------------

export const PHASE_FIELDS: ContentField[] = PHASES.flatMap((p) => [
  { key: `phase.${p.slug}.primaryFocus`, label: `${p.name} — primary focus`, type: "text", default: p.primaryFocus },
  { key: `phase.${p.slug}.cardDescription`, label: `${p.name} — one-sentence description`, type: "textarea", default: p.cardDescription },
]);

export const DOMAIN_FIELDS: ContentField[] = DOMAINS_CONTENT.map((d) => ({
  key: `domain.${d.slug}.description`,
  label: `${d.name} — description`,
  type: "textarea" as const,
  default: d.description,
}));

/** PHASES with any DB overrides applied to card copy. */
export function applyPhaseOverrides(map: Map<string, string>): FrameworkPhase[] {
  return PHASES.map((p) => ({
    ...p,
    primaryFocus: get(map, `phase.${p.slug}.primaryFocus`, p.primaryFocus),
    cardDescription: get(map, `phase.${p.slug}.cardDescription`, p.cardDescription),
  }));
}

/** DOMAINS_CONTENT with any DB overrides applied to descriptions. */
export function applyDomainOverrides(map: Map<string, string>): FrameworkDomain[] {
  return DOMAINS_CONTENT.map((d) => ({
    ...d,
    description: get(map, `domain.${d.slug}.description`, d.description),
  }));
}
