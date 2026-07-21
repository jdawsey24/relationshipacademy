"use client";

import CompanionChrome from "@/components/companion/CompanionChrome";

function Glyph({ paths }: { paths: string[] }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

const COMING: { title: string; desc: string; icon: string[]; accent: string }[] = [
  { title: "Playbooks", desc: "Guided programs for deeper work", accent: "#4F6D8C", icon: ["M5 4h11l4 4v12H5z", "M9 10h6", "M9 14h4"] },
  { title: "Unlocked experiences", desc: "Everything you've purchased or earned", accent: "#5F9E7C", icon: ["M8 11V8a4 4 0 0 1 8 0", "M6 11h12v9H6z", "M12 15v2"] },
  { title: "Saved resources", desc: "Notes and downloads you keep", accent: "#C09A52", icon: ["M6 4h12v16l-6-4-6 4z"] },
];

function tint(hex: string, a: number) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; }

export default function CompanionLibrary() {
  return (
    <CompanionChrome active="library">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Library</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy">Your library</h1>
      <p className="mt-1 font-body text-sm leading-relaxed text-charcoal/60">Playbooks, unlocked experiences, and saved resources — all in one private place.</p>

      <div className="mt-6 space-y-2.5">
        {COMING.map((c) => (
          <div key={c.title} className="flex items-center gap-3.5 rounded-2xl border border-light-gray/70 bg-white p-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: tint(c.accent, 0.12), color: c.accent }}><Glyph paths={c.icon} /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold leading-tight text-midnight-navy">{c.title}</span>
              <span className="mt-0.5 block font-body text-[13px] text-charcoal/55">{c.desc}</span>
            </span>
            <span className="shrink-0 rounded-full bg-warm-ivory px-2.5 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-wide text-charcoal/45">Soon</span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center font-body text-xs text-charcoal/45">Your library fills up as you unlock experiences and save what matters. More arrives in a later release.</p>
    </CompanionChrome>
  );
}
