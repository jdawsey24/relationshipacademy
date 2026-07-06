import { cache } from "react";
import type { Metadata } from "next";
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

  { key: "home.connect.heading", label: "“For you” section — heading", type: "text", default: "Wherever you are in your relationship journey, this is for you." },
  { key: "home.connect.body", label: "“For you” section — body", type: "textarea", default: "Whether you're figuring out if someone is right for you, navigating a committed relationship, rebuilding after something hard, or healing on your own — relationships look different at every stage. The Relationship Life Cycle™ gives you a way to understand where you are and what your relationship actually needs right now." },

  { key: "home.problem.heading", label: "“The problem” — heading", type: "text", default: "Sometimes the challenge isn't your relationship." },
  { key: "home.problem.subhead", label: "“The problem” — subhead", type: "text", default: "It's trying to solve today's problems with yesterday's expectations." },
  { key: "home.problem.body", label: "“The problem” — body", type: "textarea", default: "We're surrounded by relationship advice. Communication tips. Attachment styles. Conflict strategies. Love languages. Most of it is good. But good advice applied at the wrong moment — or the wrong stage — can make things harder, not easier. The Relationship Life Cycle™ doesn't replace what you already know about relationships. It gives it context." },

  { key: "home.mapintro.heading", label: "“A map” — heading", type: "text", default: "A map for where you are." },
  { key: "home.mapintro.body", label: "“A map” — body", type: "textarea", default: "The Relationship Life Cycle™ is a developmental framework that organizes relationship growth into six distinct phases — each with its own purpose, focus, and opportunities. It's not about whether your relationship is healthy or unhealthy. It's about understanding where it is and what it needs next." },
  { key: "home.feature1.title", label: "Feature 1 — title", type: "text", default: "Six relationship phases" },
  { key: "home.feature1.body", label: "Feature 1 — body", type: "textarea", default: "From the earliest stages of connection to rebuilding after loss." },
  { key: "home.feature2.title", label: "Feature 2 — title", type: "text", default: "Six areas of focus" },
  { key: "home.feature2.body", label: "Feature 2 — body", type: "textarea", default: "Every relationship expresses itself through six key areas, measured throughout every phase." },
  { key: "home.feature3.title", label: "Feature 3 — title", type: "text", default: "A free developmental assessment" },
  { key: "home.feature3.body", label: "Feature 3 — body", type: "textarea", default: "See exactly where your relationship is functioning right now." },

  { key: "home.phases.heading", label: "“Six phases” — heading", type: "text", default: "Every relationship has a season." },
  { key: "home.phases.body", label: "“Six phases” — body", type: "textarea", default: "The Relationship Life Cycle™ identifies six phases of relationship development — each one serving a distinct purpose in the larger journey." },

  { key: "home.assess.heading", label: "Assessment section — heading", type: "text", default: "See where your relationship is right now." },
  { key: "home.assess.body", label: "Assessment section — body", type: "textarea", default: "The Relationship Snapshot™ is a free assessment that shows you how your relationship is functioning today — and what it might need next." },

  { key: "home.pros.heading", label: "Professionals section — heading", type: "text", default: "A framework built for clinical practice." },
  { key: "home.pros.body", label: "Professionals section — body", type: "textarea", default: "Therapists, coaches, attorneys, healthcare providers, and organizations are using the Relationship Life Cycle™ Framework to bring developmental clarity to the relationships they support. Professional resources, CE courses, and certification are in development." },

  { key: "home.academy.heading", label: "Academy section — heading", type: "text", default: "The Relationship Academy" },
  { key: "home.academy.body", label: "Academy section — body", type: "textarea", default: "A community for people who want to go deeper — guided conversations, live sessions, and ongoing learning built around the Relationship Life Cycle™ Framework." },
];

export const FRAMEWORK_FIELDS: ContentField[] = [
  { key: "framework.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "The Relationship Life Cycle™ Framework" },
  { key: "framework.hero.headline", label: "Hero headline", type: "text", default: "Relationships have seasons. This is the map." },
  { key: "framework.hero.subhead", label: "Hero subhead", type: "textarea", default: "Every relationship has different needs at different points in its journey. The Relationship Life Cycle™ gives you the context to understand where you are — and what comes next." },

  { key: "framework.problem.heading", label: "“Advice” section — heading", type: "text", default: "We don't have a shortage of relationship advice." },
  { key: "framework.problem.body", label: "“Advice” section — body (blank line = new paragraph)", type: "textarea", default: "We're surrounded by conversations about communication, attachment, trust, conflict, boundaries, dating, marriage, divorce, healing, and countless other relationship topics. Most of it is useful. Most of it is true.\n\nThe problem isn't that the advice is wrong. The problem is that it's often taught in isolation — as though each relationship challenge exists independently from the larger journey.\n\nA couple struggling with conflict doesn't necessarily have a conflict problem. They may have never built the foundation that allows them to navigate conflict together. A person who keeps choosing the wrong partners may not need dating advice. They may need a clearer understanding of what the early stages of a relationship are actually supposed to accomplish.\n\nThe Relationship Life Cycle™ was created to provide the context that makes everything else make more sense." },

  { key: "framework.def.heading", label: "Definition — heading", type: "text", default: "What is the Relationship Life Cycle™?" },
  { key: "framework.def.body", label: "Definition — body (blank line = new paragraph)", type: "textarea", default: "The Relationship Life Cycle™ is a developmental framework for understanding how relationships grow, change, and evolve over time.\n\nIt's built on a simple but powerful idea: relationships are not static. They develop. The needs of a relationship in its earliest stages are not the same as its needs five years later. The skills required after a breakup are different from those needed at the beginning of a new relationship.\n\nMost relationship advice treats these as separate conversations. The Relationship Life Cycle™ brings them together into one developmental framework — organized around six phases, six universal areas of focus, and the idea that every phase serves a specific purpose in the larger journey." },

  { key: "framework.why.heading", label: "“Why it matters” — heading", type: "text", default: "Why developmental context changes everything." },
  { key: "framework.why.body", label: "“Why it matters” — body (blank line = new paragraph)", type: "textarea", default: "After years of clinical practice, a pattern became impossible to ignore. The resentment, the distance, the feeling that couples had somehow failed each other — it rarely started where they thought it did.\n\nMost of the time, the relationship had simply outpaced itself. They'd moved forward without building what they needed to carry them through. Not because they didn't love each other. Because nobody ever showed them what that foundation was supposed to look like — or when they needed to build it.\n\nSometimes the challenge isn't the relationship. It's trying to solve today's problems with yesterday's expectations — or tomorrow's expectations applied too soon.\n\nThe Relationship Life Cycle™ gives people the map they were never given." },
  { key: "framework.throughline.quote", label: "Pull quote (after “Why it matters”)", type: "textarea", default: "Every relationship has different needs at different points in its journey. The first step is understanding where you are." },

  { key: "framework.principles.heading", label: "Principles — heading", type: "text", default: "How the framework works." },

  { key: "framework.phases.heading", label: "Six phases — heading", type: "text", default: "The six phases of the Relationship Life Cycle™" },
  { key: "framework.phases.body", label: "Six phases — body", type: "textarea", default: "Each phase has a distinct purpose, a primary focus, and a set of skills and experiences associated with healthy progression." },

  { key: "framework.areas.heading", label: "Six areas — heading", type: "text", default: "Six areas. Every phase." },
  { key: "framework.areas.body", label: "Six areas — body", type: "textarea", default: "Every relationship expresses itself through six key areas — communication, trust, emotional connection, how conflict is handled, how responsibilities are shared, and physical intimacy. These areas are present throughout every phase of the relationship. But what they look like — and what they require — changes as the relationship develops." },

  { key: "framework.seasons.quote", label: "Seasons pull quote", type: "textarea", default: "Spring is not better than winter. Summer is not more important than autumn. Each season serves a different purpose. Every phase of relationship development serves a different purpose." },
  { key: "framework.seasons.attribution", label: "Seasons quote — attribution", type: "text", default: "— Relationship Life Cycle™ Framework" },

  { key: "framework.cta.heading", label: "Closing CTA — heading", type: "text", default: "Ready to see where your relationship is?" },
];

export const ASSESSMENT_FIELDS: ContentField[] = [
  { key: "assessment.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "The Relationship Snapshot™" },
  { key: "assessment.hero.headline", label: "Hero headline", type: "text", default: "Understand where your relationship is — and what it needs next." },
  { key: "assessment.hero.subhead", label: "Hero subhead", type: "textarea", default: "The Relationship Snapshot™ is a free assessment designed to help you better understand your relationship, recognize what's going well, and identify opportunities for growth." },

  { key: "assessment.how.heading", label: "“How it works” — heading", type: "text", default: "How it works" },
  { key: "assessment.learn.heading", label: "“What you'll walk away with” — heading", type: "text", default: "What you'll walk away with" },
  { key: "assessment.cred.heading", label: "Credibility — heading", type: "text", default: "Built on something real." },
  { key: "assessment.cred.body", label: "Credibility — body", type: "textarea", default: "The Relationship Snapshot™ is built on the Relationship Life Cycle™ Framework — a developmental model that views relationships as growing and changing over time rather than simply being healthy or unhealthy. It was developed by Janelle Dawsey, LMFT, and is designed to provide developmental insight, not a diagnosis or a score." },
  { key: "assessment.sample.heading", label: "Sample results — heading", type: "text", default: "Here's what your results look like." },
  { key: "assessment.faq.heading", label: "FAQ — heading", type: "text", default: "Common questions" },
  { key: "assessment.cta.heading", label: "Closing CTA — heading", type: "text", default: "Ready to get started?" },
  { key: "assessment.cta.note", label: "Closing CTA — note", type: "text", default: "Free. Confidential. Takes about 10 minutes." },
];

export const PROFESSIONALS_FIELDS: ContentField[] = [
  { key: "professionals.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "For Professionals" },
  { key: "professionals.hero.headline", label: "Hero headline", type: "text", default: "A developmental framework that gives relationship work a clearer foundation." },
  { key: "professionals.hero.subhead", label: "Hero subhead", type: "textarea", default: "The Relationship Life Cycle™ doesn't replace the models you already use. It provides the developmental context that helps you understand where a relationship is — and what it needs — at every stage." },

  { key: "professionals.gap.heading", label: "“The gap” — heading", type: "text", default: "The gap most professionals recognize." },
  { key: "professionals.gap.body", label: "“The gap” — body (blank line = new paragraph)", type: "textarea", default: "Most professionals who work with relationships encounter the same pattern. Clients arrive with good intentions, clear struggles, and years of accumulated damage from needs that were never properly understood or addressed at the right time.\n\nThe Relationship Life Cycle™ Framework was created from that clinical observation: most relationship challenges aren't caused by bad people. They're caused by relationships that outpaced their own foundation — moving forward without building the skills each phase required.\n\nThis framework gives professionals a shared developmental language for understanding that gap." },

  { key: "professionals.position.heading", label: "“A complement” — heading", type: "text", default: "A complement, not a competitor." },
  { key: "professionals.position.body", label: "“A complement” — body (blank line = new paragraph)", type: "textarea", default: "The Relationship Life Cycle™ is not designed to replace attachment theory, Gottman Method, EFT, or any existing therapeutic model. It provides the developmental framework that organizes when and why different relationship needs, challenges, and skills become most relevant.\n\nThink of it as the map that helps your existing tools make more sense — to you and to the people you serve." },

  { key: "professionals.audiences.heading", label: "“Who this is for” — heading", type: "text", default: "Who this is for" },

  { key: "professionals.beyond.heading", label: "“Beyond romantic” — heading", type: "text", default: "Beyond romantic relationships." },
  { key: "professionals.beyond.body", label: "“Beyond romantic” — body (blank line = new paragraph)", type: "textarea", default: "The Relationship Life Cycle™ Framework is fundamentally about relational development — which means its principles extend beyond romantic partnerships.\n\nRelationships between parents and children, colleagues and teams, mentors and mentees, friends and communities — all of these develop over time. All of them have phases, tasks, and opportunities for growth.\n\nThe framework's application to non-romantic relationships is an active area of development. What exists today in the context of romantic partnerships is the foundation for a much broader body of work." },

  { key: "professionals.apps.heading", label: "“Applications” — heading", type: "text", default: "How professionals are using the framework." },

  { key: "professionals.ecosystem.heading", label: "“Ecosystem” — heading", type: "text", default: "A growing professional ecosystem." },
  { key: "professionals.ecosystem.body", label: "“Ecosystem” — body", type: "textarea", default: "The Relationship Life Cycle™ is being developed into a comprehensive professional ecosystem. What exists today is the beginning." },

  { key: "professionals.authority.heading", label: "“Clinical rigor” — heading", type: "text", default: "Built with clinical rigor." },

  { key: "professionals.cta.heading", label: "Closing CTA — heading", type: "text", default: "Join the framework as it grows." },
  { key: "professionals.cta.body", label: "Closing CTA — body", type: "textarea", default: "Professional resources, manuals, CE courses, and certification are in development. Register your interest to be notified as new professional tools become available — and to be part of shaping the framework's professional ecosystem." },
];

export const SPEAKING_FIELDS: ContentField[] = [
  { key: "speaking.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "Speaking & Keynotes" },
  { key: "speaking.hero.headline", label: "Hero headline", type: "text", default: "Your audience will leave thinking about relationships differently." },
  { key: "speaking.hero.subhead", label: "Hero subhead", type: "textarea", default: "Janelle Dawsey brings the Relationship Life Cycle™ Framework to conferences, organizations, healthcare systems, legal professionals, and faith communities — creating experiences that are educational, transformative, and immediately applicable." },

  { key: "speaking.experience.heading", label: "“Walk away with” — heading", type: "text", default: "What your audience walks away with." },
  { key: "speaking.bio.heading", label: "Speaker bio — heading", type: "text", default: "About Janelle Dawsey" },
  { key: "speaking.bio.body", label: "Speaker bio — body (blank line = new paragraph)", type: "textarea", default: "Janelle Dawsey is a Licensed Marriage and Family Therapist, author, certified matchmaker, and the creator of the Relationship Life Cycle™ Framework. After years of clinical practice — sitting with couples, individuals, and families navigating some of the most complex moments of their relational lives — she recognized a pattern that kept appearing: relationships weren't failing because people were bad at relationships. They were failing because no one had ever given them a developmental map.\n\nThat recognition became the Relationship Life Cycle™.\n\nJanelle speaks from a place of clinical depth and genuine warmth. Her sessions don't feel like lectures. They feel like someone finally putting language to something audiences already knew was true — but had never heard said out loud." },
  { key: "speaking.topics.heading", label: "“Keynotes & Sessions” — heading", type: "text", default: "Keynotes & Sessions" },
  { key: "speaking.audiences.heading", label: "“Who Janelle speaks to” — heading", type: "text", default: "Who Janelle speaks to" },
  { key: "speaking.workplace.heading", label: "“Workplace” — heading", type: "text", default: "Relational development in the workplace." },
  { key: "speaking.workplace.body", label: "“Workplace” — body (blank line = new paragraph)", type: "textarea", default: "The principles of the Relationship Life Cycle™ extend naturally into organizational settings. The way trust is built between a leader and a team, the way a new professional partnership develops, the way organizations navigate change — these are all relational experiences with developmental patterns.\n\nJanelle's organizational sessions apply the framework's developmental lens to the professional relationships that shape workplace culture, retention, and performance." },
  { key: "speaking.proof.heading", label: "“Organizations & Events” — heading", type: "text", default: "Organizations & Events" },
  { key: "speaking.inquiry.heading", label: "Inquiry — heading", type: "text", default: "Bring Janelle to your event" },
];

export const ABOUT_FIELDS: ContentField[] = [
  { key: "about.story.opening", label: "Opening line (story)", type: "textarea", default: "After years of sitting with couples in therapy, a pattern became impossible to ignore." },
  { key: "about.story.body", label: "Story — body (blank line = new paragraph)", type: "textarea", default: "The resentment. The distance. The feeling that they'd somehow failed each other. It rarely started where they thought it did.\n\nMost of the time, the relationship had simply outpaced itself. They'd moved forward — into commitment, into shared lives, into families — without building what they needed to carry them through. Not because they didn't love each other. Because nobody ever showed them what that foundation was supposed to look like. Or when they needed to build it.\n\nPeople would arrive in therapy full of pain, and you'd start to understand their story — how they got to where they were — and realize the resentment wasn't really about what was happening now. It was the accumulation of years of needs that had never been recognized, skills that had never been built, phases that had been skipped over or rushed through without anyone understanding what was being left behind.\n\nThat recognition became the Relationship Life Cycle™." },

  { key: "about.created.heading", label: "“A map that didn't exist” — heading", type: "text", default: "A map that didn't exist." },
  { key: "about.created.body", label: "“A map that didn't exist” — body (blank line = new paragraph)", type: "textarea", default: "There is no shortage of relationship advice. There are books, courses, therapists, coaches, podcasts, and frameworks addressing every aspect of relationships imaginable.\n\nBut most of that guidance addresses individual pieces. Very little addresses how those pieces fit together across the full development of a relationship.\n\nThe Relationship Life Cycle™ was created to provide that context. Not to replace what already exists — but to give it a developmental home. To help people understand that where they are in their relationship determines what they need, what challenges are normal, and what comes next.\n\nSometimes the challenge isn't the relationship. It's trying to solve today's problems with yesterday's expectations — or applying tomorrow's standards before the foundation has been built." },

  { key: "about.mission.heading", label: "Mission — heading", type: "text", default: "Mission" },
  { key: "about.mission.body", label: "Mission — body", type: "textarea", default: "To give every person a developmental map for their relationships — so that where they are makes sense, what they need becomes clear, and the path forward feels possible." },
  { key: "about.vision.heading", label: "Vision — heading", type: "text", default: "Vision" },
  { key: "about.vision.body", label: "Vision — body", type: "textarea", default: "A world where relationship development is understood, not assumed — where individuals and couples have access to the language, tools, and frameworks they need to navigate every phase of the relational journey." },

  { key: "about.janelle.heading", label: "“About Janelle” — heading", type: "text", default: "About Janelle Dawsey, LMFT" },

  { key: "about.future.heading", label: "“The future” — heading", type: "text", default: "Where the Relationship Life Cycle™ is going." },
  { key: "about.future.body", label: "“The future” — body", type: "textarea", default: "What exists today — the framework, the assessment, this website — is the beginning of something much larger. The Relationship Life Cycle™ is being developed into a comprehensive ecosystem for relationship education, professional training, and research. The goal is for the framework to become a foundational reference point for how relationships are understood, supported, and taught — across clinical practice, organizational settings, education, faith communities, and beyond." },

  { key: "about.media.heading", label: "“Media & Press” — heading", type: "text", default: "Media & Press" },
];

export const CONTACT_FIELDS: ContentField[] = [
  { key: "contact.hero.heading", label: "Heading", type: "text", default: "How can we help?" },
  { key: "contact.hero.subhead", label: "Subhead", type: "textarea", default: "Whether you have a question, want to explore the framework, or are ready to work together — you're in the right place." },

  { key: "contact.connect.heading", label: "“Stay connected” — heading", type: "text", default: "Stay connected." },
  { key: "contact.connect.body", label: "“Stay connected” — body", type: "textarea", default: "Subscribe for framework updates, new resources, assessment improvements, and professional announcements." },
  { key: "contact.support.note", label: "Support note (under email)", type: "text", default: "For assessment support, please include your session ID if applicable." },
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

// --- Per-page SEO (title / meta description / social share image) ----------
// Defaults mirror the copy that used to live in each page's static `metadata`.
export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  home: {
    title: "Relationship Snapshot™ | Relationship Life Cycle™",
    description: "A free developmental assessment based on the Relationship Life Cycle™ Framework. Understand where your relationship really is.",
  },
  framework: {
    title: "The Framework | Relationship Life Cycle™",
    description: "Every relationship has different needs at different points in its journey. The Relationship Life Cycle™ gives you the context to understand where you are.",
  },
  assessment: {
    title: "The Assessment | Relationship Life Cycle™",
    description: "The Relationship Snapshot™ is a free assessment that helps you understand where your relationship is and what it needs next.",
  },
  professionals: {
    title: "For Professionals | Relationship Life Cycle™",
    description: "A developmental framework that gives relationship work a clearer foundation — a complement to the models you already use.",
  },
  speaking: {
    title: "Speaking | Relationship Life Cycle™",
    description: "Janelle Dawsey brings the Relationship Life Cycle™ Framework to conferences, organizations, and communities.",
  },
  about: {
    title: "About | Relationship Life Cycle™",
    description: "The clinical origin story behind the Relationship Life Cycle™ Framework.",
  },
  contact: {
    title: "Contact | Relationship Life Cycle™",
    description: "Questions, framework inquiries, speaking requests, or professional partnerships — reach the Relationship Life Cycle™ team.",
  },
  learn: {
    title: "Learning Center | Relationship Life Cycle™",
    description: "Articles, guides, and downloadable resources for understanding relationship development through the Relationship Life Cycle™ Framework.",
  },
};

// Canonical path for each page key (used for <link rel=canonical> + og:url).
export const PAGE_PATH: Record<string, string> = {
  home: "/", framework: "/framework", assessment: "/assessment",
  professionals: "/professionals", speaking: "/speaking", about: "/about",
  contact: "/contact", learn: "/learn",
};

// Site-wide default social share image (1200×630).
export const DEFAULT_OG_IMAGE = "/og-default.png";

/** The editable SEO fields for a page, defaulting to that page's PAGE_SEO. */
function seoFields(page: string): ContentField[] {
  const d = PAGE_SEO[page];
  return [
    { key: `seo.${page}.title`, label: "SEO — Browser/tab title", type: "text", default: d.title },
    { key: `seo.${page}.description`, label: "SEO — Meta description", type: "textarea", default: d.description },
    { key: `seo.${page}.og_image`, label: "SEO — Social share image URL (optional)", type: "text", default: "" },
  ];
}

/** Build a Next.js Metadata object for a page from overrides + defaults.
 * Includes a canonical URL, og:url, and a social image (custom or the site
 * default) so every page has complete, non-duplicated metadata. */
export function buildPageMetadata(map: Map<string, string>, page: string): Metadata {
  const d = PAGE_SEO[page];
  const title = get(map, `seo.${page}.title`, d.title);
  const description = get(map, `seo.${page}.description`, d.description);
  const path = PAGE_PATH[page];
  const image = get(map, `seo.${page}.og_image`, "") || DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName: "Relationship Life Cycle™",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const PAGE_MANIFESTS: Record<string, { label: string; fields: ContentField[] }> = {
  home: { label: "Home", fields: [...HOME_FIELDS, ...seoFields("home")] },
  framework: { label: "Framework", fields: [...FRAMEWORK_FIELDS, ...seoFields("framework")] },
  assessment: { label: "Assessment", fields: [...ASSESSMENT_FIELDS, ...seoFields("assessment")] },
  professionals: { label: "Professionals", fields: [...PROFESSIONALS_FIELDS, ...seoFields("professionals")] },
  speaking: { label: "Speaking", fields: [...SPEAKING_FIELDS, ...seoFields("speaking")] },
  about: { label: "About", fields: [...ABOUT_FIELDS, ...seoFields("about")] },
  contact: { label: "Contact", fields: [...CONTACT_FIELDS, ...seoFields("contact")] },
};

/** Read all content overrides into a Map. Resilient: returns an empty Map if
 * the table doesn't exist yet or the read fails, so callers use defaults.
 * Wrapped in React cache() so generateMetadata() + the page body in the same
 * request share a single DB read. */
export const getSiteContentMap = cache(async (): Promise<Map<string, string>> => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return new Map();
    return new Map(data.map((r) => [r.key, r.value ?? ""]));
  } catch {
    return new Map();
  }
});

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
