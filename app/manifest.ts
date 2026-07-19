import type { MetadataRoute } from "next";

// PWA manifest for the Relationship Companion. Scoped to /companion so installing
// gives a focused, standalone Companion app. Icons are PLACEHOLDERS (reusing the
// brand mark) until final branded assets are supplied.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Relationship Companion",
    short_name: "Companion",
    description: "A private space to process relationship experiences.",
    start_url: "/companion",
    scope: "/companion",
    display: "standalone",
    background_color: "#F7F4EF",
    theme_color: "#F7F4EF",
    icons: [
      { src: "/logo-mark.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo-mark.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo-mark.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
