-- B197, BE: Preiskarten. Erste Hilfe = eigene Seite / Menü, keine pricing-Zeile.

insert into public.pricing (class_id, price, popular, note)
values
  ('b197', '2.000', false, null),
  ('be', '900', false, null)
on conflict (class_id) do update set
  price = excluded.price,
  popular = excluded.popular,
  note = excluded.note;

update public.site_settings
set value = jsonb_set(value, '{classes}', '4', true)
where key = 'stats';
