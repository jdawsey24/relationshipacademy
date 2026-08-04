import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaybookBySlug, PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";
import { getResults } from "@/lib/snapshot/data";
import { resultLabel } from "@/lib/snapshot/resultTitle";
import SectionLabel from "@/components/site/SectionLabel";
import PlaybookCta from "@/components/site/PlaybookCta";
import { PlaybookMark, playbookHue } from "@/components/site/PlaybookMark";
import { IconTile } from "@/components/site/IconTile";
import type { CSSProperties } from "react";

// Render per-request (like the /playbooks index) rather than statically pre-building
// every slug at deploy. Pre-building ~26 pages fired concurrent Supabase queries at
// build; failures baked notFound()→404 that only healed on the first request. Dynamic
// rendering runs one query at request time (reliable) — no post-deploy 404 window.
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPlaybookBySlug((await params).slug);
  if (!p) return { title: "Playbook not found" };
  return {
    title: `${p.subtitle} — The Relationship Playbook™`,
    description: p.why ?? p.corePattern ?? "A therapist-developed Relationship Playbook™.",
  };
}

/**
 * The Playbook sales page — written as a CONTINUATION of the Snapshot, not a
 * standalone product pitch. When someone arrives from their results (?s=<session>)
 * and that session's primary cluster matches this Playbook, the top of the page
 * reflects their own result. Anyone else (catalog, ad, shared link) sees the same
 * page with a general opening — every section below the fold is identical.
 *
 * Voice rules (owner direction 2026-08-04): warm and direct; educational, not
 * therapy; "your responses suggest…" never "you always…"; no fear, urgency, or
 * outcome promises; internal framework vocabulary (competency, incongruence,
 * phase, domain, marker) never appears.
 */
export default async function PlaybookDetailPage(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ s?: string }> },
) {
  const { slug } = await params;
  const rawSession = (await searchParams)?.s;
  const sessionId = typeof rawSession === "string" && UUID_RE.test(rawSession) ? rawSession : undefined;

  const p = await getPlaybookBySlug(slug);
  if (!p) notFound();
  const hue = playbookHue(p.clusterId);

  // Personalize only when the visitor's own result matches THIS Playbook.
  const results = sessionId ? await getResults(sessionId) : null;
  const mine = results?.primary && results.primary.id === p.clusterId ? results.primary : null;
  const showsUp = (mine?.how_it_may_show_up ?? []).slice(0, 2);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12" style={{ "--hue": hue } as CSSProperties}>
      <Link href="/playbooks" className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← All Playbooks</Link>

      {/* 1–2. Personalized headline + reminder of the Snapshot result */}
      <section className="mt-6">
        <IconTile hue={hue} size="lg" className="mb-6">
          <PlaybookMark clusterId={p.clusterId} className="h-9 w-9" />
        </IconTile>
        <SectionLabel>{mine ? "Your next step" : "The Relationship Playbook™"}</SectionLabel>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-[44px]">
          {mine ? "You recognized the pattern. Here’s what comes next." : p.subtitle}
        </h1>

        {mine ? (
          <>
            <p className="mt-5 text-balance font-body text-lg leading-relaxed text-charcoal/75">
              Your Snapshot pointed to <strong className="text-midnight-navy">{resultLabel(mine.result_title) || mine.name}</strong>.
              {mine.core_pattern ? ` ${mine.core_pattern}` : ""}
            </p>
            <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/75">
              Your results are yours to keep, and they already gave you something useful: language for what
              has been happening. <strong className="text-midnight-navy">{p.subtitle}</strong> is the Playbook matched to that
              pattern — built to help you work with it, not just name it.
            </p>
          </>
        ) : (
          p.corePattern && <p className="mt-5 text-balance font-body text-lg leading-relaxed text-charcoal/75">{p.corePattern}</p>
        )}

        <div className="mt-8"><PlaybookCta clusterId={p.clusterId} slug={slug} sessionId={sessionId} buyLabel={`Get My Personalized Playbook — ${PLAYBOOK_PRICE_DISPLAY}`} className="!justify-start" /></div>
        <p className="mt-3 font-body text-sm text-charcoal/50">One-time purchase · instant access · yours to keep · by Janelle Dawsey, LMFT</p>
      </section>

      {/* 3. What the result may look like in real life */}
      {showsUp.length > 0 && (
        <section className="mt-14 rounded-3xl bg-white/70 p-8 sm:p-10">
          <SectionLabel tone="sage">What this can look like day to day</SectionLabel>
          <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
            Based on your answers, this pattern may show up in moments like these:
          </p>
          <ul className="mt-4 space-y-2.5">
            {showsUp.map((item) => (
              <li key={item} className="flex gap-3 font-body text-base leading-relaxed text-charcoal/80">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hue }} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-body text-base leading-relaxed text-charcoal/70">
            You may recognize some of these immediately and none of the others. That&apos;s normal — the pattern
            shows up differently depending on what a season of your relationship life is asking of you.
          </p>
        </section>
      )}

      {/* 4. Why insight alone may not be enough */}
      <section className="mt-14">
        <SectionLabel>Why insight alone may not be enough</SectionLabel>
        <h2 className="mt-3 font-display text-2xl font-semibold text-midnight-navy">Recognizing a pattern and responding differently are two different skills</h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
          You may already notice when you overthink a decision, move faster than you meant to, stay guarded,
          avoid a conversation you know is coming, or talk yourself out of something you saw clearly.
          Recognition matters. But recognition on its own does not automatically hand you a different response
          in the moment you need one.
        </p>
        <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
          That gap isn&apos;t a character flaw. It&apos;s the difference between understanding a pattern and having
          practiced something else — and practice is what this Playbook is for.
        </p>
      </section>

      {/* 5–6. Why this Playbook was recommended */}
      {(mine || p.why) && (
        <section className="mt-14 rounded-3xl border border-midnight-navy/10 bg-white p-8 sm:p-10">
          <SectionLabel tone="sage">{mine ? "Why this Playbook was matched to you" : "What this Playbook helps with"}</SectionLabel>
          {mine && (
            <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
              Your Snapshot didn&apos;t just name a pattern — it pointed to what that pattern seems to be asking
              for{mine.unmet_need ? <>: <strong className="text-midnight-navy">{mine.unmet_need}</strong></> : ""}.
              This Playbook was selected because it works on exactly that.
            </p>
          )}
          {p.why && <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">{p.why}</p>}
        </section>
      )}

      {/* 7. What the Playbook will help you do */}
      <section className="mt-14">
        <SectionLabel>What you&apos;ll be able to do</SectionLabel>
        <h2 className="mt-3 font-display text-2xl font-semibold text-midnight-navy">Guidance built around one pattern — yours</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Understand the pattern beneath the behavior",
            "Recognize it while it's happening, not afterward",
            "Notice what tends to keep it active",
            "Reflect before making a decision that matters",
            "Practice a different response in familiar moments",
            "Prepare for the conversations that need clarity",
          ].map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl border border-midnight-navy/10 bg-white p-4 font-body text-base leading-relaxed text-charcoal/80">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hue }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. What is included — experience, not file formats */}
      <section className="mt-14 rounded-3xl bg-white/70 p-8 sm:p-10">
        <SectionLabel tone="sage">What&apos;s included</SectionLabel>
        <div className="mt-5 space-y-4">
          {[
            { t: "Guided reflections", b: "Prompts that help you see the pattern in your own life — with your situation in front of you, not a hypothetical one." },
            { t: "Practical exercises", b: "Short, structured ways to try a different response and notice what changes when you do." },
            { t: "Conversation guidance", b: "Language for the moments that need clarity — asking directly, naming a limit, or checking what you actually saw." },
            { t: "Tools you keep using", b: "Ways to apply what you learned after the reading is over, so it holds up in real situations." },
          ].map((f) => (
            <div key={f.t}>
              <h3 className="font-display text-lg font-semibold text-midnight-navy">{f.t}</h3>
              <p className="mt-1 font-body text-base leading-relaxed text-charcoal/75">{f.b}</p>
            </div>
          ))}
        </div>
        {p.pillars.length > 0 && (
          <div className="mt-8 border-t border-light-gray pt-6">
            <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/45">What you&apos;ll work through</p>
            <ol className="mt-4 space-y-3">
              {p.pillars.map((pillar, i) => (
                <li key={pillar} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-ui text-sm font-semibold" style={{ backgroundColor: `${hue}1f`, color: hue }}>{i + 1}</span>
                  <span className="font-body text-base leading-relaxed text-charcoal/80">{pillar}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* 9. Realistic outcomes */}
      <section className="mt-14">
        <SectionLabel>What progress can look like</SectionLabel>
        <h2 className="mt-3 font-display text-2xl font-semibold text-midnight-navy">Clearer, sooner — not perfect</h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
          This Playbook won&apos;t promise you a particular relationship, a particular decision, or that a pattern
          never shows up again. What people tend to find is quieter than that, and more useful:
        </p>
        <ul className="mt-5 space-y-2.5">
          {[
            "You catch the pattern earlier than you used to",
            "You ask a clearer question instead of filling in the blanks",
            "You make decisions with more evidence and less guessing",
            "You say the harder thing sooner, and more directly",
            "You know what you're actually looking at, and what you want to do about it",
          ].map((item) => (
            <li key={item} className="flex gap-3 font-body text-base leading-relaxed text-charcoal/80">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hue }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why not generic advice — limitation of the advice, never the people giving it */}
      <section className="mt-14 rounded-3xl border border-midnight-navy/10 bg-white p-8 sm:p-10">
        <SectionLabel tone="sage">Why not just general relationship advice</SectionLabel>
        <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
          Most relationship advice has to be broad — communicate better, set boundaries, know your worth,
          walk away. It&apos;s not wrong. It just can&apos;t account for where you are, what you&apos;ve already tried,
          or which part is actually getting in your way.
        </p>
        <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">
          This Playbook starts from your Snapshot result, so the guidance is aimed at the pattern you&apos;re
          actually navigating rather than relationships in general.
        </p>
      </section>

      {/* 10. Educational / non-therapy disclaimer */}
      <section className="mt-14 rounded-2xl border border-light-gray bg-white/60 p-6">
        <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/45">Good to know</p>
        <p className="mt-2 font-body text-base leading-relaxed text-charcoal/75">
          The Relationship Playbook™ is an educational resource for reflection and skill-building. It is not
          therapy, diagnosis, or crisis care, and it does not replace working with a licensed professional.
          It was written by Janelle Dawsey, LMFT, and is grounded in the Relationship Life Cycle™ framework.
          If you&apos;re in distress or your safety is at risk, please reach out to a licensed professional or
          local emergency services.
        </p>
      </section>

      {/* 11. Price + primary CTA (12. embedded checkout lands in a later phase) */}
      {p.keyTakeaway && (
        <section className="mt-14 rounded-3xl bg-midnight-navy px-8 py-12 text-center text-white sm:px-12">
          <SectionLabel tone="white">The heart of it</SectionLabel>
          <p className="mx-auto mt-4 max-w-2xl text-balance font-display text-2xl font-medium leading-relaxed">{p.keyTakeaway}</p>
        </section>
      )}

      <section className="mt-14 text-center">
        <h2 className="font-display text-2xl font-semibold text-midnight-navy">
          {mine ? "Turn your results into a next step" : "Ready to dig in?"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-body text-charcoal/70">
          {p.subtitle} · {PLAYBOOK_PRICE_DISPLAY} one-time · yours to keep.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <PlaybookCta clusterId={p.clusterId} slug={slug} sessionId={sessionId} buyLabel={`Get My Personalized Playbook — ${PLAYBOOK_PRICE_DISPLAY}`} />
          <Link href="/snapshot" className="font-ui text-sm text-midnight-navy/70 underline underline-offset-4 hover:text-midnight-navy">
            Not sure this is the one? Take the free Snapshot
          </Link>
        </div>
      </section>

      {/* 13. Access & account */}
      <section className="mt-14 rounded-2xl border border-light-gray bg-white/60 p-6">
        <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/45">How you&apos;ll get it</p>
        <p className="mt-2 font-body text-base leading-relaxed text-charcoal/75">
          Payment is processed securely by Stripe. Your Playbook is connected to your Relationship Life Cycle™
          account so it stays in your library — you can open it right after your purchase and come back to it
          whenever you need it.
        </p>
      </section>

      {/* 14. FAQ */}
      <section className="mt-14">
        <SectionLabel>Questions people ask</SectionLabel>
        <div className="mt-6 space-y-3">
          {[
            { q: "Is this therapy?", a: "No. It's an educational resource for reflection and skill-building, written by a licensed therapist but not a substitute for working with one. It doesn't diagnose anything or provide crisis care." },
            { q: "How was this Playbook selected?", a: mine ? "Your Snapshot answers pointed to one pattern more consistently than the others. This Playbook is the one written for that pattern." : "Each Playbook is written for one specific pattern. If you take the free Snapshot, your answers point to the pattern showing up most consistently — and we match you to that Playbook. You're also welcome to choose one directly if you already know what you're working on." },
            { q: "Is the Playbook personalized?", a: "It's matched to your result rather than generated about you personally. Everything inside is built around the specific pattern your answers surfaced — not general relationship advice." },
            { q: "How will I receive access?", a: "Right after your purchase it's added to your library, so you can open it immediately and return anytime." },
            { q: "Do I need an account?", a: "Yes — your Playbook is attached to an account so it stays yours and you can come back to it. It takes a moment and it's the same account across everything you purchase here." },
            { q: "Can I use this if I'm single?", a: "Yes. Several patterns show up most clearly between relationships — in dating, in deciding, or in what you carry from before. The Playbook works on the pattern, not on a particular relationship status." },
            { q: "Can I use it while I'm in a relationship?", a: "Yes. Nothing here asks you to make a decision about your relationship, and nothing assumes you should stay or leave." },
            { q: "Is this for couples or individuals?", a: "It's written for you as an individual — your own patterns, responses, and choices. You're welcome to share what you learn, but it isn't a couples workbook and doesn't require your partner's participation." },
            { q: "What is the Relationship Companion?", a: "A separate, optional tool for working through a situation step by step. It's not required to use your Playbook, and your Playbook is complete on its own." },
            { q: "What happens after I purchase?", a: "You'll be taken straight to your Playbook and it'll be waiting in your library from then on." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl border border-midnight-navy/10 bg-white p-5">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold text-midnight-navy marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2.5 font-body text-base leading-relaxed text-charcoal/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 15. Final CTA */}
      <section className="mt-14 rounded-3xl border border-midnight-navy/10 bg-white p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-midnight-navy">
          {mine ? "You already know the pattern. This is the part where you work with it." : "One pattern, worked through properly"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-body text-charcoal/70">
          Take it at your own pace. It&apos;s yours to keep, and it&apos;ll be there when you need it again.
        </p>
        <div className="mt-6 flex justify-center">
          <PlaybookCta clusterId={p.clusterId} slug={slug} sessionId={sessionId} buyLabel={`Get My Personalized Playbook — ${PLAYBOOK_PRICE_DISPLAY}`} />
        </div>
      </section>
    </main>
  );
}
