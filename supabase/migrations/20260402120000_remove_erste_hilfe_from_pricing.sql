-- Erste Hilfe: nicht mehr als pricing-Karte; eigene Seite + Nav. Stats = 4 Klassen.

delete from public.pricing where class_id = 'erste_hilfe';

update public.site_settings
set value = jsonb_set(value, '{classes}', '4', true)
where key = 'stats';
