import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSiteData } from '@/lib/site-data';
import Footer from '@/components/layout/Footer';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import ServiceJsonLd from '@/components/seo/ServiceJsonLd';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  if (l === 'de') {
    return buildPageMetadata({
      locale: 'de',
      path: '/intensivkurs',
      title: 'Intensivkurs Fahrschule Mönchengladbach | Maryos – Schnell zum Führerschein',
      description:
        'Intensivkurs in Mönchengladbach ✓ Schnell zum Führerschein ✓ Maryos Fahrschule ✓ Flexible Termine ✓ Erfahrene Fahrlehrer. Jetzt anmelden: 0178 4557528',
    });
  }
  return buildPageMetadata({
    locale: l,
    path: '/intensivkurs',
    title: 'Intensive driving course Mönchengladbach | Maryos',
    description: 'Fast-track driving lessons in Mönchengladbach. Flexible slots. Call 0178 4557528.',
  });
}

export default async function IntensivkursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <div className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold uppercase italic text-white md:text-5xl">
          Intensivkurs Fahrschule Mönchengladbach
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-text-muted md:text-base">
          Du willst zügig zum Führerschein? Unser Intensivkurs richtet sich an Fahrschüler:innen, die Theorie und
          Praxis fokussiert absolvieren möchten – mit erfahrenen Fahrlehrer:innen und Terminen, die zu deinem Alltag
          passen.
        </p>
        <div className="mt-10">
          <Link
            href="/anmelden"
            className="btn-primary inline-flex h-[52px] items-center justify-center px-8 text-base"
            data-cta
          >
            Jetzt anmelden
          </Link>
        </div>
      </div>
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <Footer
          contact={siteData.settings.contact}
          impressum={siteData.settings.impressum}
          social={siteData.settings.social}
        />
      </div>
      <ServiceJsonLd
        locale={locale}
        path="/intensivkurs"
        name="Intensivkurs Fahrschule Mönchengladbach"
        description="Schnell zum Führerschein mit flexiblem Intensivkurs bei Maryos Fahrschule in Mönchengladbach."
      />
    </main>
  );
}
