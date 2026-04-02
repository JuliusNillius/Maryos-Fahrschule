import { SITE_URL } from '@/lib/seo';
import type { Instructor, InstructorLang } from '@/lib/instructors';

function langToSchemaCode(l: InstructorLang): string {
  const m: Record<InstructorLang, string> = {
    de: 'de',
    ar: 'ar',
    tr: 'tr',
    en: 'en',
    ru: 'ru',
    fr: 'fr',
  };
  return m[l] ?? 'de';
}

function instructorDescription(): string {
  return 'Fahrlehrer für Klasse B, BF17 und B197 in Mönchengladbach';
}

type Props = { instructors: Instructor[] };

/** ItemList + Person pro Fahrlehrer (nur Seite /lehrer). */
export default function InstructorsJsonLd({ instructors }: Props) {
  if (!instructors.length) return null;
  const base = SITE_URL.replace(/\/$/, '');
  const itemListElement = instructors.map((inst, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Person',
      name: inst.name,
      jobTitle: inst.title || 'Fahrlehrer',
      worksFor: {
        '@type': 'DrivingSchool',
        name: "Maryo's Fahrschule GmbH",
        url: base,
      },
      knowsLanguage: Array.from(new Set(inst.languages.map(langToSchemaCode))),
      description: instructorDescription(),
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Fahrlehrer bei Maryo's Fahrschule Mönchengladbach",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
