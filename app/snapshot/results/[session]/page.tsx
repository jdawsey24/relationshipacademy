"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Results {
  assessment_display: string;
  primary: { id: number; name: string; playbook_title: string; playbook_subtitle: string; alignment_paragraph: string } | null;
  secondary: { id: number; name: string; secondary_blurb: string } | null;
}

export default function ResultsPage() {
  const { session } = useParams<{ session: string }>();
  const [data, setData] = useState<Results | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/snapshot/results?session=${session}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: Results) => setData(d))
      .catch(() => setError(true));
  }, [session]);

  if (error) return <Centered>We couldn&apos;t load your results.</Centered>;
  if (!data) return <Centered>Preparing your results…</Centered>;
  if (!data.primary) return <Centered>Your results are being prepared.</Centered>;

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Your Relationship Snapshot&trade;</p>

      {/* Primary — the validating read */}
      <section className="mt-6">
        <h1 className="text-balance text-center font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">{data.primary.name}</h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/85">{data.primary.alignment_paragraph}</p>
      </section>

      {/* Secondary — named + one line, no CTA */}
      {data.secondary && (
        <section className="mt-8 rounded-2xl border border-light-gray bg-white/70 p-5">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">You may also relate to</p>
          <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{data.secondary.name}</p>
          <p className="mt-1 font-body text-[15px] leading-relaxed text-charcoal/80">{data.secondary.secondary_blurb}</p>
        </section>
      )}

      {/* Playbook — CTA on Primary only */}
      <PlaybookCard session={session} title={data.primary.playbook_title} subtitle={data.primary.playbook_subtitle} />
    </main>
  );
}

function PlaybookCard({ session, title, subtitle }: { session: string; title: string; subtitle: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/snapshot/convert`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: session, email }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Something went wrong."); return; }
    // Conversion event for ad/analytics tracking (Meta Pixel + GA, loaded site-wide).
    const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
    try { w.fbq?.("track", "Lead", { content_name: "Relationship Snapshot Playbook" }); } catch { /* noop */ }
    try { w.gtag?.("event", "snapshot_conversion", { event_category: "snapshot" }); } catch { /* noop */ }
    setDone(true);
  }

  return (
    <section className="mt-10 rounded-2xl bg-midnight-navy px-6 py-8 text-center text-white">
      <p className="font-ui text-xs uppercase tracking-wide text-white/60">Your next step</p>
      <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md font-body text-[17px] leading-relaxed text-white/85">{subtitle}</p>

      {done ? (
        <p className="mx-auto mt-6 max-w-sm font-body text-white/90">Check your inbox — your first email is on its way to <span className="font-semibold">{email}</span>.</p>
      ) : open ? (
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email"
            className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none" />
          <button onClick={submit} disabled={busy || !email.trim()} className="rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            {busy ? "Sending…" : "Send me my Playbook"}
          </button>
          {err && <p className="text-sm text-soft-coral">{err}</p>}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90">
          Get Your Playbook →
        </button>
      )}
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-[70vh] items-center justify-center px-6 text-center"><p className="text-charcoal/60">{children}</p></main>;
}
