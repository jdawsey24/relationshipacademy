"use client";

import { useEffect } from "react";

// Registers the Companion service worker (privacy-first: static shell + offline
// screen only). Registered from the Companion layout so only Companion visitors
// ever install it. No-ops where service workers are unsupported.
//
// Update handling: on load we ask the browser to re-check sw.js, and when a new
// worker takes control we reload once so returning users pick up the fresh shell
// after a deploy instead of getting stuck on a stale cached bundle.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Check for an updated worker on this load.
        reg.update().catch(() => { /* best-effort */ });
        // If an updated worker is already waiting, let it take over promptly.
        const waiting = reg.waiting;
        if (waiting) waiting.postMessage("SKIP_WAITING");
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              installing.postMessage("SKIP_WAITING");
            }
          });
        });
      })
      .catch(() => { /* SW is an enhancement, never required */ });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);
  return null;
}
