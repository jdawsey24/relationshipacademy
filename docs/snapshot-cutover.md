# Snapshot cutover — 47-item → cluster system

The cluster Snapshot (6 quizzes / 26 Experience Clusters) replaces the 47-item
Snapshot as the public assessment. Built in parallel, cut over deliberately.

## What changed (code)
- `/snapshot` now serves the cluster picker (`app/snapshot/*`). The 47-item flow is
  preserved at `app/snapshot-legacy/*` (dark) for the future Relationship Profile™ build.
- All site CTAs point to `/snapshot`; old paths 301-redirect there (`next.config.ts`).
- Conversion event (Meta Pixel `Lead` + GA `snapshot_conversion`) on the Playbook capture.
- Per-cluster Resend nurture: converted sessions drip a 4-email, cluster-personalized
  sequence (Day 0 result → +2/+4 content pillars → +7 Academy). `lib/snapshot/nurture.ts`,
  enrolled from `/api/snapshot/convert`, dripped by the daily `netlify/functions/
  email-sequence-cron.mjs` → `/api/cron/snapshot-nurture`. Unsubscribe:
  `/api/snapshot/unsubscribe?session=` → `/unsubscribed`.

## Deploy steps (in order)
1. Run `supabase/migrations/0033_snapshot_nurture.sql` (nurture columns).
2. Merge + deploy the `cutover` branch.
3. Unpublish the 47-item instrument (`live_enabled=false` on `ASM-SNAPSHOT-001`) so
   `/assess/relationship-snapshot` stops serving.

## External (owner, in your own tools)
- **Google Ads:** repoint the conversion action to the new `snapshot_conversion` /
  Meta `Lead` event.
- **GHL:** rebuild nurture per cluster (or per phase) — the old Healthy/Mid/Distressed
  tracks don't map to 26 clusters. (Optional: if you want leads pushed to GHL, add a
  webhook POST in `convertSession` — not built yet.)

## Env (already set on Netlify)
`RESEND_API_KEY`, `CRON_SECRET`, `URL`. Emails send from `snapshot@notify.relationshiplc.com`.

## Deferred
Playbook PDF + client portal (static per-cluster PDFs). Until then the nurture email
series is the "Playbook" value.

## Rollback
Revert the cutover commit (restores the 47-item flow at `/snapshot` + CTAs) and
republish the instrument. Legacy engine/data never changed.
