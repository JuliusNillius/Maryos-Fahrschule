# Website über Strato veröffentlichen (VPS)

Anleitung, um die Next.js-Website **komplett bei Strato** auf einem **VPS** zu betreiben. Domain und Hosting bleiben bei Strato.

---

## Voraussetzungen

- **Strato VPS** (z. B. „VPS Linux“) – klassisches Webhosting reicht nicht (kein Node.js).
- Strato-Kundenbereich mit Zugang zu **Plesk** und/oder **SSH**.
- Deine **Domain** bei Strato (z. B. `maryos-fahrschule.de`).

---

## Schritt 1: VPS bei Strato buchen

1. Einloggen unter [strato.de](https://www.strato.de) → **Produkte** → **Server** → **VPS**.
2. **VPS Linux** wählen (z. B. kleinste Stufe zum Start).
3. Bestellung abschließen. Strato schickt dir:
   - **IP-Adresse** des Servers
   - **Plesk-Zugang** (Web-Oberfläche)
   - **SSH-Zugang** (Benutzer + Passwort oder SSH-Key)

---

## Schritt 2: Server vorbereiten (per SSH)

Mit einem Terminal-Programm (z. B. Terminal auf dem Mac, PuTTY unter Windows) per SSH verbinden:

```bash
ssh root@DEINE-VPS-IP
```

(Ersetze `DEINE-VPS-IP` durch die IP aus der Strato-E-Mail.)

### Node.js installieren

```bash
# Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Prüfen
node -v   # z.B. v20.x.x
npm -v
```

### Nginx installieren (als Reverse-Proxy für die Domain)

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### PM2 installieren (App läuft dauerhaft, auch nach Logout)

```bash
sudo npm install -g pm2
```

---

## Schritt 3: Projekt auf den Server bringen

### Variante A: Mit Git (empfohlen, wenn du ein Git-Repo nutzt)

Auf dem Server:

```bash
# Projektverzeichnis anlegen
sudo mkdir -p /var/www/maryos-fahrschule
sudo chown $USER:$USER /var/www/maryos-fahrschule
cd /var/www/maryos-fahrschule

# Klonen (URL durch dein Repo ersetzen)
git clone https://github.com/DEIN-USER/DEIN-REPO.git .

# Oder nur den Hauptbranch
git clone -b main https://github.com/DEIN-USER/DEIN-REPO.git .
```

### Variante B: Mit SFTP/FTP (ohne Git)

1. Lokal auf deinem Mac: Projekt **ohne** `node_modules` und ohne `.next` packen (nur Quellcode, `package.json`, `public/`, `app/`, etc.).
2. Mit einem SFTP-Programm (z. B. **FileZilla**, **Cyberduck**) oder per `scp` auf den Server hochladen, z. B. nach `/var/www/maryos-fahrschule`.

Beispiel per `scp` (von deinem Mac aus, im Projektordner):

```bash
# .next und node_modules nicht mitschicken
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ root@DEINE-VPS-IP:/var/www/maryos-fahrschule/
```

---

## Schritt 4: Build und Umgebungsvariablen auf dem Server

Auf dem Server:

```bash
cd /var/www/maryos-fahrschule
npm install --production=false
```

### Umgebungsvariablen anlegen

Erstelle die Datei `.env.production` (oder trage die Werte in Plesk ein, falls du Plesk nutzt):

```bash
nano .env.production
```

Inhalt (mit deinen echten Werten aus `.env.local` füllen):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend (E-Mails)
RESEND_API_KEY=re_...

# Stripe (falls genutzt)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Produktion explizit
NEXT_PUBLIC_DEV_USE_SUPABASE=1
```

Speichern (in nano: `Strg+O`, Enter, `Strg+X`).

### Build ausführen

```bash
npm run build
```

Wenn der Build durchläuft, kannst du die App testen:

```bash
npm run start
```

Im Browser: `http://DEINE-VPS-IP:3000` – die Seite sollte erscheinen. Mit `Strg+C` beendest du den Test.

---

## Schritt 5: App dauerhaft mit PM2 starten

```bash
cd /var/www/maryos-fahrschule
pm2 start npm --name "maryos-fahrschule" -- start
pm2 save
pm2 startup
```

Den Befehl, den `pm2 startup` ausgibt (z. B. `sudo env PATH=... pm2 startup systemd ...`), einmal ausführen. Dann startet die App bei jedem Server-Neustart automatisch.

Nützliche PM2-Befehle:

- `pm2 status` – Status anzeigen  
- `pm2 logs maryos-fahrschule` – Logs anzeigen  
- `pm2 restart maryos-fahrschule` – App neu starten  

---

## Schritt 6: Nginx einrichten (Domain → Next.js)

Nginx leitet deine Domain auf die Next.js-App (Port 3000) weiter.

### Nginx-Konfiguration anlegen

```bash
sudo nano /etc/nginx/sites-available/maryos-fahrschule
```

Inhalt (Domain und ggf. Pfad anpassen):

```nginx
server {
    listen 80;
    server_name www.deine-domain.de deine-domain.de;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktivieren und Nginx neu laden:

```bash
sudo ln -s /etc/nginx/sites-available/maryos-fahrschule /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Schritt 7: Domain bei Strato auf den VPS zeigen

1. Strato-Kundenbereich → **Domains** → deine Domain auswählen.
2. **DNS / Einstellungen** oder **Namensserver** öffnen.
3. **A-Record** für die Domain (und ggf. für `www`) auf die **IP-Adresse deines VPS** zeigen lassen.
   - Name: `@` (oder leer) für die Hauptdomain, `www` für www.
   - Ziel: DEINE-VPS-IP (nur die IP, z. B. `123.45.67.89`).
4. Änderung speichern. DNS kann einige Minuten bis Stunden brauchen.

---

## Schritt 8: SSL (HTTPS) aktivieren

Strato-VPS haben oft **Let’s Encrypt** über Plesk. Wenn du nur SSH nutzt:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

Anweisungen von Certbot befolgen. Danach erreichst du die Seite unter **https://www.deine-domain.de**.

---

## Checkliste vor dem Go-Live

- [ ] VPS gebucht, SSH-Zugang getestet  
- [ ] Node.js, Nginx, PM2 installiert  
- [ ] Projekt auf Server (Git oder SFTP), `npm install` und `npm run build` erfolgreich  
- [ ] `.env.production` mit allen Keys (Supabase, Resend, Stripe) angelegt  
- [ ] PM2 startet die App, `pm2 save` und `pm2 startup` ausgeführt  
- [ ] Nginx-Konfiguration aktiv, `server_name` = deine Domain  
- [ ] DNS bei Strato: A-Record auf VPS-IP  
- [ ] SSL mit Certbot eingerichtet  
- [ ] Im Browser: https://deine-domain.de und https://www.deine-domain.de testen  

---

## Später: Updates veröffentlichen

Nach Änderungen am Code:

```bash
cd /var/www/maryos-fahrschule
git pull   # falls du Git nutzt
# oder neue Dateien per SFTP hochladen
npm install
npm run build
pm2 restart maryos-fahrschule
```

---

## Wichtige Hinweise

- **Secrets:** `.env.production` und alle Keys **nicht** ins Git committen. Nur auf dem Server oder in Plesk pflegen.
- **Firewall:** Port 80 (HTTP) und 443 (HTTPS) müssen vom Internet erreichbar sein. Port 3000 nur für Nginx (localhost), nicht von außen öffnen.
- **Plesk:** Wenn du Plesk nutzt, kannst du Node.js und Domains oft über die Plesk-Oberfläche einrichten; die Schritte (Build, PM2, Proxy) bleiben gleich.

Wenn du möchtest, können wir einen Schritt (z. B. Nginx, PM2 oder Domain) noch genauer durchgehen.
