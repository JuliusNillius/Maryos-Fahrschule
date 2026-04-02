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
      path: '/automatik-fuehrerschein',
      title: 'Automatik Führerschein Mönchengladbach | Maryos Fahrschule',
      description:
        'Automatik Führerschein in Mönchengladbach ✓ Einfacher einsteigen ✓ Klasse B Automatik ✓ Maryos Fahrschule. Jetzt Platz sichern: 0178 4557528',
    });
  }
  return buildPageMetadata({
    locale: l,
    path: '/automatik-fuehrerschein',
    title: 'Automatic licence Mönchengladbach | Maryos',
    description: 'Class B automatic driving lessons in Mönchengladbach. Reserve your slot: 0178 4557528.',
  });
}

export default async function AutomatikFuehrerscheinPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <div className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold uppercase italic text-white md:text-5xl">
          Automatik Führerschein Mönchengladbach
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-text-muted md:text-base">
          Ohne Kupplung entspannter lernen: Der Automatik-Führerschein (Klasse B Automatik) ist ideal, wenn du dich auf
          Verkehr und Fahrzeugführung konzentrieren möchtest. Wir begleiten dich in Mönchengladbach Schritt für Schritt.
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
        path="/automatik-fuehrerschein"
        name="Automatik Führerschein Mönchengladbach"
        description="Automatik-Führerschein Klasse B bei Maryos Fahrschule in Mönchengladbach."
      />
    </main>
  );
}
