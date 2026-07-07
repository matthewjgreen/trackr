-- Adds an optional class start time to courses so it can be offered as a
-- quick due-time option when adding/editing an assignment.
-- Stored as "HH:MM" text (nullable); empty/unset means no class time.

alter table public.courses
  add column if not exists start_time text;
