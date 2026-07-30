import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { MOVING_BEYOND_REJECTION } from "@/content/playbook/moving-beyond-rejection";
import { DATING_WITHOUT_LOSING_HOPE } from "@/content/playbook/dating-without-losing-hope";
import { LETTING_SOMEONE_IN } from "@/content/playbook/letting-someone-in";
import { TRUSTING_WHAT_YOU_SEE } from "@/content/playbook/trusting-what-you-see";
import { FINDING_SECURITY } from "@/content/playbook/finding-security";
import { BREAKING_THE_CYCLE } from "@/content/playbook/breaking-the-cycle";

const REGISTRY: Record<string, PlaybookContent> = {
  "moving-beyond-rejection": MOVING_BEYOND_REJECTION,
  // Clusters 3–7 — content scaffolded (Plays-only), registered for preview/validation.
  // NOT yet in INTERACTIVE_PLAYBOOK_KEYS or PLAYBOOK_KEY_TO_CLUSTER (lib/playbook/keys.ts):
  // the app will not serve them until that publish-wiring lands + their gated items clear.
  "dating-without-losing-hope": DATING_WITHOUT_LOSING_HOPE,
  "letting-someone-in": LETTING_SOMEONE_IN,
  "trusting-what-you-see": TRUSTING_WHAT_YOU_SEE,
  "finding-security": FINDING_SECURITY,
  "breaking-the-cycle": BREAKING_THE_CYCLE,
};

/** Authored interactive content for a playbook_key, or null if none shipped. */
export function getPlaybookContent(playbookKey: string | null | undefined): PlaybookContent | null {
  if (!playbookKey) return null;
  return REGISTRY[playbookKey] ?? null;
}

/** All registered playbook keys (for the dev preview switcher). Not a publish gate. */
export function listPlaybookKeys(): string[] {
  return Object.keys(REGISTRY);
}
