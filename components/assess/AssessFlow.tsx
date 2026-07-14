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
        <section className="mx-auto flex min-h-[68vh] max-w-xl flex-col items-center justify-center text-center">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Free relationship assessment</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">{data.instrument.name}</h1>
          <p className="mx-auto mt-4 max-w-md font-body text-lg leading-relaxed text-charcoal/75">A few quiet minutes to see how your relationship is really doing — what&apos;s working, where there&apos;s room to grow, and what to focus on next.</p>

          <div className="mt-8 w-full max-w-sm rounded-2xl border border-light-gray bg-white/70 p-5 text-left shadow-sm shadow-midnight-navy/5">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">Before you begin</p>
            <ul className="mt-3 space-y-2.5">
              {[
                "Answer based on how things are right now — not how you'd like them to be.",
                "There are no right or wrong answers.",
                "Your responses are private.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 font-body text-sm leading-relaxed text-charcoal/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => setStep("context")} className="mt-8 rounded-full bg-midnight-navy px-10 py-3.5 font-ui text-base font-semibold text-white transition-colors hover:bg-midnight-navy/90">Begin</button>
          <p className="mt-4 font-ui text-sm text-charcoal/50">{data.items.length} questions · about {data.instrument.estimated_time || "6–10 minutes"}</p>
        </section>
      )}

      {step === "context" && (
        <section className="mx-auto flex min-h-[68vh] max-w-md flex-col justify-center">
          <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">A little context</p>
          <h2 className="mt-2 text-balance text-center font-display text-3xl font-semibold text-midnight-navy">Where are you in your relationship?</h2>
          <p className="mt-2 text-center font-body text-charcoal/60">This helps us interpret your results.</p>
          <div className="mt-7 space-y-2.5">
            {STRUCTURAL_MARKERS.map((m) => (
              <button key={m} onClick={() => setStructural(m)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left font-body transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight-navy/40 ${structural === m ? "border-midnight-navy bg-midnight-navy/5 text-midnight-navy" : "border-light-gray text-charcoal hover:border-midnight-navy/50"}`}>
                <span>{m}</span>
                {structural === m && <span className="text-midnight-navy" aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => setStep("intro")} className="font-ui text-sm text-charcoal/50 hover:text-charcoal">Back</button>
            <button disabled={!structural} onClick={() => setStep("questions")} className="rounded-full bg-midnight-navy px-7 py-2.5 font-ui text-sm font-semibold text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-40">Continue</button>
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
        <section className="mx-auto flex min-h-[68vh] max-w-md flex-col justify-center">
          <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Almost there</p>
          <h2 className="mt-2 text-balance text-center font-display text-3xl font-semibold text-midnight-navy">Where should we send your results?</h2>
          <p className="mx-auto mt-2 max-w-sm text-center font-body text-charcoal/60">We&apos;ll email your results, plus a few short follow-ups to help you put them into practice. Unsubscribe anytime.</p>
          <div className="mt-7 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" className="w-full rounded-lg border border-light-gray px-3.5 py-3 text-sm transition-colors focus:border-midnight-navy focus:outline-none focus:ring-2 focus:ring-midnight-navy/25" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-lg border border-light-gray px-3.5 py-3 text-sm transition-colors focus:border-midnight-navy focus:outline-none focus:ring-2 focus:ring-midnight-navy/25" />
          </div>
          {err && <p className="mt-3 text-center text-sm text-coral-rose">{err}</p>}
          <p className="mt-3 text-center text-xs text-charcoal/45">{totalAnswered} of {data.items.length} answered.</p>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => { setStep("questions"); setDomainIdx(sections.length - 1); }} className="font-ui text-sm text-charcoal/50 hover:text-charcoal">Back</button>
            <button disabled={busy || !name.trim() || !email.trim() || totalAnswered < data.items.length} onClick={submit} className="rounded-full bg-midnight-navy px-8 py-2.5 font-ui text-sm font-semibold text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-40">{busy ? "Scoring…" : "See my results"}</button>
          </div>
        </section>
      )}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-6"><div className="text-center">{children}</div></main>;
}
