-- Transfer bonuses, synced daily from the CardMaster Base44 app.
--
-- One row per BONUS RUN, not per program pairing: when Amex → ANA runs again
-- next spring it becomes a new row, and the old one stays. That is what makes
-- the history accumulate without a second table.
--
-- Service-role access only; RLS denies anon/authenticated entirely.

create table if not exists public.transfer_bonuses (
  id uuid primary key default gen_random_uuid(),
  -- "from::to", lowercased upstream. Groups repeat runs of the same pairing.
  bonus_key text not null,
  -- Identifies one RUN of that pairing. Derived in application code rather
  -- than by the database so the fallback chain is visible and testable:
  -- start_date, else end_date, else "open". A bonus whose end date is extended
  -- keeps its start date, so it updates its row instead of forking a new one.
  run_key text not null unique,
  from_program text not null,
  to_program text not null,
  from_program_type text,
  to_program_type text,
  bonus_percent numeric(5,1) not null,
  transfer_ratio text,
  -- Nullable: upstream sends "" for an unknown start or an open-ended bonus.
  start_date date,
  end_date date,
  -- Upstream's own verdict. Authoritative over end_date: a bonus pulled early
  -- reads "expired" while its end_date is still in the future.
  status text not null,
  source_name text,
  source_url text,
  notes text,
  -- How many times upstream's scraper failed to re-find this bonus. Above
  -- zero means "show it, but flag it" — not "hide it".
  miss_count integer not null default 0,
  verified_by text,
  first_seen_at timestamptz,
  last_verified_at timestamptz,
  -- Upstream's record id, kept for tracing a row back to the app. Never a key:
  -- records can be recreated with a new id.
  base44_id text,
  synced_at timestamptz not null default now()
);

comment on table public.transfer_bonuses is
  'One row per transfer bonus run, synced daily from the CardMaster Base44 app. Deliberately excludes upstream''s created_by fields, which carry personal data.';

create index if not exists transfer_bonuses_bonus_key_idx
  on public.transfer_bonuses (bonus_key);
create index if not exists transfer_bonuses_window_idx
  on public.transfer_bonuses (status, end_date);
create index if not exists transfer_bonuses_from_program_idx
  on public.transfer_bonuses (from_program);

alter table public.transfer_bonuses enable row level security;
-- No policies: only the service-role key (which bypasses RLS) may read/write.

-- One row per sync run. Without this a dead cron is invisible: the page keeps
-- serving its last good data and nothing says how old that data is.
create table if not exists public.transfer_bonus_syncs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  -- 'succeeded' | 'aborted' | 'failed'. 'aborted' means a guard refused to
  -- write (empty or implausibly small feed) — the previous data is intact.
  status text not null,
  rows_seen integer,
  rows_written integer,
  rows_rejected integer,
  -- Failure class only, never upstream payloads.
  error text
);

comment on table public.transfer_bonus_syncs is
  'Audit log of transfer bonus sync runs. The newest succeeded row is the page''s "last updated" timestamp.';

create index if not exists transfer_bonus_syncs_started_at_idx
  on public.transfer_bonus_syncs (started_at desc);

alter table public.transfer_bonus_syncs enable row level security;
