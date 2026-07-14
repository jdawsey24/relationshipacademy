# Snapshot email sequence (Resend)

A 4-email nurture sequence that runs after someone completes the Relationship
Snapshot, nurturing toward the Academy. Built on Resend; fully resilient (email
never blocks scoring, and everything no-ops safely if not configured).

## The sequence (`lib/email/sequence.ts`)

| Day | key | Subject | CTA → |
|-----|-----|---------|-------|
| 0 | `results` | Your Relationship Snapshot Is Ready | View your results → `/snapshot/results` |
| 2 | `myth` | The Biggest Myth About Relationships | Learn more about the RLC™ → `/framework` |
| 5 | `label` | There's More to Your Relationship Than a Label | Explore the framework → `/framework` |
| 9 | `academy` | Continue Building Stronger Relationships | Join the Relationship Academy → Skool |

Copy is drafted in the RLC voice; edit it directly in `sequence.ts`. Each email
has HTML + plaintext, an on-brand layout, and an unsubscribe footer.

## Flow

- **Enroll + first email**: `app/api/assess/[slug]/score` → `enrollFromAttempt(attemptId)`
  after a live attempt is scored. Loads the respondent's email/name + growth areas,
  creates an `email_sequence_enrollments` row, and sends day-0 immediately.
  Idempotent (one enrollment per attempt); awaited but wrapped so it never fails
  the score response.
- **Drip**: `netlify/functions/email-sequence-cron.mjs` runs daily (14:00 UTC) and
  hits `GET /api/cron/email-sequence?secret=CRON_SECRET`, which calls
  `processDueEnrollments()` — sends the next step for every enrollment whose
  `next_send_at` is due and advances it (or completes).
- **Unsubscribe**: every email includes a footer link + `List-Unsubscribe` headers →
  `GET/POST /api/email/unsubscribe?id=<enrollment>` → marks `status='unsubscribed'`
  → `/unsubscribed` confirmation page.

## Data (`supabase/migrations/0031_email_sequence.sql`, owner-run)

- `email_sequence_enrollments` — email, first_name, attempt_id, growth_areas,
  current_step, status (active|completed|unsubscribed), enrolled_at, next_send_at.
  Service-role only (PII); unique on attempt_id.
- `email_sends` — per-send audit log.

## Environment variables (Netlify)

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend API key (set) |
| `CRON_SECRET` | Shared secret protecting the cron endpoint (**must add**) |
| `EMAIL_FROM` | optional; defaults to `Relationship Life Cycle <hello@notify.relationshiplc.com>` |
| `EMAIL_REPLY_TO` | optional; defaults to `hello@janelledawsey.com` |
| `URL` | auto-set by Netlify (used for links + cron self-call) |

## Go-live checklist

1. Verify **notify.relationshiplc.com** as a sending domain in Resend (add its DNS records).
2. Add `RESEND_API_KEY` (done) and `CRON_SECRET` (any strong random string) to Netlify env.
3. Run `supabase/migrations/0031_email_sequence.sql`.
4. Deploy. Netlify registers the daily scheduled function automatically.
5. Take the live Snapshot with a real address → confirm the day-0 email arrives.

## Notes

- Volume is expected low; the cron scans `status='active' AND next_send_at <= now`.
- `next_send_at` is computed as `enrolled_at + offsetDays` so cadence never drifts.
- Nothing here touches the scoring path or the legacy engine.
