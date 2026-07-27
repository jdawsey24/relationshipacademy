// Rev 3 Step 5 — helpers that let a Play FOLLOW its simulation and consume its
// EXTRACTED literature. Pure, additive, flag-gated at the call site. v0 uses none of
// this (v0 still walks the Play's own screens, literature screen included).

import type { PlaybookContent, Simulation, Play, Screen, LiteratureEntry } from "@/lib/playbook/contentSchema";

/** The authored simulation that rehearses this Play's operation, if any. */
export function simulationForPlay(content: PlaybookContent, playId: string): Simulation | undefined {
  return content.simulations?.find((s) => s.playId === playId);
}

/** The play-scope literature entries for this Play (the "extracted" in-Play education). */
export function playLiterature(content: PlaybookContent, playId: string): LiteratureEntry[] {
  return (content.literature ?? []).filter((e) => e.scope === "play" && e.playId === playId);
}

/** The Play's intervention screens with the in-Play `literature` screen removed — in Rev 3
 *  the literature is extracted to first-class LiteratureEntry objects (field guide + JIT),
 *  and the preceding simulation does the felt teaching, so the Play is no standalone worksheet.
 *  This does NOT mutate the shared Play content (v0 keeps its literature screen). */
export function screensWithoutLiterature(play: Play): Screen[] {
  return play.screens.filter((s) => s.kind !== "literature");
}
