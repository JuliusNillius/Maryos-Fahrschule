import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import Fleet from '@/components/sections/Fleet';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import { staticPageMeta } from '@/lib/seo-static-pages';

type Props = { params: Promise<{ locale: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const m = staticPageMeta('flotte', l);
  return buildPageMetadata({ locale: l, path: '/flotte', title: m.title, description: m.description });
}

export default async function FlottePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <div className="pt-20">
        <Fleet vehicles={siteData.fleet} sectionId="flotte" />
      </div>
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
