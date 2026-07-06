-- Adds optional problem-set progress to assignments.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.

alter table public.assignments
  add column if not exists total_problems     int not null default 0,
  add column if not exists completed_problems int not null default 0;
