// R4 Layer A — Crisis Safety Detection (shared, cross-Play, cross-cluster).
//
// A thin adapter over the FROZEN deterministic Safety V2 engine (lib/companion/safety).
// Content-agnostic: identical behavior in any Play or cluster. Metadata-only — never
// logs or returns the user's raw text. This is distinct from Layer B (Play-specific
// support/signposts), which is content-driven per Play.

import { screenText } from "@/lib/companion/safety";
import type { CrisisScreenResult } from "@/lib/playbook/types";

const NONE: CrisisScreenResult = { interrupt: false, heading: null, message: null, resources: [] };

/**
 * Screen a short free-text field for crisis/immediacy signals. Non-blocking by
 * design: the caller surfaces resources but does not prevent the user continuing.
 */
export async function screenPlaybookText(userId: string, text: string): Promise<CrisisScreenResult> {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return NONE;
  const interrupt = await screenText(trimmed, { userId, context: "playbook" });
  if (!interrupt) return NONE;
  return {
    interrupt: true,
    heading: interrupt.heading,
    message: interrupt.message,
    resources: interrupt.resources.map((r) => ({
      label: r.name,
      value: r.contact ?? r.url ?? "",
    })),
  };
}
