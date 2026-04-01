/**
 * SEO constants and metadata per locale.
 * Base URL: use NEXT_PUBLIC_SITE_URL in production.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maryosfahrschule.de';

export const DEFAULT_TITLE = "Maryo's Fahrschule Mönchengladbach | PKW B · BF17 · B197 · BE";
export const DEFAULT_DESCRIPTION =
  "Fahrschule Mönchengladbach (Bahnhofstraße): Führerschein PKW B, BF17, B197, BE. Online anmelden, Lehrer wählen, klare Preise. Tel. 0178 4557528";

export type Locale = 'de' | 'tr' | 'ar';

export const METADATA: Record<
  Locale,
  { title: string; description: string; openGraphTitle?: string; openGraphDescription?: string }
> = {
  de: {
    title: "Maryo's Fahrschule Mönchengladbach | PKW B · BF17 · B197 · BE",
    description:
      "Fahrschule Mönchengladbach: PKW-Führerschein B, BF17, B197, BE. Transparente Preise, Erste Hilfe, Förderung & FAQ auf der Website. 0178 4557528",
  },
  tr: {
    title: "Maryo's Sürücü Kursu Mönchengladbach | B · BF17 · B197 · BE",
    description:
      "Mönchengladbach'ta otomobil ehliyeti: B, BF17, B197, BE. Şeffaf fiyatlar, İlk Yardım, SSS ve online kayıt. 0178 4557528",
  },
  ar: {
    title: "مدرسة ماريو مونشنغلادباخ | سيارة B · BF17 · B197 · BE",
    description:
      "مدرسة قيادة في مونشنغلادباخ: رخصة سيارة B وBF17 وB197 وBE. أسعار واضحة، إسعافات أولية، أسئلة شائعة وتسجيل أونلاين. 0178 4557528",
  },
};

/** Canonical-URL mit Locale-Prefix (/de, /tr, /ar) — entspricht next-intl `localePrefix: 'always'`. */
export function getCanonicalUrl(path: string, locale: Locale): string {
  const base = SITE_URL.replace(/\/$/, '');
  const pathClean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${pathClean}`;
}
