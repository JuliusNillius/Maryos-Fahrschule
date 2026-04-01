-- ============================================================================
-- Google-Rezensionen für die FAQ-Seite (site_settings.google_review_quotes)
-- ============================================================================
-- So gehst du vor:
-- 1. Google Maps → euer Unternehmensprofil → Bewertungen → Texte kopieren
--    (nur öffentlich sichtbare Formulierungen verwenden).
-- 2. Unten im JSON "author", "rating" (1–5), "text_de" anpassen.
--    Optional: "text_tr", "text_ar" für die anderen Sprachen.
-- 3. Im Supabase-Dashboard: SQL Editor → dieses Skript (nach Bearbeitung) ausführen.
--
-- Hinweis: Die Website liest Google nicht automatisch aus — das ist Absicht,
--          bis ggf. Places API + Rechtliches geklärt sind.
-- ============================================================================

update public.site_settings
set value = '[
  {
    "author": "Vorname N.",
    "rating": 5,
    "text_de": "HIER den vollständigen Bewertungstext aus Google einfügen.",
    "text_tr": "",
    "text_ar": ""
  },
  {
    "author": "Vorname K.",
    "rating": 5,
    "text_de": "Zweites Zitat …",
    "text_tr": "",
    "text_ar": ""
  }
]'::jsonb,
    updated_at = now()
where key = 'google_review_quotes';

-- Falls der Key noch fehlt (Migration 20260403120000 nicht gelaufen):
-- insert into public.site_settings (key, value) values ('google_review_quotes', '[]'::jsonb)
-- on conflict (key) do nothing;
-- … danach das UPDATE oben erneut ausführen.
