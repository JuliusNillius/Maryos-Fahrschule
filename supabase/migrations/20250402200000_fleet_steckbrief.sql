-- Steckbrief-Felder für Flotte (PS, Ausstattung, Freitext)
alter table public.fleet add column if not exists power_ps integer;
alter table public.fleet add column if not exists has_driver_assistance boolean not null default false;
alter table public.fleet add column if not exists has_apple_carplay boolean not null default false;
alter table public.fleet add column if not exists has_android_auto boolean not null default false;
alter table public.fleet add column if not exists steckbrief_notes text;

comment on column public.fleet.power_ps is 'Motorleistung in PS (optional)';
comment on column public.fleet.steckbrief_notes is 'Zusatzinfos für Website-Steckbrief (optional)';
