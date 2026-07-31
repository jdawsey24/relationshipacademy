"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { PlaybookMark, playbookHue } from "@/components/site/PlaybookMark";
import { IconTile } from "@/components/site/IconTile";

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

const SAGE = "#8A9D8F"; // strengths / steady

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
  const hue = playbookHue(p.id);

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-8" style={{ "--hue": hue } as CSSProperties}>
      <p className="text-center font-ui text-eyebrow font-semibold uppercase text-charcoal/45">Your Relationship Snapshot&trade;</p>

      {/* Hero — the pattern, revealed */}
      <section className="mt-7 flex flex-col items-center text-center">
        <IconTile hue={hue} size="lg">
          <PlaybookMark clusterId={p.id} className="h-9 w-9" />
        </IconTile>
        <h1 className="mt-5 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-[40px]">{title}</h1>
        {p.core_pattern && <p className="mx-auto mt-4 max-w-xl text-balance font-body text-lg leading-relaxed text-charcoal/70">{p.core_pattern}</p>}
      </section>

      <Prose label="What this means" text={p.what_this_means} />
      <Prose label="Why this happens" text={p.why_this_happens} />
      <Bullets label="How it may show up" items={p.how_it_may_show_up} />

      {/* The two-sided read */}
      <TwoUp strengths={p.strengths} blindSpots={p.blind_spots} hue={hue} />

      <Prose label="Cost of staying here" text={p.cost_of_staying_here} />
      <Prose label="Growth looks like" text={p.growth_looks_like} />
      <Prose label="What you're actually looking for" text={p.unmet_need} />
      <Prose label="Developmental focus" text={p.developmental_focus} />

      {/* The heart of it — key takeaway, given a moment */}
      {p.key_takeaway && (
        <section className="mt-12 rounded-3xl px-8 py-10 text-center" style={{ backgroundColor: `${hue}12`, border: `1px solid ${hue}33` }}>
          <p className="font-ui text-eyebrow font-semibold uppercase" style={{ color: hue }}>The heart of it</p>
          <p className="mx-auto mt-3 max-w-xl text-balance font-display text-2xl font-medium italic leading-snug text-midnight-navy">{p.key_takeaway}</p>
        </section>
      )}

      {/* Playbook — CTA on Primary only */}
      <PlaybookCard
        session={session}
        clusterId={p.id}
        title={p.playbook_title}
        subtitle={p.playbook_subtitle}
        whyThisPlaybook={p.why_this_playbook}
        ctaLabel={p.call_to_action}
        available={data.playbook_url != null}
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

// A small hue tick before a section label — replaces the uniform coral labels.
function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className="flex items-center gap-2.5 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
      <span className="h-px w-5 shrink-0" style={{ backgroundColor: color ?? "var(--hue)" }} aria-hidden="true" />
      {children}
    </h2>
  );
}

function Prose({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <section className="mt-8">
      <Label>{label}</Label>
      <p className="mt-2.5 font-body text-[17px] leading-relaxed text-charcoal/85">{text}</p>
    </section>
  );
}

function Bullets({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-8">
      <Label>{label}</Label>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 font-body text-[17px] leading-relaxed text-charcoal/85">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--hue)" }} aria-hidden="true" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Strengths (steady/sage) and blind spots (the cluster hue) side by side — the
// good and the watch-out, encoded in color rather than another identical list.
function TwoUp({ strengths, blindSpots, hue }: { strengths: string[]; blindSpots: string[]; hue: string }) {
  if (!strengths?.length && !blindSpots?.length) return null;
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {strengths?.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ borderColor: `${SAGE}55`, backgroundColor: `${SAGE}12` }}>
          <Label color={SAGE}>Strengths</Label>
          <ul className="mt-3 space-y-2">
            {strengths.map((it, i) => (
              <li key={i} className="flex gap-2.5 font-body text-[15.5px] leading-relaxed text-charcoal/85">
                <svg viewBox="0 0 24 24" width={16} height={16} className="mt-[3px] shrink-0" fill="none" stroke={SAGE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {blindSpots?.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ borderColor: `${hue}55`, backgroundColor: `${hue}12` }}>
          <Label color={hue}>Blind spots</Label>
          <ul className="mt-3 space-y-2">
            {blindSpots.map((it, i) => (
              <li key={i} className="flex gap-2.5 font-body text-[15.5px] leading-relaxed text-charcoal/85">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: hue }} aria-hidden="true" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PlaybookCard({ session, clusterId, title, subtitle, whyThisPlaybook, ctaLabel, available }: {
  session: string; clusterId: number; title: string; subtitle: string; whyThisPlaybook: string; ctaLabel: string; available: boolean;
}) {
  const [buying, setBuying] = useState(false);
  const [buyErr, setBuyErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Primary CTA — start the paid checkout. Ownership must attach to an account,
  // so an unauthenticated buyer is sent to sign in and returned here.
  async function buy() {
    setBuying(true); setBuyErr(null);
    try {
      const res = await fetch(`/api/playbooks/checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cluster_id: clusterId, session_id: session }),
      });
      if (res.status === 401) {
        window.location.href = `/academy/login?next=${encodeURIComponent(`/snapshot/results/${session}`)}`;
        return;
      }
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.url) { setBuyErr(d.error ?? "Could not start checkout."); setBuying(false); return; }
      // High-intent signal for ad/analytics tracking (Meta Pixel + GA).
      const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
      try { w.fbq?.("track", "InitiateCheckout", { content_name: "Relationship Playbook" }); } catch { /* noop */ }
      window.location.href = d.url;
    } catch {
      setBuyErr("Could not start checkout."); setBuying(false);
    }
  }

  // Secondary — capture the lead (email + nurture) for people not ready to buy.
  // Keeps list growth + the Meta Pixel Lead signal; nurture soft-sells the Playbook.
  async function submit() {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/snapshot/convert`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: session, email }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Something went wrong."); return; }
    const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
    try { w.fbq?.("track", "Lead", { content_name: "Relationship Snapshot Playbook" }); } catch { /* noop */ }
    try { w.gtag?.("event", "snapshot_conversion", { event_category: "snapshot" }); } catch { /* noop */ }
    setDone(true);
  }

  return (
    <section className="mt-10 overflow-hidden rounded-2xl bg-midnight-navy px-6 py-8 text-center text-white">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
        <PlaybookMark clusterId={clusterId} className="h-7 w-7 text-white" />
      </span>
      <p className="mt-3 font-ui text-xs uppercase tracking-wide text-white/60">The Relationship Playbook&trade;</p>
      <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md font-body text-[17px] leading-relaxed text-white/85">{subtitle}</p>
      {whyThisPlaybook && <p className="mx-auto mt-3 max-w-md font-body text-[15px] leading-relaxed text-white/70">{whyThisPlaybook}</p>}

      {available ? (
        <>
          {ctaLabel && <p className="mx-auto mt-5 max-w-md font-body text-[15px] leading-relaxed text-white/75">{ctaLabel}</p>}
          <button onClick={buy} disabled={buying}
            className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
            {buying ? "Starting checkout…" : "Get Your Playbook →"}
          </button>
          {buyErr && <p className="mt-3 font-body text-sm text-soft-coral">{buyErr}</p>}

          {/* Secondary lead capture — for people who aren't ready to buy today. */}
          <div className="mx-auto mt-6 max-w-sm border-t border-white/15 pt-5">
            {done ? (
              <p className="font-body text-sm text-white/85">You&apos;re on the list — I&apos;ll send a few short notes to <span className="font-semibold">{email}</span> to help you decide. No pressure.</p>
            ) : open ? (
              <div className="flex flex-col gap-2.5">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email"
                  className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none" />
                <button onClick={submit} disabled={busy || !email.trim()} className="rounded-full border border-white/30 px-6 py-3 font-ui text-sm font-semibold text-white transition-opacity hover:bg-white/10 disabled:opacity-50">
                  {busy ? "Sending…" : "Email me my results"}
                </button>
                {err && <p className="text-sm text-soft-coral">{err}</p>}
              </div>
            ) : (
              <button onClick={() => setOpen(true)} className="font-body text-sm text-white/70 underline underline-offset-4 hover:text-white">
                Not ready? Email me my results instead
              </button>
            )}
          </div>
        </>
      ) : (
        // No playbook for this cluster yet — keep the lead-capture path only.
        <div className="mx-auto mt-6 max-w-sm">
          {done ? (
            <p className="font-body text-white/90">You&apos;re all set. Your Playbook for this area is being finalized — I&apos;ll send it to <span className="font-semibold">{email}</span> the moment it&apos;s ready.</p>
          ) : open ? (
            <div className="flex flex-col gap-2.5">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email"
                className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none" />
              <button onClick={submit} disabled={busy || !email.trim()} className="rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                {busy ? "Sending…" : "Send me my results"}
              </button>
              {err && <p className="text-sm text-soft-coral">{err}</p>}
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90">
              Get Your Results →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-[70vh] items-center justify-center px-6 text-center"><p className="text-charcoal/60">{children}</p></main>;
}
