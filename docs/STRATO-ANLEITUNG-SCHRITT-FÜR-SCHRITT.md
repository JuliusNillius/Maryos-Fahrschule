# Strato: Website live – Schritt für Schritt

Mach die Schritte **der Reihe nach**. Alles, was du brauchst, steht hier.

---

## Teil 1: Vorbereitung (auf deinem Mac / PC)

### Schritt 1.1 – VPS bei Strato bestellen

1. Geh auf **https://www.strato.de** und melde dich an.
2. Menü: **Produkte** → **Server** → **VPS**.
3. Wähle **VPS Linux** (z. B. die günstigste Stufe).
4. Bestellung abschließen und bezahlen.
5. Warte auf die E-Mail von Strato mit:
   - **IP-Adresse** des Servers (z. B. `123.45.67.89`)
   - **SSH-Zugang** (Benutzername + Passwort)
   - Link zu **Plesk** (optional, du kannst alles per SSH machen)

**Notiere dir:**  
- VPS-IP: `________________`  
- SSH-Benutzer: `________________`  
- SSH-Passwort: `________________`

---

### Schritt 1.2 – Projekt für den Upload vorbereiten

1. Öffne das **Terminal** (Mac) bzw. **PowerShell** (Windows).
2. Geh in dein Projekt:
   ```bash
   cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
   ```
3. Prüfe, dass der Build funktioniert:
   ```bash
   npm run build
   ```
   Es darf keine Fehlermeldung kommen. Wenn es durchläuft: gut.
4. Erstelle eine Liste deiner Umgebungsvariablen (für später auf dem Server):
   - Öffne die Datei **`.env.local`** im Editor.
   - Kopiere alle Zeilen (ohne sie irgendwo öffentlich zu posten).
   - Du brauchst sie in Schritt 3.4 auf dem Server für **`.env.production`**.

---

## Teil 2: Mit dem Server verbinden und Grundlagen installieren

### Schritt 2.1 – Per SSH einloggen

Im Terminal (Benutzer und IP ersetzen):

```bash
ssh root@DEINE-VPS-IP
```

Beispiel: `ssh root@123.45.67.89`  
Beim ersten Mal fragt er nach „Are you sure?“ → **yes** tippen, Enter.  
Dann das **SSH-Passwort** aus der Strato-E-Mail eingeben.

Wenn du drin bist, siehst du etwas wie `root@vps123:~#`. Ab jetzt sind alle Befehle **auf dem Server**.

---

### Schritt 2.2 – Node.js installieren

Diese Befehle **einzeln** nacheinander ausführen:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

```bash
sudo apt-get install -y nodejs
```

```bash
node -v
```

Es sollte z. B. `v20.x.x` anzeigen. Dann:

```bash
sudo apt-get install -y nginx
```

```bash
sudo npm install -g pm2
```

Damit sind Node.js, Nginx und PM2 installiert.

---

### Schritt 2.3 – Ordner für die Website anlegen

```bash
sudo mkdir -p /var/www/maryos-fahrschule
sudo chown $USER:$USER /var/www/maryos-fahrschule
```

---

## Teil 3: Projekt auf den Server bringen

### Schritt 3.1 – Projekt hochladen (von deinem Mac aus)

**SSH-Verbindung zum Server vorher beenden:** im Terminal `exit` tippen, Enter.

Dann **auf deinem Mac** im Terminal (im Projektordner):

```bash
cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ root@DEINE-VPS-IP:/var/www/maryos-fahrschule/
```

**DEINE-VPS-IP** durch deine echte VPS-IP ersetzen (z. B. `123.45.67.89`).  
Passwort eingeben, wenn gefragt. Warten, bis der Upload fertig ist.

---

### Schritt 3.2 – Wieder per SSH auf den Server

```bash
ssh root@DEINE-VPS-IP
```

---

### Schritt 3.3 – Abhängigkeiten installieren und bauen

```bash
cd /var/www/maryos-fahrschule
npm install
npm run build
```

Wenn hier ein Fehler kommt: Fehlermeldung notieren. Meist fehlt dann etwas in der Umgebung oder im Code.  
Wenn `npm run build` **ohne Fehler** durchläuft: weiter.

---

### Schritt 3.4 – Umgebungsvariablen anlegen

```bash
nano .env.production
```

Es öffnet sich ein Editor. Dort **genau die gleichen Variablen** eintragen wie in deiner lokalen `.env.local` (Supabase, Resend, Stripe usw.). Beispiel (mit deinen echten Werten ersetzen):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
```

Speichern: **Strg+O**, Enter. Beenden: **Strg+X**.

---

### Schritt 3.5 – App testen

```bash
npm run start
```

Kurz warten. Dann **am Mac im Browser** öffnen: **http://DEINE-VPS-IP:3000**  
Die Website sollte erscheinen.  
Im Server-Terminal: **Strg+C** drücken, um `npm run start` zu beenden.

---

### Schritt 3.6 – App dauerhaft mit PM2 starten

```bash
cd /var/www/maryos-fahrschule
pm2 start npm --name "maryos-fahrschule" -- start
pm2 save
pm2 startup
```

Den Befehl, den `pm2 startup` **ausgibt** (beginnt oft mit `sudo env PATH=...`), **komplett kopieren** und nochmal ausführen. Dann startet die App auch nach einem Neustart des Servers automatisch.

---

## Teil 4: Domain und HTTPS einrichten

### Schritt 4.1 – Nginx-Konfiguration anlegen

Ersetze **deine-domain.de** durch deine echte Domain (z. B. `maryos-fahrschule.de`).

```bash
sudo nano /etc/nginx/sites-available/maryos-fahrschule
```

In den Editor **genau das** einfügen (Domain anpassen):

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

Speichern: **Strg+O**, Enter. Beenden: **Strg+X**.

Aktivieren und testen:

```bash
sudo ln -sf /etc/nginx/sites-available/maryos-fahrschule /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Bei `nginx -t` sollte „syntax is ok“ stehen.

---

### Schritt 4.2 – Domain bei Strato auf den VPS zeigen

1. Im Browser: **Strato** → einloggen → **Domains** → deine Domain wählen.
2. Zu **DNS** / **Einstellungen** / **Namensserver** gehen.
3. **A-Record** anlegen bzw. anpassen:
   - **Name:** `@` (oder leer) für die Hauptdomain.
   - **Ziel / Wert:** deine **VPS-IP** (nur die IP, z. B. `123.45.67.89`).
4. Wenn du **www** nutzen willst: weiteren Eintrag:
   - **Name:** `www`
   - **Ziel / Wert:** wieder die **VPS-IP**.
5. Speichern. DNS kann 5–60 Minuten brauchen.

---

### Schritt 4.3 – SSL (HTTPS) einrichten

Wieder **per SSH auf dem Server**:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

**deine-domain.de** und **www.deine-domain.de** durch deine echte Domain ersetzen.  
Certbot fragt nach E-Mail und AGB → ausfüllen. Am Ende solltest du „Successfully received certificate“ sehen.

---

### Schritt 4.4 – Test im Browser

Im Browser öffnen:

- **https://deine-domain.de**
- **https://www.deine-domain.de**

Die Seite sollte laden und das Schloss (HTTPS) anzeigen.

---

## Fertig – Kurz-Checkliste

- [ ] VPS bei Strato bestellt, IP + SSH-Zugang notiert  
- [ ] Node.js, Nginx, PM2 auf dem Server installiert  
- [ ] Projekt per rsync hochgeladen  
- [ ] `npm install` und `npm run build` ohne Fehler  
- [ ] `.env.production` mit allen Keys angelegt  
- [ ] PM2 startet die App, `pm2 save` und `pm2 startup` ausgeführt  
- [ ] Nginx-Konfiguration mit deiner Domain angelegt und aktiv  
- [ ] DNS bei Strato: A-Record(s) auf VPS-IP  
- [ ] SSL mit Certbot eingerichtet  
- [ ] https://deine-domain.de im Browser getestet  

---

## Später: Änderungen veröffentlichen

Wenn du am Projekt etwas geändert hast:

1. **Auf dem Mac** wieder hochladen:
   ```bash
   cd "/Users/juliusnillius/Desktop/Maryos Fahrschule 23.53.54"
   rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ root@DEINE-VPS-IP:/var/www/maryos-fahrschule/
   ```
2. **Per SSH auf den Server**, dann:
   ```bash
   cd /var/www/maryos-fahrschule
   npm install
   npm run build
   pm2 restart maryos-fahrschule
   ```

Danach ist die neue Version live.

---

Wenn ein Schritt nicht klappt: Fehlermeldung genau aufschreiben (oder Screenshot) und den Schritt nennen – dann kann man gezielt nach der Ursache suchen.
