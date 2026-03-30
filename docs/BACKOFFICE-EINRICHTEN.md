# Backoffice einrichten – Schritt für Schritt

Damit der Backoffice-Login funktioniert, brauchst du Supabase und eine Datei mit Zugangsdaten. So geht’s.

---

## ✅ Wenn Supabase schon verbunden ist (schneller Weg)

Wenn du schon **Project URL**, **Anon Key** und **Service Role Key** in `.env.local` hast und die App keine Meldung „Supabase ist nicht konfiguriert“ mehr zeigt:

1. **Migrationen in die Datenbank bringen** (Tabellen anlegen inkl. `backoffice_admins`):
   ```bash
   npm run supabase:push
   ```
   *(Falls das fehlschlägt: Supabase einmal verknüpfen mit `npm run supabase:link`, dann erneut `npm run supabase:push`.)*

2. **Ersten Backoffice-User anlegen** (legt den Auth-User an und gibt dir das Passwort aus):
   ```bash
   npm run seed:admin
   ```
   - E-Mail: **juliusa.engels@icloud.com** (steht im Script)
   - Passwort wird in der Konsole ausgegeben (Standard: `MaryosBackoffice2025!`).

3. **Backoffice testen:** Browser → http://localhost:3000 → Button **Backoffice** → mit der E-Mail und dem Passwort aus Schritt 2 einloggen.

Damit bist du fertig. Die ausführliche Anleitung unten brauchst du nur, wenn du ein neues Supabase-Projekt anlegst oder die Keys noch nicht hast.

---

## Teil 1: Supabase (wo die Daten liegen)

### Schritt 1: Supabase öffnen
1. Gehe im Browser zu: **https://supabase.com**
2. Oben rechts auf **Sign in** klicken (oder Account anlegen).
3. Nach dem Login siehst du deine Projekte.

### Schritt 2: Projekt erstellen (wenn du noch keins hast)
1. Auf **New Project** klicken.
2. **Name** eingeben (z.B. „maryos-fahrschule“).
3. **Database Password** ausdenken und **sicher** notieren – du brauchst es später.
4. **Region** auswählen (z.B. Frankfurt).
5. Auf **Create new project** klicken.
6. 1–2 Minuten warten, bis „Project is ready“ erscheint.

### Schritt 3: Die drei Werte kopieren
1. Links in der Leiste auf das **Zahnrad** klicken (ganz unten).
2. Dann auf **API** klicken.
3. Auf der Seite siehst du:
   - **Project URL** – eine Adresse wie `https://abcdefgh.supabase.co`
   - **Project API keys** – darunter zwei lange Zeilen:
     - **anon** **public** → das ist dein „Anon Key“
     - **service_role** → das ist dein „Service Role Key“
4. Diese drei Dinge **kopieren** und in eine Notiz schreiben:
   - Project URL
   - anon public (der erste Key)
   - service_role (der zweite Key)

---

## Teil 2: Die Zugangsdatei im Projekt

### Schritt 4: Projektordner finden
1. Öffne den Ordner deines Projekts „Maryos Fahrschule“ (da wo z.B. `package.json` liegt).
2. Du kannst ihn in Cursor links im Explorer sehen – der oberste Ordner ist der Projektordner.

### Schritt 5: Neue Datei anlegen
1. **Rechtsklick** auf den Projektordner (ganz oben).
2. **New File** wählen.
3. Als Namen **genau** eintippen: **`.env.local`**
   - Der Punkt am Anfang muss dabei sein.
   - Keine .txt dahinter, nur `.env.local`

### Schritt 6: Inhalt einfügen
1. Die neue Datei `.env.local` öffnen (doppelklicken).
2. **Genau** diese drei Zeilen reinkopieren (ohne Leerzeichen vor oder nach dem `=`):

```
NEXT_PUBLIC_SUPABASE_URL=HIER_DEINE_PROJECT_URL_EINFÜGEN
NEXT_PUBLIC_SUPABASE_ANON_KEY=HIER_DEIN_ANON_KEY_EINFÜGEN
SUPABASE_SERVICE_ROLE_KEY=HIER_DEIN_SERVICE_ROLE_KEY_EINFÜGEN
```

3. **HIER_DEINE_PROJECT_URL_EINFÜGEN** ersetzen durch die **Project URL** aus Schritt 3 (z.B. `https://abcdefgh.supabase.co`).
4. **HIER_DEIN_ANON_KEY_EINFÜGEN** ersetzen durch den **anon public** Key aus Schritt 3.
5. **HIER_DEIN_SERVICE_ROLE_KEY_EINFÜGEN** ersetzen durch den **service_role** Key aus Schritt 3.
6. Datei **speichern** (Ctrl+S / Cmd+S).

**Beispiel**, wie es danach aussehen kann (mit falschen Werten):
```
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## Teil 3: Backoffice-Admin anlegen (damit du dich einloggen kannst)

### Schritt 7: Tabelle backoffice_admins in Supabase
1. In Supabase links auf **Table Editor** klicken.
2. In der Liste die Tabelle **backoffice_admins** auswählen.
   - Wenn die Tabelle fehlt: Sie wird durch die Migrationen angelegt. Erst **Schritt 8** (Migrationen) ausführen, dann hierher zurück.
3. Auf **Insert row** (oder „Zeile einfügen“) klicken.
4. Bei **email** die E-Mail-Adresse eintragen, mit der du dich später im Backoffice einloggen willst.
5. Speichern.

### Schritt 8: Datenbank-Tabellen anlegen (falls noch nicht geschehen)
Die Tabellen (z.B. `backoffice_admins`) kommen aus den Migrations-Dateien im Ordner `supabase/migrations/`.

- Entweder in Supabase: **SQL Editor** → die Inhalte der Migrations-Dateien nacheinander ausführen.
- Oder mit Supabase CLI: `npx supabase db push` (wenn Supabase CLI eingerichtet ist).

---

## Teil 4: App neu starten

### Schritt 9: Dev-Server neu starten
1. Im Terminal (wo `npm run dev` läuft) mit **Ctrl+C** (Mac: **Cmd+C**) den Server stoppen.
2. Wieder starten mit: **`npm run dev`**
3. Warten, bis „Ready“ erscheint.

### Schritt 10: Backoffice testen
1. Im Browser die Seite öffnen: **http://localhost:3000**
2. Auf den Button **Backoffice** klicken.
3. Du solltest die **Login-Seite** sehen (ohne „Supabase ist nicht konfiguriert“).
4. E-Mail und Passwort eingeben – **Passwort** ist dein Supabase-Benutzer-Passwort:
   - Entweder du hast in Supabase unter **Authentication → Users** schon einen User mit dieser E-Mail angelegt (dann dessen Passwort),
   - Oder du legst unter **Authentication → Users** einen neuen User mit genau der E-Mail an, die in `backoffice_admins` steht, und setzt dort ein Passwort.

---

## Wenn etwas nicht klappt

- **„Supabase ist nicht konfiguriert“** → `.env.local` prüfen: Namen genau `.env.local`, alle drei Zeilen da, **keine Leerzeichen** um das `=`, Server neu gestartet?
- **„Ungültige E-Mail oder Passwort“** → In Supabase unter **Authentication → Users** prüfen, ob ein User mit dieser E-Mail existiert; Passwort ggf. zurücksetzen.
- **„Dieser Account hat keinen Backoffice-Zugang“** → In der Tabelle **backoffice_admins** muss genau diese E-Mail stehen (gleiche Schreibweise).
