import { SITE_URL } from '@/lib/seo';

/**
 * JSON-LD LocalBusiness / DrivingSchool schema for Maryo's Fahrschule.
 * Rendered in root layout so it appears on every page.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DrivingSchool',
  '@id': `${SITE_URL}/#organization`,
  name: "Maryo's Fahrschule GmbH",
  alternateName: "MARYO'S FAHRSCHULE",
  description: "Fahrschule in Mönchengladbach. Führerschein PKW Klasse B & BF17. FAHR IN DEIN GLÜCK.",
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/$/, '')}/logo.svg`,
  image: [`${SITE_URL.replace(/\/$/, '')}/logo.png`],
  telephone: '+491784557528',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+491784557528',
      contactType: 'customer service',
      areaServed: 'DE',
      availableLanguage: ['de', 'tr', 'ar'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bahnhofstraße 25',
    postalCode: '41236',
    addressLocality: 'Mönchengladbach',
    addressCountry: 'DE',
  },
  areaServed: [
    {
      '@type': 'AdministrativeArea',
      name: 'Mönchengladbach',
    },
    {
      '@type': 'PostalCode',
      postalCode: '41061',
      addressCountry: 'DE',
    },
    {
      '@type': 'PostalCode',
      postalCode: '41063',
      addressCountry: 'DE',
    },
    {
      '@type': 'PostalCode',
      postalCode: '41236',
      addressCountry: 'DE',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.1952,
    longitude: 6.4417,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '12:00',
      closes: '18:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '18',
  },
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Apple Pay, Google Pay, Sofort, Klarna, Visa, Mastercard',
  foundingDate: '2025',
  legalName: "Maryo's Fahrschule GmbH",
  taxID: 'HRB 23787 Mönchengladbach',
  owner: {
    '@type': 'Person',
    name: 'Yaako Maryo Asoo',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Führerschein-Angebote',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Führerschein Klasse B',
          serviceType: 'Driving lessons (Class B)',
          areaServed: 'Mönchengladbach',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Begleitetes Fahren (BF17)',
          serviceType: 'Driving lessons (BF17)',
          areaServed: 'Mönchengladbach',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'B197 (Automatikprüfung mit Schaltkompetenz)',
          serviceType: 'Driving lessons (B197)',
          areaServed: 'Mönchengladbach',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'BE (Anhängerführerschein)',
          serviceType: 'Driving lessons (Class BE)',
          areaServed: 'Mönchengladbach',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Erste-Hilfe-Kurs (Führerschein)',
          serviceType: 'First aid course for driver licensing',
          areaServed: 'Mönchengladbach',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Beratung zur Kostenübernahme / Förderung',
          serviceType: 'Consultation',
          areaServed: 'Mönchengladbach',
        },
      },
    ],
  },
  sameAs: [
    'https://www.instagram.com/',
    'https://www.tiktok.com/',
    'https://www.facebook.com/',
    'https://www.youtube.com/',
  ],
  potentialAction: {
    '@type': 'CommunicateAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://wa.me/491784557528',
      actionPlatform: 'https://schema.org/WhatsAppAction',
    },
    expectsAcceptanceOf: {
      '@type': 'Offer',
      description: 'WhatsApp Kontakt',
    },
  },
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
