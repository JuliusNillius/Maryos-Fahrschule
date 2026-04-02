import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import InstructorQuiz from '@/components/sections/InstructorQuiz';
import Instructors from '@/components/sections/Instructors';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import InstructorsJsonLd from '@/components/layout/InstructorsJsonLd';
import { buildPageMetadata, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const t = await getTranslations({ locale, namespace: 'lehrerPage' });
  return buildPageMetadata({
    locale: l,
    path: '/lehrer',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function LehrerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const t = await getTranslations({ locale, namespace: 'lehrerPage' });

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <InstructorsJsonLd instructors={siteData.instructors} />
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 lg:px-8">
          <h1 className="text-center font-heading text-2xl font-bold italic uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('h1')}
          </h1>
        </div>
        <InstructorQuiz instructors={siteData.instructors} />
        <Instructors instructors={siteData.instructors} />
      </div>
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
