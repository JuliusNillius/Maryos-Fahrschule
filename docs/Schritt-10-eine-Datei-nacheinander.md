# Schritt 10: Frontend anbinden – eine Datei nach der anderen

Öffne **jeweils die genannte Datei** in deinem Projekt und nimm die angegebene Änderung vor. Danach die nächste Datei.

---

## Datei 1 von 10: `app/[locale]/page.tsx`

**1a) Ganz oben einen Import ergänzen** (z. B. nach den anderen Imports):
```ts
import { getSiteData } from '@/lib/site-data';
```

**1b) In der async Funktion** direkt nach der Zeile `setRequestLocale(locale);` **eine neue Zeile** einfügen:
```ts
const siteData = await getSiteData();
```

**1c) Im return** diese fünf Zeilen ersetzen:

- Aus: `<Stats />`  
  In: `<Stats stats={siteData.settings.stats} />`

- Aus: `<InstructorQuiz />`  
  In: `<InstructorQuiz instructors={siteData.instructors} />`

- Aus: `<HomeTabs />`  
  In:
  ```tsx
  <HomeTabs
    instructors={siteData.instructors}
    pricing={siteData.pricing}
    faq={siteData.faq}
    locale={locale}
  />
  ```

- Aus: `<Contact />`  
  In: `<Contact contact={siteData.settings.contact} />`

- Aus: `<Footer />`  
  In: `<Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} />`

---

## Datei 2 von 10: `components/sections/Stats.tsx`

**2a) Vor der Komponente** (z. B. nach den Imports) einfügen:
```ts
type StatsProps = {
  stats?: {
    googleRating?: number;
    googleReviews?: number;
    languages?: number;
    classes?: number;
  } | null;
};

const STATS_FALLBACK = [
  { key: 'google', value: 5, decimals: 1, suffix: '' },
  { key: 'reviews', value: 18, decimals: 0, suffix: '' },
  { key: 'languages', value: 10, decimals: 0, suffix: '' },
  { key: 'classes', value: 6, decimals: 0, suffix: '' },
] as const;
```

**2b) Erste Zeile der Komponente ändern:**

- Aus: `export default function Stats() {`  
  In: `export default function Stats({ stats }: StatsProps) {`

**2c) Direkt danach in der Komponente** (nach `const t = ...`) einfügen:
```ts
const STATS = stats
  ? [
      { key: 'google' as const, value: stats.googleRating ?? 5, decimals: 1, suffix: '' },
      { key: 'reviews' as const, value: stats.googleReviews ?? 18, decimals: 0, suffix: '' },
      { key: 'languages' as const, value: stats.languages ?? 10, decimals: 0, suffix: '' },
      { key: 'classes' as const, value: stats.classes ?? 6, decimals: 0, suffix: '' },
    ]
  : STATS_FALLBACK;
```

**2d) Die alte Zeile** `const STATS = [` … bis `];` **löschen** (falls noch vorhanden).

---

## Datei 3 von 10: `components/sections/InstructorQuiz.tsx`

**3a) Import anpassen:**  
`INSTRUCTORS` aus dem Import von `@/lib/instructors` entfernen, nur die Typen behalten, z. B.:
```ts
import { type Instructor, type InstructorLang, type InstructorClass } from '@/lib/instructors';
```

**3b) Komponente:**  
- Aus: `export default function InstructorQuiz() {`  
  In: `export default function InstructorQuiz({ instructors }: { instructors: Instructor[] }) {`

**3c) Direkt danach in der Komponente:**
```ts
const list = instructors?.length ? instructors : [];
```

**3d) Im Rest der Datei** jedes `INSTRUCTORS` durch `list` ersetzen.

---

## Datei 4 von 10: `components/sections/HomeTabs.tsx`

**4a) Oben die Imports ergänzen:**
```ts
import type { PricingItem, FaqItem } from '@/lib/site-data';
import type { Instructor } from '@/lib/instructors';
```

**4b) Props-Typ vor der Komponente:**
```ts
type HomeTabsProps = {
  instructors: Instructor[];
  pricing: PricingItem[];
  faq: FaqItem[];
  locale: string;
};
```

**4c) Komponenten-Signatur:**
- Aus: `export default function HomeTabs() {`  
  In: `export default function HomeTabs({ instructors, pricing, faq, locale }: HomeTabsProps) {`

**4d) Im JSX anpassen:**
- `<Instructors />` → `<Instructors instructors={instructors} />`
- `<Pricing />` → `<Pricing pricing={pricing} />`
- `<RegistrationForm />` → `<RegistrationForm instructors={instructors} />`
- `<FAQ />` → `<FAQ faq={faq} locale={locale} />`

---

## Datei 5 von 10: `components/sections/Instructors.tsx`

**5a) Import:**  
`INSTRUCTORS` aus dem Import entfernen, z. B. nur:
```ts
import { getLangFlag, getClassesForFilter, type Instructor, type InstructorLang } from '@/lib/instructors';
```

**5b) Komponente:**
- Aus: `export default function Instructors() {`  
  In: `export default function Instructors({ instructors }: { instructors: Instructor[] }) {`

**5c) Direkt danach:**
```ts
const list = instructors?.length ? instructors : [];
```

**5d) Die Zeile** `const filtered = filterInstructors(INSTRUCTORS, ...)` **ändern zu:**
```ts
const filtered = filterInstructors(list, langFilters, classFilter, availabilityOnly);
```

---

## Datei 6 von 10: `components/sections/Pricing.tsx`

**6a) Import ergänzen:**
```ts
import type { PricingItem } from '@/lib/site-data';
```

**6b) Die Konstante** `PRICING` **umbenennen** in `PRICING_FALLBACK` (Name nur ändern, Werte gleich lassen).

**6c) Props und Items in der Komponente:**
- Aus: `export default function Pricing() {`  
  In: `export default function Pricing({ pricing }: { pricing?: PricingItem[] | null }) {`

**6d) Direkt danach in der Komponente:**
```ts
const items = pricing?.length
  ? pricing.map((p) => ({
      id: p.class_id,
      price: p.price,
      popular: p.popular,
      note: p.note ?? undefined,
    }))
  : PRICING_FALLBACK;
```

**6e) Im return** jedes `PRICING` durch `items` ersetzen (z. B. `items.map(...)`).

---

## Datei 7 von 10: `components/sections/RegistrationForm.tsx`

**7a) Import:**  
`INSTRUCTORS` entfernen, nur Typ behalten:
```ts
import type { Instructor } from '@/lib/instructors';
```

**7b) Komponente:**
- Aus: `export default function RegistrationForm() {`  
  In: `export default function RegistrationForm({ instructors = [] }: { instructors?: Instructor[] }) {`

**7c) Direkt danach:**
```ts
const list = instructors?.length ? instructors : [];
```

**7d) In der Datei** jedes `INSTRUCTORS` durch `list` ersetzen (z. B. `list.filter(i => i.available)`, `list.find(...)`).

---

## Datei 8 von 10: `components/sections/FAQ.tsx`

**8a) Import:**
```ts
import type { FaqItem } from '@/lib/site-data';
```

**8b) Komponente:**
- Aus: `export default function FAQ() {`  
  In: `export default function FAQ({ faq, locale = 'de' }: { faq?: FaqItem[] | null; locale?: string }) {`

**8c) Nach** `const [openId, setOpenId] = ...` **einfügen:**
```ts
const qKey = locale === 'en' ? 'question_en' : locale === 'tr' ? 'question_tr' : locale === 'ar' ? 'question_ar' : locale === 'ru' ? 'question_ru' : 'question_de';
const aKey = locale === 'en' ? 'answer_en' : locale === 'tr' ? 'answer_tr' : locale === 'ar' ? 'answer_ar' : locale === 'ru' ? 'answer_ru' : 'answer_de';
const faqItems = faq?.length
  ? faq.map((item, i) => ({
      id: i,
      question: (item[qKey as keyof FaqItem] as string) || item.question_de,
      answer: (item[aKey as keyof FaqItem] as string) || item.answer_de,
    }))
  : FAQ_KEYS.map((key, i) => ({
      id: i,
      question: t(`${key}Q`),
      answer: t(`${key}A`),
    }));
```

**8d) Im return** den Block mit `{FAQ_KEYS.map((key, i) => (` … ersetzen durch:
```tsx
{faqItems.map((item, i) => (
  <AccordionItem
    key={i}
    id={i}
    open={openId === i}
    onToggle={() => setOpenId((prev) => (prev === i ? null : i))}
    question={item.question}
    answer={item.answer}
  />
))}
```

---

## Datei 9 von 10: `components/sections/Contact.tsx`

**9a) Die feste Konstante** `MAP_EMBED_URL` **kann bleiben** (wird als Fallback genutzt).

**9b) Komponente:**
- Aus: `export default function Contact() {`  
  In:
  ```ts
  export default function Contact({ contact }: {
    contact?: {
      phone?: string;
      whatsapp?: string;
      street?: string;
      zip?: string;
      city?: string;
      mapUrl?: string;
    } | null;
  }) {
  ```

**9c) Direkt danach in der Komponente:**
```ts
const phone = contact?.phone ?? '0178 4557528';
const whatsapp = (contact?.whatsapp ?? '491784557528').replace(/\s/g, '');
const address = contact?.street && contact?.zip && contact?.city
  ? `${contact.street}, ${contact.zip} ${contact.city}`
  : 'Bahnhofstraße 25, 41236 Mönchengladbach';
const mapUrl = contact?.mapUrl ?? 'https://maps.google.com/maps?q=Bahnhofstraße+25,+41236+Mönchengladbach&output=embed';
const mapsQuery = contact?.street && contact?.city
  ? encodeURIComponent(`${contact.street}, ${contact.zip} ${contact.city}`)
  : 'Bahnhofstraße+25,+41236+Mönchengladbach';
const telHref = `tel:${phone.replace(/\s/g, '').replace(/^0/, '+49')}`;
```

**9d) Im JSX ersetzen:**
- `href="https://www.google.com/maps/..."` → `href={\`https://www.google.com/maps/search/?api=1&query=${mapsQuery}\`}`
- Den angezeigten Adress-Text → `{address}`
- `href="tel:+491784557528"` → `href={telHref}` und Anzeige → `{phone}`
- WhatsApp-Link → `href={\`https://wa.me/${whatsapp}\`}`
- iframe `src={MAP_EMBED_URL}` → `src={mapUrl}`

---

## Datei 10 von 10: `components/layout/Footer.tsx`

**10a) Komponente:**
- Aus: `export default function Footer() {`  
  In:
  ```ts
  export default function Footer({
    contact,
    impressum,
  }: {
    contact?: { phone?: string; street?: string; zip?: string; city?: string } | null;
    impressum?: { company?: string; street?: string; zip?: string; city?: string; register?: string; owner?: string } | null;
  }) {
  ```

**10b) Direkt danach:**
```ts
const address = contact?.street && contact?.zip && contact?.city
  ? `${contact.street}, ${contact.zip} ${contact.city}`
  : 'Bahnhofstraße 25, 41236 Mönchengladbach';
const phone = contact?.phone ?? '0178 4557528';
const company = impressum?.company ?? "Maryo's Fahrschule GmbH";
const register = impressum?.register ?? 'HRB 23787 Mönchengladbach';
const owner = impressum?.owner ?? 'Yaako Maryo Asoo';
```

**10c) Im JSX** die festen Texte ersetzen durch `{address}`, `{phone}`, `{company}`, `{register}`, `{owner}` (an den Stellen, wo bisher Adresse, Telefon, Firma, Register, Inhaber standen).

---

## Fertig

Wenn du alle 10 Dateien so angepasst hast, lädt die Website Fahrlehrer, Preise, Stats, FAQ und Kontakt aus dem Backoffice. Änderungen im Backoffice erscheinen auf der Seite (ggf. nach Neuladen).

**Hinweis:** Wenn eine Datei bei dir leicht anders aufgebaut ist (z. B. andere Variablennamen), die gleiche Logik an der passenden Stelle einbauen.
