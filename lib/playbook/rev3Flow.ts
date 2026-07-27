// Rev 3 Step 5 — helpers that let a Play FOLLOW its simulation and consume its
// EXTRACTED literature. Pure, additive, flag-gated at the call site. v0 uses none of
// this (v0 still walks the Play's own screens, literature screen included).

import type { PlaybookContent, Simulation, Play, Screen, LiteratureEntry, Mission, UseReview } from "@/lib/playbook/contentSchema";

/** The authored simulation that rehearses this Play's operation, if any. */
export function simulationForPlay(content: PlaybookContent, playId: string): Simulation | undefined {
  return content.simulations?.find((s) => s.playId === playId);
}

/** The authored real-world mission for this Play's operation, if any. */
export function missionForPlay(content: PlaybookContent, playId: string): Mission | undefined {
  return content.missions?.find((m) => m.playId === playId);
}

/** The structured Use Review (return form) for this Play, if any. */
export function useReviewForPlay(content: PlaybookContent, playId: string): UseReview | undefined {
  return content.useReviews?.find((r) => r.playId === playId);
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
