"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RELATIONSHIP_STATUSES, INTEREST_TOPICS } from "@/lib/companion";
import { STATUS_META } from "@/lib/companion/statusMeta";

// Post-entitlement onboarding: intro -> status -> interests -> privacy ack.
// Copy is placeholder where marked. Status filters/prioritizes; it never assigns a phase.

function Glyph({ paths, size = 20 }: { paths: string[]; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function CompanionOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggle(topic: string) {
    setInterests((prev) => prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]);
  }

  async function finish() {
    setBusy(true); setErr(null);
    const r = await fetch("/api/companion/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status_key: status, interests }) });
    if (!r.ok) { const d = await r.json().catch(() => ({})); setBusy(false); setErr(d.error ?? "Something went wrong."); return; }
    router.replace("/companion");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-warm-ivory px-6 pb-10 pt-12">
      <div className="mb-8 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-midnight-navy" : "bg-light-gray"}`} />)}
      </div>

      {step === 0 && (
        <Section eyebrow="Welcome" title="A private space to process" onNext={() => setStep(1)} nextLabel="Get started">
          <p className="text-balance font-body text-[16px] leading-relaxed text-charcoal/75">[APPROVED INTRODUCTION TO BE PROVIDED] — The Relationship Companion is a private space to process what you&apos;re navigating and make more intentional decisions. It&apos;s not therapy, and there&apos;s no schedule to keep.</p>
        </Section>
      )}

      {step === 1 && (
        <Section eyebrow="About you" title="Where are you right now?" subtitle="This shapes what we surface first. You can change it anytime." onNext={() => status && setStep(2)} nextDisabled={!status}>
          <div className="space-y-2.5">
            {RELATIONSHIP_STATUSES.map((s) => {
              const sel = status === s.key;
              const m = STATUS_META[s.key];
              return (
                <button key={s.key} onClick={() => setStatus(s.key)}
                  className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all ${sel ? "border-midnight-navy bg-midnight-navy/[0.04]" : "border-light-gray bg-white hover:border-midnight-navy/25"}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${sel ? "bg-midnight-navy text-white" : "bg-warm-ivory text-midnight-navy/65"}`}>
                    <Glyph paths={m?.icon ?? []} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-lg font-semibold text-midnight-navy">{s.label}</span>
                    <span className="block font-body text-[13px] text-charcoal/55">{m?.desc}</span>
                  </span>
                  <span className={`shrink-0 text-midnight-navy transition-opacity ${sel ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
                    <Glyph paths={["M5 12l5 5 9-11"]} size={18} />
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section eyebrow="About you" title="What do you often want support with?" subtitle="Optional — these are preferences, not results. You can change them anytime." onNext={() => setStep(3)}>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TOPICS.map((t) => {
              const on = interests.includes(t);
              return (
                <button key={t} onClick={() => toggle(t)}
                  className={`rounded-full border px-4 py-2 font-ui text-sm transition-colors ${on ? "border-midnight-navy bg-midnight-navy text-white" : "border-light-gray bg-white text-charcoal/75 hover:border-midnight-navy/30"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section eyebrow="One last thing" title="Before you begin" onNext={finish} nextDisabled={!ack || busy} nextLabel={busy ? "Setting up…" : "Enter the Companion"}>
          <div className="rounded-2xl border border-light-gray bg-white p-5 font-body text-sm leading-relaxed text-charcoal/75">
            <p>[APPROVED LEGAL / PRIVACY COPY TO BE PROVIDED]</p>
            <ul className="mt-3 space-y-2">
              {["Your entries are private to you.", "This is an educational, reflective tool.", "It is not therapy, diagnosis, crisis care, or emergency support.", "It does not make relationship decisions for you."].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-midnight-navy/60" aria-hidden="true"><Glyph paths={["M5 12l5 5 9-11"]} size={15} /></span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <label className="mt-4 flex items-start gap-2.5 font-body text-sm text-charcoal/80">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 h-4 w-4 accent-midnight-navy" />
            <span>I understand and agree.</span>
          </label>
          {err && <p className="mt-2 font-body text-sm text-coral-rose">{err}</p>}
        </Section>
      )}
    </main>
  );
}

function Section({ eyebrow, title, subtitle, children, onNext, nextLabel = "Continue", nextDisabled }: {
  eyebrow?: string; title: string; subtitle?: string; children: React.ReactNode; onNext: () => void; nextLabel?: string; nextDisabled?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {eyebrow && <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">{eyebrow}</p>}
      <h1 className="mt-1.5 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy">{title}</h1>
      {subtitle && <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/60">{subtitle}</p>}
      <div className="mt-6 flex-1">{children}</div>
      <button onClick={onNext} disabled={nextDisabled}
        className="mt-6 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white transition-opacity disabled:opacity-40">
        {nextLabel}
      </button>
    </div>
  );
}
