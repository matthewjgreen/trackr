-- Adds a three-state status to assignments: 'not_started' | 'in_progress' | 'completed'.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- The existing boolean `completed` column is kept and stays in sync (the app
-- writes completed = (status = 'completed')), so the push worker keeps working
-- unchanged.

alter table public.assignments
  add column if not exists status text not null default 'not_started';

-- Backfill from the old boolean for existing rows.
update public.assignments
  set status = case when completed then 'completed' else 'not_started' end;
