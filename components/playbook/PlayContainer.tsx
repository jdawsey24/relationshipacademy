"use client";

// The universal, slotted Play walker (Phase 5B D23). Renders a Play's screens in
// order, collects the user's work into a draft, and assembles the executable output.
// Screen kinds are a discriminated union; unknown kinds are skipped defensively.

import { useMemo, useState, type ReactNode } from "react";
import type { Play, Screen } from "@/lib/playbook/contentSchema";
import SortEngine from "@/components/playbook/SortEngine";

type Draft = Record<string, unknown>;

export interface PlayContainerProps {
  play: Play;
  onSaveOutput: (payload: Record<string, unknown>) => void;
  onExit: () => void;
  onRoute?: (toPlayId: string) => void;
  onScreenText?: (text: string) => void; // Layer A crisis screening (best-effort)
}

function Prose({ body }: { body: string[] }) {
  return (
    <div className="space-y-4">
      {body.map((p, i) => (
        <p key={i} className="font-body text-reading text-charcoal/85">
          {p}
        </p>
      ))}
    </div>
  );
}

function ChipInput({ value, onChange, placeholder, suggestions }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[] }) {
  const [text, setText] = useState("");
  function add(v: string) {
    const t = v.trim();
    if (!t) return;
    onChange([...value, t]);
    setText("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-full bg-light-gray/70 px-3 py-1 font-ui text-sm text-charcoal">
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-charcoal/50 hover:text-charcoal">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(text);
            }
          }}
          placeholder={placeholder ?? "Add one…"}
          className="min-w-0 flex-1 rounded-full border border-light-gray bg-white px-4 py-2 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy"
        />
        <button type="button" onClick={() => add(text)} className="rounded-full bg-midnight-navy px-4 py-2 font-ui text-sm text-warm-ivory">
          Add
        </button>
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-light-gray px-3 py-1 font-ui text-xs text-charcoal/70 hover:bg-light-gray/50">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const nextBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90";

// ---- Interaction registry ------------------------------------------------------
// The universal, slotted walker renders each screen by looking up its kind in this
// registry rather than a monolithic switch. This is the shared mechanism later Rev 3
// walkers (Simulation / Mission / UseReview) reuse; the Rev 3 signature primitives
// (evidenceTimeline, conclusionNarrowing) register here in a later step. Behavior is
// identical to the prior switch (behavioral + persistence parity, §16 step 2).

type Summary = { label: string; value: string }[];

interface ScreenCtx {
  play: Play;
  i: number;
  draft: Draft;
  summary: Summary;
  setField: (key: string, v: unknown) => void;
  advance: () => void;
  onExit: () => void;
  onSaveOutput: (payload: Record<string, unknown>) => void;
  onScreenText?: (text: string) => void;
  onRoute?: (toPlayId: string) => void;
}

type ScreenRenderer<K extends Screen["kind"]> = (s: Extract<Screen, { kind: K }>, ctx: ScreenCtx) => ReactNode;

const SCREEN_REGISTRY: { [K in Screen["kind"]]: ScreenRenderer<K> } = {
  shift: (s, ctx) => (
    <div className="space-y-6">
      <Prose body={s.body} />
      <button type="button" className={nextBtn} onClick={ctx.advance}>Continue</button>
    </div>
  ),
  learn: (s, ctx) => (
    <div className="space-y-6">
      <Prose body={s.body} />
      <button type="button" className={nextBtn} onClick={ctx.advance}>Continue</button>
    </div>
  ),
  emotionBeat: (s, ctx) => (
    <div className="space-y-6">
      <Prose body={s.body} />
      {ctx.play.routing && ctx.onRoute && (
        <button type="button" onClick={() => ctx.onRoute!(ctx.play.routing!.toPlayId)} className="block font-ui text-sm text-midnight-navy underline">
          {ctx.play.routing.label}
        </button>
      )}
      <button type="button" className={nextBtn} onClick={ctx.advance}>Continue</button>
    </div>
  ),
  literature: (s, ctx) => <LiteratureScreen l1={s.l1} l2={s.l2} l2Heading={s.l2Heading} onNext={ctx.advance} />,
  scenarioSort: (s, ctx) => (
    <ScenarioSortScreen
      key={ctx.i}
      data={s}
      onDone={(assignments, evidence) => {
        ctx.setField(`sort_${ctx.i}`, assignments);
        if (evidence) ctx.setField(`evidence_${ctx.i}`, evidence);
        ctx.advance();
      }}
    />
  ),
  ownTurn: (s, ctx) => (
    <OwnTurnScreen key={ctx.i} data={s} draft={ctx.draft} setField={ctx.setField} onScreenText={ctx.onScreenText} onNext={ctx.advance} />
  ),
  sufficiency: (s, ctx) => (
    <SufficiencyScreen
      key={ctx.i}
      data={s}
      onDone={(res) => {
        ctx.setField("sufficiency", res.choice);
        if (res.needToKnow) ctx.setField("need_to_know", res.needToKnow);
        if (res.observable) ctx.setField("observable_evidence", res.observable);
        ctx.advance();
      }}
    />
  ),
  ruleBuilder: (s, ctx) => (
    <RuleBuilderScreen
      key={ctx.i}
      data={s}
      initialCondition={(ctx.draft["observable_evidence"] as string) ?? ""}
      onDone={(rule) => {
        ctx.setField("rule", rule);
        ctx.advance();
      }}
    />
  ),
  sentenceBuilder: (s, ctx) => (
    <SentenceBuilderScreen
      key={ctx.i}
      data={s}
      initial=""
      onDone={(sentence) => {
        ctx.setField("narrowest_true_thing", sentence);
        ctx.advance();
      }}
    />
  ),
  output: (s, ctx) => (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-midnight-navy">{s.heading}</h2>
      {s.body && <p className="font-body text-[15px] text-charcoal/70">{s.body}</p>}
      <dl className="space-y-3">
        {ctx.summary.map((r, idx) => (
          <div key={idx} className="rounded-xl bg-warm-ivory px-4 py-3">
            <dt className="font-ui text-xs uppercase tracking-wide text-charcoal/50">{prettyLabel(r.label)}</dt>
            <dd className="mt-1 font-body text-[15px] text-charcoal">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={nextBtn} onClick={() => { ctx.onSaveOutput({ ...ctx.draft }); ctx.advance(); }}>
          Save to My Plays
        </button>
        <button type="button" className="rounded-full border border-midnight-navy px-6 py-3 font-ui text-sm text-midnight-navy" onClick={ctx.advance}>
          Just take it with me
        </button>
      </div>
    </div>
  ),
  portable: (s, ctx) => (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-midnight-navy">{s.heading}</h2>
      <ol className="space-y-2">
        {s.steps.map((step, idx) => (
          <li key={idx} className="flex gap-3 font-body text-[16px] text-charcoal/85">
            <span className="font-ui text-coral-rose">{idx + 1}.</span> {step}
          </li>
        ))}
      </ol>
      <button type="button" className={nextBtn} onClick={ctx.advance}>Continue</button>
    </div>
  ),
  realWorldUse: (s, ctx) => (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-midnight-navy">Use it in real life</h2>
      <p className="font-body text-[16px] text-charcoal/85"><span className="font-medium">Use this when</span> {s.useWhen}</p>
      <p className="font-body text-[16px] text-charcoal/85"><span className="font-medium">Do:</span> {s.doThis}</p>
      {s.safetyNote && (
        <p className="rounded-2xl bg-amber-warm/15 px-4 py-3 font-body text-[15px] text-charcoal/85" role="note">{s.safetyNote}</p>
      )}
      <button type="button" className={nextBtn} onClick={ctx.onExit}>Done — back to board</button>
    </div>
  ),
};

/** Look up and render a screen by kind. Unknown kinds are skipped defensively. */
function renderScreen(s: Screen, ctx: ScreenCtx): ReactNode {
  const renderer = SCREEN_REGISTRY[s.kind] as ((s: Screen, ctx: ScreenCtx) => ReactNode) | undefined;
  return renderer ? renderer(s, ctx) : null;
}

export default function PlayContainer({ play, onSaveOutput, onExit, onRoute, onScreenText }: PlayContainerProps) {
  const [i, setI] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const screen = play.screens[i] as Screen | undefined;
  const advance = () => setI((n) => Math.min(n + 1, play.screens.length));
  const setField = (key: string, v: unknown) => setDraft((d) => ({ ...d, [key]: v }));

  const summary = useMemo<Summary>(() => {
    const rows: Summary = [];
    for (const [k, v] of Object.entries(draft)) {
      if (typeof v === "string" && v.trim()) rows.push({ label: k, value: v });
      else if (Array.isArray(v) && v.length) rows.push({ label: k, value: (v as string[]).join(" · ") });
      else if (v && typeof v === "object") rows.push({ label: k, value: Object.values(v as Record<string, string>).filter(Boolean).join(" → ") });
    }
    return rows;
  }, [draft]);

  if (!screen) {
    // Reached the end without an explicit output screen — exit.
    return null;
  }

  const ctx: ScreenCtx = { play, i, draft, summary, setField, advance, onExit, onSaveOutput, onScreenText, onRoute };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onExit} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">
          ← Back to board
        </button>
      </div>

      {/* Support signpost — ALWAYS VISIBLE (owner decision 2026-08-05).
        *
        * This was previously collapsed behind a link reading "If this feels
        * bigger than a dating moment". Two problems: the crisis wording — the
        * most important copy in the product — was closed by default, and the
        * label was hardcoded, so it appeared on every Playbook including the
        * one for a partner who died. Someone grieving was asked whether things
        * felt bigger than a dating moment to reach the suicide copy.
        *
        * Now it renders as a standing help box, styled like one and marked up
        * as a complementary landmark so screen readers can jump to it. Only
        * [0] is used, which is safe: no play authors more than one (verified). */}
      {play.supportSignposts?.[0] && (
        <aside
          className="mb-6 rounded-2xl border border-slate-blue/40 bg-slate-blue/10 p-5"
          role="complementary"
          aria-label="Support"
        >
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-blue">Support</p>
          <h3 className="mt-1.5 font-display text-lg text-midnight-navy">{play.supportSignposts[0].heading}</h3>
          <p className="mt-2 whitespace-pre-line font-body text-body text-charcoal/85">
            {play.supportSignposts[0].body}
          </p>
        </aside>
      )}

      <div className="rounded-3xl bg-white/60 p-6 sm:p-8">
        {renderScreen(screen, ctx)}
      </div>
    </div>
  );
}

function prettyLabel(key: string): string {
  const map: Record<string, string> = {
    question: "The question",
    saw: "What you saw",
    guessing: "What you're guessing",
    unknown: "What's still unknown",
    evidence: "What would tell you",
    rule: "Your move",
    event: "What happened",
    conclusion: "What you turned it into",
    establishes: "What it establishes",
    notEstablishes: "What it can't prove",
    narrowest_true_thing: "The narrowest true thing",
  };
  return map[key] ?? key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

// ---- per-screen sub-components ----

function LiteratureScreen({ l1, l2, l2Heading, onNext }: { l1: string; l2?: string; l2Heading?: string; onNext: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-midnight-navy">Why this matters</h2>
      <p className="font-body text-base leading-relaxed text-charcoal/85">{l1}</p>
      {l2 && (
        <div>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="font-ui text-sm text-midnight-navy underline">
            {open ? "Hide" : (l2Heading ?? "Understand this deeper")} {open ? "▴" : "▸"}
          </button>
          {open && <p className="mt-3 font-body text-body text-charcoal/75">{l2}</p>}
        </div>
      )}
      <button type="button" className={nextBtn} onClick={onNext}>Show me how</button>
    </div>
  );
}

function ScenarioSortScreen({ data, onDone }: { data: Extract<Screen, { kind: "scenarioSort" }>; onDone: (a: Record<string, string>, evidence?: string) => void }) {
  const [assignments, setAssignments] = useState<Record<string, string> | null>(null);
  const [evidence, setEvidence] = useState<string>("");
  return (
    <div className="space-y-5">
      <p className="font-body text-[15px] text-charcoal/70">{data.prompt}</p>
      <div className="rounded-2xl bg-warm-ivory p-4">
        <p className="font-body text-base leading-relaxed text-charcoal">{data.situation}</p>
        {data.thought && <p className="mt-2 font-body text-[15px] italic text-charcoal/70">{data.thought}</p>}
      </div>
      {!assignments ? (
        <SortEngine buckets={data.buckets} items={data.items} note={data.note} onComplete={(a) => setAssignments(a)} />
      ) : data.evidenceQuestion ? (
        <fieldset className="space-y-3">
          <legend className="font-body text-[16px] text-charcoal/85">{data.evidenceQuestion.prompt}</legend>
          {data.evidenceQuestion.options.map((opt) => (
            <label key={opt} className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 font-body text-[15px] text-charcoal">
              <input type="radio" name="evidence" value={opt} checked={evidence === opt} onChange={() => setEvidence(opt)} />
              {opt}
            </label>
          ))}
          <button type="button" disabled={!evidence} onClick={() => onDone(assignments, evidence)} className={nextBtn + " disabled:opacity-40"}>
            Continue
          </button>
        </fieldset>
      ) : (
        <button type="button" onClick={() => onDone(assignments)} className={nextBtn}>Continue</button>
      )}
    </div>
  );
}

function OwnTurnScreen({ data, draft, setField, onScreenText, onNext }: { data: Extract<Screen, { kind: "ownTurn" }>; draft: Draft; setField: (k: string, v: unknown) => void; onScreenText?: (t: string) => void; onNext: () => void }) {
  return (
    <div className="space-y-6">
      {data.intro && <p className="font-body text-[16px] text-charcoal/85">{data.intro}</p>}
      {data.fields.map((f) => (
        <div key={f.id} className="space-y-2">
          <label className="block font-ui text-sm font-medium text-charcoal">{f.label}</label>
          {f.input === "text" ? (
            <input
              defaultValue={(draft[f.id] as string) ?? ""}
              onBlur={(e) => {
                setField(f.id, e.target.value);
                if (onScreenText && e.target.value.trim()) onScreenText(e.target.value);
              }}
              placeholder={f.placeholder}
              className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy"
            />
          ) : (
            <ChipInput
              value={(draft[f.id] as string[]) ?? []}
              onChange={(v) => setField(f.id, v)}
              placeholder={f.placeholder}
              suggestions={f.suggestions}
            />
          )}
        </div>
      ))}
      <button type="button" className={nextBtn} onClick={onNext}>Continue</button>
    </div>
  );
}

function SufficiencyScreen({ data, onDone }: { data: Extract<Screen, { kind: "sufficiency" }>; onDone: (r: { choice: "enough" | "need-more"; needToKnow?: string; observable?: string }) => void }) {
  const [needMore, setNeedMore] = useState(false);
  const [needToKnow, setNeedToKnow] = useState("");
  const [observable, setObservable] = useState("");
  if (needMore) {
    const ready = needToKnow.trim() && observable.trim();
    return (
      <div className="space-y-5">
        {data.needMoreIntro && <p className="font-body text-[16px] text-charcoal/85">{data.needMoreIntro}</p>}
        <label className="block font-ui text-sm font-medium text-charcoal">{data.needToKnowLabel}</label>
        <input value={needToKnow} onChange={(e) => setNeedToKnow(e.target.value)} className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy" />
        <label className="block font-ui text-sm font-medium text-charcoal">{data.observableLabel}</label>
        <input value={observable} onChange={(e) => setObservable(e.target.value)} className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy" />
        <button type="button" disabled={!ready} onClick={() => onDone({ choice: "need-more", needToKnow, observable })} className={nextBtn + " disabled:opacity-40"}>Continue</button>
        {!ready && <p className="font-body text-sm text-charcoal/55">Name both — this keeps “more information” from turning into waiting forever.</p>}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="font-body text-[16px] text-charcoal/85">{data.prompt}</p>
      <div className="flex flex-col gap-3">
        <button type="button" className={nextBtn} onClick={() => onDone({ choice: "enough" })}>{data.enoughLabel}</button>
        <button type="button" className="rounded-full border border-midnight-navy px-6 py-3 font-ui text-sm text-midnight-navy" onClick={() => setNeedMore(true)}>{data.needMoreLabel}</button>
      </div>
    </div>
  );
}

function RuleBuilderScreen({ data, initialCondition = "", onDone }: { data: Extract<Screen, { kind: "ruleBuilder" }>; initialCondition?: string; onDone: (rule: { condition: string; action: string }) => void }) {
  const [condition, setCondition] = useState(initialCondition);
  const [action, setAction] = useState("");
  const [checked, setChecked] = useState(false);
  const ready = condition.trim() && action && checked;
  return (
    <div className="space-y-5">
      {data.intro && <p className="font-body text-[16px] text-charcoal/85">{data.intro}</p>}
      <label className="block font-ui text-sm font-medium text-charcoal">{data.conditionLabel}</label>
      <input value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy" />
      <label className="block font-ui text-sm font-medium text-charcoal">{data.thenLabel}</label>
      <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy">
        <option value="">Choose one…</option>
        {data.actions.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <label className="flex items-start gap-3 rounded-xl bg-warm-ivory px-4 py-3 font-body text-[14px] text-charcoal/80">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-1" />
        {data.controlCheck}
      </label>
      <button type="button" disabled={!ready} onClick={() => onDone({ condition, action })} className={nextBtn + " disabled:opacity-40"}>
        Looks right
      </button>
    </div>
  );
}

function SentenceBuilderScreen({ data, initial, onDone }: { data: Extract<Screen, { kind: "sentenceBuilder" }>; initial: string; onDone: (s: string) => void }) {
  const [text, setText] = useState(initial);
  return (
    <div className="space-y-4">
      <label className="block font-ui text-sm font-medium text-charcoal">{data.label}</label>
      {data.helper && <p className="font-body text-[14px] text-charcoal/65">{data.helper}</p>}
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy" />
      <button type="button" disabled={!text.trim()} onClick={() => onDone(text)} className={nextBtn + " disabled:opacity-40"}>Continue</button>
    </div>
  );
}
