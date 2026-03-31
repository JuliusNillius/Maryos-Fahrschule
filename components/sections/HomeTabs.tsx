'use client';

import { useTranslations } from 'next-intl';
import type { PricingItem, FaqItem } from '@/lib/site-data';
import type { Instructor } from '@/lib/instructors';
import Classes from '@/components/sections/Classes';
import Fleet from '@/components/sections/Fleet';
import Pricing from '@/components/sections/Pricing';
import RegistrationForm from '@/components/sections/RegistrationForm';
import Reviews from '@/components/sections/Reviews';
import FAQ from '@/components/sections/FAQ';

import type { FleetVehicle } from '@/lib/fleet';

type HomeTabsProps = {
  instructors: Instructor[];
  pricing: PricingItem[];
  faq: FaqItem[];
  fleet: FleetVehicle[];
  locale: string;
};

/**
 * Alle Startseiten-Inhalte als eine lange Sektionen-Seite (keine zweite Tab-Leiste).
 * Erreichbar über die einzige Navbar per Anker #flotte, #fuehrerscheine, #ablauf, #preise, #anmelden, #faq.
 */
export default function HomeTabs({ instructors, pricing, faq, fleet, locale }: HomeTabsProps) {
  const t = useTranslations('homeTabs');

  return (
    <div className="section-divider bg-bg" aria-label={t('ariaLabel')}>
      {/* Flotte */}
      <Fleet vehicles={fleet} sectionId="flotte" />
      {/* Preise = Führerscheinklassen + Paketpreise */}
      <section id="preise" className="section-divider scroll-mt-20 bg-bg">
        <Classes embedded />
        <Pricing pricing={pricing} embedded />
      </section>
      {/* Anmelden (RegistrationForm hat id="anmelden") */}
      <RegistrationForm instructors={instructors} />
      {/* Bewertungen & FAQ */}
      <div id="faq" className="scroll-mt-20">
        <Reviews />
        <FAQ faq={faq} locale={locale} />
      </div>
    </div>
  );
}
