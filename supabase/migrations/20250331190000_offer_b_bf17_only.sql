-- Angebot nur PKW B & BF17: bestehende Projektdaten bereinigen (läuft idempotent-sicher mehrfach).
-- Hinweis: Passe googleRating/googleReviews in site_settings.stats bei Bedarf im Backoffice an.

-- Hero-/Stats-Zahlen: 4. Wert = Anzahl Angebote (B + BF17), 3. = Sprachen Website
update public.site_settings
set value = jsonb_set(jsonb_set(value, '{languages}', '3', true), '{classes}', '2', true)
where key = 'stats';

-- Preise: nur noch PKW-Pakete in der Tabelle
delete from public.pricing where class_id in ('be', 'a', 'a2', 'a1', 'am');

insert into public.pricing (class_id, price, popular, note)
values ('bf17', '1.800', false, null)
on conflict (class_id) do update set
  price = excluded.price,
  popular = excluded.popular,
  note = excluded.note;

-- Fahrlehrer: nur noch B / BF17 (Begleitetes Fahren)
update public.instructors set classes = '{B,BF17}'::text[];

-- Fahrlehrer: Anzeige-Texte von Motorrad/PKW-Mix auf PKW angleichen (Backoffice bleibt überschreibbar)
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

-- Fuhrpark: Zweirad / AM entfernen, PKW auf B + BF17
delete from public.fleet
where not ('B' = any(classes));

update public.fleet
set classes = '{B,BF17}'::text[];
