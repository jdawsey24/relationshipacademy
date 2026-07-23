"use client";

import { useEffect, type RefObject } from "react";

// Accessible modal behavior for the Companion's full-screen dialogs (safety
// interstitial, Get-help, install guide): move focus in on open, trap Tab within
// the dialog, close on Escape, and restore focus to the opener on close.
export function useDialogA11y(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea,input:not([disabled]),select,[tabindex]:not([tabindex="-1"])'
      )).filter((n) => n.offsetParent !== null);

    (focusables()[0] ?? el).focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); opener?.focus?.(); };
  }, [ref, onClose]);
}
