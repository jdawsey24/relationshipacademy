"use client";

// Rev 3 Step 5 — a Play FOLLOWS its simulation.
//
// Phase 1: the authored Simulation (felt rehearsal of the operation).
// Phase 2: the Play's intervention screens, with the in-Play literature screen extracted
//          (literature is now first-class + the simulation already did the felt teaching),
//          so the Play reads as the operation the reader just felt — not a standalone worksheet.
//
// Flag-gated at the call site; not used by v0. If the Play has no simulation, this renders
// the Play directly (still literature-extracted for the Rev 3 path).

import { useState } from "react";
import type { PlaybookContent, Play, FidelityOutcome } from "@/lib/playbook/contentSchema";
import SimulationPlayer from "@/components/playbook/SimulationPlayer";
import PlayContainer from "@/components/playbook/PlayContainer";
import { simulationForPlay } from "@/lib/playbook/rev3Flow";
import { rev3Play } from "@/content/playbook/moving-beyond-rejection-rev3-copy";

export interface PlaySequenceProps {
  content: PlaybookContent;
  play: Play;
  onSaveOutput: (payload: Record<string, unknown>) => void;
  onExit: () => void;
  onRoute?: (toPlayId: string) => void;
  onScreenText?: (text: string) => void;
  onSurfaceJit?: (literatureId: string) => void;
  onSimComplete?: (simId: string, fidelity: FidelityOutcome) => void;
  /** Resume: if the simulation was already completed, go straight to the Play. */
  simCompleted?: boolean;
}

export default function PlaySequence({
  content,
  play,
  onSaveOutput,
  onExit,
  onRoute,
  onScreenText,
  onSurfaceJit,
  onSimComplete,
  simCompleted = false,
}: PlaySequenceProps) {
  const sim = simulationForPlay(content, play.playId);
  const [phase, setPhase] = useState<"sim" | "play">(sim && !simCompleted ? "sim" : "play");

  if (sim && phase === "sim") {
    return (
      <SimulationPlayer
        simulation={sim}
        onComplete={(fidelity, _toPlayId) => {
          onSimComplete?.(sim.id, fidelity);
          setPhase("play");
        }}
        onExit={onExit}
        onScreenText={onScreenText}
        onSurfaceJit={onSurfaceJit}
      />
    );
  }

  const playForRev3: Play = rev3Play(play);
  return (
    <PlayContainer play={playForRev3} onSaveOutput={onSaveOutput} onExit={onExit} onRoute={onRoute} onScreenText={onScreenText} />
  );
}
