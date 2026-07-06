import type { NextConfig } from "next";

// Content-Security-Policy — ENFORCING. Violations are blocked. If a legit
// resource ever breaks, add its origin to the relevant directive below (or
// temporarily append "-Report-Only" to the header key on line ~33 to downgrade
// to report-only). Allowances: GA (googletagmanager/google-analytics), Meta
// Pixel (connect.facebook.net/facebook.com), Supabase (*.supabase.co),
// Cloudflare Turnstile, and inline script/style which Next.js + the analytics
// snippets currently require.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com",
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://connect.facebook.net https://www.facebook.com https://challenges.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com",
].join("; ");

// Security headers applied to every response. The non-CSP headers are safe to
// enforce immediately; CSP is report-only (see above).
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise the Next.js version
  images: {
    // Serve modern formats automatically via next/image.
    formats: ["image/avif", "image/webp"],
    // Allow optimizing article/resource images stored in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "hxfclagqmynyolyimxnm.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
