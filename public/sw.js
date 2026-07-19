/* Relationship Companion service worker — privacy-first.
 * Caches ONLY immutable static build assets + a graceful offline screen.
 * NEVER caches API responses or authenticated HTML (journal entries, Blueprint,
 * plans). Registered only from Companion pages. */
const CACHE = "companion-shell-v3";
const OFFLINE_URL = "/companion/offline";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE_URL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never touch API traffic or any authenticated content — always network.
  if (url.pathname.startsWith("/api/")) return;

  // Immutable hashed static assets: cache-first (safe to cache anywhere).
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // Companion navigations: network-first, fall back to the offline screen.
  // (The HTML itself is not cached — only the offline shell is served on failure.)
  if (req.mode === "navigate" && url.pathname.startsWith("/companion")) {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
    return;
  }
  // Everything else: passthrough (no caching).
});
