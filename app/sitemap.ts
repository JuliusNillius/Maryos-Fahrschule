import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { routing } from '@/i18n/routing';

const LOCALES = routing.locales as readonly string[];
const SUBPAGES = [
  '',
  'anmelden',
  'preise',
  'termine',
  'faq',
  'team',
  'lehrer',
  'flotte',
  'blog',
  'erste-hilfe',
  'impressum',
  'datenschutz',
  'agb',
] as const;

const FUEHRERSCHEIN_KLASSEN = ['b', 'bf17'] as const;

function pathForLocale(locale: string, subpage: string): string {
  const base = SITE_URL.replace(/\/$/, '');
  const suffix = subpage ? `/${subpage}` : '';
  return `${base}/${locale}${suffix}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const subpage of SUBPAGES) {
      entries.push({
        url: pathForLocale(locale, subpage),
        lastModified: now,
        changeFrequency: subpage === '' ? ('weekly' as const) : ('monthly' as const),
        priority: subpage === '' ? 1 : 0.7,
      });
    }

    for (const klasse of FUEHRERSCHEIN_KLASSEN) {
      entries.push({
        url: pathForLocale(locale, `fuehrerschein/${klasse}`),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    }
  }

  return entries;
}
