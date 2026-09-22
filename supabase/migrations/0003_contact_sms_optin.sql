-- Contact-form SMS opt-in (A2P 10DLC consent record).
--
-- Adds the optional mobile number and the explicit text-message consent given
-- on the contact form. created_at on the same row is the time of consent, which
-- is the record carriers expect you to be able to produce on request.
--
-- Safe to re-run.

alter table public.contact_submissions
  add column if not exists phone text
    check (phone is null or char_length(phone) <= 32),
  add column if not exists sms_consent boolean not null default false;

comment on column public.contact_submissions.phone is
  'Optional mobile number supplied on the contact form.';
comment on column public.contact_submissions.sms_consent is
  'True when the visitor explicitly checked the SMS opt-in box. created_at is the consent timestamp.';
