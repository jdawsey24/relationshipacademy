"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CompanionChrome from "@/components/companion/CompanionChrome";
import { PLANNER_FIELDS } from "@/lib/companion";

export default function CompanionPlannerEdit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [notFound, setNotFound] = useState(false);
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
      await fetch(`/api/companion/planner/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: next }) }).catch(() => {});
      setState("saved");
    }, 700);
  }

  async function del() { if (!confirm("Delete this conversation plan?")) return; await fetch(`/api/companion/planner/${id}`, { method: "DELETE" }); router.replace("/companion/planner"); }

  if (notFound) return <CompanionChrome active="none"><p className="font-body text-sm text-charcoal/55">This plan isn&apos;t available.</p></CompanionChrome>;

  return (
    <CompanionChrome active="none">
      <div className="flex items-center justify-between">
        <button onClick={() => router.replace("/companion/planner")} className="font-ui text-sm text-charcoal/55">← Plans</button>
        <span className="font-ui text-xs text-charcoal/40">{state === "saving" ? "Saving…" : state === "saved" ? "Saved" : ""}</span>
      </div>
      <h1 className="mt-3 font-display text-2xl font-semibold text-midnight-navy">Plan the conversation</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">[APPROVED PLANNER GUIDANCE TO BE PROVIDED]</p>

      <div className="mt-5 space-y-3">
        {PLANNER_FIELDS.map((f) => (
          <label key={f.key} className="block rounded-2xl border border-light-gray bg-white p-4">
            <span className="font-body text-sm font-medium text-midnight-navy">{f.label}</span>
            <textarea value={fields[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)} rows={2}
              className="mt-2 w-full rounded-xl border border-light-gray bg-warm-ivory/40 px-3 py-2 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />
          </label>
        ))}
      </div>
      <button onClick={del} className="mt-6 font-ui text-sm text-coral-rose">Delete plan</button>
    </CompanionChrome>
  );
}
