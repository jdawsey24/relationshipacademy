"use client";

import { useEffect } from "react";

// Registers the Companion service worker (privacy-first: static shell + offline
// screen only). Registered from the Companion layout so only Companion visitors
// ever install it. No-ops where service workers are unsupported.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => { /* SW is an enhancement, never required */ });
  }, []);
  return null;
}
