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
      path: '/bf17-begleitetes-fahren',
      title: 'BF17 Mönchengladbach – Begleitetes Fahren | Maryos Fahrschule',
      description:
        'BF17 Begleitetes Fahren in Mönchengladbach ✓ Führerschein mit 17 ✓ Maryos Fahrschule ✓ Günstig & professionell. Info: 0178 4557528',
    });
  }
  return buildPageMetadata({
    locale: l,
    path: '/bf17-begleitetes-fahren',
    title: 'BF17 accompanied driving Mönchengladbach | Maryos',
    description: 'Licence at 17 with BF17 in Mönchengladbach. Professional training. 0178 4557528.',
  });
}

export default async function Bf17BegleitetesFahrenPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <div className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold uppercase italic text-white md:text-5xl">
          BF17 – Begleitetes Fahren in Mönchengladbach
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-text-muted md:text-base">
          Mit 17 schon mobil: Beim begleiteten Fahren (BF17) übst du mit einer festgelegten Begleitperson – wir bereiten
          dich in der Fahrschule strukturiert darauf vor und begleiten dich bis zur Prüfung.
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
        path="/bf17-begleitetes-fahren"
        name="BF17 Begleitetes Fahren Mönchengladbach"
        description="BF17 begleitetes Fahren – Ausbildung bei Maryos Fahrschule in Mönchengladbach."
      />
    </main>
  );
}
