import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { routing } from '@/i18n/routing';

const LOCALES = routing.locales as readonly string[];
const SUBPAGES = ['', 'impressum', 'datenschutz', 'agb'] as const;

function pathForLocale(locale: string, subpage: string): string {
  const base = SITE_URL.replace(/\/$/, '');
  if (locale === 'de') {
    return subpage ? `${base}/${subpage}` : base;
  }
  return subpage ? `${base}/${locale}/${subpage}` : `${base}/${locale}`;
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
  }

  return entries;
}
