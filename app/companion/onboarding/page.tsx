"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RELATIONSHIP_STATUSES, INTEREST_TOPICS } from "@/lib/companion";

// Post-entitlement onboarding: intro -> status -> interests -> privacy ack.
// All copy is placeholder. Status filters/prioritizes; it never assigns a phase.
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
      {/* Progress */}
      <div className="mb-8 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-midnight-navy" : "bg-light-gray"}`} />)}
      </div>

      {step === 0 && (
        <Section title="A private space to process" onNext={() => setStep(1)} nextLabel="Get started">
          <p className="font-body text-charcoal/75">[APPROVED INTRODUCTION TO BE PROVIDED] — The Relationship Companion is a private space to process what you&apos;re navigating and make more intentional decisions. It&apos;s not therapy, and there&apos;s no schedule to keep.</p>
        </Section>
      )}

      {step === 1 && (
        <Section title="Which best describes your relationship right now?" onNext={() => status && setStep(2)} nextDisabled={!status}>
          <div className="space-y-2.5">
            {RELATIONSHIP_STATUSES.map((s) => (
              <button key={s.key} onClick={() => setStatus(s.key)}
                className={`block w-full rounded-2xl border px-5 py-4 text-left font-body ${status === s.key ? "border-midnight-navy bg-midnight-navy/5 text-midnight-navy" : "border-light-gray bg-white text-charcoal"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="What do you often want support with?" subtitle="Optional — you can change this anytime. These are preferences, not results." onNext={() => setStep(3)}>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TOPICS.map((t) => (
              <button key={t} onClick={() => toggle(t)}
                className={`rounded-full border px-4 py-2 font-ui text-sm ${interests.includes(t) ? "border-midnight-navy bg-midnight-navy text-white" : "border-light-gray bg-white text-charcoal/75"}`}>
                {t}
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section title="Before you begin" onNext={finish} nextDisabled={!ack || busy} nextLabel={busy ? "Setting up…" : "Enter the Companion"}>
          <div className="rounded-2xl border border-light-gray bg-white p-5 font-body text-sm leading-relaxed text-charcoal/75">
            <p>[APPROVED LEGAL / PRIVACY COPY TO BE PROVIDED]</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Your entries are private to you.</li>
              <li>This is an educational, reflective tool.</li>
              <li>It is not therapy, diagnosis, crisis care, or emergency support.</li>
              <li>It does not make relationship decisions for you.</li>
            </ul>
          </div>
          <label className="mt-4 flex items-start gap-2.5 font-body text-sm text-charcoal/80">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1" />
            <span>I understand and agree.</span>
          </label>
          {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        </Section>
      )}
    </main>
  );
}

function Section({ title, subtitle, children, onNext, nextLabel = "Continue", nextDisabled }: {
  title: string; subtitle?: string; children: React.ReactNode; onNext: () => void; nextLabel?: string; nextDisabled?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-balance font-display text-2xl font-semibold leading-tight text-midnight-navy">{title}</h1>
      {subtitle && <p className="mt-2 font-body text-sm text-charcoal/60">{subtitle}</p>}
      <div className="mt-6 flex-1">{children}</div>
      <button onClick={onNext} disabled={nextDisabled}
        className="mt-6 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white disabled:opacity-40">
        {nextLabel}
      </button>
    </div>
  );
}
