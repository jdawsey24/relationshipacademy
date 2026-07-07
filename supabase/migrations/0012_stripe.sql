-- Stripe billing columns on profiles. Populated by the Stripe webhook when a
-- member subscribes; membership_tier is driven off the subscription.
-- Safe to run more than once. Run in the Supabase SQL editor.

alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text;   -- active | trialing | past_due | canceled | ...

create index if not exists profiles_stripe_customer_idx on public.profiles (stripe_customer_id);

notify pgrst, 'reload schema';
