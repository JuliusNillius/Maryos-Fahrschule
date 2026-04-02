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
      path: '/fahrschule-rheydt',
      title: 'Fahrschule Rheydt | Maryos – Deine Fahrschule in Mönchengladbach Rheydt',
      description:
        'Fahrschule in Rheydt, Mönchengladbach ✓ Bahnhofstraße 25 ✓ Klasse B, BF17, Automatik ✓ Maryos Fahrschule. Jetzt anmelden: 0178 4557528',
    });
  }
  return buildPageMetadata({
    locale: l,
    path: '/fahrschule-rheydt',
    title: 'Driving school Rheydt, Mönchengladbach | Maryos',
    description: 'Driving lessons in Rheydt at Bahnhofstraße 25. Classes B, BF17, automatic. 0178 4557528.',
  });
}

export default async function FahrschuleRheydtPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <div className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold uppercase italic text-white md:text-5xl">
          Fahrschule Rheydt – Mönchengladbach
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-text-muted md:text-base">
          Direkt am Bahnhof Rheydt, Bahnhofstraße 25: Maryos Fahrschule ist für dich da – mit Klasse B, BF17,
          Automatik und persönlicher Betreuung. Komm vorbei oder melde dich online an.
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
        path="/fahrschule-rheydt"
        name="Fahrschule Rheydt Mönchengladbach"
        description="Fahrschule am Bahnhof Rheydt, Bahnhofstraße 25 – Führerschein Klasse B, BF17 und Automatik."
      />
    </main>
  );
}
