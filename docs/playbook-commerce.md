# Playbook commerce (paid one-time products)

Playbooks moved from a free Snapshot lead-magnet to **paid one-time products**.
One playbook per Snapshot cluster; **same price for every playbook** (one shared
Stripe price). Ownership is recorded per user so the PDF is gated and the
Companion returning-customer discount can detect it.

## Data model
- `supabase/migrations/0042_playbook_entitlements.sql` — `playbook_entitlements`
  (user_id + cluster_id, one active row per user+playbook). Own-row read RLS;
  all writes via the service role. **Owner runs this migration.**

## Stripe (owner sets up)
- One Product "Relationship Playbook" with **one Price** at **$29.99**, lookup
  key `playbook_onetime`, one-time, metadata `product_key=playbook`,
  `billing_type=one_time`. The specific playbook (cluster id) rides in the
  checkout session metadata, not the price. Purchasing is inert until this
  price exists (checkout returns a clean "not available yet").
- The buy button does not hardcode the price (avoids drift) — the amount is
  shown on the Stripe Checkout page. Price anchor: Playbook $29.99 · Companion
  $19.99 base / $9.99 for owners of a playbook or Academy membership.

## Flow
1. **Buy** — `POST /api/playbooks/checkout` `{ cluster_id }` (requires a signed-in
   member; ownership must attach to an account). Reuses the profile's Stripe
   customer. `success_url` → `/playbooks?purchase=success`.
2. **Grant** — the Stripe webhook (`checkout.session.completed`, `product_key=playbook`)
   writes a `playbook_entitlements` row (`lib/snapshot/playbookGrants.ts`,
   idempotent by Stripe id / unique(user,cluster)).
3. **Access** — `GET /api/playbooks/[cluster]/download` authorizes the owner and
   streams the PDF. The 6 PDFs live in `/content/playbooks` (OUTSIDE `public/`,
   so they are never directly reachable) and are bundled into that function via
   `outputFileTracingIncludes` in `next.config.ts`.
4. **Library** — `/playbooks` lists what the member owns with download buttons.

## Snapshot funnel (kept, not removed)
The Snapshot results card now leads with a **Buy** CTA but **keeps the email
capture** (Meta Pixel `Lead` + the nurture sequence) as a secondary path for
people not ready to purchase. The day-0 nurture email links to the results page
to unlock the playbook (soft-sell) instead of delivering a free PDF.

## Companion cross-sell discount
`lib/companion/pricing.ts#getReturningEligibility` qualifies anyone who owns an
Academy membership **or** at least one playbook, so a playbook owner gets the
discounted Companion price (`companion_returning`).

## Owner checklist
- [ ] Run migration `0042_playbook_entitlements.sql`.
- [ ] Create the Stripe price (`playbook_onetime`, one-time) at **$29.99**.
- [ ] (For the Companion discount) create `companion_returning` if not already.
