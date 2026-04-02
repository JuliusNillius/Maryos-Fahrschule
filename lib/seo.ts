import type { Metadata } from 'next';

/**
 * SEO constants and metadata per locale.
 * Base URL: use NEXT_PUBLIC_SITE_URL in production (www-Variante als Standard).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maryosfahrschule.de';

export const DEFAULT_TITLE = "Maryo's Fahrschule Mönchengladbach | PKW B · BF17 · B197 · BE";
export const DEFAULT_DESCRIPTION =
  "Fahrschule Mönchengladbach Rheydt, Bahnhofstr. 25: Führerschein B, BF17, B197, BE, Intensivkurs. Fahr in dein Glück. Online anmelden, 65 €/Fahrstunde, mehrsprachig. Tel. 0178 4557528";

export type Locale = 'de' | 'en' | 'tr' | 'ar';

export const METADATA: Record<
  Locale,
  { title: string; description: string; openGraphTitle?: string; openGraphDescription?: string }
> = {
  de: {
    title: "Maryo's Fahrschule Mönchengladbach Rheydt | Führerschein B · BF17 · B197 · BE",
    description:
      "Fahrschule am Bahnhof Rheydt: PKW-Führerschein B, BF17, B197 (Automatik-Prüfung), BE, Intensivkurs. Motto Fahr in dein Glück. 65 €/Fahrstunde, DE/EN/TR/AR, online anmelden. 0178 4557528",
  },
  en: {
    title: "Maryo's Driving School Mönchengladbach | Car B · BF17 · B197 · BE",
    description:
      "Driving school in Mönchengladbach: car licence B, BF17, B197, BE. Clear prices, first aid, funding & FAQ. Lessons in German, English, Turkish & Arabic. 0178 4557528",
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

/** Canonical-URL mit Locale-Prefix (/de, /en, /tr, /ar) — entspricht next-intl `localePrefix: 'always'`. */
export function getCanonicalUrl(path: string, locale: Locale): string {
  const base = SITE_URL.replace(/\/$/, '');
  const pathClean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${pathClean}`;
}

const ROUTING_LOCALES: readonly Locale[] = ['de', 'en', 'tr', 'ar'];

/** hreflang-Alternates: Pfad ohne Locale, z. B. `''` für Startseite, `'preise'` für /de/preise */
export function alternateLanguageUrls(pathWithoutLocale: string): Record<string, string> {
  const base = SITE_URL.replace(/\/$/, '');
  const suffix =
    !pathWithoutLocale || pathWithoutLocale === '/'
      ? ''
      : pathWithoutLocale.startsWith('/')
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
  const out: Record<string, string> = {};
  for (const loc of ROUTING_LOCALES) {
    out[loc] = `${base}/${loc}${suffix}`;
  }
  out['x-default'] = `${base}/de${suffix}`;
  return out;
}

function ogLocaleFor(locale: Locale): string {
  if (locale === 'de') return 'de_DE';
  if (locale === 'en') return 'en_US';
  if (locale === 'tr') return 'tr_TR';
  return 'ar_SA';
}

/** Einheitliche Title/Description/Canonical/hreflang/OG/Twitter für Unterseiten. */
export function buildPageMetadata(opts: {
  locale: Locale;
  /** z. B. `'/'`, `'/lehrer'`, `'/preise'` */
  path: string;
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  keywords?: string[];
  robots?: Metadata['robots'];
}): Metadata {
  const pathNorm = opts.path === '' ? '/' : opts.path.startsWith('/') ? opts.path : `/${opts.path}`;
  const canonical = getCanonicalUrl(pathNorm, opts.locale);
  const base = SITE_URL.replace(/\/$/, '');
  const ogImage = `${base}/logo.png`;
  const subpath = pathNorm === '/' ? '' : pathNorm.replace(/^\//, '');
  const ogTitle = opts.openGraphTitle ?? opts.title;
  const ogDesc = opts.openGraphDescription ?? opts.description;
  return {
    title: opts.title,
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    ...(opts.robots !== undefined ? { robots: opts.robots } : {}),
    alternates: {
      canonical,
      languages: alternateLanguageUrls(subpath),
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      siteName: "Maryo's Fahrschule",
      locale: ogLocaleFor(opts.locale),
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Maryo's Fahrschule" }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
    },
  };
}

