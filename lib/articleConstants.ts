import { PHASES } from "@/lib/frameworkContent";

// Pure, client-safe article constants + types (no server-only imports).

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  content: string | null;
  featured_image_url: string | null;
  author: string | null;
  publish_date: string | null;
  status: string;
  tags: string | null;
  related_phase_slug: string | null;
  cta_text: string | null;
  cta_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at?: string;
  updated_by?: string | null;
}

export const ARTICLE_CATEGORIES = [
  "Dating", "Commitment", "Marriage", "Conflict", "Breakups", "Divorce",
  "Healing", "Relationship Development", "Communication", "Emotional Wellness",
];

export const ARTICLE_STATUSES = ["draft", "published"];

export const RELATED_PHASE_OPTIONS = [
  { value: "", label: "— none —" },
  ...PHASES.map((p) => ({ value: p.slug, label: p.name })),
];

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
