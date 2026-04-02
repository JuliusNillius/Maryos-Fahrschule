-- Öffentliche Website: 4 Sprachen (DE · EN · TR · AR). Alte Defaults hatten languages: 3.
update public.site_settings
set
  value = jsonb_set(value, '{languages}', '4'::jsonb, true),
  updated_at = now()
where key = 'stats'
  and coalesce((value->>'languages')::int, 0) = 3;
