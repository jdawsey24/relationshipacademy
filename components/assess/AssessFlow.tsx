"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { STRUCTURAL_MARKERS } from "@/lib/studioScoring";
import { domainLabel } from "@/lib/studioAssessment";

// Shared single-page assessment flow for a published Studio instrument. Mounted
// by both /assess/[slug] and the /snapshot flagship — the only difference is the
// results URL, passed in as resultsHref so each host keeps its own URL space.

type Item = { item_id: string; text: string; domain: string | null; phase: string | null; reverse_scored: boolean };
type Opt = { value: number; label: string };
interface Data { instrument: { name: string; purpose: string | null; estimated_time: string | null }; items: Item[]; responseOptions: Opt[] }
type Step = "intro" | "context" | "questions" | "capture";

export default function AssessFlow({ slug, resultsHref }: { slug: string; resultsHref: (attemptId: string) => string }) {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [structural, setStructural] = useState<string>("");
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [domainIdx, setDomainIdx] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/assess/${encodeURIComponent(slug)}/items`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: Data) => setData(d))
      .catch(() => setNotFound(true));
  }, [slug]);
  useEffect(() => { load(); }, [load]);

  const sections = useMemo(() => {
    const order: string[] = [];
    const by: Record<string, Item[]> = {};
    for (const it of data?.items ?? []) {
      const d = it.domain ?? "general";
      if (!by[d]) { by[d] = []; order.push(d); }
      by[d].push(it);
    }
    return order.map((d) => ({ domain: d, items: by[d] }));
  }, [data]);

  if (notFound) return <Centered><p className="text-charcoal/70">This assessment isn&apos;t available right now.</p></Centered>;
  if (!data) return <Centered><p className="text-charcoal/60">Loading…</p></Centered>;

  const opts = data.responseOptions;
  const section = sections[domainIdx];
  const sectionAnswered = section ? section.items.every((it) => responses[it.item_id]) : false;
  const totalAnswered = Object.keys(responses).length;

  async function submit() {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/assess/${encodeURIComponent(slug)}/score`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structural_context: structural, responses, name, email }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok || !d.attempt_id) { setErr(d.error ?? "Something went wrong."); return; }
    router.push(resultsHref(d.attempt_id));
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-8 text-center"><Logo variant="full" href="/" className="mx-auto h-10" /></header>

      {step === "intro" && (
        <section className="text-center">
          <h1 className="font-display text-3xl font-semibold text-midnight-navy">{data.instrument.name}</h1>
          {data.instrument.purpose && <p className="mx-auto mt-3 max-w-lg font-body text-charcoal/80">{data.instrument.purpose}</p>}
          <p className="mt-4 text-sm text-charcoal/50">{data.items.length} questions{data.instrument.estimated_time ? ` · about ${data.instrument.estimated_time}` : ""}</p>
          <button onClick={() => setStep("context")} className="mt-8 rounded-full bg-midnight-navy px-8 py-3 font-ui text-sm font-semibold text-white hover:bg-midnight-navy/90">Begin</button>
        </section>
      )}

      {step === "context" && (
        <section>
          <h2 className="text-center font-display text-2xl font-semibold text-midnight-navy">Where are you in your relationship?</h2>
          <p className="mt-2 text-center text-sm text-charcoal/60">This helps us interpret your results.</p>
          <div className="mt-6 space-y-2">
            {STRUCTURAL_MARKERS.map((m) => (
              <button key={m} onClick={() => setStructural(m)} className={`block w-full rounded-xl border px-4 py-3 text-left font-body transition-colors ${structural === m ? "border-midnight-navy bg-midnight-navy/5" : "border-light-gray hover:border-midnight-navy/50"}`}>{m}</button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep("intro")} className="text-sm text-charcoal/50 hover:text-charcoal">Back</button>
            <button disabled={!structural} onClick={() => setStep("questions")} className="rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-semibold text-white disabled:opacity-40">Continue</button>
          </div>
        </section>
      )}

      {step === "questions" && section && (
        <section>
          <div className="mb-4">
            <div className="h-1.5 w-full rounded-full bg-light-gray"><div className="h-1.5 rounded-full bg-midnight-navy transition-all" style={{ width: `${Math.round(((domainIdx) / sections.length) * 100)}%` }} /></div>
            <p className="mt-2 text-xs text-charcoal/50">Section {domainIdx + 1} of {sections.length} · {domainLabel(section.domain)}</p>
          </div>
          <div className="space-y-6">
            {section.items.map((it) => (
              <div key={it.item_id}>
                <p className="font-body text-charcoal">{it.text}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {opts.map((o) => (
                    <button key={o.value} onClick={() => setResponses((r) => ({ ...r, [it.item_id]: o.value }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${responses[it.item_id] === o.value ? "border-midnight-navy bg-midnight-navy text-white" : "border-light-gray text-charcoal/70 hover:border-midnight-navy/50"}`}>{o.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => (domainIdx === 0 ? setStep("context") : setDomainIdx((i) => i - 1))} className="text-sm text-charcoal/50 hover:text-charcoal">Back</button>
            <button disabled={!sectionAnswered} onClick={() => (domainIdx === sections.length - 1 ? setStep("capture") : setDomainIdx((i) => i + 1))} className="rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-semibold text-white disabled:opacity-40">{domainIdx === sections.length - 1 ? "Continue" : "Next"}</button>
          </div>
        </section>
      )}

      {step === "capture" && (
        <section className="mx-auto max-w-md">
          <h2 className="text-center font-display text-2xl font-semibold text-midnight-navy">Where should we send your results?</h2>
          <div className="mt-6 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" className="w-full rounded-lg border border-light-gray px-3 py-2.5 text-sm" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-lg border border-light-gray px-3 py-2.5 text-sm" />
          </div>
          {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
          <p className="mt-2 text-xs text-charcoal/45">{totalAnswered} of {data.items.length} answered.</p>
          <div className="mt-6 flex justify-between">
            <button onClick={() => { setStep("questions"); setDomainIdx(sections.length - 1); }} className="text-sm text-charcoal/50 hover:text-charcoal">Back</button>
            <button disabled={busy || !name.trim() || !email.trim() || totalAnswered < data.items.length} onClick={submit} className="rounded-full bg-midnight-navy px-8 py-2.5 font-ui text-sm font-semibold text-white disabled:opacity-40">{busy ? "Scoring…" : "See my results"}</button>
          </div>
        </section>
      )}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-6"><div className="text-center">{children}</div></main>;
}
