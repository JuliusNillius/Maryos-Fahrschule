# E2E-Tests (Playwright)

Die Tests nutzen die **data-testid**-Attribute aus `docs/BUTTON-CHECKLIST.md`.

## Voraussetzung

- Node-Abhängigkeiten installiert: `npm install --legacy-peer-deps`
- Optional: Chromium für Playwright: `npx playwright install chromium`

## Befehle

```bash
# Alle E2E-Tests ausführen (startet ggf. Dev-Server oder nutzt laufenden auf :3000)
npm run test:e2e

# Mit UI (Debug, einzeln durchklicken)
npm run test:e2e:ui

# Nur eine Datei
npx playwright test e2e/homepage.spec.ts

# Bestimmten Test
npx playwright test -g "Hero-CTAs"
```

## Hinweise

- **baseURL:** `http://localhost:3000`
- **webServer:** `npm run dev` – wenn bereits ein Server auf Port 3000 läuft, wird er wiederverwendet (`reuseExistingServer: true`).
- Neue Tests sollten weiterhin `page.getByTestId('...')` mit den IDs aus der Button-Checkliste verwenden.
