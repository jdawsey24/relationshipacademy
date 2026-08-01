import type { PlaybookContent } from "@/lib/playbook/contentSchema";

// Flagship — the only publish-wired playbook (lib/playbook/keys.ts).
import { MOVING_BEYOND_REJECTION } from "@/content/playbook/moving-beyond-rejection";

// Full content corpus (handoff 2): 25 Plays-only Playbooks + 5 add-ons.
// Registered here for preview/validation; NONE are in INTERACTIVE_PLAYBOOK_KEYS
// or PLAYBOOK_KEY_TO_CLUSTER (lib/playbook/keys.ts) yet — the app will not serve
// them until publish-wiring lands and the owner gates clear (safety review,
// slug confirmation, stat citations). Keyed by each module's `playbookKey`.

// Exploration
import { LETTING_SOMEONE_IN } from "@/content/playbook/letting-someone-in";
import { DATING_WITHOUT_LOSING_HOPE } from "@/content/playbook/dating-without-losing-hope";
import { TRUSTING_WHAT_YOU_SEE } from "@/content/playbook/trusting-what-you-see";
import { FINDING_SECURITY } from "@/content/playbook/finding-security";
import { LEAN_IN_OR_LET_GO } from "@/content/playbook/lean-in-or-let-go";
import { LETTING_GO_OF_THE_ARMOR } from "@/content/playbook/letting-go-of-the-armor";
// Exclusivity
import { STAYING_YOURSELF } from "@/content/playbook/staying-yourself";
import { ASKING_BETTER_QUESTIONS } from "@/content/playbook/asking-better-questions";
// Expansion
import { BREAKING_THE_CYCLE } from "@/content/playbook/breaking-the-cycle";
import { FINDING_YOUR_WAY_BACK } from "@/content/playbook/finding-your-way-back";
import { REBUILDING_PHYSICAL_CONNECTION } from "@/content/playbook/rebuilding-physical-connection";
import { BUILDING_A_TRUE_PARTNERSHIP } from "@/content/playbook/building-a-true-partnership";
import { LEARNING_TO_SAY_NO } from "@/content/playbook/learning-to-say-no";
import { FEELING_SEEN } from "@/content/playbook/feeling-seen";
import { STAYING_CONNECTED } from "@/content/playbook/staying-connected";
// Expiration
import { ACCEPTING_WHAT_IS } from "@/content/playbook/accepting-what-is";
import { REBUILDING_TRUST } from "@/content/playbook/rebuilding-trust";
import { BUILDING_A_SHARED_FUTURE } from "@/content/playbook/building-a-shared-future";
// Recovery
import { LETTING_GO } from "@/content/playbook/letting-go";
import { FINDING_YOURSELF_AGAIN } from "@/content/playbook/finding-yourself-again";
import { MAKING_CONFIDENT_DECISIONS } from "@/content/playbook/making-confident-decisions";
// Renewal
import { OPENING_YOUR_HEART_AGAIN } from "@/content/playbook/opening-your-heart-again";
import { MOVING_FORWARD } from "@/content/playbook/moving-forward";
import { FROM_THE_GROUND_UP } from "@/content/playbook/from-the-ground-up";
import { A_DIFFERENT_LEGACY } from "@/content/playbook/a-different-legacy";
// Add-ons (reached by signpost / life-situation menu — not quiz-detectable)
import { ADDON_LOSING_A_PARTNER } from "@/content/playbook/losing-a-partner";
import { ADDON_CAREGIVING } from "@/content/playbook/caregiving";
import { ADDON_LIVING_WITH_ILLNESS } from "@/content/playbook/living-with-illness";
import { ADDON_DATING_LATER } from "@/content/playbook/dating-later";
import { ADDON_GRIEVING_DIFFERENTLY } from "@/content/playbook/grieving-differently";

const REGISTRY: Record<string, PlaybookContent> = {
  "moving-beyond-rejection": MOVING_BEYOND_REJECTION,

  // Exploration
  "letting-someone-in": LETTING_SOMEONE_IN,
  "dating-without-losing-hope": DATING_WITHOUT_LOSING_HOPE,
  "trusting-what-you-see": TRUSTING_WHAT_YOU_SEE,
  "finding-security": FINDING_SECURITY,
  "lean-in-or-let-go": LEAN_IN_OR_LET_GO,
  "letting-go-of-the-armor": LETTING_GO_OF_THE_ARMOR,
  // Exclusivity
  "staying-yourself": STAYING_YOURSELF,
  "asking-better-questions": ASKING_BETTER_QUESTIONS,
  // Expansion
  "breaking-the-cycle": BREAKING_THE_CYCLE,
  "finding-your-way-back": FINDING_YOUR_WAY_BACK,
  "rebuilding-physical-connection": REBUILDING_PHYSICAL_CONNECTION,
  "building-a-true-partnership": BUILDING_A_TRUE_PARTNERSHIP,
  "learning-to-say-no": LEARNING_TO_SAY_NO,
  "feeling-seen": FEELING_SEEN,
  "staying-connected": STAYING_CONNECTED,
  // Expiration
  "accepting-what-is": ACCEPTING_WHAT_IS,
  "rebuilding-trust": REBUILDING_TRUST,
  "building-a-shared-future": BUILDING_A_SHARED_FUTURE,
  // Recovery
  "letting-go": LETTING_GO,
  "finding-yourself-again": FINDING_YOURSELF_AGAIN,
  "making-confident-decisions": MAKING_CONFIDENT_DECISIONS,
  // Renewal
  "opening-your-heart-again": OPENING_YOUR_HEART_AGAIN,
  "moving-forward": MOVING_FORWARD,
  "from-the-ground-up": FROM_THE_GROUND_UP,
  "a-different-legacy": A_DIFFERENT_LEGACY,
  // Add-ons
  "addon-losing-a-partner": ADDON_LOSING_A_PARTNER,
  "addon-caregiving": ADDON_CAREGIVING,
  "addon-living-with-illness": ADDON_LIVING_WITH_ILLNESS,
  "addon-dating-later": ADDON_DATING_LATER,
  "addon-grieving-differently": ADDON_GRIEVING_DIFFERENTLY,
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
