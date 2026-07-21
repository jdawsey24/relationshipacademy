"use client";

import { useEffect, useRef, useState } from "react";
import CompanionChrome from "@/components/companion/CompanionChrome";
import SafetyInterstitial, { type SafetyPayload } from "@/components/companion/SafetyInterstitial";

interface Section { key: string; label: string; body: string; updated_at: string | null }

// The 21 blueprint sections grouped into readable themes.
const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Your vision", keys: ["vision", "core_values", "relationship_commitment"] },
  { title: "Your emotional world", keys: ["emotional_safety", "what_makes_me_withdraw", "what_helps_me_trust", "what_overwhelms_me", "what_helps_me_reconnect"] },
  { title: "Your story", keys: ["experiences_that_shaped_me", "lessons_learned", "patterns_to_change", "strengths_developed"] },
  { title: "Who you want to be", keys: ["qualities_to_embody", "qualities_i_value", "growth_priorities"] },
  { title: "What to look for", keys: ["green_flags", "yellow_flags", "red_flags"] },
  { title: "Your boundaries", keys: ["boundaries", "non_negotiables"] },
  { title: "Your support", keys: ["support_system"] },
];

export default function CompanionBlueprint() {
  const [sections, setSections] = useState<Section[] | null>(null);
  const [safety, setSafety] = useState<SafetyPayload | null>(null);
  useEffect(() => { fetch("/api/companion/blueprint").then((r) => r.ok ? r.json() : null).then((d) => setSections(d?.sections ?? [])).catch(() => {}); }, []);

  const byKey = new Map((sections ?? []).map((s) => [s.key, s]));
  const total = sections?.length ?? 0;
  const filled = (sections ?? []).filter((s) => s.body?.trim()).length;
  const pct = total ? Math.round((filled / total) * 100) : 0;

  return (
    <CompanionChrome active="blueprint">
      {safety && <SafetyInterstitial payload={safety} onClose={() => setSafety(null)} />}
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Blueprint</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy">Your blueprint</h1>
      <p className="mt-1 font-body text-sm leading-relaxed text-charcoal/60">A living picture of what matters to you. Fill it in gradually — nothing needs finishing in one sitting.</p>

      {sections !== null && (
        <div className="mt-4">
          <div className="flex items-center justify-between font-ui text-[11px] text-charcoal/45">
            <span>{filled} of {total} filled in</span><span>{pct}%</span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-light-gray">
            <div className="h-full rounded-full bg-midnight-navy transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {sections === null ? <p className="mt-5 font-body text-sm text-charcoal/50">Loading…</p> : (
        <div className="mt-6 space-y-7">
          {GROUPS.map((g) => {
            const items = g.keys.map((k) => byKey.get(k)).filter(Boolean) as Section[];
            if (items.length === 0) return null;
            return (
              <section key={g.title}>
                <h2 className="font-display text-lg font-semibold text-midnight-navy">{g.title}</h2>
                <div className="mt-1.5 h-px bg-light-gray" />
                <div className="mt-3 space-y-2.5">
                  {items.map((s) => <SectionEditor key={s.key} section={s} onSafety={setSafety} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </CompanionChrome>
  );
}

function SectionEditor({ section, onSafety }: { section: Section; onSafety: (p: SafetyPayload) => void }) {
  const [text, setText] = useState(section.body);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onChange(v: string) {
    setText(v); setState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const r = await fetch("/api/companion/blueprint", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: section.key, text: v }) }).then((res) => res.json()).catch(() => null);
      setState("saved");
      if (r?.safety) onSafety(r.safety as SafetyPayload);
    }, 800);
  }

  return (
    <div className="rounded-2xl border border-light-gray bg-white p-4">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={section.key} className="font-display text-[17px] font-semibold leading-snug text-midnight-navy">{section.label}</label>
        <span className="shrink-0 font-ui text-[10px] text-charcoal/40">{state === "saving" ? "Saving…" : state === "saved" ? "Saved" : ""}</span>
      </div>
      <textarea id={section.key} value={text} onChange={(e) => onChange(e.target.value)} rows={3} placeholder="Write freely, whenever you're ready…"
        className="mt-2.5 w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-3 py-2.5 font-body text-sm leading-relaxed text-charcoal placeholder:text-charcoal/35 focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10" />
    </div>
  );
}
