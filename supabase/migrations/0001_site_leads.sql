-- site_leads: capture rows from the public site forms (contact, speaking,
-- learn waitlist, professional interest). Run this once in the Supabase SQL
-- editor. The scoring/admin service-role writes bypass RLS; the policies below
-- also permit anon inserts and restrict reads to authenticated admins.

create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  source text not null,          -- 'contact_form' | 'speaking_inquiry' | 'learn_waitlist' | 'professional_interest'
  inquiry_type text,
  message text,
  organization text,
  event_type text,
  status text default 'new',     -- new | contacted | converted | archived
  notes text,
  created_at timestamptz not null default now()
);

alter table public.site_leads enable row level security;

-- Public (anon) may insert leads; they cannot read them.
create policy "site_leads public insert"
  on public.site_leads for insert
  to anon, authenticated
  with check (true);

-- Authenticated admins may read all leads.
create policy "site_leads admin read"
  on public.site_leads for select
  to authenticated
  using (true);
