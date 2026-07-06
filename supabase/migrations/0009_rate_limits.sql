-- Rate limiting backed by Postgres so it works across serverless instances
-- (in-memory counters don't — each Netlify function instance has its own memory).
-- check_rate_limit() atomically increments a per-key counter within a sliding
-- window and returns TRUE if the request is allowed, FALSE if over the limit.
-- Only the service role calls it (from server API routes). Run in the SQL editor.

create table if not exists public.rate_limits (
  key text primary key,                       -- e.g. 'site-leads:1.2.3.4'
  window_start timestamptz not null default now(),
  count integer not null default 0
);

alter table public.rate_limits enable row level security;
-- RLS on, no policy => default-deny for anon/authenticated. The service role
-- (which the API uses) bypasses RLS.

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
as $$
declare
  v_now timestamptz := now();
  v_count integer;
begin
  insert into public.rate_limits (key, window_start, count)
  values (p_key, v_now, 1)
  on conflict (key) do update
    set count = case
          when public.rate_limits.window_start < v_now - make_interval(secs => p_window_seconds)
          then 1                                   -- window expired: reset
          else public.rate_limits.count + 1        -- same window: increment
        end,
        window_start = case
          when public.rate_limits.window_start < v_now - make_interval(secs => p_window_seconds)
          then v_now
          else public.rate_limits.window_start
        end
  returning count into v_count;

  return v_count <= p_limit;                        -- true = allowed
end;
$$;

-- Only the server (service role) may call this — stop anon/authenticated from
-- poisoning counters via the auto-exposed RPC endpoint.
revoke execute on function public.check_rate_limit(text, integer, integer) from anon, authenticated;

notify pgrst, 'reload schema';
