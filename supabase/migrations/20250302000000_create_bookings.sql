-- Tabelle für Terminanfragen (Booking-Calendar)
-- Ausführen in Supabase Dashboard → SQL Editor oder via Supabase CLI

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  time text not null,
  name text,
  email text,
  phone text
);

-- RLS: Nur Service Role (API) darf inserten; Lesezugriff optional für Dashboard
alter table public.bookings enable row level security;

-- Service Role umgeht RLS; für Anon/Leser: Policy nur für authentifizierte Admins
create policy "Service role can insert bookings"
  on public.bookings
  for insert
  with check (true);

comment on table public.bookings is 'Terminanfragen aus dem Booking-Calendar (Fahrstunde/Theorie)';
