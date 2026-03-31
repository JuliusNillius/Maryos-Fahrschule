-- Fuhrpark / Autos (für Startseite-Tab "Autos" und Backoffice-Verwaltung)
create table if not exists public.fleet (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  model text not null default '',
  transmission text not null default 'manual' check (transmission in ('manual', 'automatic')),
  classes text[] not null default '{}',
  image text not null default '',
  sort_order int not null default 0,
  internal_note text
);

alter table public.fleet enable row level security;

do $$
begin
  drop policy if exists "Public read fleet" on public.fleet;
  drop policy if exists "Service role full access fleet" on public.fleet;
  execute 'create policy "Public read fleet" on public.fleet for select using (true)';
  execute 'create policy "Service role full access fleet" on public.fleet for all using (true) with check (true)';
end $$;

-- Optionale Seed-Daten (nur PKW B/BF17, nur wenn Tabelle leer)
insert into public.fleet (model, transmission, classes, image, sort_order)
select * from (values
  ('VW Golf 8'::text, 'manual'::text, '{B,BF17}'::text[], 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop'::text, 0),
  ('VW Golf 8', 'automatic', '{B,BF17}', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop', 1),
  ('Audi A3', 'manual', '{B,BF17}', 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&h=400&fit=crop', 2)
) as v(model, transmission, classes, image, sort_order)
where (select count(*) from public.fleet) = 0;
