"use client";

// Top-level interactive experience: opening → recognition → personalized board →
// play → (my plays / exit). Recognition SURFACES pathways; it never locks them
// ("Explore another area" always available). No gamification.

import { useState } from "react";
import type { PlaybookContent, Play, PlaybookProgress } from "@/lib/playbook/contentSchema";
import type { CrisisScreenResult } from "@/lib/playbook/types";
import { useProgress } from "@/components/playbook/useProgress";
import PlayContainer from "@/components/playbook/PlayContainer";

type View = "opening" | "recognition" | "board" | "gate" | "play" | "myplays";

export interface ExperienceShellProps {
  content: PlaybookContent;
  playbookKey: string;
  initialProgress: PlaybookProgress;
}

export default function ExperienceShell({ content, playbookKey, initialProgress }: ExperienceShellProps) {
  const { progress, update, saving } = useProgress(playbookKey, initialProgress);
  const [view, setView] = useState<View>("opening");
  const [exploreAll, setExploreAll] = useState(false);
  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const [crisis, setCrisis] = useState<CrisisScreenResult | null>(null);
  const [healthyFor, setHealthyFor] = useState<string | null>(null);

  const playById = (id: string | null): Play | undefined => content.plays.find((p) => p.playId === id);
  const activePlay = playById(activePlayId);

  function toggleRecognized(cardId: string) {
    update((p) => ({
      ...p,
      recognized: p.recognized.includes(cardId) ? p.recognized.filter((x) => x !== cardId) : [...p.recognized, cardId],
    }));
  }

  function openPlay(id: string) {
    const play = playById(id);
    if (!play) return; // not built in this release
    setActivePlayId(id);
    setHealthyFor(null);
    setView("gate");
  }

  function startActivePlay() {
    if (!activePlayId) return;
    update((p) => ({ ...p, play_states: { ...p.play_states, [activePlayId]: p.play_states[activePlayId] === "in_my_plays" || p.play_states[activePlayId] === "used" ? p.play_states[activePlayId] : "explored" } }));
    setView("play");
  }

  async function screen(text: string) {
    try {
      const res = await fetch(`/api/playbook/${encodeURIComponent(playbookKey)}/screen`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json()) as CrisisScreenResult;
      if (data.interrupt) setCrisis(data);
    } catch {
      /* best-effort */
    }
  }

  function saveOutput(payload: Record<string, unknown>) {
    if (!activePlay) return;
    const play = activePlay;
    update((p) => ({
      ...p,
      play_states: { ...p.play_states, [play.playId]: "in_my_plays" },
      outputs: {
        ...p.outputs,
        [play.playId]: { output_schema_version: play.outputSchemaVersion, play_version: play.playVersion, payload },
      },
      my_plays: p.my_plays.some((c) => c.play_id === play.playId)
        ? p.my_plays
        : [
            ...p.my_plays,
            {
              play_id: play.playId,
              play_version: play.playVersion,
              name: play.name,
              when: play.myPlaysTemplate.when,
              move: play.myPlaysTemplate.move,
              lookingFor: play.myPlaysTemplate.lookingFor,
              watchOut: play.myPlaysTemplate.watchOut,
              remember: play.myPlaysTemplate.remember,
            },
          ],
    }));
  }

  function markUsed(playId: string) {
    update((p) => ({ ...p, play_states: { ...p.play_states, [playId]: "used" } }));
  }

  const routeCards = content.recognitionCards.filter((c) => c.role === "route");
  const recognizedRoutes = routeCards.filter((c) => progress.recognized.includes(c.id));
  const shownCards = exploreAll || recognizedRoutes.length === 0 ? routeCards : recognizedRoutes;

  return (
    <div className="min-h-screen bg-warm-ivory px-5 py-10">
      {crisis && (
        <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-deep-red/30 bg-white p-5" role="alert">
          <h3 className="font-display text-lg text-deep-red">{crisis.heading ?? "If you're in danger or crisis"}</h3>
          {crisis.message && <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal/85">{crisis.message}</p>}
          {crisis.resources.length > 0 && (
            <ul className="mt-3 space-y-1">
              {crisis.resources.map((r, i) => (
                <li key={i} className="font-body text-sm text-charcoal"><span className="font-medium">{r.label}</span>{r.value ? ` — ${r.value}` : ""}</li>
              ))}
            </ul>
          )}
          <button type="button" onClick={() => setCrisis(null)} className="mt-3 font-ui text-sm text-charcoal/55 underline">Dismiss</button>
        </div>
      )}

      {view === "opening" && (
        <section className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-semibold text-midnight-navy">{content.opening.title}</h1>
          <div className="mt-6 space-y-4">
            {content.opening.body.map((p, i) => (
              <p key={i} className="font-body text-[17px] leading-relaxed text-charcoal/85">{p}</p>
            ))}
          </div>
          {content.opening.manifestations && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {content.opening.manifestations.map((m) => (
                <li key={m} className="rounded-full bg-white/70 px-3 py-1 font-body text-sm italic text-charcoal/70">{m}</li>
              ))}
            </ul>
          )}
          <button type="button" onClick={() => setView("recognition")} className="mt-8 rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white">
            {content.opening.cta}
          </button>
        </section>
      )}

      {view === "recognition" && (
        <section className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl text-midnight-navy">What's showing up for you?</h2>
          <p className="mt-2 font-body text-[15px] text-charcoal/70">Tap the ones that fit — skip the rest. There are no wrong answers, and this isn't a test.</p>
          <ul className="mt-6 space-y-3">
            {content.recognitionCards.map((card) => {
              const selected = progress.recognized.includes(card.id);
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => (card.role === "route" ? toggleRecognized(card.id) : toggleRecognized(card.id))}
                    className={"w-full rounded-2xl p-4 text-left transition " + (selected ? "bg-midnight-navy text-warm-ivory" : "bg-white/70 text-charcoal hover:bg-white")}
                  >
                    <span className="font-body text-[16px] leading-relaxed">{selected ? "✓ " : ""}{card.headline}</span>
                    {card.secondaryExamples && card.secondaryExamples.length > 0 && (
                      <span className={"mt-1 block font-body text-[13px] " + (selected ? "text-warm-ivory/70" : "text-charcoal/55")}>
                        {card.secondaryExamples.join("  ·  ")}
                      </span>
                    )}
                  </button>
                  {selected && card.role === "validate" && card.validationCopy && (
                    <p className="mt-2 rounded-xl bg-sage-green/15 px-4 py-3 font-body text-[14px] text-charcoal/80">{card.validationCopy}</p>
                  )}
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => setView("board")} className="mt-8 rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white">
            Show me where to start
          </button>
        </section>
      )}

      {view === "board" && (
        <section className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-midnight-navy">Where you might start</h2>
            {progress.my_plays.length > 0 && (
              <button type="button" onClick={() => setView("myplays")} className="font-ui text-sm text-midnight-navy underline">My Plays ({progress.my_plays.length})</button>
            )}
          </div>
          <p className="mt-2 font-body text-[15px] text-charcoal/70">Based on what sounded familiar, here's where you might start. These are suggestions — not a diagnosis, not a to-do list. Start with whichever one pulls at you.</p>

          <ul className="mt-6 space-y-3">
            {shownCards.map((card) => {
              const built = Boolean(playById(card.pathwayPlayId));
              const play = playById(card.pathwayPlayId);
              const state = card.pathwayPlayId ? progress.play_states[card.pathwayPlayId] : undefined;
              return (
                <li key={card.id} className="rounded-2xl bg-white/70 p-5">
                  <p className="font-body text-[16px] leading-relaxed text-charcoal">{card.headline}</p>
                  {built && play ? (
                    <>
                      <p className="mt-1 font-body text-[14px] text-charcoal/60">You'll learn to: {play.positioning}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button type="button" onClick={() => openPlay(card.pathwayPlayId as string)} className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm text-warm-ivory">
                          {state === "in_my_plays" || state === "used" ? "Revisit" : "Start"}
                        </button>
                        {state && <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">{state.replace(/_/g, " ")}</span>}
                        {(state === "explored" || state === "in_my_plays") && (
                          <button type="button" onClick={() => markUsed(card.pathwayPlayId as string)} className="font-ui text-xs text-slate-blue underline">I used this in real life</button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 inline-block rounded-full bg-light-gray/60 px-3 py-1 font-ui text-xs text-charcoal/60">Coming soon</p>
                  )}
                </li>
              );
            })}
          </ul>

          <button type="button" onClick={() => setExploreAll((e) => !e)} className="mt-6 font-ui text-sm text-midnight-navy underline">
            {exploreAll ? "Show just my starting points" : "Explore another area"}
          </button>
          <p className="mt-6 font-ui text-xs text-charcoal/40">{saving ? "Saving…" : "Saved"}</p>
        </section>
      )}

      {view === "gate" && activePlay && (
        <section className="mx-auto max-w-2xl">
          <button type="button" onClick={() => setView("board")} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Back to board</button>
          <h2 className="mt-6 font-display text-2xl text-midnight-navy">{activePlay.name}</h2>
          <p className="mt-4 rounded-2xl bg-white/70 p-5 font-body text-[17px] italic leading-relaxed text-charcoal/85">“{activePlay.recognitionGate.prompt}”</p>
          <p className="mt-4 font-body text-[15px] text-charcoal/70">Does this happen for you?</p>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" onClick={startActivePlay} className="rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white">Yes, this happens</button>
            <button type="button" onClick={() => setView("board")} className="rounded-full border border-midnight-navy px-6 py-3 font-ui text-sm text-midnight-navy">Not really me</button>
            <button type="button" onClick={() => { setHealthyFor(activePlay.name); setView("board"); }} className="font-ui text-sm text-charcoal/55 underline">I handle this okay</button>
          </div>
          {healthyFor && <p className="mt-4 font-body text-sm text-sage-green">Nice — that's a real strength. Keep it.</p>}
        </section>
      )}

      {view === "play" && activePlay && (
        <PlayContainer
          play={activePlay}
          onSaveOutput={saveOutput}
          onExit={() => setView("board")}
          onRoute={(id) => openPlay(id)}
          onScreenText={screen}
        />
      )}

      {view === "myplays" && (
        <section className="mx-auto max-w-2xl">
          <button type="button" onClick={() => setView("board")} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Back to board</button>
          <h2 className="mt-6 font-display text-2xl text-midnight-navy">My Plays</h2>
          {progress.my_plays.length === 0 ? (
            <p className="mt-4 font-body text-[15px] text-charcoal/70">Nothing saved yet — when you finish a Play, it lands here as a quick reminder you can pull up anytime.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {progress.my_plays.map((c) => (
                <li key={c.play_id} className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-display text-lg text-midnight-navy">{c.name}</h3>
                  <dl className="mt-3 space-y-2 font-body text-[14px] text-charcoal/85">
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">When this comes up</dt><dd>{c.when}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">My move</dt><dd>{c.move}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">What I'm looking for</dt><dd>{c.lookingFor}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Watch out for</dt><dd>{c.watchOut}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Remember</dt><dd>{c.remember}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
