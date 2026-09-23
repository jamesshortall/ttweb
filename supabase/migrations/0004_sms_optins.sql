-- SMS opt-in consent log (A2P 10DLC).
--
-- One row per explicit opt-in from the public SMS opt-in form. created_at is
-- the time of consent — this table is the record to produce if a carrier or
-- campaign review asks you to prove a subscriber opted in.
--
-- Service-role access only; RLS denies anon/authenticated entirely.

create table if not exists public.sms_optins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text check (name is null or char_length(name) <= 120),
  -- Digits only, normalized on write so formatting never splits a subscriber.
  phone text not null check (char_length(phone) between 10 and 15),
  consent boolean not null default true,
  -- What the person agreed to, captured verbatim at the time of consent.
  consent_text text not null,
  source text not null default 'sms-opt-in-form',
  -- Set when the welcome/confirmation message was actually delivered.
  welcome_sent boolean not null default false
);

comment on table public.sms_optins is
  'Explicit SMS opt-ins. created_at is the consent timestamp; consent_text is the exact disclosure shown.';

create index if not exists sms_optins_created_at_idx
  on public.sms_optins (created_at desc);
create index if not exists sms_optins_phone_idx
  on public.sms_optins (phone);

alter table public.sms_optins enable row level security;
-- No policies: only the service-role key (which bypasses RLS) may read/write.
