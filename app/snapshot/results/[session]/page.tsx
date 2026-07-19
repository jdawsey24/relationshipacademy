"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Primary {
  id: number; name: string; result_title: string; core_pattern: string;
  what_this_means: string; why_this_happens: string;
  how_it_may_show_up: string[]; strengths: string[]; blind_spots: string[];
  cost_of_staying_here: string; growth_looks_like: string;
  unmet_need: string; developmental_focus: string;
  playbook_title: string; playbook_subtitle: string; why_this_playbook: string;
  key_takeaway: string; call_to_action: string;
}
interface Results {
  assessment_display: string;
  primary: Primary | null;
  secondary: { id: number; name: string; result_title: string; secondary_blurb: string } | null;
  playbook_url: string | null;
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

  const p = data.primary;
  const title = p.result_title || p.name;

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Your Relationship Snapshot&trade;</p>

      {/* Primary — the full structured read */}
      <section className="mt-6">
        <h1 className="text-balance text-center font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">{title}</h1>
        {p.core_pattern && <p className="mx-auto mt-4 max-w-xl text-balance text-center font-body text-lg leading-relaxed text-charcoal/70">{p.core_pattern}</p>}
      </section>

      <Prose label="What this means" text={p.what_this_means} />
      <Prose label="Why this happens" text={p.why_this_happens} />
      <Bullets label="How it may show up" items={p.how_it_may_show_up} />
      <Bullets label="Strengths" items={p.strengths} />
      <Bullets label="Blind spots" items={p.blind_spots} />
      <Prose label="Cost of staying here" text={p.cost_of_staying_here} />
      <Prose label="Growth looks like" text={p.growth_looks_like} />
      <Prose label="What you're actually looking for" text={p.unmet_need} />
      <Prose label="Developmental focus" text={p.developmental_focus} />

      {/* Playbook — CTA on Primary only */}
      <PlaybookCard
        session={session}
        title={p.playbook_title}
        subtitle={p.playbook_subtitle}
        whyThisPlaybook={p.why_this_playbook}
        keyTakeaway={p.key_takeaway}
        ctaLabel={p.call_to_action}
        playbookUrl={data.playbook_url}
      />

      {/* Secondary — named + one line, no CTA */}
      {data.secondary && (
        <section className="mt-8 rounded-2xl border border-light-gray bg-white/70 p-5">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">You may also relate to</p>
          <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{data.secondary.result_title || data.secondary.name}</p>
          <p className="mt-1 font-body text-[15px] leading-relaxed text-charcoal/80">{data.secondary.secondary_blurb}</p>
        </section>
      )}
    </main>
  );
}

function Prose({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <section className="mt-7">
      <h2 className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">{label}</h2>
      <p className="mt-2 font-body text-[17px] leading-relaxed text-charcoal/85">{text}</p>
    </section>
  );
}

function Bullets({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-7">
      <h2 className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">{label}</h2>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 font-body text-[17px] leading-relaxed text-charcoal/85">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose/70" aria-hidden="true" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlaybookCard({ session, title, subtitle, whyThisPlaybook, keyTakeaway, ctaLabel, playbookUrl }: {
  session: string; title: string; subtitle: string; whyThisPlaybook: string; keyTakeaway: string; ctaLabel: string; playbookUrl: string | null;
}) {
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
      <p className="font-ui text-xs uppercase tracking-wide text-white/60">The Relationship Playbook&trade;</p>
      <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md font-body text-[17px] leading-relaxed text-white/85">{subtitle}</p>
      {whyThisPlaybook && <p className="mx-auto mt-3 max-w-md font-body text-[15px] leading-relaxed text-white/70">{whyThisPlaybook}</p>}

      {done ? (
        <div className="mx-auto mt-6 max-w-sm">
          {playbookUrl ? (
            <>
              <a href={playbookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90">
                Download your Playbook
              </a>
              <p className="mt-3 font-body text-sm text-white/80">A copy is also on its way to <span className="font-semibold">{email}</span>.</p>
            </>
          ) : (
            <p className="font-body text-white/90">You&apos;re all set. Your Playbook for this area is being finalized — I&apos;ll send it to <span className="font-semibold">{email}</span> the moment it&apos;s ready. Watch your inbox for your first steps.</p>
          )}
        </div>
      ) : (
        <>
          {keyTakeaway && <p className="mx-auto mt-5 max-w-md border-t border-white/15 pt-5 font-body text-[15px] italic leading-relaxed text-white/85">{keyTakeaway}</p>}
          {open ? (
            <div className="mx-auto mt-5 flex max-w-sm flex-col gap-2.5">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email"
                className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none" />
              <button onClick={submit} disabled={busy || !email.trim()} className="rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                {busy ? "Sending…" : playbookUrl ? "Get my Playbook" : "Send me my Playbook"}
              </button>
              {err && <p className="text-sm text-soft-coral">{err}</p>}
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90">
              {ctaLabel || "Get Your Playbook"} →
            </button>
          )}
        </>
      )}
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-[70vh] items-center justify-center px-6 text-center"><p className="text-charcoal/60">{children}</p></main>;
}
