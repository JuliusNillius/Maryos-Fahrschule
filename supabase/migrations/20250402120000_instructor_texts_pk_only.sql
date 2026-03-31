-- Falls 20250331190000 schon ohne Text-Updates lief: Lehrer-Anzeige auf PKW bereinigen (idempotent).

update public.instructors
set
  title = 'Fahrlehrer',
  specialty = 'Prüfungsvorbereitung',
  quote = 'Gemeinsam sicher ans Ziel — Schritt für Schritt.'
where name = 'Can T.';

update public.instructors
set title = regexp_replace(title, 'Motorrad[- ]?Spezialist', 'Fahrlehrer', 'gi')
where title ~* 'motorrad';

update public.instructors
set specialty = regexp_replace(coalesce(specialty, ''), 'Motorrad[- ]?Spezialist', 'Prüfungsvorbereitung', 'gi')
where specialty ~* 'motorrad';

update public.instructors
set quote = 'Gemeinsam sicher ans Ziel — Schritt für Schritt.'
where quote ~* 'motorrad';
