"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CompanionChrome from "@/components/companion/CompanionChrome";
import SafetyInterstitial, { type SafetyPayload } from "@/components/companion/SafetyInterstitial";
import { PLANNER_FIELDS } from "@/lib/companion";

// The 12 planner fields grouped into readable sections.
const GROUPS = [
  { title: "The conversation", keys: ["discuss", "why_matters", "hoped_outcome"] },
  { title: "What you know", keys: ["facts", "assumptions"] },
  { title: "Understanding each other", keys: ["want_understood", "want_to_understand"] },
  { title: "How to say it", keys: ["boundary_request", "how_communicate", "respectful_looks_like"] },
  { title: "When and where", keys: ["when_where"] },
  { title: "Afterward", keys: ["after_reflection"] },
];
const LABEL: Record<string, string> = Object.fromEntries(PLANNER_FIELDS.map((f) => [f.key, f.label]));

export default function CompanionPlannerEdit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [notFound, setNotFound] = useState(false);
  const [safety, setSafety] = useState<SafetyPayload | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch(`/api/companion/planner/${id}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: { plan: { fields: Record<string, string> } }) => setFields(d.plan.fields ?? {})).catch(() => setNotFound(true));
  }, [id]);

  function onChange(key: string, v: string) {
    const next = { ...fields, [key]: v };
    setFields(next); setState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const r = await fetch(`/api/companion/planner/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: next }) }).then((res) => res.json()).catch(() => null);
      setState("saved");
      if (r?.safety) setSafety(r.safety as SafetyPayload);
    }, 700);
  }

  async function del() { if (!confirm("Delete this conversation plan?")) return; await fetch(`/api/companion/planner/${id}`, { method: "DELETE" }); router.replace("/companion/planner"); }

  if (notFound) return <CompanionChrome active="none"><p className="font-body text-sm text-charcoal/55">This plan isn&apos;t available.</p></CompanionChrome>;

  return (
    <CompanionChrome active="none">
      {safety && <SafetyInterstitial payload={safety} onClose={() => setSafety(null)} />}
      <div className="flex items-center justify-between">
        <button onClick={() => router.replace("/companion/planner")} className="flex items-center gap-1 font-ui text-sm text-charcoal/55 hover:text-charcoal"><span aria-hidden="true">←</span> Plans</button>
        <span className="font-ui text-xs text-charcoal/40">{state === "saving" ? "Saving…" : state === "saved" ? "Saved" : ""}</span>
      </div>

      <p className="mt-4 font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Conversation Planner</p>
      <h1 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-midnight-navy">Plan the conversation</h1>
      <p className="mt-1 font-body text-sm leading-relaxed text-charcoal/55">Work through what you want to say, at your own pace. Everything saves privately as you go.</p>

      <div className="mt-6 space-y-7">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="font-display text-lg font-semibold text-midnight-navy">{g.title}</h2>
            <div className="mt-1.5 h-px bg-light-gray" />
            <div className="mt-3 space-y-2.5">
              {g.keys.map((k) => (
                <div key={k} className="rounded-2xl border border-light-gray bg-white p-4">
                  <label htmlFor={k} className="block font-display text-[17px] font-semibold leading-snug text-midnight-navy">{LABEL[k]}</label>
                  <textarea id={k} value={fields[k] ?? ""} onChange={(e) => onChange(k, e.target.value)} rows={2}
                    className="mt-2.5 w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-3 py-2.5 font-body text-sm leading-relaxed text-charcoal focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button onClick={del} className="mt-7 font-ui text-sm text-coral-rose hover:underline">Delete plan</button>
    </CompanionChrome>
  );
}
