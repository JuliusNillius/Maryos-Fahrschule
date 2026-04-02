# Hero-Videos über Supabase Storage (Option A)

## Checkliste 1–8 (nur Klicken & Einfügen)

**Voraussetzung:** Die Migration für den Bucket ist schon durch (bei dir: `db push` mit `hero_videos_bucket` war erfolgreich). Dann reicht diese Liste.

1. **Browser öffnen** → [supabase.com](https://supabase.com) → einloggen.
2. **Dein Projekt** auswählen (das zur Fahrschule-Website gehört).
3. Links im Menü auf **„Storage“** (oder „Speicher“) klicken.
4. In der Liste den Bucket **`hero-videos`** anklicken.  
   *(Wenn er fehlt: erst Migration / SQL aus dem Repo ausführen – siehe unten.)*
5. **Dateien hochladen:** Button wie **„Upload“** / **„New file“** → deine beiden Videos von der Festplatte wählen.  
   **Wichtig:** Dateinamen genau so: **`hero.mp4`** und **`hero-mobile.mp4`** (klein schreiben, Punkt mp4).
6. **`hero.mp4` öffnen** (einmal draufklicken) → Menü **⋯** (drei Punkte) oder **„Copy URL“** → **öffentliche URL kopieren** (beginnt mit `https://` und enthält `supabase.co`). In einen Editor/Notiz **Desktop-URL** einfügen.
7. Dasselbe für **`hero-mobile.mp4`** → **Mobil-URL** kopieren und notieren.
8. **Vercel:** [vercel.com](https://vercel.com) → dein **Website-Projekt** → **Settings** → **Environment Variables** → zwei neue Einträge anlegen (Häkchen **Production** setzen):  
   - Name: `NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL` → Wert: **Desktop-URL**  
   - Name: `NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL` → Wert: **Mobil-URL**  
   Speichern → Tab **Deployments** → beim letzten Deployment **⋯** → **Redeploy** (oder neu aus Git deployen).

**Fertig.** Seite neu laden; im Browser **F12 → Network** → nach `mp4` filtern – die Anfrage sollte zu **supabase.co** gehen.

---

## 1. Migration ausführen

Lokal oder verlinktes Projekt:

```bash
npx supabase db push --linked
```

Oder im **Supabase Dashboard → SQL** den Inhalt von  
`supabase/migrations/20260406140000_hero_videos_bucket.sql` einfügen und ausführen.

Damit existiert der **öffentliche** Bucket `hero-videos` (nur `video/mp4`, bis 100 MiB).

## 2. Videos hochladen

1. Dashboard → **Storage** → Bucket **`hero-videos`**
2. Dateien hochladen, **exakt** diese Namen (oder passe die URLs unten an):
   - `hero.mp4` (Desktop, 16∶9)
   - `hero-mobile.mp4` (Mobil, 9∶16)

## 3. Öffentliche URLs kopieren

Pro Datei: **⋯ → Copy public URL**

Form:

```text
https://<DEIN-PROJEKT-REF>.supabase.co/storage/v1/object/public/hero-videos/hero.mp4
https://<DEIN-PROJEKT-REF>.supabase.co/storage/v1/object/public/hero-videos/hero-mobile.mp4
```

## 4. Vercel (Production)

**Settings → Environment Variables:**

| Name | Wert |
|------|------|
| `NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL` | volle URL zu `hero.mp4` |
| `NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL` | volle URL zu `hero-mobile.mp4` |

**Redeploy** auslösen (neuer Build übernimmt `NEXT_PUBLIC_*`).

## 5. Optional: `public/videos/` entschlacken

Wenn nur noch Supabase-URLs genutzt werden:

- Große MP4s aus dem Git entfernen (z. B. `git rm --cached public/videos/hero*.mp4`) und `public/videos/` in `.gitignore` ergänzen **oder** kleine Platzhalter behalten für lokales Dev ohne Env.

Lokal ohne Env-Variablen nutzt die App weiter **`/videos/hero.mp4`** aus `public/`.

## 6. Kurz testen

- Production: Hard-Reload, **Network**-Tab → Video-Request auf `…supabase.co/storage/…` mit **200**.
- Bei schwarzem Hero: CSP prüfen (`CSP_DISABLE=1` nur zum Debuggen).
