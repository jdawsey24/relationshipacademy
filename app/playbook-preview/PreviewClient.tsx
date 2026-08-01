"use client";

// DEV/PREVIEW-ONLY walkthrough harness. Mounts the REAL ExperienceShell (rev3 forced on) for any
// REGISTERED playbook, so the owner can click through every cluster without an auth session or the
// keys.ts publish gate. Never rendered in production (the server page 404s there). Not shipped.
//
// The rich mock "states" (active mission, pending review, …) are Cluster-1-specific — they reference
// Cluster 1's play/mission ids. For every other cluster the preview starts from first-time (empty
// progress); you click through recognition → plays → missions → reviews live.

import { useState } from "react";
import ExperienceShell from "@/components/playbook/ExperienceShell";
import RelatedPlaybooks from "@/components/playbook/RelatedPlaybooks";
import { getPlaybookContent, listPlaybookKeys } from "@/content/playbook";
import { emptyProgress, type PlaybookProgress } from "@/lib/playbook/contentSchema";

const C1_KEY = "moving-beyond-rejection";
const RD = "read-and-decide";
const RD_M = "mission-rd-read-before-react";
const out = { output_schema_version: 1, play_version: 1, payload: { evidence: "shorter texts", rule: { condition: "I see one more short day", action: "I ask directly" } } };

const savedCard = {
  play_id: RD,
  play_version: 1,
  name: "Read It, Then Decide",
  when: "A text or a change in how they're acting starts turning into a story.",
  move: "Separate what I saw from what I'm guessing, and name the one thing that would tell me more.",
  lookingFor: "The narrowest true thing the moment actually shows.",
  watchOut: "Acting on the story before the evidence is in.",
  remember: "One data point isn't a verdict.",
};

// A returning Cluster-1 reader who has worked through the in-app Play and saved it.
function returningBase(): PlaybookProgress {
  return {
    ...emptyProgress(C1_KEY, 1),
    recognized: ["rec-evidence"],
    play_states: { [RD]: "in_my_plays" },
    outputs: { [RD]: out },
    my_plays: [savedCard],
    simulation_state: { version: 1, runs: { "sim-rd-shorter-texts": { completed: true, fidelity: { signature: "evidenceTimeline", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" } } } },
  };
}

const C1_STATES = ["first-time", "no-mission", "active-mission", "pending-review", "reviewed"] as const;

function c1ProgressFor(state: string): PlaybookProgress {
  switch (state) {
    case "first-time":
      return emptyProgress(C1_KEY, 1);
    case "active-mission":
      return { ...returningBase(), practice_state: { version: 1, currentMissionId: RD_M, missions: { [RD_M]: { state: "selected" } } } };
    case "pending-review":
      return { ...returningBase(), practice_state: { version: 1, currentMissionId: RD_M, missions: { [RD_M]: { state: "attempted", attemptCount: 1 } } } };
    case "reviewed":
      return {
        ...returningBase(),
        practice_state: { version: 1, currentMissionId: RD_M, missions: { [RD_M]: { state: "reviewed", attemptCount: 1 } } },
        use_review_state: { version: 1, reviews: { [RD]: [{ performed: "partly" }] } },
      };
    case "no-mission":
    default:
      return returningBase();
  }
}

const btn = "rounded-full border px-3 py-1 font-ui text-xs transition";
const on = "border-midnight-navy bg-midnight-navy text-white";
const off = "border-light-gray bg-white text-charcoal/70 hover:border-midnight-navy/40";

export default function PreviewClient({ state: initialState }: { state: string }) {
  const keys = listPlaybookKeys();
  const [key, setKey] = useState(keys.includes(C1_KEY) ? C1_KEY : keys[0]);
  const [state, setState] = useState(initialState);

  const content = getPlaybookContent(key);
  const isC1 = key === C1_KEY;
  const progress = content
    ? isC1
      ? c1ProgressFor(state)
      : emptyProgress(key, content.playbookVersion)
    : null;

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-2 px-5 pt-4">
        <span className="font-ui text-xs uppercase tracking-wide text-charcoal/40">preview</span>
        {keys.map((k) => {
          const c = getPlaybookContent(k);
          return (
            <button key={k} type="button" onClick={() => setKey(k)} className={`${btn} ${k === key ? on : off}`}>
              {c?.displayName ?? k}
            </button>
          );
        })}
      </div>
      {isC1 && (
        <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-2 px-5 pt-2">
          <span className="font-ui text-xs uppercase tracking-wide text-charcoal/30">state</span>
          {C1_STATES.map((s) => (
            <button key={s} type="button" onClick={() => setState(s)} className={`${btn} ${s === state ? on : off}`}>
              {s}
            </button>
          ))}
        </div>
      )}
      {content && progress ? (
        <>
          <ExperienceShell key={`${key}:${isC1 ? state : "first"}`} content={content} playbookKey={key} initialProgress={progress} rev3 />
          {/* Cross-Playbook routing scaffold — in-app this becomes hrefFor={`/playbook/${to}`}
              once targets are publish-wired; here it switches the preview. */}
          <div className="px-5 pb-16">
            <RelatedPlaybooks fromKey={key} titleFor={(k) => getPlaybookContent(k)?.displayName} onSelect={setKey} />
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-2xl px-5 pt-8 font-body text-charcoal/60">No content registered for “{key}”.</div>
      )}
    </div>
  );
}
