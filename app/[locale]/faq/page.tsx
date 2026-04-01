import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import Reviews from '@/components/sections/Reviews';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import FaqJsonLd from '@/components/layout/FaqJsonLd';
import { getCanonicalUrl, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const canonical = getCanonicalUrl('/faq', l);
  const t = await getTranslations({ locale, namespace: 'faqPage' });
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

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <FaqJsonLd faq={siteData.faq} locale={locale} />
      <div className="pt-20">
        <Reviews stats={siteData.settings.stats} quotes={siteData.settings.google_review_quotes} />
        <FAQ faq={siteData.faq} locale={locale} variant="page" />
      </div>
      <Contact contact={siteData.settings.contact} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
