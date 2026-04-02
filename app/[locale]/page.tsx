import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import HomeSwitcherOffer from '@/components/sections/HomeSwitcherOffer';
import Referral from '@/components/sections/Referral';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import HomeLocalIntro from '@/components/sections/HomeLocalIntro';
import { METADATA, buildPageMetadata, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

/** Suchbegriffe inkl. Long-Tail & Synonyme (z. B. Automatik-Suche → B197). */
const DE_HOME_KEYWORDS = [
  'Fahrschule Mönchengladbach',
  'Führerschein Mönchengladbach',
  'Fahrschule Rheydt',
  'Führerschein Rheydt',
  'Fahrschule Bahnhofstraße 25',
  'Führerschein Klasse B Mönchengladbach',
  'BF17 Mönchengladbach',
  'Begleitetes Fahren Mönchengladbach',
  'B197 Mönchengladbach',
  'Automatik Führerschein Mönchengladbach',
  'PKW Führerschein',
  'Führerschein BE Mönchengladbach',
  'Anhängerführerschein BE',
  'Intensivkurs Fahrschule Mönchengladbach',
  'Fahrschule Odenkirchen',
  'Fahrschule Wickrath',
  'Fahrschule Giesenkirchen',
  'Online Führerschein anmelden',
  'Fahr in dein Glück',
  "Maryos Fahrschule",
  "Maryo's Fahrschule GmbH",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  if (!(['de', 'en', 'tr', 'ar'] as const).includes(l)) {
    return {};
  }

  if (l === 'de') {
    return buildPageMetadata({
      locale: 'de',
      path: '/',
      title: 'Fahrschule Mönchengladbach Rheydt | Maryos – Führerschein B, BF17, B197 & BE',
      description:
        'Führerschein Mönchengladbach: B, BF17, B197 (Automatik-Prüfung), BE, Intensivkurs. Fahrschule Bahnhof Rheydt, 65 €/h, DE/EN/TR/AR, online anmelden, ★5,0. Fahr in dein Glück · 0178 4557528',
      keywords: DE_HOME_KEYWORDS,
      openGraphTitle: 'Maryos – Fahrschule Mönchengladbach & Rheydt | Fahr in dein Glück',
      openGraphDescription:
        'PKW-Führerschein B, BF17, B197 & BE in Mönchengladbach (Bahnhof Rheydt). Intensivkurs, mehrsprachige Fahrlehrer:innen, transparente Preise, 5,0 Sterne bei Google.',
    });
  }

  const meta = METADATA[l];
  return buildPageMetadata({
    locale: l,
    path: '/',
    title: meta.title,
    description: meta.description,
    openGraphTitle: meta.openGraphTitle,
    openGraphDescription: meta.openGraphDescription,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <Hero stats={siteData.settings.stats} />
      <HomeLocalIntro locale={locale} />
      <TrustBar />
      <HomeSwitcherOffer />
      <Referral />
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
