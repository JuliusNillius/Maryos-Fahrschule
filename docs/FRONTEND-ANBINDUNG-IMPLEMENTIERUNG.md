# Frontend-Anbindung: Website lädt Daten aus Backoffice

Damit Fahrlehrer, Preise, Stats, FAQ und Kontakt auf der Website aus der Datenbank kommen, die folgenden Änderungen in deinem Projekt vornehmen.

**Voraussetzung:** Die Datei `lib/site-data.ts` existiert bereits (mit `getSiteData()`, Typen `PricingItem`, `FaqItem`, `SiteSettings`). Die Supabase-Migration mit den Tabellen `instructors`, `pricing`, `site_settings`, `faq` muss ausgeführt sein.

---

## 1. Homepage: Daten laden und weiterreichen

**Datei: `app/[locale]/page.tsx`**

- **Import ergänzen** (ganz oben):
```ts
import { getSiteData } from '@/lib/site-data';
```

- **In der Funktion** nach `setRequestLocale(locale);` einfügen:
```ts
const siteData = await getSiteData();
```

- **JSX anpassen** – die Komponenten bekommen die neuen Props:
```tsx
<Stats stats={siteData.settings.stats} />
<InstructorQuiz instructors={siteData.instructors} />
<HomeTabs
  instructors={siteData.instructors}
  pricing={siteData.pricing}
  faq={siteData.faq}
  locale={locale}
/>
<Contact contact={siteData.settings.contact} />
<Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} />
```

---

## 2. Stats – Werte aus Backoffice

**Datei: `components/sections/Stats.tsx`**

- **Props-Typ und Fallback** (nach den Imports, vor der Komponente):
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

- **Komponente** – Signatur ändern und STATS aus props ableiten:
```tsx
export default function Stats({ stats }: StatsProps) {
  const t = useTranslations('stats');
  const STATS = stats
    ? [
        { key: 'google' as const, value: stats.googleRating ?? 5, decimals: 1, suffix: '' },
        { key: 'reviews' as const, value: stats.googleReviews ?? 18, decimals: 0, suffix: '' },
        { key: 'languages' as const, value: stats.languages ?? 10, decimals: 0, suffix: '' },
        { key: 'classes' as const, value: stats.classes ?? 6, decimals: 0, suffix: '' },
      ]
    : STATS_FALLBACK;
  // … Rest der Komponente unverändert (sectionRef, numberRefs, useEffect, return mit STATS.map)
}
```

---

## 3. InstructorQuiz – Fahrlehrer aus Props

**Datei: `components/sections/InstructorQuiz.tsx`**

- **Import**: `INSTRUCTORS` entfernen, nur Typ behalten:
```ts
import { type Instructor, type InstructorLang, type InstructorClass } from '@/lib/instructors';
```

- **Props**:
```ts
type InstructorQuizProps = { instructors: Instructor[] };
```

- **Komponente**:
```tsx
export default function InstructorQuiz({ instructors }: InstructorQuizProps) {
  const list = instructors?.length ? instructors : [];
  // Ersetze überall „INSTRUCTORS“ durch „list“
}
```

---

## 4. HomeTabs – Props durchreichen

**Datei: `components/sections/HomeTabs.tsx`**

- **Props-Typ** (vor der Komponente):
```ts
import type { PricingItem, FaqItem } from '@/lib/site-data';
import type { Instructor } from '@/lib/instructors';

type HomeTabsProps = {
  instructors: Instructor[];
  pricing: PricingItem[];
  faq: FaqItem[];
  locale: string;
};
```

- **Komponente**:
```tsx
export default function HomeTabs({ instructors, pricing, faq, locale }: HomeTabsProps) {
  // …
  {index === 0 && (
    <div className="space-y-0">
      <WhyUs />
      <Instructors instructors={instructors} />
    </div>
  )}
  // …
  {index === 3 && <Pricing pricing={pricing} />}
  {index === 4 && <RegistrationForm instructors={instructors} />}
  {index === 5 && (
    <div className="space-y-0">
      <Reviews />
      <FAQ faq={faq} locale={locale} />
    </div>
  )}
}
```

---

## 5. Instructors – Liste aus Props

**Datei: `components/sections/Instructors.tsx`**

- **Import**: `INSTRUCTORS` entfernen, nur Typen und Hilfsfunktionen behalten:
```ts
import { getLangFlag, getClassesForFilter, type Instructor, type InstructorLang } from '@/lib/instructors';
```

- **Props**:
```ts
type InstructorsProps = { instructors: Instructor[] };
```

- **Komponente**:
```tsx
export default function Instructors({ instructors }: InstructorsProps) {
  const list = instructors?.length ? instructors : [];
  const filtered = filterInstructors(list, langFilters, classFilter, availabilityOnly);
  // Rest wie bisher, nur „filtered“ wird aus „list“ berechnet
}
```

---

## 6. Pricing – Preise aus Backoffice

**Datei: `components/sections/Pricing.tsx`**

- **Import** (oben):
```ts
import type { PricingItem } from '@/lib/site-data';
```

- **Fallback behalten**:
```ts
const PRICING_FALLBACK = [
  { id: 'b', price: '1.800', popular: true },
  { id: 'be', price: '500', note: 'addOn' },
  { id: 'a', price: '900' },
  { id: 'a2', price: '800' },
  { id: 'a1', price: '700' },
  { id: 'am', price: '500' },
];
```

- **Props und Anzeige-Array**:
```tsx
type PricingProps = { pricing?: PricingItem[] | null };

export default function Pricing({ pricing }: PricingProps) {
  const items = pricing?.length
    ? pricing.map((p) => ({
        id: p.class_id,
        price: p.price,
        popular: p.popular,
        note: p.note ?? undefined,
      }))
    : PRICING_FALLBACK;
  // Im return: „items.map“ statt „PRICING.map“, bei Links weiter „item.id“ (ist class_id)
}
```

- **In der Karte**: `item.id.toUpperCase()` bleibt (class_id ist z.B. "b").

---

## 7. RegistrationForm – Fahrlehrer aus Props

**Datei: `components/sections/RegistrationForm.tsx`**

- **Import**: `INSTRUCTORS` entfernen:
```ts
import type { Instructor } from '@/lib/instructors';
```

- **Props**:
```ts
type RegistrationFormProps = { instructors?: Instructor[] };
```

- **Komponente**:
```tsx
export default function RegistrationForm({ instructors = [] }: RegistrationFormProps) {
  const list = instructors?.length ? instructors : [];
  // Ersetze „INSTRUCTORS“ durch „list“ (z.B. list.filter(i => i.available).map, list.find(i => i.id === watch('instructorId')))
}
```

---

## 8. FAQ – Einträge aus Backoffice

**Datei: `components/sections/FAQ.tsx`**

- **Import** (oben):
```ts
import type { FaqItem } from '@/lib/site-data';
```

- **Props**:
```ts
type FAQProps = { faq?: FaqItem[] | null; locale?: string };
```

- **In der Komponente** – wenn FAQ aus DB vorhanden, diese anzeigen, sonst Übersetzungen:
```tsx
export default function FAQ({ faq, locale = 'de' }: FAQProps) {
  const t = useTranslations('faq');
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

  return (
    // … wie bisher, nur statt FAQ_KEYS.map:
    <div className="mt-10 rounded-xl border border-[rgba(93,196,34,0.15)] bg-surface">
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
    </div>
  );
}
```

---

## 9. Contact – Kontakt aus Backoffice

**Datei: `components/sections/Contact.tsx`**

- **Konstante** `MAP_EMBED_URL` entfernen oder nur als Fallback behalten.

- **Props**:
```ts
type ContactProps = {
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    street?: string;
    zip?: string;
    city?: string;
    mapUrl?: string;
  } | null;
};
```

- **Komponente**:
```tsx
export default function Contact({ contact }: ContactProps) {
  const phone = contact?.phone ?? '0178 4557528';
  const whatsapp = contact?.whatsapp ?? '491784557528';
  const address = contact?.street && contact?.zip && contact?.city
    ? `${contact.street}, ${contact.zip} ${contact.city}`
    : 'Bahnhofstraße 25, 41236 Mönchengladbach';
  const mapUrl = contact?.mapUrl ?? 'https://maps.google.com/maps?q=Bahnhofstraße+25,+41236+Mönchengladbach&output=embed';
  const mapsQuery = contact?.street && contact?.city
    ? encodeURIComponent(`${contact.street}, ${contact.zip} ${contact.city}`)
    : 'Bahnhofstraße+25,+41236+Mönchengladbach';

  // Im JSX: href für Tel: tel:+49… mit phone (z.B. phone.replace(/\s/g,''))
  // WhatsApp: https://wa.me/${whatsapp}
  // Adresse: {address}
  // iframe src={mapUrl}
  // Google-Maps-Link: query=${mapsQuery}
}
```

- **Tel-Link**: Für `tel:` die Nummer ohne Leerzeichen; wenn mit 0 beginnend: `const telHref = \`tel:\${phone.replace(/\\s/g,'').replace(/^0/,'+49')}\`;`
- **WhatsApp-Link**: `href={\`https://wa.me/\${whatsapp}\`}` (whatsapp ohne + und Leerzeichen, z. B. 491784557528).

---

## 10. Footer – Kontakt & Impressum aus Backoffice

**Datei: `components/layout/Footer.tsx`**

- **Props**:
```ts
type FooterProps = {
  contact?: { phone?: string; street?: string; zip?: string; city?: string } | null;
  impressum?: { company?: string; street?: string; zip?: string; city?: string; register?: string; owner?: string } | null;
};
```

- **Komponente**:
```tsx
export default function Footer({ contact, impressum }: FooterProps) {
  const address = contact?.street && contact?.zip && contact?.city
    ? `${contact.street}, ${contact.zip} ${contact.city}`
    : 'Bahnhofstraße 25, 41236 Mönchengladbach';
  const phone = contact?.phone ?? '0178 4557528';
  const company = impressum?.company ?? "Maryo's Fahrschule GmbH";
  const register = impressum?.register ?? 'HRB 23787 Mönchengladbach';
  const owner = impressum?.owner ?? 'Yaako Maryo Asoo';
  // Im JSX diese Variablen verwenden statt der festen Texte
}
```

---

## Kurz-Checkliste

- [ ] `app/[locale]/page.tsx` – getSiteData, Props an alle Komponenten
- [ ] `components/sections/Stats.tsx` – stats-Prop, STATS aus stats ableiten
- [ ] `components/sections/InstructorQuiz.tsx` – instructors-Prop, list statt INSTRUCTORS
- [ ] `components/sections/HomeTabs.tsx` – instructors, pricing, faq, locale; an Unterkomponenten durchreichen
- [ ] `components/sections/Instructors.tsx` – instructors-Prop, list
- [ ] `components/sections/Pricing.tsx` – pricing-Prop, items aus pricing oder Fallback
- [ ] `components/sections/RegistrationForm.tsx` – instructors-Prop, list
- [ ] `components/sections/FAQ.tsx` – faq + locale, faqItems aus DB oder Übersetzungen
- [ ] `components/sections/Contact.tsx` – contact-Prop, phone/address/mapUrl aus contact
- [ ] `components/layout/Footer.tsx` – contact + impressum Props

Wenn alle Punkte umgesetzt sind, kommen Fahrlehrer, Preise, Stats, FAQ und Kontakt aus dem Backoffice und Änderungen dort erscheinen auf der Website.
