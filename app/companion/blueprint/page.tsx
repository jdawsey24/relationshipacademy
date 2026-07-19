"use client";

import { useEffect, useRef, useState } from "react";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Section { key: string; label: string; body: string; updated_at: string | null }

export default function CompanionBlueprint() {
  const [sections, setSections] = useState<Section[] | null>(null);
  useEffect(() => { fetch("/api/companion/blueprint").then((r) => r.ok ? r.json() : null).then((d) => setSections(d?.sections ?? [])).catch(() => {}); }, []);

  return (
    <CompanionChrome active="blueprint">
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Blueprint</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">A living picture of what matters to you. Fill it in gradually — nothing needs finishing in one sitting.</p>

      <div className="mt-5 space-y-3">
        {sections === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          sections.map((s) => <SectionEditor key={s.key} section={s} />)}
      </div>
    </CompanionChrome>
  );
}

function SectionEditor({ section }: { section: Section }) {
  const [text, setText] = useState(section.body);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [updated, setUpdated] = useState(section.updated_at);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onChange(v: string) {
    setText(v); setState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await fetch("/api/companion/blueprint", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: section.key, text: v }) }).catch(() => {});
      setState("saved"); setUpdated(new Date().toISOString());
    }, 800);
  }

  return (
    <section className="rounded-2xl border border-light-gray bg-white p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-display font-semibold text-midnight-navy">{section.label}</p>
        <span className="font-ui text-[10px] text-charcoal/40">{state === "saving" ? "Saving…" : updated ? `Saved ${new Date(updated).toLocaleDateString()}` : ""}</span>
      </div>
      <textarea value={text} onChange={(e) => onChange(e.target.value)} rows={3} placeholder="[APPROVED PROMPT TO BE PROVIDED]"
        className="mt-2 w-full rounded-xl border border-light-gray bg-warm-ivory/40 px-3 py-2 font-body text-sm leading-relaxed focus:border-midnight-navy/40 focus:outline-none" />
    </section>
  );
}
