# Supabase Setup

## Projekt „Maryos Fahrschule“ mit der CLI verknüpfen

Damit du Migrationen per Befehl ausführen kannst (statt SQL im Dashboard zu kopieren):

1. **Project Reference ID besorgen**  
   [Supabase Dashboard](https://supabase.com/dashboard) → dein Projekt **Maryos Fahrschule** → **Settings** (Zahnrad) → **General** → **Reference ID** (ca. 20 Zeichen, z. B. `abcdefghijklmnopqrst`).

2. **Projekt verknüpfen** (einmalig, im Projektroot):
   ```bash
   npx supabase link --project-ref DEINE_REFERENCE_ID
   ```
   Wenn gefragt: Datenbank-Passwort eingeben (steht unter **Settings → Database → Database password**; falls du es vergessen hast, dort „Reset database password“).

3. **Migrationen auf die Cloud-Datenbank anwenden**:
   ```bash
   npx supabase db push --linked
   ```
   Damit werden alle Dateien in `supabase/migrations/` (inkl. **fleet**) auf dein gehostetes Projekt angewendet.

Optional: Mit `npx supabase db remote commit` kannst du später Änderungen aus der Cloud zurück in lokale Migrations-Dateien holen.

---

## Buchungen (Booking-Calendar)

1. Im [Supabase Dashboard](https://supabase.com/dashboard) das Projekt öffnen.
2. **SQL Editor** → Neue Abfrage → Inhalt von `migrations/20250302000000_create_bookings.sql` einfügen → Run.
3. **Settings → API**: Keys in die Umgebungsvariablen der App eintragen (z. B. `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role (nur Server, nicht im Client verwenden)

Ohne `SUPABASE_SERVICE_ROLE_KEY` speichert die API keine Buchungen in der DB, antwortet aber weiterhin mit Erfolg.

---

## Backoffice (Fahrlehrer, Autos/Fuhrpark, Preise, Einstellungen, FAQ, Anmeldungen)

1. **SQL Editor** → Inhalt von `migrations/20250303000000_backoffice_tables.sql` ausführen (legt alle Tabellen inkl. **fleet** für den Fuhrpark an und fügt juliusa.engels@icloud.com in `backoffice_admins` ein).  
   **Falls du die Backoffice-Migration schon früher (ohne fleet) ausgeführt hast:** Im SQL Editor zusätzlich `migrations/20250303100000_fleet.sql` ausführen, um nur die Tabelle **fleet** anzulegen.
2. **Admin-User anlegen** (einmalig): Im Projektroot ausführen:
   ```bash
   npm run seed:admin
   ```
   Das legt den User **juliusa.engels@icloud.com** mit dem Passwort **MaryosBackoffice2025!** an. Nach dem ersten Login im Backoffice das Passwort ändern (Supabase Dashboard → Authentication → Users → Passwort zurücksetzen).
3. **Backoffice aufrufen**: Oben rechts auf der Website auf „Backoffice“ klicken → Login mit der obigen E-Mail und dem Passwort.
