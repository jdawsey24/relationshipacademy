import type { CSSProperties } from "react";
import { getPlaybookContent } from "@/content/playbook";
import { ADDON_KEY_TO_CLUSTER } from "@/lib/playbook/keys";
import { PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";
import PlaybookBuyButton from "@/components/site/PlaybookBuyButton";
import SectionLabel from "@/components/site/SectionLabel";
import { IconTile } from "@/components/site/IconTile";

// The Expansion life-situation add-ons, presented for individual purchase. GATED
// with the corpus flag (NEXT_PUBLIC_PLAYBOOK_CORPUS) — renders nothing until the
// flip, so production is unaffected. Names + the reserved entitlement id come from
// the registry/content so they stay in sync; the buy button posts the add-on's
// reserved id and the checkout auto-applies the back-end coupon.
//
// Gentle "for when…" blurbs are marketing copy (owner-editable). List price is the
// standard $29.99; the coupon applies the discount quietly at checkout.
const ADDON_COPY: Record<string, { blurb: string; hue: string }> = {
  "addon-losing-a-partner": { blurb: "For grief when a partner has died — a loss the usual relationship advice doesn't fit.", hue: "#6B7C97" },
  "addon-caregiving": { blurb: "For when you're caring for a partner who's unwell, and the partnership has quietly changed.", hue: "#8A9D8F" },
  "addon-living-with-illness": { blurb: "For when you're the one who's ill — and don't want to be a burden, or feel like one.", hue: "#9C7A97" },
  "addon-dating-later": { blurb: "For dating later in life — the mechanics are different, and you bring more of yourself.", hue: "#C9A96E" },
  "addon-grieving-differently": { blurb: "For grieving a pregnancy or fertility loss together, when you each carry it differently.", hue: "#D9777D" },
};
const ORDER = [
  "addon-losing-a-partner",
  "addon-caregiving",
  "addon-living-with-illness",
  "addon-dating-later",
  "addon-grieving-differently",
];

export default function AddonsForSale() {
  if (process.env.NEXT_PUBLIC_PLAYBOOK_CORPUS !== "true") return null;
  const items = ORDER.filter((k) => ADDON_KEY_TO_CLUSTER[k] != null && getPlaybookContent(k) && ADDON_COPY[k]);
  if (items.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="text-center">
        <SectionLabel tone="sage">For a specific season</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">When life changes the relationship</h2>
        <p className="mx-auto mt-3 max-w-xl font-body text-charcoal/65">
          Focused companion reads for the hardest seasons — loss, caregiving, illness, dating again, grief. Each stands on its own.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {items.map((k) => {
          const content = getPlaybookContent(k)!;
          const { blurb, hue } = ADDON_COPY[k];
          const id = ADDON_KEY_TO_CLUSTER[k];
          return (
            <div key={k} style={{ "--hue": hue } as CSSProperties} className="flex flex-col rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <IconTile hue={hue}>
                <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s-7-4.35-9.5-8.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6.5C19 16.65 12 21 12 21z" />
                </svg>
              </IconTile>
              <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-midnight-navy">{content.displayName}</h3>
              <p className="mt-2 flex-1 font-body text-body text-charcoal/70">{blurb}</p>
              <div className="mt-5">
                <PlaybookBuyButton clusterId={id} label={`Get this — ${PLAYBOOK_PRICE_DISPLAY}`} className="!w-full" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center font-body text-sm text-charcoal/50">{PLAYBOOK_PRICE_DISPLAY} each · one-time · yours to keep</p>
    </section>
  );
}
