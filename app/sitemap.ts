import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import { getPosts } from '@/lib/sanity-blog';

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
  'intensivkurs',
  'automatik-fuehrerschein',
  'fahrschule-rheydt',
  'bf17-begleitetes-fahren',
] as const;

const FUEHRERSCHEIN_KLASSEN = ['b', 'bf17'] as const;

function pathForLocale(locale: string, subpage: string): string {
  const base = SITE_URL.replace(/\/$/, '');
  const suffix = subpage ? `/${subpage}` : '';
  return `${base}/${locale}${suffix}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const posts = await getPosts();

  for (const locale of LOCALES) {
    for (const subpage of SUBPAGES) {
      entries.push({
        url: pathForLocale(locale, subpage),
        lastModified: now,
        changeFrequency: subpage === '' ? ('weekly' as const) : ('monthly' as const),
        priority:
          subpage === ''
            ? 1
            : ['intensivkurs', 'automatik-fuehrerschein', 'fahrschule-rheydt', 'bf17-begleitetes-fahren'].includes(
                  subpage,
                )
              ? 0.85
              : 0.7,
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

    for (const post of posts) {
      const slug = typeof post.slug === 'string' ? post.slug.trim() : '';
      if (!slug) continue;
      const lastMod =
        post.publishedAt && !Number.isNaN(Date.parse(post.publishedAt))
          ? new Date(post.publishedAt)
          : now;
      entries.push({
        url: pathForLocale(locale, `blog/${slug}`),
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.65,
      });
    }
  }

  return entries;
}
