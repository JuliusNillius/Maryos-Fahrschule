import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import PriceCalculator from '@/components/sections/PriceCalculator';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

type Props = { params: Promise<{ locale: string }> };

export default async function PreisePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <div className="pt-20">
        <PriceCalculator />
      </div>
      <Contact contact={siteData.settings.contact} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
