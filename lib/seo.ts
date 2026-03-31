/**
 * SEO constants and metadata per locale.
 * Base URL: use NEXT_PUBLIC_SITE_URL in production.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maryos-fahrschule.de';

export const DEFAULT_TITLE = "Maryo's Fahrschule | Mönchengladbach | PKW B & BF17";
export const DEFAULT_DESCRIPTION =
  "Fahrschule in Mönchengladbach. Führerschein Klasse B & BF17 (PKW). Lehrer wählen, online anmelden, Apple Pay. 5.0 ★ Google. 0178 4557528";

export type Locale = 'de' | 'tr' | 'ar';

export const METADATA: Record<
  Locale,
  { title: string; description: string; openGraphTitle?: string; openGraphDescription?: string }
> = {
  de: {
    title: "Maryo's Fahrschule | Mönchengladbach | PKW B & BF17",
    description:
      "Fahrschule in Mönchengladbach. Führerschein Klasse B & BF17 (PKW). Lehrer wählen, online anmelden, Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
  tr: {
    title: "Maryo's Fahrschule | Mönchengladbach | PKW B & BF17",
    description:
      "Mönchengladbach'da sürücü kursu. Sadece otomobil B ve BF17. Öğretmen seçin, online kayıt, Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
  ar: {
    title: "مدرسة ماريو للقيادة | مونشنغلادباخ | سيارة B و BF17",
    description:
      "مدرسة قيادة في مونشنغلادباخ. رخصة سيارة B و BF17 فقط. اختر معلمك، سجّل أونلاين، Apple Pay. 5.0 ★ Google. 0178 4557528",
  },
};

/** Canonical-URL mit Locale-Prefix (/de, /tr, /ar) — entspricht next-intl `localePrefix: 'always'`. */
export function getCanonicalUrl(path: string, locale: Locale): string {
  const base = SITE_URL.replace(/\/$/, '');
  const pathClean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${pathClean}`;
}
