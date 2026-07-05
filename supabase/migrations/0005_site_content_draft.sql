-- Draft/publish for the Website/Framework CMS. `value` stays the PUBLISHED
-- value that public pages read; `draft_value` holds staged edits that are not
-- live until published. Publishing copies draft_value -> value and clears the
-- draft. Safe to run more than once. Run in the Supabase SQL editor.

alter table public.site_content add column if not exists draft_value text;

-- Drafts must not be publicly readable. The table has a public (anon) read
-- policy for published copy. A table-wide SELECT grant lets anon read EVERY
-- column, so a column-level REVOKE alone is ignored — you must drop the
-- table-wide grant and re-grant SELECT on only the public columns. The admin
-- API uses the service role (its own grants), so it still reads draft_value.
revoke select on public.site_content from anon, authenticated;
grant select (key, value, updated_at, updated_by) on public.site_content to anon, authenticated;

notify pgrst, 'reload schema';
