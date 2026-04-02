import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getSiteData } from '@/lib/site-data';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import { lehrerDetailMeta } from '@/lib/seo-static-pages';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const l = (locale as Locale) || 'de';
  let displayName = id.replace(/-/g, ' ');
  try {
    const data = await getSiteData();
    const inst = data.instructors.find((i) => i.id === id);
    if (inst?.name?.trim()) displayName = inst.name.trim();
  } catch {
    /* z. B. Build ohne Supabase */
  }
  const m = lehrerDetailMeta(l, displayName);
  return buildPageMetadata({
    locale: l,
    path: `/lehrer/${id}`,
    title: m.title,
    description: m.description,
  });
}

export default async function LehrerPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 pt-16 pb-16 text-text max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom)+4rem)]">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-3xl font-bold uppercase italic text-white">
          Lehrer: {id}
        </h1>
        <p className="mt-4 text-text-muted">
          Instructor-Detail + Buchung (Cal.com). Wird in Schritt 19 verknüpft.
        </p>
        <Link
          href={locale === 'de' ? '/' : `/${locale}`}
          className="mt-6 inline-block text-green-500 underline"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
