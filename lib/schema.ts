// Schema.org / JSON-LD builders. Kept in one place so structured data stays
// consistent and is easy to extend (Course, Certification, etc.) later.

export const SITE_URL = "https://relationshiplc.com";
const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#janelle`;
const OG = `${SITE_URL}/og-default.png`;

/** The publisher/brand. Referenced by @id from other nodes. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Relationship Life Cycle™",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-full.png`,
    description:
      "A developmental framework for understanding how relationships grow, change, and evolve — with a free assessment, education, and professional resources.",
    founder: { "@id": PERSON_ID },
    sameAs: [
      "https://instagram.com/theejanellexoxo",
      "https://tiktok.com/@theejanellexoxo",
    ],
  };
}

/** The website itself (enables the sitelinks search box slot in future). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Relationship Life Cycle™",
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/** Janelle Dawsey — framework creator. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Janelle Dawsey",
    honorificSuffix: "LMFT",
    jobTitle: "Licensed Marriage and Family Therapist",
    description:
      "Licensed Marriage and Family Therapist, author, certified matchmaker, and creator of the Relationship Life Cycle™ Framework.",
    url: `${SITE_URL}/about`,
    worksFor: { "@id": ORG_ID },
    knowsAbout: ["Relationships", "Marriage and Family Therapy", "Relationship development"],
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string | null;
  slug: string;
  image: string | null;
  author: string | null;
  publishDate: string | null;
  updatedAt?: string | null;
}

export function articleSchema(a: ArticleSchemaInput) {
  const url = `${SITE_URL}/learn/${a.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: a.title,
    description: a.description ?? undefined,
    image: a.image || OG,
    author: a.author ? { "@type": "Person", name: a.author } : { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    datePublished: a.publishDate ?? undefined,
    dateModified: a.updatedAt ?? a.publishDate ?? undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/** Breadcrumb trail. items = [{ name, path }], path relative to the site root. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** FAQ rich result. */
export function faqSchema(qas: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  };
}
