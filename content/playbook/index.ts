import type { PlaybookContent } from "@/lib/playbook/contentSchema";

// Flagship — the only publish-wired playbook (lib/playbook/keys.ts).
import { MOVING_BEYOND_REJECTION } from "@/content/playbook/finding-love-that-feels-mutual";

// Full content corpus (handoff 2): 25 Plays-only Playbooks + 5 add-ons.
// Registered here for preview/validation; NONE are in INTERACTIVE_PLAYBOOK_KEYS
// or PLAYBOOK_KEY_TO_CLUSTER (lib/playbook/keys.ts) yet — the app will not serve
// them until publish-wiring lands and the owner gates clear (safety review,
// slug confirmation, stat citations). Keyed by each module's `playbookKey`.

// Exploration
import { LETTING_SOMEONE_IN } from "@/content/playbook/how-to-let-someone-in";
import { DATING_WITHOUT_LOSING_HOPE } from "@/content/playbook/dating-without-losing-hope";
import { TRUSTING_WHAT_YOU_SEE } from "@/content/playbook/trust-yourself-to-choose-better";
import { FINDING_SECURITY } from "@/content/playbook/the-relationship-overthinkers-playbook";
import { LEAN_IN_OR_LET_GO } from "@/content/playbook/is-this-going-somewhere";
import { LETTING_GO_OF_THE_ARMOR } from "@/content/playbook/more-than-what-you-provide";
// Exclusivity
import { STAYING_YOURSELF } from "@/content/playbook/how-to-love-without-losing-yourself";
import { ASKING_BETTER_QUESTIONS } from "@/content/playbook/asking-better-questions";
// Expansion
import { BREAKING_THE_CYCLE } from "@/content/playbook/how-to-stop-having-the-same-fight";
import { FINDING_YOUR_WAY_BACK } from "@/content/playbook/from-roommates-back-to-partners";
import { REBUILDING_PHYSICAL_CONNECTION } from "@/content/playbook/the-intimacy-reset";
import { BUILDING_A_TRUE_PARTNERSHIP } from "@/content/playbook/the-partnership-reset";
import { LEARNING_TO_SAY_NO } from "@/content/playbook/boundaries-without-guilt";
import { FEELING_SEEN } from "@/content/playbook/loved-not-just-needed";
import { STAYING_CONNECTED } from "@/content/playbook/money-work-and-us";
// Expiration
import { ACCEPTING_WHAT_IS } from "@/content/playbook/can-we-fix-this";
import { REBUILDING_TRUST } from "@/content/playbook/can-i-trust-you-again";
import { BUILDING_A_SHARED_FUTURE } from "@/content/playbook/do-we-want-the-same-future";
// Recovery
import { LETTING_GO } from "@/content/playbook/letting-go-without-losing-what-it-meant";
import { FINDING_YOURSELF_AGAIN } from "@/content/playbook/finding-yourself-after-everything-changed";
import { MAKING_CONFIDENT_DECISIONS } from "@/content/playbook/how-to-make-a-relationship-decision-you-can-trust";
// Renewal
import { OPENING_YOUR_HEART_AGAIN } from "@/content/playbook/starting-again-without-starting-from-scratch";
import { MOVING_FORWARD } from "@/content/playbook/moving-forward";
import { FROM_THE_GROUND_UP } from "@/content/playbook/what-nobody-taught-you-about-healthy-relationships";
import { A_DIFFERENT_LEGACY } from "@/content/playbook/the-cycle-breakers-playbook";
// Add-ons (reached by signpost / life-situation menu — not quiz-detectable)
import { ADDON_LOSING_A_PARTNER } from "@/content/playbook/losing-a-partner";
import { ADDON_CAREGIVING } from "@/content/playbook/caregiving";
import { ADDON_LIVING_WITH_ILLNESS } from "@/content/playbook/living-with-illness";
import { ADDON_DATING_LATER } from "@/content/playbook/dating-later";
import { ADDON_GRIEVING_DIFFERENTLY } from "@/content/playbook/grieving-differently";

const REGISTRY: Record<string, PlaybookContent> = {
  "finding-love-that-feels-mutual": MOVING_BEYOND_REJECTION,

  // Exploration
  "how-to-let-someone-in": LETTING_SOMEONE_IN,
  "dating-without-losing-hope": DATING_WITHOUT_LOSING_HOPE,
  "trust-yourself-to-choose-better": TRUSTING_WHAT_YOU_SEE,
  "the-relationship-overthinkers-playbook": FINDING_SECURITY,
  "is-this-going-somewhere": LEAN_IN_OR_LET_GO,
  "more-than-what-you-provide": LETTING_GO_OF_THE_ARMOR,
  // Exclusivity
  "how-to-love-without-losing-yourself": STAYING_YOURSELF,
  "asking-better-questions": ASKING_BETTER_QUESTIONS,
  // Expansion
  "how-to-stop-having-the-same-fight": BREAKING_THE_CYCLE,
  "from-roommates-back-to-partners": FINDING_YOUR_WAY_BACK,
  "the-intimacy-reset": REBUILDING_PHYSICAL_CONNECTION,
  "the-partnership-reset": BUILDING_A_TRUE_PARTNERSHIP,
  "boundaries-without-guilt": LEARNING_TO_SAY_NO,
  "loved-not-just-needed": FEELING_SEEN,
  "money-work-and-us": STAYING_CONNECTED,
  // Expiration
  "can-we-fix-this": ACCEPTING_WHAT_IS,
  "can-i-trust-you-again": REBUILDING_TRUST,
  "do-we-want-the-same-future": BUILDING_A_SHARED_FUTURE,
  // Recovery
  "letting-go-without-losing-what-it-meant": LETTING_GO,
  "finding-yourself-after-everything-changed": FINDING_YOURSELF_AGAIN,
  "how-to-make-a-relationship-decision-you-can-trust": MAKING_CONFIDENT_DECISIONS,
  // Renewal
  "starting-again-without-starting-from-scratch": OPENING_YOUR_HEART_AGAIN,
  "moving-forward": MOVING_FORWARD,
  "what-nobody-taught-you-about-healthy-relationships": FROM_THE_GROUND_UP,
  "the-cycle-breakers-playbook": A_DIFFERENT_LEGACY,
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
