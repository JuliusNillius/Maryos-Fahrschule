import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import Fleet from '@/components/sections/Fleet';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

type Props = { params: Promise<{ locale: string }> };

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function FlottePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <div className="pt-20">
        <Fleet vehicles={siteData.fleet} sectionId="flotte" />
      </div>
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
