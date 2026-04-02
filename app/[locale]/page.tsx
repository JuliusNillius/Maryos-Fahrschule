import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import HomeSwitcherOffer from '@/components/sections/HomeSwitcherOffer';
import Referral from '@/components/sections/Referral';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <Hero stats={siteData.settings.stats} />
      <TrustBar />
      <HomeSwitcherOffer />
      <Referral />
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
