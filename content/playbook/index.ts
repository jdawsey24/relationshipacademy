import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { MOVING_BEYOND_REJECTION } from "@/content/playbook/moving-beyond-rejection";

const REGISTRY: Record<string, PlaybookContent> = {
  "moving-beyond-rejection": MOVING_BEYOND_REJECTION,
};

/** Authored interactive content for a playbook_key, or null if none shipped. */
export function getPlaybookContent(playbookKey: string | null | undefined): PlaybookContent | null {
  if (!playbookKey) return null;
  return REGISTRY[playbookKey] ?? null;
}
