import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import PriceCalculator from '@/components/sections/PriceCalculator';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { getCanonicalUrl, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const canonical = getCanonicalUrl('/preise', l);
  const t = await getTranslations({ locale, namespace: 'preisePage' });
  const title = t('metaTitle');
  const description = t('metaDescription');
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Maryo's Fahrschule",
      type: 'website',
    },
  };
}

export default async function PreisePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const t = await getTranslations({ locale, namespace: 'preisePage' });

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <div className="pt-20">
        <section className="border-b border-[rgba(93,196,34,0.12)] bg-bg px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-primary">{t('kicker')}</p>
            <h1 className="mt-3 font-heading text-3xl font-bold italic uppercase tracking-tight text-white md:text-4xl">
              {t('heading')}
            </h1>
            <p className="mt-4 font-body text-sm leading-relaxed text-text-muted md:text-base">{t('intro1')}</p>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-muted md:text-base">{t('intro2')}</p>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-muted md:text-base">{t('intro3')}</p>
          </div>
        </section>
        <PriceCalculator />
      </div>
      <Contact contact={siteData.settings.contact} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
