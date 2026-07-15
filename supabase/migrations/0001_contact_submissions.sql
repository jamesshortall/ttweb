-- Contact-form submissions (optional storage; email delivery is primary).
--
-- Written to exclusively by the website's server runtime using the
-- service-role key. Row Level Security denies all access to anon and
-- authenticated roles — there is deliberately NO public policy on this table.
--
-- Retention: submissions contain personal data. Review and purge regularly;
-- the Privacy Policy commits to deletion within 24 months (pending legal
-- review). Example purge:
--   delete from public.contact_submissions where created_at < now() - interval '24 months';

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  category text not null check (
    category in (
      'free-consultation',
      'points-strategy',
      'credit-card-strategy',
      'award-travel',
      'loyalty-program-review',
      'points-portfolio-audit',
      'cardmaster-support',
      'general',
      'partnership-media'
    )
  ),
  message text not null check (char_length(message) <= 5000),
  preferred_contact text not null default 'email' check (
    preferred_contact in ('email', 'either', 'no-preference')
  ),
  -- Lightweight triage workflow for Jim.
  status text not null default 'new' check (status in ('new', 'replied', 'archived'))
);

comment on table public.contact_submissions is
  'Website contact-form submissions. Service-role access only; see RLS below.';

-- Enable RLS and add no policies: anon/authenticated get nothing, and the
-- service-role key (server-only) bypasses RLS by design.
alter table public.contact_submissions enable row level security;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
