# Lokal starten – wenn localhost nicht lädt

## 1. Normale Variante (Port 3000)

Im **Terminal** (eigenes Fenster, z. B. Terminal.app oder Cursor-Terminal):

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
npm run dev
```

**Wichtig:** Warten, bis in der Ausgabe **"✓ Ready in X.Xs"** erscheint (meist 2–4 Sekunden). Erst danach im Browser öffnen.

Dann im Browser: **http://localhost:3000** (leitet auf **http://localhost:3000/de** weiter) oder **http://localhost:3000/de** direkt.

- Wenn du **404** siehst: Öffne direkt **http://localhost:3000/de**.
- **Safari „kann keine Verbindung aufbauen“:** Der Server muss laufen (`npm run dev`). Probiere **http://127.0.0.1:3000** statt `localhost`. Wenn es dann geht, liegt es oft an IPv6 (Safari und localhost).
- Test-URL, ob der Server läuft: **http://localhost:3000/api/health** (sollte `{"ok":true,...}` anzeigen)

---

## 2. Safari: „Safari kann keine Verbindung aufbauen“

1. **Server muss laufen:** Im Terminal `npm run dev` ausführen und warten, bis „Ready“ erscheint.
2. **127.0.0.1 statt localhost:** In Safari **http://127.0.0.1:3000** (oder **http://127.0.0.1:3000/de**) öffnen. Oft blockiert Safari bei `localhost` (IPv6).
3. Wenn du von einem anderen Gerät (z. B. iPhone) zugreifen willst: gleiches WLAN, dann im Safari die IP deines Macs nutzen, z. B. **http://192.168.1.42:3000** (IP in Systemeinstellungen → Netzwerk prüfen).

---

## 3. Wenn Port 3000 blockiert oder langsam ist

Port 3001 nutzen:

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
npm run dev:3001
```

Browser: **http://localhost:3001**

---

## 4. Supabase in Development deaktivieren

Die Startseite lädt im Development **ohne** Supabase (leere Daten: keine Lehrer, keine FAQ usw.), damit die Seite schnell anzeigt.

Wenn du **mit** echten Daten aus Supabase testen willst, in `.env.local` setzen:

```
NEXT_PUBLIC_DEV_USE_SUPABASE=1
```

Dann wird `getSiteData()` auch lokal Supabase anfragen. Ohne diese Variable wird im Dev-Modus keine Datenbank angefragt.

---

## 5. Port manuell freigeben

Falls „address already in use“ kommt:

```bash
lsof -ti :3000 | xargs kill -9
```

Für Port 3001: `lsof -ti :3001 | xargs kill -9`

---

## 6. Production-Build lokal testen

Wenn der Dev-Server gar nicht reagiert, Build und Production-Server testen:

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
npm run build
npm run start
```

Dann **http://localhost:3000** im Browser öffnen (Production-Server antwortet ohne Laufzeit-Kompilierung).
