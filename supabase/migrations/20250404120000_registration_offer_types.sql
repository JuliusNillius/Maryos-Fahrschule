-- Angebotsarten bei Online-Anmeldung (Standard vs. Paket z. B. 10 Fahrstunden mit 1 Promo-Stunde)
alter table public.registrations
  add column if not exists offer_type text not null default 'standard',
  add column if not exists bundle_lesson_hours integer,
  add column if not exists promo_lesson_hours integer;

comment on column public.registrations.offer_type is 'standard | bundle_10_promo';
comment on column public.registrations.bundle_lesson_hours is 'Gesamt-Fahrstunden im Paket (z. B. 10)';
comment on column public.registrations.promo_lesson_hours is 'Davon als Angebot / inkl. (z. B. 1)';
