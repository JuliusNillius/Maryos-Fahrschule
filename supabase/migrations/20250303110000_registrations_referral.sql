-- Empfehlungscode: Werbecode des Freundes (bei Anmeldung eingegeben) + eigener Code (zum Weitergeben)
-- Führt nur aus, wenn public.registrations existiert (wird von 20250303000000_backoffice_tables.sql angelegt).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'registrations'
  ) THEN
    ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS referrer_code text;
    ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS my_referral_code text;
    COMMENT ON COLUMN public.registrations.referrer_code IS 'Code des Werbenden (von neuem Kunden bei Anmeldung eingegeben)';
    COMMENT ON COLUMN public.registrations.my_referral_code IS 'Eigener Code dieses Kunden zum Weitergeben; 15€ Gutschein für Werbenden nach Zahlung des Geworbenen';
    CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_my_referral_code
      ON public.registrations (my_referral_code) WHERE my_referral_code IS NOT NULL;
  END IF;
END $$;
