-- Öffentliche Kündigungs-/Vertragsende-Anfragen (Backoffice: Liste + Rückruf)
create table if not exists public.termination_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  message text,
  status text not null default 'new' check (status in ('new', 'done'))
);

alter table public.termination_requests enable row level security;
create policy "Service role full access termination_requests" on public.termination_requests
  for all using (true) with check (true);

-- Startseiten-Statistik: Sprachen = 3 (Website DE/TR/AR)
update public.site_settings
set value = jsonb_set(value, '{languages}', to_jsonb(3), true), updated_at = now()
where key = 'stats';
