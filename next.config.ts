import type { NextConfig } from "next";

// Content-Security-Policy — ENFORCING. Violations are blocked. If a legit
// resource ever breaks, add its origin to the relevant directive below (or
// temporarily append "-Report-Only" to the header key on line ~33 to downgrade
// to report-only). Allowances: GA (googletagmanager/google-analytics), Meta
// Pixel (connect.facebook.net/facebook.com), Supabase (*.supabase.co),
// Cloudflare Turnstile, Stripe, and inline script/style which Next.js + the
// analytics snippets currently require.
//
// STRIPE (required by the embedded Checkout on the Playbook sales page): the
// js.stripe.com SCRIPT, api.stripe.com for its XHR, and the js/hooks.stripe.com
// FRAMES the payment form and 3-D Secure render in. Miss any one of these and
// checkout fails with "Failed to load Stripe.js" — i.e. nobody can buy.
// In development, Next.js's client runtime (HMR + eval source-maps) requires
// 'unsafe-eval', so we add it ONLY in dev. A production build never uses eval,
// so the deployed CSP stays strict. Without this, dev-mode scripts are blocked
// by CSP and pages never hydrate (forms fall back to a plain reload).
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc =
  "script-src 'self' 'unsafe-inline'" +
  (isDev ? " 'unsafe-eval'" : "") +
  " https://www.googletagmanager.com https://connect.facebook.net https://challenges.cloudflare.com https://js.stripe.com";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self'",       // Relationship Companion PWA service worker (same-origin)
  "manifest-src 'self'",
  scriptSrc,
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://connect.facebook.net https://www.facebook.com https://challenges.cloudflare.com https://api.stripe.com https://js.stripe.com",
  "frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://js.stripe.com https://hooks.stripe.com",
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
  // The paid Playbook PDFs live outside public/ and are streamed by the gated
  // download route via fs. Force-include them in that function's bundle so the
  // read works on Netlify/serverless (they aren't statically imported).
  outputFileTracingIncludes: {
    "/api/playbooks/[cluster]/download": ["./content/playbooks/**"],
  },
  images: {
    // Serve modern formats automatically via next/image.
    formats: ["image/avif", "image/webp"],
    // Allow optimizing article/resource images stored in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "hxfclagqmynyolyimxnm.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Phase pages moved from /framework/phases/:slug to top-level /:slug.
      { source: "/framework/phases/:slug", destination: "/:slug", permanent: true },
      // RLC Studio refactor: the flat "Knowledge Base" is now the Framework
      // hierarchy. Admin-internal, so not a permanent (301) redirect.
      { source: "/admin/studio/kb", destination: "/admin/studio/framework", permanent: false },
      { source: "/admin/studio/kb/:path*", destination: "/admin/studio/framework", permanent: false },
      // Snapshot cutover: the cluster quiz now owns /snapshot. Old 47-item entry
      // points (and existing ad links / bookmarks) land on the new picker.
      { source: "/snapshot/intro", destination: "/snapshot", permanent: true },
      { source: "/snapshot/phase-select", destination: "/snapshot", permanent: true },
      { source: "/snapshot/capture", destination: "/snapshot", permanent: true },
      { source: "/snapshot/thank-you", destination: "/snapshot", permanent: true },
      { source: "/snapshot/questions/:domain", destination: "/snapshot", permanent: true },

      // Playbook slug rename (2026-08-09). The slugs now match the consumer
      // names from the Experience Clusters workbook. Every one of these was a
      // live, publicly linked URL, so the old address has to keep working:
      // permanent (301) so search engines move their record across rather than
      // indexing both. The interactive path /playbook/:key is authenticated and
      // reached from inside the app, so it redirects too but nothing external
      // depends on it.
      { source: "/playbooks/a-different-legacy", destination: "/playbooks/the-cycle-breakers-playbook", permanent: true },
      { source: "/playbook/a-different-legacy", destination: "/playbook/the-cycle-breakers-playbook", permanent: true },
      { source: "/playbook/a-different-legacy/:path*", destination: "/playbook/the-cycle-breakers-playbook/:path*", permanent: true },
      { source: "/playbooks/accepting-what-is", destination: "/playbooks/can-we-fix-this", permanent: true },
      { source: "/playbook/accepting-what-is", destination: "/playbook/can-we-fix-this", permanent: true },
      { source: "/playbook/accepting-what-is/:path*", destination: "/playbook/can-we-fix-this/:path*", permanent: true },
      { source: "/playbooks/breaking-the-cycle", destination: "/playbooks/how-to-stop-having-the-same-fight", permanent: true },
      { source: "/playbook/breaking-the-cycle", destination: "/playbook/how-to-stop-having-the-same-fight", permanent: true },
      { source: "/playbook/breaking-the-cycle/:path*", destination: "/playbook/how-to-stop-having-the-same-fight/:path*", permanent: true },
      { source: "/playbooks/building-a-shared-future", destination: "/playbooks/do-we-want-the-same-future", permanent: true },
      { source: "/playbook/building-a-shared-future", destination: "/playbook/do-we-want-the-same-future", permanent: true },
      { source: "/playbook/building-a-shared-future/:path*", destination: "/playbook/do-we-want-the-same-future/:path*", permanent: true },
      { source: "/playbooks/building-a-true-partnership", destination: "/playbooks/the-partnership-reset", permanent: true },
      { source: "/playbook/building-a-true-partnership", destination: "/playbook/the-partnership-reset", permanent: true },
      { source: "/playbook/building-a-true-partnership/:path*", destination: "/playbook/the-partnership-reset/:path*", permanent: true },
      { source: "/playbooks/feeling-seen", destination: "/playbooks/loved-not-just-needed", permanent: true },
      { source: "/playbook/feeling-seen", destination: "/playbook/loved-not-just-needed", permanent: true },
      { source: "/playbook/feeling-seen/:path*", destination: "/playbook/loved-not-just-needed/:path*", permanent: true },
      { source: "/playbooks/finding-security", destination: "/playbooks/the-relationship-overthinkers-playbook", permanent: true },
      { source: "/playbook/finding-security", destination: "/playbook/the-relationship-overthinkers-playbook", permanent: true },
      { source: "/playbook/finding-security/:path*", destination: "/playbook/the-relationship-overthinkers-playbook/:path*", permanent: true },
      { source: "/playbooks/finding-your-way-back", destination: "/playbooks/from-roommates-back-to-partners", permanent: true },
      { source: "/playbook/finding-your-way-back", destination: "/playbook/from-roommates-back-to-partners", permanent: true },
      { source: "/playbook/finding-your-way-back/:path*", destination: "/playbook/from-roommates-back-to-partners/:path*", permanent: true },
      { source: "/playbooks/finding-yourself-again", destination: "/playbooks/finding-yourself-after-everything-changed", permanent: true },
      { source: "/playbook/finding-yourself-again", destination: "/playbook/finding-yourself-after-everything-changed", permanent: true },
      { source: "/playbook/finding-yourself-again/:path*", destination: "/playbook/finding-yourself-after-everything-changed/:path*", permanent: true },
      { source: "/playbooks/from-the-ground-up", destination: "/playbooks/what-nobody-taught-you-about-healthy-relationships", permanent: true },
      { source: "/playbook/from-the-ground-up", destination: "/playbook/what-nobody-taught-you-about-healthy-relationships", permanent: true },
      { source: "/playbook/from-the-ground-up/:path*", destination: "/playbook/what-nobody-taught-you-about-healthy-relationships/:path*", permanent: true },
      { source: "/playbooks/lean-in-or-let-go", destination: "/playbooks/is-this-going-somewhere", permanent: true },
      { source: "/playbook/lean-in-or-let-go", destination: "/playbook/is-this-going-somewhere", permanent: true },
      { source: "/playbook/lean-in-or-let-go/:path*", destination: "/playbook/is-this-going-somewhere/:path*", permanent: true },
      { source: "/playbooks/learning-to-say-no", destination: "/playbooks/boundaries-without-guilt", permanent: true },
      { source: "/playbook/learning-to-say-no", destination: "/playbook/boundaries-without-guilt", permanent: true },
      { source: "/playbook/learning-to-say-no/:path*", destination: "/playbook/boundaries-without-guilt/:path*", permanent: true },
      { source: "/playbooks/letting-go", destination: "/playbooks/letting-go-without-losing-what-it-meant", permanent: true },
      { source: "/playbook/letting-go", destination: "/playbook/letting-go-without-losing-what-it-meant", permanent: true },
      { source: "/playbook/letting-go/:path*", destination: "/playbook/letting-go-without-losing-what-it-meant/:path*", permanent: true },
      { source: "/playbooks/letting-go-of-the-armor", destination: "/playbooks/more-than-what-you-provide", permanent: true },
      { source: "/playbook/letting-go-of-the-armor", destination: "/playbook/more-than-what-you-provide", permanent: true },
      { source: "/playbook/letting-go-of-the-armor/:path*", destination: "/playbook/more-than-what-you-provide/:path*", permanent: true },
      { source: "/playbooks/letting-someone-in", destination: "/playbooks/how-to-let-someone-in", permanent: true },
      { source: "/playbook/letting-someone-in", destination: "/playbook/how-to-let-someone-in", permanent: true },
      { source: "/playbook/letting-someone-in/:path*", destination: "/playbook/how-to-let-someone-in/:path*", permanent: true },
      { source: "/playbooks/making-confident-decisions", destination: "/playbooks/how-to-make-a-relationship-decision-you-can-trust", permanent: true },
      { source: "/playbook/making-confident-decisions", destination: "/playbook/how-to-make-a-relationship-decision-you-can-trust", permanent: true },
      { source: "/playbook/making-confident-decisions/:path*", destination: "/playbook/how-to-make-a-relationship-decision-you-can-trust/:path*", permanent: true },
      { source: "/playbooks/moving-beyond-rejection", destination: "/playbooks/finding-love-that-feels-mutual", permanent: true },
      { source: "/playbook/moving-beyond-rejection", destination: "/playbook/finding-love-that-feels-mutual", permanent: true },
      { source: "/playbook/moving-beyond-rejection/:path*", destination: "/playbook/finding-love-that-feels-mutual/:path*", permanent: true },
      { source: "/playbooks/opening-your-heart-again", destination: "/playbooks/starting-again-without-starting-from-scratch", permanent: true },
      { source: "/playbook/opening-your-heart-again", destination: "/playbook/starting-again-without-starting-from-scratch", permanent: true },
      { source: "/playbook/opening-your-heart-again/:path*", destination: "/playbook/starting-again-without-starting-from-scratch/:path*", permanent: true },
      { source: "/playbooks/rebuilding-physical-connection", destination: "/playbooks/the-intimacy-reset", permanent: true },
      { source: "/playbook/rebuilding-physical-connection", destination: "/playbook/the-intimacy-reset", permanent: true },
      { source: "/playbook/rebuilding-physical-connection/:path*", destination: "/playbook/the-intimacy-reset/:path*", permanent: true },
      { source: "/playbooks/rebuilding-trust", destination: "/playbooks/can-i-trust-you-again", permanent: true },
      { source: "/playbook/rebuilding-trust", destination: "/playbook/can-i-trust-you-again", permanent: true },
      { source: "/playbook/rebuilding-trust/:path*", destination: "/playbook/can-i-trust-you-again/:path*", permanent: true },
      { source: "/playbooks/staying-connected", destination: "/playbooks/money-work-and-us", permanent: true },
      { source: "/playbook/staying-connected", destination: "/playbook/money-work-and-us", permanent: true },
      { source: "/playbook/staying-connected/:path*", destination: "/playbook/money-work-and-us/:path*", permanent: true },
      { source: "/playbooks/staying-yourself", destination: "/playbooks/how-to-love-without-losing-yourself", permanent: true },
      { source: "/playbook/staying-yourself", destination: "/playbook/how-to-love-without-losing-yourself", permanent: true },
      { source: "/playbook/staying-yourself/:path*", destination: "/playbook/how-to-love-without-losing-yourself/:path*", permanent: true },
      { source: "/playbooks/trusting-what-you-see", destination: "/playbooks/trust-yourself-to-choose-better", permanent: true },
      { source: "/playbook/trusting-what-you-see", destination: "/playbook/trust-yourself-to-choose-better", permanent: true },
      { source: "/playbook/trusting-what-you-see/:path*", destination: "/playbook/trust-yourself-to-choose-better/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
