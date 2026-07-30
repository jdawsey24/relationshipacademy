import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { MOVING_BEYOND_REJECTION } from "@/content/playbook/moving-beyond-rejection";
import { DATING_WITHOUT_LOSING_HOPE } from "@/content/playbook/dating-without-losing-hope";

const REGISTRY: Record<string, PlaybookContent> = {
  "moving-beyond-rejection": MOVING_BEYOND_REJECTION,
  // Cluster 4 — content scaffolded (Plays-only). NOT yet in INTERACTIVE_PLAYBOOK_KEYS
  // or PLAYBOOK_KEY_TO_CLUSTER (lib/playbook/keys.ts): the app will not serve it until
  // that publish-wiring lands + the §10 gated items clear.
  "dating-without-losing-hope": DATING_WITHOUT_LOSING_HOPE,
};

/** Authored interactive content for a playbook_key, or null if none shipped. */
export function getPlaybookContent(playbookKey: string | null | undefined): PlaybookContent | null {
  if (!playbookKey) return null;
  return REGISTRY[playbookKey] ?? null;
}
