-- Öffentliche Google-Rezensionstexte (FAQ): manuell im Backoffice, kein Live-API-Abruf.

insert into public.site_settings (key, value)
values ('google_review_quotes', '[]'::jsonb)
on conflict (key) do nothing;
