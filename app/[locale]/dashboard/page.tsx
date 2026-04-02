import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import { staticPageMeta } from '@/lib/seo-static-pages';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const m = staticPageMeta('dashboard', l);
  return buildPageMetadata({
    locale: l,
    path: '/dashboard',
    title: m.title,
    description: m.description,
    robots: { index: false, follow: true },
  });
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 pt-16 pb-16 text-text max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom)+4rem)]">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-3xl font-bold uppercase italic text-white">
          Schüler-Dashboard
        </h1>
        <p className="mt-4 text-text-muted">
          Geschützter Bereich (Supabase Auth). Wird in Schritt 30 umgesetzt.
        </p>
      </div>
    </main>
  );
}
