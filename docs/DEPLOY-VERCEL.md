# Website mit Vercel live schalten

Du hast schon einen Vercel-Account – so bringst du **Maryo’s Fahrschule** (Next.js) online und verbindest **maryosfahrschule.de** (Strato).

---

## Schritt 1: Code auf GitHub (falls noch nicht)

1. Auf [github.com](https://github.com) ein **neues Repository** anlegen (z. B. `maryos-fahrschule`), **ohne** README, wenn du lokal schon ein Projekt hast.
2. Im Projektordner im Terminal:

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USER/DEIN-REPO.git
git push -u origin main
```

**Wichtig:** `.env.local` steht normalerweise in `.gitignore` und wird **nicht** hochgeladen – gut so. Die Werte trägst du nur in Vercel ein (Schritt 3).

---

## Schritt 2: Projekt bei Vercel anlegen

1. Auf [vercel.com](https://vercel.com) einloggen.
2. **Add New…** → **Project**.
3. **Import** dein GitHub-Repository (einmal GitHub verbinden, falls nötig).
4. Einstellungen:
   - **Framework Preset:** Next.js (wird meist automatisch erkannt).
   - **Root Directory:** `./` (leer lassen, wenn das Repo nur dieses Projekt ist).
5. **Noch nicht auf Deploy klicken** – zuerst Umgebungsvariablen (Schritt 3).

---

## Schritt 3: Umgebungsvariablen in Vercel

Unter **Environment Variables** alle Variablen aus deiner lokalen **`.env.local`** eintragen – **Name und Wert 1:1 kopieren**.

Mindestens (siehe auch `.env.example`):

| Name | Hinweis |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | gleiche Stelle |
| `SUPABASE_SERVICE_ROLE_KEY` | gleiche Stelle (nur Server, geheim halten) |

Falls du nutzt, zusätzlich z. B.:

- `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_EMAIL`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SANITY_*`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_DEV_USE_SUPABASE` – für **Produktion** meist **nicht** setzen oder `0`, damit die Live-Seite normal mit Supabase arbeitet

**Environment:** mindestens **Production** anhaken; für Vorschau-Deployments kannst du dieselben Werte auch für **Preview** setzen.

Dann **Deploy** starten.

---

## Schritt 4: Ersten Deploy prüfen

- Vercel zeigt eine URL wie `dein-projekt.vercel.app`.
- Öffnen und testen: z. B. `https://dein-projekt.vercel.app/de` (Startseite Deutsch wegen `localePrefix: 'always'`).

Wenn der Build fehlschlägt: **Logs** in Vercel öffnen und die Fehlermeldung lesen (oft fehlt eine Env-Variable).

---

## Schritt 5: Eigene Domain maryosfahrschule.de (Strato)

### In Vercel

1. Projekt → **Settings** → **Domains**.
2. Domain eintragen: `maryosfahrschule.de` und `www.maryosfahrschule.de` (beide hinzufügen).
3. Vercel zeigt dir die **DNS-Einträge**, die du bei Strato setzen musst (meist **CNAME** für `www` und ggf. **A** oder **CNAME** für die Root-Domain – genau so übernehmen, wie Vercel es anzeigt).

### Bei Strato (DNS)

1. Strato-Kundenbereich → **Domains** → **maryosfahrschule.de** → **DNS** / **Einstellungen**.
2. Alte Einträge, die auf **SmartWebsite** oder andere Hosts zeigen, ggf. **entfernen oder anpassen** (sonst zeigt die Domain noch nicht auf Vercel).
3. Die von Vercel vorgegebenen Einträge anlegen, z. B.:
   - **CNAME** für `www` → Ziel wie `cname.vercel-dns.com` (exakt wie in Vercel angezeigt).
   - Für die **Root-Domain** (`@`): Vercel zeigt oft eine **A-Record-IP** oder einen speziellen CNAME – **genau** übernehmen.

DNS kann **einige Minuten bis zu 48 Stunden** brauchen. In Vercel auf **Refresh** klicken, bis die Domain als erkannt erscheint.

**SSL:** Vercel stellt **HTTPS** automatisch bereit – du musst bei Strato kein extra SSL für Vercel kaufen.

---

## Schritt 6: Supabase & Webhooks (nach Go-Live)

- **Supabase** → **Authentication** → **URL configuration**: Production-URL (`https://maryosfahrschule.de`) in erlaubten Redirect-URLs aufnehmen, falls Login genutzt wird.
- **Stripe Webhook:** Endpoint-URL auf die **Vercel-URL** deiner API anpassen (z. B. `https://maryosfahrschule.de/api/stripe/webhook`), falls du Stripe nutzt.

---

## Später: Änderungen veröffentlichen

Einfach auf **main** (oder deinen Production-Branch) **pushen** – Vercel baut und deployt automatisch neu.

```bash
git add .
git commit -m "Update …"
git push
```

---

## Kurz-Checkliste

- [ ] Code auf GitHub  
- [ ] Projekt in Vercel importiert  
- [ ] Alle Env-Variablen aus `.env.local` in Vercel eingetragen  
- [ ] Deploy erfolgreich, `…vercel.app/de` getestet  
- [ ] Domains in Vercel hinzugefügt  
- [ ] DNS bei Strato nach Vorgabe von Vercel gesetzt  
- [ ] Supabase / Stripe URLs geprüft  

Damit läuft die Website über **Vercel**; **Strato** bleibt für Domain (und ggf. E-Mail, SmartWebsite) – die Domain zeigt nur auf Vercel.
