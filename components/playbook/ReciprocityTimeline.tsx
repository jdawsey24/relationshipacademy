"use client";

import { useState } from "react";

// SIGNATURE interaction (OBSERVE / S6). A two-lane teaching simulation — NOT a tracker
// of a real person. Two guided passes contrast over-pursuit (filling every gap → the
// other lane stays unreadable) with leaving space (the other lane's contribution, in
// DIFFERENT forms, becomes information). Reciprocity is shown at the PATTERN level —
// never matched turns, never a scoreboard.

type Token = { id: number; label: string };

// The Them-lane contributions are deliberately different in FORM from the You moves,
// vary in number, and sometimes are absent — a pattern of participation, not a mirror.
const SPACE_SCRIPT: { you: string; them: string[] }[] = [
  { you: "You reach out", them: ["Follows through"] },
  { you: "You share something real", them: ["Asks about you", "Makes a plan"] },
  { you: "You reach out again", them: [] }, // sometimes nothing comes back — also information
  { you: "You leave a little room", them: ["Makes time"] }, // they can initiate too
];

function Lane({ who, tokens, muted }: { who: string; tokens: Token[]; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-light-gray bg-white/70 p-3">
      <p className="mb-2 font-ui text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">{who}</p>
      <div className="flex min-h-[2.75rem] flex-wrap items-center gap-1.5">
        {tokens.length === 0 ? (
          <span className={`font-body text-sm italic ${muted ? "text-charcoal/30" : "text-charcoal/40"}`}>
            {muted ? "— no room to see —" : "—"}
          </span>
        ) : (
          tokens.map((t) => (
            <span
              key={t.id}
              className="motion-safe:animate-[fadeIn_.35s_ease] rounded-full bg-coral-rose/12 px-3 py-1 font-ui text-[13px] text-midnight-navy"
            >
              {t.label}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default function ReciprocityTimeline({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"pursuit" | "pursuitInsight" | "space" | "spaceInsight">("pursuit");
  const [you, setYou] = useState<Token[]>([]);
  const [them, setThem] = useState<Token[]>([]);
  const [step, setStep] = useState(0);
  const nid = () => Date.now() + Math.random();

  // Pass 1 — over-pursuit: every tap adds a You move; the Them lane stays unreadable.
  const pursue = () => {
    const next = [...you, { id: nid(), label: "You reach out" }];
    setYou(next);
    if (next.length >= 4) setPhase("pursuitInsight");
  };

  const startSpace = () => {
    setYou([]); setThem([]); setStep(0); setPhase("space");
  };

  // Pass 2 — leaving space: each tap plays the next scripted beat; Them contributes in
  // varied forms (or not), revealing a pattern rather than matched turns.
  const leaveSpace = () => {
    const beat = SPACE_SCRIPT[step];
    setYou((y) => [...y, { id: nid(), label: beat.you }]);
    setThem((t) => [...t, ...beat.them.map((l) => ({ id: nid(), label: l }))]);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= SPACE_SCRIPT.length) setTimeout(() => setPhase("spaceInsight"), 350);
  };

  return (
    <div className="rounded-2xl border border-light-gray bg-warm-ivory/60 p-4">
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>

      <div className="grid gap-2.5">
        <Lane who="You" tokens={you} />
        <Lane who="Them" tokens={them} muted={phase === "pursuit" || phase === "pursuitInsight"} />
      </div>

      <div className="mt-4">
        {phase === "pursuit" && (
          <div className="text-center">
            <p className="mb-3 font-body text-[15px] text-charcoal/75">When you fill every gap…</p>
            <button onClick={pursue} className="min-h-[44px] rounded-full bg-midnight-navy px-6 font-ui text-sm font-semibold text-white hover:opacity-90">
              Reach out →
            </button>
          </div>
        )}
        {phase === "pursuitInsight" && (
          <div className="text-center">
            <p className="mx-auto mb-3 max-w-md font-body text-[15px] leading-relaxed text-charcoal/80">
              …you&rsquo;re the only one showing up. There&rsquo;s no room to see what they&rsquo;d bring.
            </p>
            <button onClick={startSpace} className="min-h-[44px] rounded-full bg-coral-rose px-6 font-ui text-sm font-semibold text-white hover:opacity-90">
              Now try leaving space
            </button>
          </div>
        )}
        {phase === "space" && (
          <div className="text-center">
            <p className="mb-3 font-body text-[15px] text-charcoal/75">When you leave a little room…</p>
            <button onClick={leaveSpace} className="min-h-[44px] rounded-full bg-midnight-navy px-6 font-ui text-sm font-semibold text-white hover:opacity-90">
              Leave space →
            </button>
            <p className="mt-3 font-ui text-xs text-charcoal/40">{step}/{SPACE_SCRIPT.length}</p>
          </div>
        )}
        {phase === "spaceInsight" && (
          <div className="text-center">
            <p className="mx-auto mb-2 max-w-md font-body text-[15px] leading-relaxed text-charcoal/80">
              Their part can look different from yours &mdash; a follow-through, a plan, a question. That still counts.
              Sometimes nothing comes back, and that&rsquo;s information too. You&rsquo;re watching for a pattern of both
              people showing up, not a perfect match.
            </p>
            <p className="mx-auto mb-4 max-w-md font-body text-[15px] font-semibold text-midnight-navy">
              Reciprocity is information &mdash; not a scoreboard.
            </p>
            <button onClick={onDone} className="min-h-[48px] rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white hover:opacity-90">
              I see it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
