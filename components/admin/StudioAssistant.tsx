"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AssistantPanel, { logAssistantEvent } from "@/components/admin/AssistantPanel";

// Shell for the RLC Studio Assistant. Scopes the panel to the authoring
// environment (/admin/studio, /admin/ai), owns open/closed state (persisted),
// and handles layout (push content on large screens, overlay drawer on small)
// plus accessibility (Escape, focus move + restore, focus trap when overlaid,
// aria-expanded, reduced-motion). Wraps page content so it can push it.

const STORAGE_KEY = "rlc-studio-assistant-open";

function focusable(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])')
  ).filter((e) => e.offsetParent !== null);
}

export default function StudioAssistant({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inScope = pathname.startsWith("/admin/studio") || pathname.startsWith("/admin/ai");

  const [open, setOpen] = useState(false);
  const [overlay, setOverlay] = useState(false); // true on small screens (< lg)
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  // Persisted open state (hydration-safe).
  useEffect(() => {
    try { setOpen(localStorage.getItem(STORAGE_KEY) === "1"); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, open ? "1" : "0"); } catch { /* ignore */ }
  }, [open]);

  // Track viewport for push-vs-overlay + focus-trap decisions.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setOverlay(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Escape to close + focus trap (only when overlaid/modal).
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); return; }
      if (e.key === "Tab" && overlay && drawerRef.current) {
        const f = focusable(drawerRef.current);
        if (f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => { window.clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [open, overlay]);

  // Restore focus to the launcher when the panel closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (!inScope) return <>{children}</>;

  return (
    <>
      <div className={`min-w-0 flex-1 transition-[padding] duration-200 motion-reduce:transition-none ${open ? "lg:pr-[380px]" : ""}`}>
        {children}
      </div>

      {!open && (
        <button
          ref={launcherRef}
          onClick={() => { setOpen(true); logAssistantEvent("opened", { route: pathname }); }}
          aria-expanded={false}
          aria-label="Open Studio Assistant"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-dusty-plum px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-dusty-plum/90"
        >
          <span aria-hidden>✨</span> Studio Assistant
        </button>
      )}

      {open && (
        <>
          {overlay && <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />}
          <aside
            ref={drawerRef}
            role={overlay ? "dialog" : "complementary"}
            aria-modal={overlay ? true : undefined}
            aria-label="Studio Assistant"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[360px] flex-col border-l border-light-gray bg-white shadow-xl lg:w-[380px] lg:max-w-none"
          >
            <header className="flex items-center justify-between border-b border-light-gray px-4 py-3">
              <div className="flex items-center gap-2"><span aria-hidden>✨</span><span className="text-sm font-semibold text-midnight-navy">Studio Assistant</span></div>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close Studio Assistant" className="rounded p-1 text-lg leading-none text-charcoal/50 hover:bg-light-gray hover:text-midnight-navy">✕</button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AssistantPanel />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
