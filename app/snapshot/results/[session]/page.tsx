"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { PlaybookMark, playbookHue } from "@/components/site/PlaybookMark";
import { IconTile } from "@/components/site/IconTile";
import { getPlaybookContent } from "@/content/playbook";
import { CLUSTER_PAIRED_KEY, keyForClusterId, isPlaybookKey } from "@/lib/playbook/keys";
import { routesFrom } from "@/lib/playbook/crossPlaybookRoutes";

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
  converted?: boolean;
}

const SAGE = "#8A9D8F"; // strengths / steady

export default function ResultsPage() {
  const { session } = useParams<{ session: string }>();
  const [data, setData] = useState<Results | null>(null);
  const [error, setError] = useState(false);
  // The email gate: results are revealed only after the email is captured. Read the
  // prior unlock in an effect (client-only) so there's no hydration surprise.
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    fetch(`/api/snapshot/results?session=${session}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: Results) => {
        setData(d);
        // Email already captured for this session (e.g. arriving from a nurture
        // email on another device) — don't gate a converted lead twice.
        if (d.converted) setUnlocked(true);
      })
      .catch(() => setError(true));
  }, [session]);

  useEffect(() => {
    try { if (localStorage.getItem(`snap_unlocked_${session}`)) setUnlocked(true); } catch { /* noop */ }
  }, [session]);

  if (error) return <Centered>We couldn&apos;t load your results.</Centered>;
  if (!data) return <Centered>Preparing your results…</Centered>;
  if (!data.primary) return <Centered>Your results are being prepared.</Centered>;

  const p = data.primary;
  const title = p.result_title || p.name;
  const hue = playbookHue(p.id);
  const available = data.playbook_url != null;

  // Email gate — capture first, then reveal. This is the top of the funnel.
  if (!unlocked) {
    return <EmailGate session={session} onUnlock={() => setUnlocked(true)} />;
  }

  // Related-Playbook nudge — only for the two clusters with a second, separately-sold module,
  // and only when it's actually served (isPlaybookKey is corpus-flag-aware).
  const pairedKey = CLUSTER_PAIRED_KEY[p.id];
  const paired = pairedKey && isPlaybookKey(pairedKey) ? getPlaybookContent(pairedKey) : null;
  const primaryKey = keyForClusterId(p.id);
  const pairedReason = paired && primaryKey
    ? routesFrom(primaryKey).find((r) => r.to === pairedKey)?.reason ?? null
    : null;

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

      {/* First paragraph, then the matched Playbook — the recommendation comes early. */}
      <Prose label="What this means" text={p.what_this_means} />

      <PlaybookOffer
        variant="full"
        session={session}
        clusterId={p.id}
        title={p.playbook_title}
        subtitle={p.playbook_subtitle}
        whyThisPlaybook={p.why_this_playbook}
        ctaLabel={p.call_to_action}
        available={available}
      />

      <ContinueDivider />

      {/* The rest of the results */}
      <Prose label="Why this happens" text={p.why_this_happens} />
      <Bullets label="How it may show up" items={p.how_it_may_show_up} />
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

      {/* Bottom CTA — the funnel again, for readers who scrolled the whole thing. */}
      <PlaybookOffer
        variant="compact"
        session={session}
        clusterId={p.id}
        title={p.playbook_title}
        subtitle={p.playbook_subtitle}
        whyThisPlaybook={p.why_this_playbook}
        ctaLabel={p.call_to_action}
        available={available}
      />

      {/* Related Playbook — a separate next step (own product), for C12/C21 results */}
      {paired && pairedKey && (
        <section className="mt-6 rounded-2xl border border-dashed border-midnight-navy/25 bg-white/60 p-5">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">A related Playbook</p>
          <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{paired.displayName}</p>
          {pairedReason && <p className="mt-1 font-body text-body text-charcoal/75">{pairedReason}</p>}
          <a href={`/playbooks/${pairedKey}`} className="mt-3 inline-flex items-center gap-1 font-ui text-sm font-semibold text-midnight-navy underline underline-offset-4 hover:opacity-80">
            See {paired.displayName} →
          </a>
          <p className="mt-2 font-body text-xs text-charcoal/45">A separate Playbook, bought on its own.</p>
        </section>
      )}

      {/* Secondary — named + one line, no CTA */}
      {data.secondary && (
        <section className="mt-8 rounded-2xl border border-light-gray bg-white/70 p-5">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">You may also relate to</p>
          <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{data.secondary.result_title || data.secondary.name}</p>
          <p className="mt-1 font-body text-body text-charcoal/80">{data.secondary.secondary_blurb}</p>
        </section>
      )}
    </main>
  );
}

// Email gate — the personalized results are the incentive to hand over an email.
// Captures the lead (same endpoint as before), remembers the unlock, then reveals.
function EmailGate({ session, onUnlock }: { session: string; onUnlock: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setBusy(true); setErr(null);
    const res = await fetch(`/api/snapshot/convert`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: session, email: email.trim(), name: name.trim() }),
    }).catch(() => null);
    const d = res ? await res.json().catch(() => ({})) : {};
    if (!res || !res.ok) { setErr((d as { error?: string }).error ?? "Something went wrong. Please try again."); setBusy(false); return; }
    const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
    try { w.fbq?.("track", "Lead", { content_name: "Relationship Snapshot" }); } catch { /* noop */ }
    try { w.gtag?.("event", "snapshot_conversion", { event_category: "snapshot" }); } catch { /* noop */ }
    try { localStorage.setItem(`snap_unlocked_${session}`, "1"); } catch { /* noop */ }
    onUnlock();
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/45">Your Relationship Snapshot&trade;</p>
      <h1 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">
        Your results are ready
      </h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/75">
        Enter your email and I&apos;ll show you your results now — and send you a copy so you can revisit them anytime.
      </p>
      <form onSubmit={submit} className="mt-8 w-full">
        <input
          value={name} onChange={(e) => setName(e.target.value)} type="text" required
          autoComplete="given-name" placeholder="First name" maxLength={80}
          className="h-12 w-full rounded-full border border-midnight-navy/20 bg-white px-5 font-body text-base text-charcoal outline-none focus:border-midnight-navy"
        />
        <input
          value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
          autoComplete="email" placeholder="you@example.com"
          className="mt-3 h-12 w-full rounded-full border border-midnight-navy/20 bg-white px-5 font-body text-base text-charcoal outline-none focus:border-midnight-navy"
        />
        <button type="submit" disabled={busy || !email.trim() || !name.trim()}
          className="mt-3 h-12 w-full rounded-full bg-midnight-navy font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
          {busy ? "Loading your results…" : "Show me my results →"}
        </button>
        {err && <p className="mt-3 font-body text-sm text-coral-rose">{err}</p>}
      </form>
      <p className="mt-4 font-body text-xs text-charcoal/45">No spam. Unsubscribe anytime.</p>
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
      <p className="mt-2.5 font-body text-reading text-charcoal/85">{text}</p>
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
          <li key={i} className="flex gap-2.5 font-body text-reading text-charcoal/85">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--hue)" }} aria-hidden="true" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// A gentle "there's more below" divider after the early Playbook offer.
function ContinueDivider() {
  return (
    <div className="mt-10 flex items-center gap-3">
      <span className="h-px flex-1 bg-light-gray" aria-hidden="true" />
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">Keep reading your results ↓</span>
      <span className="h-px flex-1 bg-light-gray" aria-hidden="true" />
    </div>
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

// The Playbook offer — a pure BUY CTA (no email capture; that's the gate now).
// `full` is the early recommendation; `compact` is the bottom repeat.
function PlaybookOffer({ session, clusterId, title, subtitle, whyThisPlaybook, ctaLabel, available, variant }: {
  session: string; clusterId: number; title: string; subtitle: string; whyThisPlaybook: string; ctaLabel: string; available: boolean; variant: "full" | "compact";
}) {
  const [buying, setBuying] = useState(false);
  const [buyErr, setBuyErr] = useState<string | null>(null);

  // Ownership must attach to an account, so an unauthenticated buyer signs in via
  // the neutral account doorway and is returned here to finish.
  async function buy() {
    setBuying(true); setBuyErr(null);
    try {
      const res = await fetch(`/api/playbooks/checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cluster_id: clusterId, session_id: session }),
      });
      if (res.status === 401) {
        window.location.href = `/account/login?next=${encodeURIComponent(`/snapshot/results/${session}`)}`;
        return;
      }
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.url) { setBuyErr(d.error ?? "Could not start checkout."); setBuying(false); return; }
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      try { w.fbq?.("track", "InitiateCheckout", { content_name: "Relationship Playbook" }); } catch { /* noop */ }
      window.location.href = d.url;
    } catch {
      setBuyErr("Could not start checkout."); setBuying(false);
    }
  }

  // No purchasable Playbook for this cluster yet — a quiet "coming soon" note.
  if (!available) {
    return (
      <section className="mt-8 rounded-2xl border border-light-gray bg-white/70 p-5 text-center">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">The Relationship Playbook&trade;</p>
        <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{title}</p>
        <p className="mt-1 font-body text-body text-charcoal/70">This Playbook is coming soon — we&apos;ll email you the moment it&apos;s ready.</p>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <section className="mt-12 rounded-2xl border border-midnight-navy/15 bg-white p-6 text-center">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-plum">Your next step</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-midnight-navy sm:text-2xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-2 max-w-md font-body text-body text-charcoal/70">{subtitle}</p>}
        <button onClick={buy} disabled={buying}
          className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
          {buying ? "Starting checkout…" : "Get Your Playbook →"}
        </button>
        {buyErr && <p className="mt-3 font-body text-sm text-coral-rose">{buyErr}</p>}
      </section>
    );
  }

  // full
  return (
    <section className="mt-8 overflow-hidden rounded-2xl bg-midnight-navy px-6 py-8 text-center text-white">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
        <PlaybookMark clusterId={clusterId} className="h-7 w-7 text-white" />
      </span>
      <p className="mt-3 font-ui text-xs uppercase tracking-wide text-white/60">Your matched Playbook</p>
      <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md font-body text-reading text-white/85">{subtitle}</p>
      {whyThisPlaybook && <p className="mx-auto mt-3 max-w-md font-body text-body text-white/70">{whyThisPlaybook}</p>}
      {ctaLabel && <p className="mx-auto mt-5 max-w-md font-body text-body text-white/75">{ctaLabel}</p>}
      <button onClick={buy} disabled={buying}
        className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
        {buying ? "Starting checkout…" : "Get Your Playbook →"}
      </button>
      {buyErr && <p className="mt-3 font-body text-sm text-soft-coral">{buyErr}</p>}
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-[70vh] items-center justify-center px-6 text-center"><p className="text-charcoal/60">{children}</p></main>;
}
