# Sanity CMS – Blog

Die Website lädt Blog-Artikel aus Sanity, sobald `NEXT_PUBLIC_SANITY_PROJECT_ID` und ggf. `NEXT_PUBLIC_SANITY_DATASET` gesetzt sind.

## Schema „post“

Unter `schemas/post.ts` liegt die Definition für den Dokumenttyp **post**. Felder:

| Feld         | Typ     | Pflicht | Beschreibung                    |
|-------------|---------|--------|----------------------------------|
| `title`     | string  | ja     | Titel des Artikels               |
| `slug`      | slug    | ja     | URL-Slug (z. B. aus Titel)       |
| `excerpt`   | text    | nein   | Kurzbeschreibung / Teaser        |
| `mainImage` | image   | nein   | Hauptbild                        |
| `publishedAt` | datetime | nein | Veröffentlichungsdatum           |
| `body`      | array (blocks) | nein | Inhalt (Portable Text)       |

## Einbindung im Sanity Studio

1. Eigenes Sanity-Projekt anlegen oder bestehendes verwenden (gleiche Project ID wie in der App).
2. In `sanity.config.ts` den Typ einbinden:

```ts
import { defineConfig } from 'sanity';
import { postSchema } from '../sanity/schemas/post';

export default defineConfig({
  // ...
  schema: {
    types: [postSchema],
  },
});
```

3. Im Studio Dokumente vom Typ **post** anlegen; `slug` generieren („Generate“) und **Publish** ausführen.

## Umgebungsvariablen (Next.js)

- `NEXT_PUBLIC_SANITY_PROJECT_ID` – Projekt-ID aus dem Sanity Dashboard
- `NEXT_PUBLIC_SANITY_DATASET` – z. B. `production` (Standard)

Ohne Project ID zeigt die Website eine leere Blog-Liste und 404 für einzelne Slugs.
