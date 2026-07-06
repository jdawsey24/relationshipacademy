import type { MetadataRoute } from "next";
import { PHASES } from "@/lib/frameworkContent";
import { getPublishedArticles } from "@/lib/articles";

export const revalidate = 3600; // refresh hourly so new articles appear automatically

const BASE = "https://relationshiplc.com";

// Dynamic XML sitemap at /sitemap.xml. Covers all public, indexable pages and
// automatically includes newly published articles (and any future content read
// the same way). Excludes admin, auth, API, the quiz flow, and drafts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/framework`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/assessment`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/professionals`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/speaking`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  // The six framework phase pages (SSG).
  const phaseRoutes: MetadataRoute.Sitemap = PHASES.map((p) => ({
    url: `${BASE}/framework/phases/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Published articles only (drafts excluded by getPublishedArticles).
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getPublishedArticles();
    articleRoutes = articles.map((a) => ({
      url: `${BASE}/learn/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : a.publish_date ? new Date(a.publish_date) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Resilient: if the articles read fails, still return the static + phase URLs.
  }

  return [...staticRoutes, ...phaseRoutes, ...articleRoutes];
}
