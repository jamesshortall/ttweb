-- Advertising analytics + audit storage.
--
-- WHY POSTGRES/SUPABASE (not the IONOS MySQL box): the specification asks for
-- "Row Level Security" and "administrator-only management policies". RLS is a
-- PostgreSQL/Supabase feature — MySQL 8.0 has no equivalent — and the site
-- already runs Supabase for contact submissions with exactly this
-- service-role-only pattern. Keeping ad analytics here means one database, one
-- security model, and no browser ever holding database credentials.
--
-- Editorial objects (advertisers, campaigns, advertisements, creatives,
-- placement zones, ad-network config) live in Sanity, NOT here. These tables
-- hold only high-volume machine data: raw events, daily rollups, and the
-- administrative audit trail.
--
-- All three tables are written to exclusively by the site's server runtime
-- using the service-role key. RLS is enabled with NO policies, so anon and
-- authenticated roles get nothing; the service-role key bypasses RLS by design.
-- Public browser clients can never write arbitrary impression/click counts —
-- every event is validated through a server route first.

-- ─────────────────────────────────────────────────────────────────────────────
-- Raw events (append-only, high volume). Never queried directly by the
-- dashboard; a scheduled job (migration 0003, Phase 3) rolls these into
-- ad_daily_aggregates. Purge past AD_EVENT_RETENTION_DAYS, e.g.:
--   delete from public.ad_events where created_at < now() - interval '365 days';
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.ad_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_type text not null check (event_type in ('impression', 'click')),
  -- Sanity document _id values (text, not FKs — the CMS owns those objects).
  ad_id text not null,
  campaign_id text,
  advertiser_id text,
  placement_key text not null,
  page_path text,
  device text not null default 'unknown'
    check (device in ('desktop', 'tablet', 'mobile', 'unknown')),
  -- True when this click is the first for its dedup key inside the configured
  -- window (see docs/ADVERTISING.md → "How unique clicks are calculated").
  -- Always false for impressions.
  is_unique boolean not null default false,
  -- Salted hash of a short-lived, non-persistent signal (session + minimized
  -- request info). Enables unique-click dedup WITHOUT storing a raw IP or any
  -- persistent browser fingerprint.
  dedup_hash text
);

comment on table public.ad_events is
  'Raw ad impression/click events. Service-role writes only; see RLS below.';

alter table public.ad_events enable row level security;

create index if not exists ad_events_created_at_idx
  on public.ad_events (created_at desc);
create index if not exists ad_events_ad_idx
  on public.ad_events (ad_id, created_at desc);
create index if not exists ad_events_campaign_idx
  on public.ad_events (campaign_id, created_at desc);
create index if not exists ad_events_placement_idx
  on public.ad_events (placement_key, created_at desc);
create index if not exists ad_events_type_idx
  on public.ad_events (event_type, created_at desc);
-- Supports the unique-click lookup: "any click for this ad+dedup_hash since T?"
create index if not exists ad_events_dedup_idx
  on public.ad_events (ad_id, dedup_hash, created_at desc)
  where event_type = 'click';

-- ─────────────────────────────────────────────────────────────────────────────
-- Daily aggregates. The dashboard reads ONLY this table (fast, indexed). Filled
-- by the aggregation job in Phase 3; created now so the schema is stable.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.ad_daily_aggregates (
  id bigint generated always as identity primary key,
  day date not null,
  ad_id text not null,
  campaign_id text,
  advertiser_id text,
  placement_key text not null,
  device text not null default 'unknown',
  page_path text,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  unique_clicks bigint not null default 0,
  updated_at timestamptz not null default now(),
  unique (day, ad_id, placement_key, device, page_path)
);

comment on table public.ad_daily_aggregates is
  'Pre-aggregated daily ad metrics for the admin dashboard. Service-role only.';

alter table public.ad_daily_aggregates enable row level security;

create index if not exists ad_daily_aggregates_day_idx
  on public.ad_daily_aggregates (day desc);
create index if not exists ad_daily_aggregates_campaign_idx
  on public.ad_daily_aggregates (campaign_id, day desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- Administrative audit trail. Records who changed what (ad/campaign create,
-- edit, status change, creative replacement, destination/script change,
-- archive/delete). Written by server routes we control and, in Phase 3, by a
-- Sanity publish webhook that reports Studio edits.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.ad_audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- Admin identity when known (Sanity user id/email), else 'system'.
  actor text not null default 'system',
  action text not null,
  entity_type text,
  entity_id text,
  summary text,
  metadata jsonb
);

comment on table public.ad_audit_log is
  'Administrative audit trail for advertising changes. Service-role only.';

alter table public.ad_audit_log enable row level security;

create index if not exists ad_audit_log_created_at_idx
  on public.ad_audit_log (created_at desc);
create index if not exists ad_audit_log_entity_idx
  on public.ad_audit_log (entity_type, entity_id, created_at desc);
