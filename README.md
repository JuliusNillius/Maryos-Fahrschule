# Maryo's Fahrschule

Website für die Fahrschule in Mönchengladbach. Next.js 14, Tailwind, GSAP, Lenis, i18n (DE, EN, TR, AR, RU).

## Quick Start

```bash
npm install
cp .env.example .env.local
# .env.local mit echten Werten füllen (optional für lokale Entwicklung)
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000).

Im Development wird **ohne** Supabase geladen (Seite zeigt sofort, mit leeren Inhalten). Mit echten Daten: in `.env.local` `NEXT_PUBLIC_DEV_USE_SUPABASE=1` setzen. Wenn localhost nicht lädt: `docs/LOCALHOST-START.md`.

## Backoffice (wenn Supabase schon in .env.local steht)

```bash
npm run supabase:push   # Tabellen anlegen
npm run seed:admin      # Ersten Admin-User anlegen (Passwort erscheint in der Konsole)
```
Dann unter http://localhost:3000 auf **Backoffice** klicken und einloggen. Ausführlich: `docs/BACKOFFICE-EINRICHTEN.md`.

## Umgebungsvariablen

Siehe `.env.example`. Wichtig für volle Funktion:

- **Supabase** – Buchungen speichern: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Sanity** – Blog: `NEXT_PUBLIC_SANITY_PROJECT_ID` (und ggf. `NEXT_PUBLIC_SANITY_DATASET`)
- **Resend** – E-Mails (Kontaktformular + Termin-Benachrichtigung): `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_EMAIL`
- **Stripe** – Zahlungen: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Plausible** – Analytics: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

## Logo & Icons

- **Logo:** `public/logo.svg` (Platzhalter) und optional `public/logo.png`. Wird überall über die Komponente `components/layout/Logo.tsx` (Navbar, Footer) eingebunden; bei fehlendem PNG wird SVG, danach Text-Fallback genutzt.
- **Favicon:** `app/icon.svg` („M“-Icon). Apple-Touch: in `app/layout.tsx` auf `/logo.svg` gesetzt.
- **PWA:** Das Manifest nutzt zusätzlich `/logo.svg`; für maskable Icons weiterhin `public/icon-192.png` und `public/icon-512.png` (z. B. aus dem Logo erzeugen mit [realfavicongenerator.net](https://realfavicongenerator.net/)).

## Weitere Docs

- **Supabase (Buchungen):** `supabase/README.md` + Migration in `supabase/migrations/`
- **Sanity (Blog):** `sanity/README.md` + Schema in `sanity/schemas/post.ts`

## Skripte

- `npm run dev` – Dev-Server (Port 3000)
- `npm run build` – Production-Build
- `npm run start` – Production-Server
- `npm run lighthouse` – Build + Lighthouse-Report (localhost)
