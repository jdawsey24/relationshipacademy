import type { MetadataRoute } from "next";

const BASE = "https://relationshiplc.com";

// robots.txt at /robots.txt. Allows crawling of public pages; blocks admin,
// auth, API, and the interactive quiz flow (thin/duplicate step pages). Points
// crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/snapshot/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
