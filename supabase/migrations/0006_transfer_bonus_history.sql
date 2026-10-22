-- Historical transfer bonuses, synced daily from the CardMaster Base44 app.
--
-- Deliberately a SECOND table rather than more rows in transfer_bonuses.
-- They answer different questions and are keyed differently: transfer_bonuses
-- holds what this site has observed since the sync began, keyed on the START
-- date so an extended bonus updates in place; this is upstream's archive back
-- to 2017, keyed on upstream's own history_key (pairing + END date). Merging
-- them would collide those keys and muddy the "what is live now" query that
-- the public page depends on.
--
-- Service-role access only; RLS denies anon/authenticated entirely.

create table if not exists public.transfer_bonus_history (
  id uuid primary key default gen_random_uuid(),
  -- Upstream's key for one historical run: "from::to::end_date".
  history_key text not null unique,
  -- "from::to" — groups every run of the same pairing. This is what the
  -- per-pairing statistics aggregate on.
  bonus_key text not null,
  from_program text not null,
  to_program text not null,
  -- Normalized issuer, present on history but not on current bonuses.
  from_bank text,
  from_program_type text,
  to_program_type text,
  bonus_percent numeric(5,1) not null,
  transfer_ratio text,
  start_date date,
  end_date date,
  status text not null,
  source_name text,
  source_url text,
  notes text,
  -- 'backfill' (reconstructed from archives) or 'live' (observed running).
  -- Backfilled rows are the weaker evidence and are labelled as such.
  origin text,
  first_seen_at timestamptz,
  last_verified_at timestamptz,
  base44_id text,
  synced_at timestamptz not null default now()
);

comment on table public.transfer_bonus_history is
  'Archive of past transfer bonus runs, 2017 onward, synced from CardMaster. Excludes upstream''s created_by fields, which carry personal data.';

create index if not exists transfer_bonus_history_bonus_key_idx
  on public.transfer_bonus_history (bonus_key);
create index if not exists transfer_bonus_history_from_program_idx
  on public.transfer_bonus_history (from_program);
create index if not exists transfer_bonus_history_start_date_idx
  on public.transfer_bonus_history (start_date desc);

alter table public.transfer_bonus_history enable row level security;
-- No policies: only the service-role key (which bypasses RLS) may read/write.
