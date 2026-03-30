# Vercel – Schritt für Schritt (für Einsteiger)

Jeden Schritt **nacheinander** machen. Wenn etwas nicht klappt, den Schritt nochmal lesen oder Hilfe holen.

---

## Teil A: Dein Projekt auf GitHub legen

GitHub ist ein Ort im Internet, wo dein Code liegt. Vercel holt sich den Code von dort.

### Schritt A1 – GitHub-Account

1. Geh auf **https://github.com**
2. Wenn du **noch keinen** Account hast: oben rechts **Sign up** und durch die Anmeldung klicken (E-Mail, Passwort).
3. Wenn du schon einen Account hast: **Sign in** und einloggen.

---

### Schritt A2 – Neues leeres Repository anlegen

1. Oben rechts auf das **+** klicken → **New repository**.
2. Bei **Repository name** etwas eingeben, z. B. `maryos-fahrschule`
3. Wichtig: **Add a README** **nicht** anhaken (Häkchen weg).
4. Unten auf **Create repository** klicken.
5. GitHub zeigt dir jetzt eine Seite mit Befehlen. **Noch nichts kopieren** – wir machen das im nächsten Schritt.

**Merke dir:** Die Adresse deines Repos sieht so aus:  
`https://github.com/DEIN-BENUTZERNAME/maryos-fahrschule`  
(Dein echter Benutzername steht da, wo hier „DEIN-BENUTZERNAME“ steht.)

---

### Schritt A3 – Terminal öffnen (auf dem Mac) – genau erklärt

**Was ist das Terminal?**  
Ein Textfenster, in dem du **Befehle** eintippen kannst. Git läuft darüber.

**Schritt für Schritt:**

1. Auf der **Tastatur**: Taste **command** (⌘, Apfel-Symbol) **halten** und **Leertaste** drücken.  
   *Alternativ:* Oben rechts in der Menüleiste auf die **Lupe** (Spotlight) klicken.
2. Es öffnet sich ein **Suchfeld** in der Mitte.
3. Tippe: **Terminal** (ein Wort).
4. In der Liste erscheint **Terminal** (Icon mit `>_`).  
   **Enter** drücken (oder doppelklicken).

**Was du jetzt siehst:**

- Ein Fenster mit **blinkendem Strich** oder **Block** – das ist der Cursor. Dort tippst du.
- Irgendwo steht oft `~ %` oder dein Name – das ist **normal**. Du bist noch **nicht** im Projektordner (kommt bei A4).

**Wichtig:**

- Nach jedem Befehl **Enter** (Zeilenschalter).
- **Cmd + V** fügt aus der Zwischenablage ein (kopieren von hier geht oft einfacher als abtippen).

---

### Schritt A4 – In den Projektordner wechseln – genau erklärt

**Was soll passieren?**  
Git soll im Ordner laufen, in dem deine Website liegt (**Maryos Fahrschule 23.53.54**).

**Variante 1 – Befehl eintippen (wenn der Ordner auf dem Desktop liegt):**

1. **Einmal** ins Terminal-Fenster klicken.
2. Diese **eine Zeile** einfügen (**Cmd + V**) oder abtippen, dann **Enter**:

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
```

3. **Wenn es klappt:** Es erscheint eine neue Zeile mit Cursor – oft steht im Pfad etwas mit **Maryos** oder **23.53.54**.

4. **Kontrolle:** Tippe `pwd` → **Enter**. Es muss ein Pfad kommen, der **Maryos** oder **Fahrschule** enthält.

**Wenn eine Fehlermeldung kommt** (z. B. „No such file“):

- Der Ordner liegt **woanders** oder heißt **anders**. Dann **Variante 2**.

**Variante 2 – Ordner per Finder ins Terminal ziehen (sehr zuverlässig):**

1. **Finder** öffnen, zu deinem Projektordner gehen (drin sollten Ordner wie `app`, `components`, `public` sichtbar sein).
2. Im Terminal tippen: `cd ` (**c**, **d**, **Leertaste** – danach **nichts** mehr, Cursor steht nach der Leertaste).
3. Den **Ordner** aus dem Finder (den **Namen** oben oder die kleine **Ordner-Zeile**) mit der Maus **in das Terminal-Fenster ziehen** und **loslassen**. Es erscheint automatisch der richtige Pfad.
4. **Enter** drücken.
5. Nochmal `pwd` → **Enter** zur Kontrolle.

**Variante 3 – Terminal aus dem Finder öffnen (macOS):**

1. Im Finder den **Projektordner** öffnen.
2. Menü **Darstellung** → ggf. **Pfadleiste einblenden**.
3. Im Ordner: **Rechtsklick** auf leeren Bereich → **„Neues Terminal-Fenster im Ordner“** oder ähnlich (je nach macOS-Version; nicht überall vorhanden).

---

### Schritt A5 – Git starten und ersten Upload – jeder Befehl einzeln erklärt

**Regel:** Immer **nur eine Zeile**, **Enter**, warten, bis die nächste Eingabezeile mit Cursor erscheint. Dann erst weiter.

---

**Befehl 1 – `git init`**

| Was passiert? | Git wird in diesem Ordner „eingeschaltet“. |
| Eintippen | `git init` |
| Enter | ja |
| Gute Meldung | `Initialized empty Git repository` oder deutsch „Leeres Git-Repository …“ |

---

**Befehl 2 – `git add .`**

| Was passiert? | Alle Dateien werden für den nächsten Schritt **vorgemerkt**. Der **Punkt** `.` heißt „alles in diesem Ordner“. |
| Eintippen | `git add .` (Leerzeichen vor dem Punkt nicht vergessen) |
| Enter | ja |
| Gute Meldung | Oft **gar nichts** – auch ok |

---

**Befehl 3 – `git commit -m "Erster Stand fuer Vercel"`**

| Was passiert? | Erster **Schnappschuss** deines Codes wird gespeichert (lokal auf dem Mac). |
| Eintippen | genau diese Zeile (Anführungszeichen mit): |

```bash
git commit -m "Erster Stand fuer Vercel"
```

**Wenn Git nach **Name** und **E-Mail** fragt** (`Please tell me who you are`):

1. Zwei Zeilen ausführen (mit **deinen** Daten):

```bash
git config --global user.name "Max Mustermann"
git config --global user.email "deine@email.de"
```

2. Danach **nochmal** den `git commit -m "Erster Stand fuer Vercel"` Befehl.

**Gute Meldung:** etwas mit `files changed` / `Dateien geändert`.

---

**Befehl 4 – `git branch -M main`**

| Was passiert? | Der Haupt-Zweig heißt **main** (Standard für GitHub/Vercel). |
| Eintippen | `git branch -M main` |
| Enter | ja |
| Gute Meldung | meist **keine** Ausgabe |

---

**Befehl 5 – Verbindung zu GitHub: `git remote add origin ...`**

| Was passiert? | Dein Ordner weiß jetzt: „Hochladen geht zu **diesem** GitHub-Repo.“ |

1. Im **Browser** auf GitHub dein leeres Repo öffnen. In der Adresszeile steht z. B.:  
   `https://github.com/maxmustermann/maryos-fahrschule`

2. Im Terminal **eine Zeile** ( **maxmustermann** und **maryos-fahrschule** durch **deine** echten Werte ersetzen):

```bash
git remote add origin https://github.com/maxmustermann/maryos-fahrschule.git
```

3. **Enter**

**Fehler** `remote origin already exists`: Dann war schon eine Verknüpfung da. Stattdessen:

```bash
git remote set-url origin https://github.com/DEIN-BENUTZERNAME/maryos-fahrschule.git
```

(dann wieder mit deinen echten Daten)

---

**Befehl 6 – Hochladen: `git push -u origin main`**

| Was passiert? | Alle Dateien werden zu **GitHub** hochgeladen. |

1. Eintippen: `git push -u origin main` → **Enter**

2. **Anmeldung – oft eine von zwei Varianten:**

   **Variante A – Browser öffnet sich**  
   GitHub fragt, ob die App darf → **Authorize** / **Genehmigen** klicken. Fertig.

   **Variante B – Terminal fragt nach Username / Password**  
   - **Username:** dein GitHub-Benutzername (nicht die E-Mail).  
   - **Password:** **nicht** dein normales GitHub-Passwort! Du brauchst ein **Token**:
     1. Browser: **github.com** → Profilbild oben rechts → **Settings**
     2. Links unten: **Developer settings** → **Personal access tokens** → **Tokens (classic)**
     3. **Generate new token (classic)** → bei **Note** z. B. „Mac“ eintragen → Häkchen bei **repo** setzen → **Generate token**
     4. Den angezeigten **langen Code einmal kopieren** (wird nicht nochmal gezeigt!)
     5. Im Terminal bei **Password** einfügen (**Cmd+V**) – oft siehst du **keine** Zeichen, das ist normal → **Enter**

**Gute Meldung:** `Writing objects`, `Enumerating objects`, am Ende **kein** rotes `fatal` / `error`.

**Kontrolle:** Im Browser GitHub-Repo **neu laden** – du solltest **Dateien und Ordner** sehen (nicht mehr „empty“).

**Dann bist du fertig mit Teil A.**

---

## Teil B: Projekt bei Vercel verbinden

### Schritt B1 – Bei Vercel einloggen

1. Geh auf **https://vercel.com**
2. **Log In** → mit **GitHub** einloggen (empfohlen, dann ist alles verbunden).

---

### Schritt B2 – Neues Projekt aus GitHub importieren

1. Nach dem Login: **Add New…** → **Project** (oder **Import Project**).
2. Liste der **GitHub-Repositories**. Dein Repo **`maryos-fahrschule`** sollte erscheinen.
3. Daneben auf **Import** klicken.

Falls das Repo **nicht** in der Liste steht:

- **Adjust GitHub App Permissions** oder **Configure GitHub App** klicken und dem Zugriff auf das Repository erlauben.

---

### Schritt B3 – Umgebungsvariablen **vor** dem ersten Deploy – genau erklärt

**Was sind das überhaupt?**  
Passwörter und Adressen (z. B. für Supabase), die deine Website braucht. Sie stehen bei dir in **`.env.local`** – dürfen **nicht** auf GitHub, aber **müssen** bei Vercel eingetragen werden, sonst funktioniert die Live-Seite nicht.

**Wichtig:** Erst **alle** Variablen eintragen, **dann** auf **Deploy** klicken.

---

**Teil 1 – Die Datei `.env.local` auf dem Mac finden und öffnen**

1. **Finder** öffnen (blaues Gesicht-Symbol in der Dock-Leiste).
2. Zu deinem Projektordner gehen: **Maryos Fahrschule 23.53.54** (oft auf dem **Desktop**).
3. Den Ordner **öffnen**, sodass du viele Unterordner siehst (`app`, `components`, …).
4. Die Datei **`.env.local`** beginnt mit einem **Punkt** – manche Macs **verstecken** solche Dateien.
5. **Versteckte Dateien einblenden:** Im Finder-Fenster **Cmd + Shift + Punkt** (alle drei Tasten gleichzeitig) drücken.  
   Jetzt sollte **`.env.local`** sichtbar werden (graues Icon oder Dokument).
6. **Rechtsklick** auf **`.env.local`** → **Öffnen mit** → **TextEdit** oder **Cursor** / **VS Code**.  
   **Nicht** mit Word öffnen.

**Falls die Datei fehlt:**  
Dann hast du sie noch nicht angelegt. Dann brauchst du die Werte aus dem **Supabase-Dashboard** (und ggf. Resend/Stripe) und trägst sie **direkt in Vercel** ein – Namen siehst du in der Datei **`.env.example`** im gleichen Ordner (die kannst du normal öffnen, da stehen nur **Namen**, keine Geheimnisse).

---

**Teil 2 – Eine Zeile aus `.env.local` verstehen**

Die Datei sieht ungefähr so aus (Beispiel, **nicht** kopieren):

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdef.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

- **Eine Zeile** = **ein** Eintrag für Vercel.
- Das **Gleichheitszeichen** `=` trennt zwei Teile:
  - **Links** (z. B. `NEXT_PUBLIC_SUPABASE_URL`) = der **Name** (Key) – **genau so** tippen, **kein** Leerzeichen am Anfang.
  - **Rechts** (z. B. `https://…`) = der **Wert** (Value) – **alles** ab dem ersten Zeichen nach `=` bis zum **Zeilenende** (Leerzeichen am Rand weglassen).

**Zeilen ignorieren:**

- Leere Zeilen.
- Zeilen, die mit **`#`** beginnen (Kommentar).
- Zeilen **ohne** `=`.

---

**Teil 3 – In Vercel eintragen (Klick für Klick)**

1. Zurück zum **Browser-Tab mit Vercel** (Projekt-Import-Seite).
2. Mit der Maus **nach unten scrollen**, bis du **Environment Variables** siehst.
3. Du siehst zwei Felder, oft beschriftet mit **Key** und **Value** (oder **Name** / **Value**).

**Für die erste Zeile aus `.env.local`:**

4. **Key:** den linken Teil eintragen, z. B. `NEXT_PUBLIC_SUPABASE_URL` (am besten **kopieren** aus TextEdit: Markieren, **Cmd+C**, in Vercel **Cmd+V**).
5. **Value:** den rechten Teil eintragen (nach dem `=`). Achtung: manchmal ist der Wert **sehr lang** – komplett markieren und kopieren, nichts abschneiden.
6. Wenn es eine Auswahl **Environment** gibt: mindestens **Production** anhaken (und gern auch **Preview**, wenn du magst).
7. Auf **Add** (oder **+ Add**) klicken.

**Wiederholen** für **jede** Zeile mit `=` in `.env.local` – jede Zeile ist ein neuer **Key** + **Value** + **Add**.

8. Wenn du fertig bist, **nach oben** scrollen: Du solltest eine **Liste** aller eingetragenen Namen sehen.

---

**Teil 4 – Sicherheit**

- Diese Werte sind wie **Passwörter**. Nicht in Screenshots für andere, nicht in Chats posten.
- Wenn du Hilfe brauchst: nur sagen **„der Build schlägt fehl“**, nicht die Werte schicken.

---

**Teil 5 – Dann Deploy**

Erst wenn die Variablen drin sind: großen Button **Deploy** klicken.

---

### Schritt B4 – Nach dem Deploy (wenn B3 erledigt ist)

Falls du in **B3** schon auf **Deploy** geklickt hast, passiert das jetzt automatisch.

1. **Warten** (1–3 Minuten). Ein Fortschrittsbalken läuft.
2. Wenn **Congratulations** oder eine grüne Haken-Seite kommt: **Continue to Dashboard** oder die angezeigte **URL** anklicken.

---

### Schritt B5 – Testen, ob die Seite läuft

1. Vercel zeigt eine Adresse wie: `https://maryos-fahrschule.vercel.app` (Name kann anders sein).
2. In die Adresszeile **hinten** noch **`/de`** schreiben, also z. B.:  
   `https://DEIN-NAME.vercel.app/de`
3. **Enter** – die Startseite sollte erscheinen.

Wenn **Fehler** kommt: In Vercel → dein Projekt → **Deployments** → letzten Eintrag → **Logs** – dort steht oft, was fehlt (z. B. eine fehlende Variable).

---

## Teil C: Eigene Domain maryosfahrschule.de (später, wenn Teil B klappt)

### Schritt C1 – Domain in Vercel eintragen

1. Vercel → dein Projekt → oben **Settings** → links **Domains**.
2. ins Feld deine Domain eingeben: `maryosfahrschule.de` → **Add**.
3. Dann nochmal: `www.maryosfahrschule.de` → **Add**.
4. Vercel zeigt dir jetzt **DNS-Einträge** (CNAME, A, …). **Fenster offen lassen** oder Screenshot machen (ohne private Daten).

---

### Schritt C2 – DNS bei Strato ändern

1. Bei **Strato** einloggen → **Domains** → **maryosfahrschule.de**.
2. Menüpunkt wie **DNS**, **DNS-Verwaltung** oder **Einstellungen** öffnen.
3. **Genau** die Einträge eintragen, die **Vercel** anzeigt (CNAME für `www`, ggf. A-Record für `@`).

**Hinweis:** Wenn noch Einträge auf **SmartWebsite** zeigen, musst du sie **ändern oder löschen**, damit die Domain zu Vercel zeigt. Wenn du unsicher bist: Strato-Support fragen: „Ich will meine Domain auf Vercel zeigen lassen, welche DNS-Einträge muss ich setzen?“ und ihnen die Vercel-Anzeige schicken.

---

### Schritt C3 – Warten

DNS kann **15 Minuten bis 24 Stunden** brauchen. In Vercel unter **Domains** steht irgendwann ein Haken, wenn es passt.

---

## Wenn du später am Projekt etwas änderst

1. Dateien am Mac speichern.
2. Im Terminal im Projektordner:

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
git add .
git commit -m "Aenderung"
git push
```

3. Vercel baut automatisch neu – du musst nichts extra klicken.

---

## Kurz: Reihenfolge

| Nr. | Was |
|-----|-----|
| A1 | GitHub-Account |
| A2 | Neues Repo ohne README |
| A3 | Terminal öffnen |
| A4 | `cd` in den Projektordner |
| A5 | `git init`, `add`, `commit`, `remote`, `push` |
| B1 | vercel.com, mit GitHub einloggen |
| B2 | Projekt importieren |
| B3 | Alle Variablen aus `.env.local` in Vercel eintragen |
| B4 | Deploy |
| B5 | `…vercel.app/de` im Browser testen |
| C1–C3 | Domain in Vercel + DNS bei Strato (wenn alles läuft) |

Die etwas technischere Version mit Details zu Supabase/Stripe steht zusätzlich in **`docs/DEPLOY-VERCEL.md`**.
