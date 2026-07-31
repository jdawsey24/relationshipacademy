"use client";

// Top-level interactive experience: opening → recognition → personalized board →
// play → (my plays / exit). Recognition SURFACES pathways; it never locks them
// ("Explore another area" always available). No gamification.

import { useState } from "react";
import type { PlaybookContent, Play, PlaybookProgress, Mission } from "@/lib/playbook/contentSchema";
import type { CrisisScreenResult } from "@/lib/playbook/types";
import { useProgress } from "@/components/playbook/useProgress";
import PlayContainer from "@/components/playbook/PlayContainer";
import PlaySequence from "@/components/playbook/PlaySequence";
import OutputEditor from "@/components/playbook/OutputEditor";
import * as actions from "@/lib/playbook/progressActions";
import MissionCard from "@/components/playbook/MissionCard";
import UseReviewFlow from "@/components/playbook/UseReviewFlow";
import ChangePathHome from "@/components/playbook/ChangePathHome";
import FieldGuide from "@/components/playbook/FieldGuide";
import type { SurfacedItem } from "@/lib/playbook/changePath";
import { PLAYBOOK_REV3_ENABLED } from "@/lib/playbook/rev3";
import { simulationForPlay, missionForPlay, useReviewForPlay } from "@/lib/playbook/rev3Flow";
import { nextRung } from "@/lib/playbook/mission";
import { buildPlaybookEvent, emitPlaybookEvent } from "@/lib/playbook/clientEvents";

/** A returning reader has functional state to resume from — land on the home, not onboarding. */
function isReturning(p: PlaybookProgress): boolean {
  return (
    p.recognized.length > 0 ||
    Object.keys(p.play_states).length > 0 ||
    p.my_plays.length > 0 ||
    Boolean(p.simulation_state || p.practice_state || p.use_review_state)
  );
}

type View = "opening" | "recognition" | "board" | "gate" | "play" | "myplays" | "practice" | "review" | "history" | "home" | "understand" | "experiences" | "tools";

/** Format a logged-experience ISO timestamp for display, or null if absent/unparseable. */
function fmtLoggedDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Fuller date (with year) for the history list. */
function fmtFullDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** How the reader rated their use of the move, in plain words (from the Technique-Fidelity signal). */
const PERFORMED_LABEL: Record<string, string> = {
  yes: "Used it closely",
  partly: "Used some of it",
  no: "Didn't really use it this time",
};

// Consumer one-liners for the Experience ("See it play out") library — keyed by the
// simulation's interaction signature so no internal term ("simulation") is ever shown.
const EXPERIENCE_BLURB: Record<string, string> = {
  evidenceTimeline: "An unfolding dating scenario where the evidence keeps changing — practice reading it before you react.",
  conclusionNarrowing: "A letdown that starts turning into a bigger story — practice narrowing it back to what the moment actually shows.",
  dualAttention: "A few dates with someone easy to like — practice keeping both questions open: are they into you, and is this what you want.",
  decisionRoom: "A low, done-for-now dating night — practice choosing a stance on purpose, for right now, instead of letting a hard week decide.",
  investmentView: "A few weeks of talking to someone — practice tying how much you put in to what you can actually see, not the quiet.",
  communicationRehearsal: "A few small, low-risk moments — practice saying the real thing clearly and kindly, and seeing what you learn.",
};

export interface ExperienceShellProps {
  content: PlaybookContent;
  playbookKey: string;
  initialProgress: PlaybookProgress;
  /** Rev 3 flag seam — defaults to the feature flag so v0 is unchanged when it's off. */
  rev3?: boolean;
}

export default function ExperienceShell({ content, playbookKey, initialProgress, rev3 = PLAYBOOK_REV3_ENABLED }: ExperienceShellProps) {
  const { progress, update, saving } = useProgress(playbookKey, initialProgress);
  const [view, setView] = useState<View>(rev3 && isReturning(initialProgress) ? "home" : "opening");
  const [exploreAll, setExploreAll] = useState(false);
  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const [crisis, setCrisis] = useState<CrisisScreenResult | null>(null);
  const [healthyFor, setHealthyFor] = useState<string | null>(null);
  const [usedReviewFor, setUsedReviewFor] = useState<string | null>(null);
  const [editingOutputFor, setEditingOutputFor] = useState<string | null>(null);
  const [practicePlayId, setPracticePlayId] = useState<string | null>(null);
  const [reviewFor, setReviewFor] = useState<string | null>(null);
  const [reviewFromMission, setReviewFromMission] = useState<string | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null); // Play whose logged-experience history is open
  const [surfacedLit, setSurfacedLit] = useState<string | null>(null); // JIT literature surfaced in-context
  // JIT reads the reader has surfaced in-context this session — become browseable in the Field
  // Guide ("Previously surfaced" reads). Session-scoped UI state (not hydrated from persistence).
  const [surfacedJitIds, setSurfacedJitIds] = useState<string[]>([]);
  // Where a sub-view (gate/play/practice/review/myplays) returns on Back — the launch VIEW,
  // so opening a layer from the Home returns to the Home, from the tool library to the tool
  // library, etc. Set at each entry. Defaults to the board (the only launch base in v0).
  const [backTo, setBackTo] = useState<View>("board");
  // My Plays launches its OWN sub-views (edit/log/history) which set `backTo` to "myplays" so they
  // return here — so My Plays' own Back needs a separate origin, set when My Plays is opened.
  const [myplaysReturn, setMyplaysReturn] = useState<View>("home");

  function surfaceJit(litId: string) {
    setSurfacedLit(litId);
    setSurfacedJitIds((ids) => (ids.includes(litId) ? ids : [...ids, litId]));
  }

  const playById = (id: string | null): Play | undefined => content.plays.find((p) => p.playId === id);
  const activePlay = playById(activePlayId);
  const usedReviewPlay = playById(usedReviewFor);
  // The output editor is MODAL — while it's open it replaces the current view (nothing to navigate
  // past), so it can't be left pinned over another screen after you edit and move on.
  const editingPlay = editingOutputFor ? playById(editingOutputFor) : undefined;
  const isEditing = Boolean(editingPlay?.outputEditor);
  const practiceMission = practicePlayId ? missionForPlay(content, practicePlayId) : undefined;
  const reviewContent = reviewFor ? useReviewForPlay(content, reviewFor) : undefined;

  function openReview(playId: string, fromMissionId?: string) {
    setReviewFor(playId);
    setReviewFromMission(fromMissionId ?? null);
    setView("review");
  }

  function openHistory(playId: string) {
    setHistoryFor(playId);
    setView("history");
  }

  // Route a Change-Path-surfaced item to its experience (records the current focus).
  // Every item here is launched from the Home, so its Back returns to the Home.
  function handleSurfaced(item: SurfacedItem) {
    setBackTo("home");
    if (item.playId) update((p) => actions.recordChangePathFocus(p, item.playId as string));
    if (item.kind === "experience" && item.playId) openPlay(item.playId);
    else if (item.kind === "practice" && item.playId) {
      setPracticePlayId(item.playId);
      setView("practice");
    } else if (item.kind === "review" && item.playId) openReview(item.playId);
    else if (item.kind === "history" && item.playId) openHistory(item.playId);
    else if (item.kind === "understand") setView("understand");
    else {
      setExploreAll(true);
      setView("board");
    }
  }

  function toggleRecognized(cardId: string) {
    update((p) => actions.toggleRecognized(p, cardId));
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
    update((p) => actions.markExplored(p, activePlayId));
    setView("play");
  }

  // "See it play out" — enter a chosen scenario directly (the library already gave context,
  // so no recognition gate). Returns to the experience library on Back.
  function startExperience(playId: string) {
    if (!playById(playId)) return;
    setActivePlayId(playId);
    setBackTo("experiences");
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
    update((p) => actions.recordOutput(p, play, payload));
  }

  function markUsed(playId: string) {
    update((p) => actions.markUsed(p, playId));
  }

  // Emit a validated, idempotent longitudinal event (best-effort; lands when the endpoint
  // + migration are live). Minimal functional payload only.
  function emitMissionEvent(eventType: "mission_selected" | "mission_attempt_reported", mission: Mission, rungId?: string) {
    const ev = buildPlaybookEvent({
      playbookKey,
      playbookVersion: content.playbookVersion,
      objectType: "mission",
      objectId: mission.id,
      objectVersion: mission.version,
      eventType,
      payload: rungId ? { rung_id: rungId } : {},
    });
    if (ev) void emitPlaybookEvent(playbookKey, ev);
  }

  const routeCards = content.recognitionCards.filter((c) => c.role === "route");
  const recognizedRoutes = routeCards.filter((c) => progress.recognized.includes(c.id));
  const shownCards = exploreAll || recognizedRoutes.length === 0 ? routeCards : recognizedRoutes;

  return (
    <div className="min-h-screen bg-warm-ivory px-5 py-10">
      {/* JIT literature surfaced in-context (e.g. from a simulation) — overlay keeps the
          underlying experience mounted, so no state is lost. */}
      {surfacedLit && (
        <div className="fixed inset-0 z-50 overflow-auto bg-warm-ivory/97 pt-[env(safe-area-inset-top)]" role="dialog" aria-label="Related reading" aria-modal="true">
          <FieldGuide
            entries={content.literature ?? []}
            availableJitIds={[surfacedLit]}
            initialEntryId={surfacedLit}
            title="Related reading"
            onExit={() => setSurfacedLit(null)}
          />
        </div>
      )}

      {crisis && (
        <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-deep-red/30 bg-white p-5" role="alert">
          <h3 className="font-display text-lg text-deep-red">{crisis.heading ?? "If you're in danger or crisis"}</h3>
          {crisis.message && <p className="mt-2 font-body text-body text-charcoal/85">{crisis.message}</p>}
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

      {usedReviewPlay && (
        <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-sage-green/30 bg-white p-5" role="dialog" aria-label="How did it go?">
          <h3 className="font-display text-lg text-midnight-navy">How did it go with “{usedReviewPlay.name}”?</h3>
          <p className="mt-2 font-body text-[14px] text-charcoal/70">A quick honesty check — no score, and a date ending isn't a failure here.</p>
          <p className="mt-3 rounded-xl bg-sage-green/12 px-3 py-2 font-body text-[14px] text-charcoal/85"><span className="font-medium">Doing it right looks like:</span> {usedReviewPlay.fidelity.correct}</p>
          <div className="mt-3">
            <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Watch you didn't slip into</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 font-body text-[14px] text-charcoal/80">
              {usedReviewPlay.fidelity.misuse.map((m, idx) => <li key={idx}>{m}</li>)}
            </ul>
          </div>
          <p className="mt-3 font-body text-micro italic text-charcoal/60">{usedReviewPlay.fidelity.notMeaning}</p>
          {progress.outputs[usedReviewPlay.playId] ? (
            <div className="mt-4 border-t border-light-gray pt-4">
              <p className="font-body text-[15px] text-charcoal/85">Does the Play you saved still fit what you learned?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={() => { markUsed(usedReviewPlay.playId); setUsedReviewFor(null); }} className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm text-warm-ivory">Keep it</button>
                <button type="button" onClick={() => { markUsed(usedReviewPlay.playId); setEditingOutputFor(usedReviewPlay.playId); setUsedReviewFor(null); }} className="rounded-full border border-midnight-navy px-5 py-2 font-ui text-sm text-midnight-navy">Update it</button>
                <button type="button" onClick={() => setUsedReviewFor(null)} className="font-ui text-sm text-charcoal/55 underline">Not yet</button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => { markUsed(usedReviewPlay.playId); setUsedReviewFor(null); }} className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm text-warm-ivory">Mark as used</button>
              <button type="button" onClick={() => setUsedReviewFor(null)} className="font-ui text-sm text-charcoal/55 underline">Not yet</button>
            </div>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="mx-auto max-w-2xl">
          <OutputEditor
            play={editingPlay!}
            initial={(progress.outputs[editingOutputFor!]?.payload as Record<string, unknown>) ?? {}}
            onSave={(payload) => {
              update((p) => actions.recordOutput(p, editingPlay!, payload, true)); // keepState: stays "used"
              setEditingOutputFor(null);
            }}
            onCancel={() => setEditingOutputFor(null)}
          />
        </div>
      ) : (
        <>


      {view === "opening" && (
        <section className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-semibold text-midnight-navy">{content.opening.title}</h1>
          <div className="mt-6 space-y-4">
            {content.opening.body.map((p, i) => (
              <p key={i} className="font-body text-reading text-charcoal/85">{p}</p>
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
                    onClick={() => toggleRecognized(card.id)}
                    className={"w-full rounded-2xl p-4 text-left transition " + (selected ? "bg-midnight-navy text-warm-ivory" : "bg-white/70 text-charcoal hover:bg-white")}
                  >
                    <span className="font-body text-[16px] leading-relaxed">{selected ? "✓ " : ""}{card.headline}</span>
                    {card.secondaryExamples && card.secondaryExamples.length > 0 && (
                      <span className={"mt-1 block font-body text-micro " + (selected ? "text-warm-ivory/70" : "text-charcoal/55")}>
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
          {rev3 && isReturning(progress) && (
            <button type="button" onClick={() => setView("home")} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Home</button>
          )}
          <div className="mt-2 flex items-center justify-between">
            <h2 className="font-display text-2xl text-midnight-navy">Where you might start</h2>
            {progress.my_plays.length > 0 && (
              <button type="button" onClick={() => { setMyplaysReturn("board"); setView("myplays"); }} className="font-ui text-sm text-midnight-navy underline">My Plays ({progress.my_plays.length})</button>
            )}
          </div>
          <p className="mt-2 font-body text-[15px] text-charcoal/70">Based on what sounded familiar, here's where you might start. These are suggestions — not a diagnosis, not a to-do list. Start with whichever one pulls at you.</p>

          <ul className="mt-6 space-y-3">
            {shownCards.map((card) => {
              const built = Boolean(playById(card.pathwayPlayId));
              const play = playById(card.pathwayPlayId);
              const state = card.pathwayPlayId ? progress.play_states[card.pathwayPlayId] : undefined;
              // Rev 3: real-life uses accumulate — the log stays available and shows how many times.
              const loggedUses = rev3 && card.pathwayPlayId ? actions.reviewEntries(progress, card.pathwayPlayId) : [];
              const lastLogged = loggedUses.length ? fmtLoggedDate(loggedUses[loggedUses.length - 1]?.at) : null;
              return (
                <li key={card.id} className="rounded-2xl bg-white/70 p-5">
                  <p className="font-body text-[16px] leading-relaxed text-charcoal">{card.headline}</p>
                  {built && play ? (
                    <>
                      <p className="mt-1 font-body text-[14px] text-charcoal/60">You'll learn to: {play.positioning}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button type="button" onClick={() => { setBackTo("board"); openPlay(card.pathwayPlayId as string); }} className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm text-warm-ivory">
                          {state === "in_my_plays" || state === "used" ? "Revisit" : "Start"}
                        </button>
                        {state && <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">{state.replace(/_/g, " ")}</span>}
                        {(state === "explored" || state === "in_my_plays" || (rev3 && state === "used")) && (
                          <button
                            type="button"
                            onClick={() => {
                              setBackTo("board");
                              const pid = card.pathwayPlayId as string;
                              if (rev3 && useReviewForPlay(content, pid)) openReview(pid);
                              else setUsedReviewFor(pid);
                            }}
                            className="font-ui text-xs text-slate-blue underline"
                          >
                            {rev3 ? (loggedUses.length ? "Log another real-life experience" : "Log a real-life experience") : "I used this in real life"}
                          </button>
                        )}
                        {rev3 && (state === "explored" || state === "in_my_plays" || state === "used") && missionForPlay(content, card.pathwayPlayId as string) && (
                          <button type="button" onClick={() => { setBackTo("board"); setPracticePlayId(card.pathwayPlayId as string); setView("practice"); }} className="font-ui text-xs text-slate-blue underline">Practice this →</button>
                        )}
                      </div>
                      {loggedUses.length > 0 && (
                        <>
                          <p className="mt-2 font-ui text-xs text-charcoal/45">
                            Logged {loggedUses.length} experience{loggedUses.length > 1 ? "s" : ""} in real life{lastLogged ? ` · last ${lastLogged}` : ""}
                            {" · "}
                            <button type="button" onClick={() => { setBackTo("board"); openHistory(card.pathwayPlayId as string); }} className="text-slate-blue underline">View all</button>
                          </p>
                          {loggedUses[loggedUses.length - 1]?.experience && (
                            <p className="mt-1 font-body text-micro italic text-charcoal/60">“{loggedUses[loggedUses.length - 1]!.experience}”</p>
                          )}
                        </>
                      )}
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
          <button type="button" onClick={() => setView(backTo)} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">{backTo === "board" ? "← Back to board" : "← Back"}</button>
          <h2 className="mt-6 font-display text-2xl text-midnight-navy">{activePlay.name}</h2>
          <p className="mt-4 rounded-2xl bg-white/70 p-5 font-body text-reading italic text-charcoal/85">“{activePlay.recognitionGate.prompt}”</p>
          <p className="mt-4 font-body text-[15px] text-charcoal/70">Does this happen for you?</p>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" onClick={startActivePlay} className="rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white">Yes, this happens</button>
            <button type="button" onClick={() => setView(backTo)} className="rounded-full border border-midnight-navy px-6 py-3 font-ui text-sm text-midnight-navy">Not really me</button>
            <button type="button" onClick={() => setHealthyFor(activePlay.name)} className="font-ui text-sm text-charcoal/55 underline">I handle this okay</button>
          </div>
          {healthyFor && (
            <div className="mt-4 rounded-xl bg-sage-green/12 px-4 py-3">
              <p className="font-body text-sm text-charcoal/85">Nice — that's a real strength, and worth keeping. You can still open it anytime, or {backTo === "board" ? "head back to the board." : "head back."}</p>
              <button type="button" onClick={() => setView(backTo)} className="mt-2 font-ui text-sm text-midnight-navy underline">{backTo === "board" ? "Back to the board" : "Go back"}</button>
            </div>
          )}
        </section>
      )}

      {view === "play" && activePlay && (() => {
        // Rev 3 (flag on): the Play follows its simulation. v0 (flag off): the Play alone.
        const sim = rev3 ? simulationForPlay(content, activePlay.playId) : undefined;
        return sim ? (
          <PlaySequence
            content={content}
            play={activePlay}
            onSaveOutput={saveOutput}
            onExit={() => setView(backTo)}
            onRoute={(id) => openPlay(id)}
            onScreenText={screen}
            onSimComplete={(simId, fidelity) => update((p) => actions.recordSimulationComplete(p, simId, fidelity))}
            onSurfaceJit={surfaceJit}
            simCompleted={Boolean(progress.simulation_state?.runs?.[sim.id]?.completed)}
          />
        ) : (
          <PlayContainer
            play={activePlay}
            onSaveOutput={saveOutput}
            onExit={() => setView(backTo)}
            onRoute={(id) => openPlay(id)}
            onScreenText={screen}
          />
        );
      })()}

      {view === "practice" && practiceMission && (() => {
        const m = practiceMission;
        const ms = progress.practice_state?.missions?.[m.id];
        return (
          <MissionCard
            mission={m}
            state={ms?.state}
            rungId={ms?.rungId}
            lastReport={ms?.lastReport}
            onSelect={() => {
              update((p) => actions.recordMissionSelected(p, m.id));
              emitMissionEvent("mission_selected", m);
            }}
            onReport={(report) => {
              const stretchEligible = report === "attempted" ? Boolean(nextRung(m, ms?.rungId)) : undefined;
              update((p) => actions.recordMissionReport(p, m.id, report, { stretchEligible }));
              if (report === "attempted") emitMissionEvent("mission_attempt_reported", m, ms?.rungId);
            }}
            onReview={useReviewForPlay(content, m.playId) ? () => openReview(m.playId, m.id) : undefined}
            onExit={() => setView(backTo)}
          />
        );
      })()}

      {view === "review" && reviewContent && reviewFor && (() => {
        const pid = reviewFor;
        return (
          <UseReviewFlow
            review={reviewContent}
            hasSavedOutput={Boolean(progress.outputs[pid])}
            onScreenText={screen}
            // Submit only — the mission is marked `reviewed` here, never when the review merely opens.
            onComplete={(signals, action, experience) => {
              update((p) => actions.recordUseReview(p, pid, signals, new Date().toISOString(), experience));
              // "Save this Play" when none existed: add the My Plays card (tool_saved_after_use).
              const play = playById(pid);
              if (action === "save" && play) update((p) => actions.recordOutput(p, play, {}));
              update((p) => actions.markUsed(p, pid));
              if (reviewFromMission) update((p) => actions.markMissionReviewed(p, reviewFromMission));
              const rev = useReviewForPlay(content, pid);
              const ev = rev && buildPlaybookEvent({
                playbookKey,
                playbookVersion: content.playbookVersion,
                objectType: "use_review",
                objectId: rev.id,
                objectVersion: rev.version,
                eventType: "use_reviewed",
                payload: {
                  ...(signals.performed ? { performed: signals.performed } : {}),
                  ...(signals.stuck ? { stuck: signals.stuck } : {}),
                  ...(signals.kept ? { kept: true } : {}),
                  ...(signals.updated ? { updated: true } : {}),
                  ...(signals.saved ? { saved: true } : {}),
                },
              });
              if (ev) void emitPlaybookEvent(playbookKey, ev);
              if (action === "update") setEditingOutputFor(pid);
              setView(backTo);
            }}
            onExit={() => setView(backTo)}
          />
        );
      })()}

      {view === "home" && (
        <ChangePathHome
          content={content}
          progress={progress}
          displayName={content.displayName}
          onSurfaced={handleSurfaced}
          onUnderstand={() => setView("understand")}
          onSeeItPlayOut={() => setView("experiences")}
          onUseATool={() => setView("tools")}
          onMyPlays={() => { setMyplaysReturn("home"); setView("myplays"); }}
          onExplore={() => { setExploreAll(true); setView("board"); }}
        />
      )}

      {view === "understand" && (
        <FieldGuide
          entries={content.literature ?? []}
          availableJitIds={surfacedJitIds}
          onExit={() => setView(rev3 && isReturning(progress) ? "home" : "board")}
        />
      )}

      {/* See it play out — the Experience library. The reader picks a scenario WITH context
          first; picking one steps straight into it (no recognition gate). */}
      {view === "experiences" && (
        <section className="mx-auto max-w-2xl">
          <button type="button" onClick={() => setView("home")} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Home</button>
          <h2 className="mt-6 font-display text-2xl text-midnight-navy">See it play out</h2>
          <p className="mt-2 font-body text-[15px] text-charcoal/70">Step through a realistic situation and practice noticing what happens — before you decide anything. Pick one to step into.</p>
          <ul className="mt-6 space-y-3">
            {(content.simulations ?? []).map((sim) => {
              const play = playById(sim.playId);
              if (!play) return null;
              const done = Boolean(progress.simulation_state?.runs?.[sim.id]?.completed);
              return (
                <li key={sim.id} className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-display text-lg text-midnight-navy">{play.name}</h3>
                  <p className="mt-1 font-body text-[15px] text-charcoal/75">{EXPERIENCE_BLURB[sim.signature] ?? "Step through a realistic situation and practice noticing what happens."}</p>
                  {done && <p className="mt-1 font-ui text-xs uppercase tracking-wide text-charcoal/45">You've been through this</p>}
                  <button type="button" onClick={() => startExperience(sim.playId)} className="mt-3 rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm text-warm-ivory">{done ? "Step through it again →" : "Step into it →"}</button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Use a tool — the Play library. Only APPROVED, built Plays appear (others stay hidden
          until approved). Each card: when it helps · what it does · whether it's been explored. */}
      {view === "tools" && (
        <section className="mx-auto max-w-2xl">
          <button type="button" onClick={() => setView("home")} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Home</button>
          <h2 className="mt-6 font-display text-2xl text-midnight-navy">Use a tool</h2>
          <p className="mt-2 font-body text-[15px] text-charcoal/70">These are the moves you can use when a moment comes up. Open one to learn it, or revisit one you've saved. More tools for this pattern are on the way.</p>
          <ul className="mt-6 space-y-3">
            {content.plays.map((play) => {
              const state = progress.play_states[play.playId];
              const explored = state === "explored" || state === "in_my_plays" || state === "used";
              return (
                <li key={play.playId} className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-display text-lg text-midnight-navy">{play.name}</h3>
                  <p className="mt-3 font-body text-[14px] leading-relaxed text-charcoal/85"><span className="font-ui text-xs uppercase tracking-wide text-charcoal/50">When it helps</span><br />{play.recognitionGate.prompt}</p>
                  <p className="mt-2 font-body text-[14px] leading-relaxed text-charcoal/85"><span className="font-ui text-xs uppercase tracking-wide text-charcoal/50">What it helps you do</span><br />{play.positioning}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" onClick={() => { setBackTo("tools"); openPlay(play.playId); }} className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm text-warm-ivory">{state === "in_my_plays" || state === "used" ? "Revisit →" : "Start →"}</button>
                    {explored && <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">{state === "in_my_plays" ? "saved" : state === "used" ? "used" : "explored"}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {view === "myplays" && (
        <section className="mx-auto max-w-2xl">
          <button type="button" onClick={() => setView(myplaysReturn)} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">{myplaysReturn === "board" ? "← Back to board" : "← Back"}</button>
          <h2 className="mt-6 font-display text-2xl text-midnight-navy">My Plays</h2>
          {progress.my_plays.length === 0 ? (
            <p className="mt-4 font-body text-[15px] text-charcoal/70">Nothing saved yet — when you finish a Play, it lands here as a quick reminder you can pull up anytime.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {progress.my_plays.map((c) => (
                <li key={c.play_id} className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-display text-lg text-midnight-navy">{c.name}</h3>
                  {c.userLine && (
                    <p className="mt-2 rounded-xl bg-sage-green/12 px-3 py-2 font-body text-[14px] text-charcoal"><span className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Your saved answer</span><br />{c.userLine}</p>
                  )}
                  <dl className="mt-3 space-y-2 font-body text-[14px] text-charcoal/85">
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">When this comes up</dt><dd>{c.when}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">My move</dt><dd>{c.move}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">What I'm looking for</dt><dd>{c.lookingFor}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Watch out for</dt><dd>{c.watchOut}</dd></div>
                    <div><dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Remember</dt><dd>{c.remember}</dd></div>
                  </dl>
                  {rev3 && (() => {
                    // Real-life uses accumulate here too — log again anytime, with a running count.
                    const entries = actions.reviewEntries(progress, c.play_id);
                    const lastLogged = entries.length ? fmtLoggedDate(entries[entries.length - 1]?.at) : null;
                    return (
                      <div className="mt-4 border-t border-light-gray pt-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          {playById(c.play_id)?.outputEditor && (
                            <button
                              type="button"
                              onClick={() => { setBackTo("myplays"); setEditingOutputFor(c.play_id); }}
                              className="font-ui text-xs text-slate-blue underline"
                            >
                              Edit this Play
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setBackTo("myplays");
                              if (useReviewForPlay(content, c.play_id)) openReview(c.play_id);
                              else setUsedReviewFor(c.play_id);
                            }}
                            className="font-ui text-xs text-slate-blue underline"
                          >
                            {entries.length ? "Log another real-life experience" : "Log a real-life experience"}
                          </button>
                        </div>
                        {entries.length > 0 && (
                          <>
                            <p className="mt-2 font-ui text-xs text-charcoal/45">
                              Logged {entries.length} experience{entries.length > 1 ? "s" : ""} in real life{lastLogged ? ` · last ${lastLogged}` : ""}
                              {" · "}
                              <button type="button" onClick={() => { setBackTo("myplays"); openHistory(c.play_id); }} className="text-slate-blue underline">View all</button>
                            </p>
                            {entries[entries.length - 1]?.experience && (
                              <p className="mt-1 font-body text-micro italic text-charcoal/60">“{entries[entries.length - 1]!.experience}”</p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })()}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {view === "history" && historyFor && rev3 && (() => {
        const pid = historyFor;
        const play = playById(pid);
        const ordered = [...actions.reviewEntries(progress, pid)].reverse(); // newest first
        return (
          <section className="mx-auto max-w-2xl">
            <button type="button" onClick={() => setView(backTo)} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">{backTo === "board" ? "← Back to board" : backTo === "myplays" ? "← Back to My Plays" : "← Back"}</button>
            <h2 className="mt-6 font-display text-2xl text-midnight-navy">Real-life experiences</h2>
            {play && <p className="mt-1 font-body text-[15px] text-charcoal/60">{play.name}</p>}
            {ordered.length === 0 ? (
              <p className="mt-6 font-body text-[15px] text-charcoal/70">No experiences logged yet — when you log one, it lands here.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {ordered.map((e, i) => (
                  <li key={i} className="rounded-2xl bg-white/70 p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-ui text-xs uppercase tracking-wide text-charcoal/50">{fmtFullDate(e.at) ?? "Logged"}</span>
                      {e.performed && <span className="font-ui text-xs text-charcoal/55">{PERFORMED_LABEL[e.performed]}</span>}
                    </div>
                    {e.experience && <p className="mt-2 font-body text-[15px] italic text-charcoal/85">“{e.experience}”</p>}
                    {e.didDifferently?.length ? (
                      <p className="mt-2 font-body text-micro text-charcoal/60"><span className="font-ui uppercase tracking-wide text-charcoal/45">What I did:</span> {e.didDifferently.join(" · ")}</p>
                    ) : null}
                    {e.stuck && (
                      <p className="mt-1 font-body text-micro text-charcoal/60"><span className="font-ui uppercase tracking-wide text-charcoal/45">Where I got stuck:</span> {e.stuck}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })()}
        </>
      )}
    </div>
  );
}
