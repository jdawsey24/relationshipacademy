"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** True when Turnstile is configured for the browser. Forms use this to decide
 * whether to require a token before submitting. */
export const turnstileEnabled = !!SITE_KEY;

// Minimal typing for the injected global.
interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Cloudflare Turnstile widget. Renders explicitly so we reliably capture the
// token into React state via onToken. Renders nothing when unconfigured.
export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    function render() {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => onToken(token),
        "error-callback": () => onToken(""),
        "expired-callback": () => onToken(""),
      });
    }

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      if (existing) {
        existing.addEventListener("load", render);
      } else {
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        s.setAttribute("data-turnstile", "");
        s.onload = render;
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="cf-turnstile" />;
}
