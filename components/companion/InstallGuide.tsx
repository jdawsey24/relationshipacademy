"use client";

import { useEffect, useState } from "react";

// Device-detected "Add to Home Screen" guide. Consumer language only (no PWA
// jargon). Android uses the native prompt when available; iOS shows Safari steps
// (placeholder illustrations). Never falsely claims success the browser can't
// confirm. Dismissible + reopenable; records state so we don't nag.
type Device = "ios" | "android" | "desktop";
interface BIPEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

function detect(): Device {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)").matches || (window.navigator as { standalone?: boolean }).standalone === true;
}

export default function InstallGuide({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const [show, setShow] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [bip, setBip] = useState<BIPEvent | null>(null);

  useEffect(() => {
    setDevice(detect());
    const onBIP = (e: Event) => { e.preventDefault(); setBip(e as BIPEvent); };
    window.addEventListener("beforeinstallprompt", onBIP);
    if (open) { setShow(true); }
    else if (!isStandalone()) {
      // First-visit auto-show once, unless already dismissed/completed.
      fetch("/api/companion/install").then((r) => r.ok ? r.json() : null).then((d) => {
        if (d && (d.install_state === "not_shown" || d.install_state === "shown")) {
          setShow(true);
          fetch("/api/companion/install", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: "shown" }) }).catch(() => {});
        }
      }).catch(() => {});
    }
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, [open]);

  function record(state: string) { fetch("/api/companion/install", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state }) }).catch(() => {}); }
  function close() { record("dismissed"); setShow(false); onClose?.(); }

  async function androidInstall() {
    if (!bip) return;
    await bip.prompt();
    const choice = await bip.userChoice.catch(() => ({ outcome: "dismissed" }));
    record(choice.outcome === "accepted" ? "completed" : "dismissed"); // only claim success when the browser confirms
    setShow(false); onClose?.();
  }

  if (!show || (isStandalone() && !open)) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-charcoal/30 p-4" onClick={close}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">Quick access</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-midnight-navy">Add Companion to your phone</h2>
          </div>
          <button onClick={close} aria-label="Close" className="text-2xl leading-none text-charcoal/40">×</button>
        </div>
        <p className="mt-2 font-body text-sm text-charcoal/70">Save it to your Home Screen so it opens like an app, right when you need it.</p>

        <div className="mt-4 rounded-2xl border border-light-gray bg-warm-ivory/40 p-4 font-body text-sm text-charcoal/80">
          {device === "ios" && (
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Tap the <strong>Share</strong> icon in Safari.</li>
              <li>Scroll down and choose <strong>Add to Home Screen</strong>.</li>
              <li>Confirm the name, then tap <strong>Add</strong>.</li>
            </ol>
          )}
          {device === "android" && (bip ? (
            <button onClick={androidInstall} className="w-full rounded-full bg-midnight-navy py-3 font-ui text-sm font-semibold text-white">Add Companion to Home Screen</button>
          ) : (
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Open your browser menu.</li>
              <li>Choose <strong>Add to Home Screen</strong> or <strong>Install app</strong>.</li>
              <li>Confirm the installation.</li>
            </ol>
          ))}
          {device === "desktop" && (bip ? (
            <button onClick={androidInstall} className="w-full rounded-full bg-midnight-navy py-3 font-ui text-sm font-semibold text-white">Install Companion</button>
          ) : (
            <p>You can keep using the Companion in your browser. On a phone, open it in your mobile browser to save it to your Home Screen.</p>
          ))}
          <p className="mt-3 text-xs text-charcoal/45">Once it&apos;s on your Home Screen, the Companion opens full-screen, just like an app.</p>
        </div>

        <button onClick={close} className="mt-4 w-full py-2 font-ui text-sm text-charcoal/55">Maybe later</button>
      </div>
    </div>
  );
}
