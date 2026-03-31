-- Backoffice: Fahrlehrer (ersetzt lib/instructors.ts)
create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  title text not null default '',
  languages text[] not null default '{}',
  classes text[] not null default '{}',
  specialty text,
  tags text[] not null default '{}',
  quote text not null default '',
  available boolean not null default true,
  image text not null default '',
  sort_order int not null default 0,
  internal_note text
);

alter table public.instructors enable row level security;
create policy "Public read instructors" on public.instructors for select using (true);
create policy "Service role full access instructors" on public.instructors for all using (true) with check (true);

-- Backoffice: Preise pro Klasse
create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  class_id text not null unique,
  price text not null,
  popular boolean not null default false,
  note text
);

alter table public.pricing enable row level security;
create policy "Public read pricing" on public.pricing for select using (true);
create policy "Service role full access pricing" on public.pricing for all using (true) with check (true);

-- Backoffice: Einstellungen (Kontakt, Öffnung, Stats, Impressum, E-Mail-Vorlage)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Service role full access site_settings" on public.site_settings for all using (true) with check (true);

-- Backoffice: FAQ
create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  question_de text not null,
  answer_de text not null,
  question_en text,
  answer_en text,
  question_tr text,
  answer_tr text,
  question_ar text,
  answer_ar text,
  question_ru text,
  answer_ru text
);

alter table public.faq enable row level security;
create policy "Public read faq" on public.faq for select using (true);
create policy "Service role full access faq" on public.faq for all using (true) with check (true);

-- Anmeldungen (Registration-Formular)
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Step 1
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  birth_date text,
  street text,
  zip text,
  city text,
  mother_tongue text,
  -- Step 2
  licence_class text not null,
  transmission text,
  instructor_id text,
  lesson_language text not null,
  has_licence boolean default false,
  existing_licence_class text,
  existing_licence_country text,
  bf17 boolean default false,
  time_slots text[],
  source text,
  -- Payment
  payment_status text not null default 'pending',
  stripe_payment_intent_id text,
  paid_at timestamptz,
  -- Internal
  internal_note text
);

alter table public.registrations enable row level security;
create policy "Service role full access registrations" on public.registrations for all using (true) with check (true);

-- Backoffice-Admins: welche Supabase-Auth-User dürfen ins Backoffice (E-Mail-Liste)
create table if not exists public.backoffice_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.backoffice_admins enable row level security;
create policy "Service role full access backoffice_admins" on public.backoffice_admins for all using (true) with check (true);

-- Seed default pricing (nur PKW: B & BF17)
insert into public.pricing (class_id, price, popular, note) values
  ('b', '1.800', true, null),
  ('bf17', '1.800', false, null)
on conflict (class_id) do nothing;

-- Seed default site_settings
insert into public.site_settings (key, value) values
  ('contact', '{"phone":"0178 4557528","whatsapp":"491784557528","email":"info@maryos-fahrschule.de","street":"Bahnhofstraße 25","zip":"41236","city":"Mönchengladbach","mapUrl":"https://maps.google.com/maps?q=Bahnhofstraße+25,+41236+Mönchengladbach&output=embed"}'::jsonb),
  ('opening_hours', '{"text":"Mo–Fr 12:00–18:00"}'::jsonb),
  ('stats', '{"googleRating":5,"googleReviews":18,"languages":3,"classes":2}'::jsonb),
  ('impressum', '{"company":"Maryo''s Fahrschule GmbH","street":"Bahnhofstraße 25","zip":"41236","city":"Mönchengladbach","register":"HRB 23787 Mönchengladbach","owner":"Yaako Maryo Asoo"}'::jsonb),
  ('email_welcome', '{"subject":"Willkommen bei Maryo''s Fahrschule 🍀","body":"<h1>Willkommen bei Maryo''s, {{firstName}}!</h1><p>Wir haben deine Anmeldung für die Führerscheinklasse <strong>{{licenceClass}}</strong> erhalten.</p><p>Wir melden uns innerhalb von 24 Stunden unter <strong>{{phone}}</strong> bei dir.</p><p>Fahr in dein Glück! 🍀</p><p>— Maryo''s Fahrschule GmbH</p>"}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- Seed first admin (E-Mail wird berechtigt; User muss in Supabase Auth angelegt werden)
insert into public.backoffice_admins (email) values ('juliusa.engels@icloud.com')
on conflict (email) do nothing;

-- Seed Fahrlehrer (nur PKW B & BF17)
insert into public.instructors (name, title, languages, classes, specialty, tags, quote, available, image, sort_order) values
  ('Maryo A.', 'Inhaber', '{de,ar,en}', '{B,BF17}', 'Prüfungscoach', '{Geduldig,Erfahren,Motivierend}', 'Ich bringe dich sicher ans Ziel.', true, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop', 0),
  ('Anna K.', 'Angst-Expertin', '{de,ru}', '{B,BF17}', 'Angst-Expertin', '{Einfühlsam,Ruhig,Strukturiert}', 'Gemeinsam schaffen wir das.', true, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop', 1),
  ('Can T.', 'Fahrlehrer', '{de,tr,en}', '{B,BF17}', 'Prüfungsvorbereitung', '{Leidenschaftlich,Präzise,Humorvoll}', 'Gemeinsam sicher ans Ziel — Schritt für Schritt.', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop', 2),
  ('Elena V.', 'Automatik-Expertin', '{de,ru}', '{B,BF17}', 'Automatik-Expertin', '{Professionell,Freundlich,Geduldig}', 'Automatik ist die Zukunft.', false, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop', 3),
  ('Ahmad M.', 'Neueinsteiger-Coach', '{de,ar,fr}', '{B,BF17}', 'Neueinsteiger-Coach', '{Verständnisvoll,Locker,Unterstützend}', 'Jeder fängt mal an — ich bin dabei.', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', 4);

-- Fuhrpark / Autos (Startseite-Tab "Autos" + Backoffice → Autos)
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
drop policy if exists "Public read fleet" on public.fleet;
drop policy if exists "Service role full access fleet" on public.fleet;
create policy "Public read fleet" on public.fleet for select using (true);
create policy "Service role full access fleet" on public.fleet for all using (true) with check (true);

-- Seed Fuhrpark (nur PKW, nur wenn Tabelle leer)
insert into public.fleet (model, transmission, classes, image, sort_order)
select v.model, v.transmission, v.classes, v.image, v.sort_order
from (values
  ('VW Golf 8'::text, 'manual'::text, '{B,BF17}'::text[], 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop'::text, 0),
  ('VW Golf 8', 'automatic', '{B,BF17}', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop', 1),
  ('Audi A3', 'manual', '{B,BF17}', 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&h=400&fit=crop', 2)
) as v(model, transmission, classes, image, sort_order)
where (select count(*) from public.fleet) = 0;
