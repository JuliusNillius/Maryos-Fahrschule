/**
 * SEO constants and metadata per locale.
 * Base URL: use NEXT_PUBLIC_SITE_URL in production.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maryos-fahrschule.de';

export const DEFAULT_TITLE = "Maryo's Fahrschule | Mönchengladbach | B, BE, A, A1, A2, AM";
export const DEFAULT_DESCRIPTION =
  "Fahrschule in Mönchengladbach. Führerschein Klasse B, BE, A, A1, A2, AM. Lehrer wählen, online anmelden, Apple Pay. 5.0 ★ Google. 0178 4557528";

export type Locale = 'de' | 'en' | 'tr' | 'ar' | 'ru';

export const METADATA: Record<
  Locale,
  { title: string; description: string; openGraphTitle?: string; openGraphDescription?: string }
> = {
  de: {
    title: "Maryo's Fahrschule | Mönchengladbach | B, BE, A, A1, A2, AM",
    description:
      "Fahrschule in Mönchengladbach. Führerschein Klasse B, BE, A, A1, A2, AM. Lehrer wählen, online anmelden, Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
  en: {
    title: "Maryo's Driving School | Mönchengladbach | B, BE, A, A1, A2, AM",
    description:
      "Driving school in Mönchengladbach. License classes B, BE, A, A1, A2, AM. Choose your instructor, register online, Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
  tr: {
    title: "Maryo's Fahrschule | Mönchengladbach | B, BE, A, A1, A2, AM",
    description:
      "Mönchengladbach'da sürücü kursu. B, BE, A, A1, A2, AM sınıfları. Öğretmen seçin, online kayıt, Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
  ar: {
    title: "مدرسة ماريو للقيادة | مونشنغلادباخ | B, BE, A, A1, A2, AM",
    description:
      "مدرسة قيادة في مونشنغلادباخ. رخصة B, BE, A, A1, A2, AM. اختر معلمك، سجّل أونلاين، Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
  ru: {
    title: "Maryo's Fahrschule | Мёнхенгладбах | B, BE, A, A1, A2, AM",
    description:
      "Автошкола в Мёнхенгладбахе. Категории B, BE, A, A1, A2, AM. Выбор инструктора, запись онлайн, Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
};

export function getCanonicalUrl(path: string, locale: Locale): string {
  const base = SITE_URL.replace(/\/$/, '');
  const pathClean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'de') {
    return pathClean === '/' ? base : `${base}${pathClean}`;
  }
  const localePath = pathClean === '/' ? `/${locale}` : `/${locale}${pathClean}`;
  return `${base}${localePath}`;
}
