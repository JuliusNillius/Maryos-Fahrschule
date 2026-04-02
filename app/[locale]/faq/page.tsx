import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import Reviews from '@/components/sections/Reviews';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import FaqJsonLd from '@/components/layout/FaqJsonLd';
import { buildPageMetadata, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const t = await getTranslations({ locale, namespace: 'faqPage' });
  const messages = await getMessages({ locale });
  const faqPage = messages.faqPage as {
    metaKeywords?: string[];
  };
  const keywords = Array.isArray(faqPage.metaKeywords) ? faqPage.metaKeywords : undefined;
  const title = t('metaTitle');
  const description = t('metaDescription');
  return {
    ...buildPageMetadata({ locale: l, path: '/faq', title, description }),
    ...(keywords?.length ? { keywords } : {}),
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
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
