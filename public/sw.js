/* Relationship Companion service worker — privacy-first.
 * Caches ONLY immutable static build assets + a graceful offline screen.
 * NEVER caches API responses or authenticated HTML (journal entries, Blueprint,
 * plans). Registered only from Companion pages.
 *
 * Cache-busting: the CACHE version is bumped on any shell/strategy change so the
 * `activate` step deletes every older cache. Static assets use stale-while-
 * revalidate (serve cached, refresh in the background) so returning users never
 * get stuck on a stale shell after a deploy; navigations are always network-first.
 */
const CACHE = "companion-shell-v4";
const OFFLINE_URL = "/companion/offline";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE_URL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Allow the page to prompt an immediate activation of an updated worker.
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never touch API traffic or any authenticated content — always network.
  if (url.pathname.startsWith("/api/")) return;

  // Static build assets: stale-while-revalidate. Serve the cached copy immediately
  // (fast), but always fetch a fresh copy in the background and update the cache,
  // so a new deploy's assets replace older cached ones without a stale-shell trap.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((hit) => {
          const network = fetch(req)
            .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
            .catch(() => hit);
          return hit || network;
        })
      )
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
