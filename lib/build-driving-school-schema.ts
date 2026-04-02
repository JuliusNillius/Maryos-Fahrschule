import type { GoogleReviewQuote } from '@/lib/site-data';
import { SITE_URL } from '@/lib/seo';

const FALLBACK_REVIEWS = [
  {
    '@type': 'Review',
    author: { '@type': 'Person', name: 'Fahrschüler aus Mönchengladbach' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody:
      'Super Fahrschule in Mönchengladbach! Sehr geduldige Fahrlehrer, mehrsprachiger Unterricht und faire Preise. Klasse B in kurzer Zeit bestanden.',
    datePublished: '2025-12-01',
  },
  {
    '@type': 'Review',
    author: { '@type': 'Person', name: 'Fahrschülerin Mönchengladbach' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody:
      "Maryo's Fahrschule ist wirklich empfehlenswert. Anmeldung war einfach und schnell, der Unterricht auf Arabisch hat mir sehr geholfen.",
    datePublished: '2025-11-15',
  },
];

function normalizeReviewBody(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function quotesToSchemaReviews(quotes: GoogleReviewQuote[] | undefined) {
  const fromDb = (quotes ?? [])
    .filter((q) => normalizeReviewBody(q.text_de ?? '').length > 0)
    .slice(0, 5)
    .map((q) => {
      const body = normalizeReviewBody(q.text_de ?? '');
      const name = (q.author?.trim() || 'Fahrschüler:in').slice(0, 120);
      const r = Math.min(5, Math.max(1, Math.round(Number(q.rating) || 5)));
      return {
        '@type': 'Review',
        author: { '@type': 'Person', name },
        reviewRating: { '@type': 'Rating', ratingValue: String(r), bestRating: '5' },
        reviewBody: body,
      };
    });
  if (fromDb.length >= 2) return fromDb;
  return FALLBACK_REVIEWS;
}

/** DrivingSchool JSON-LD inkl. Review-Liste (CMS-Zitate oder Fallback). */
export function buildDrivingSchoolSchema(quotes?: GoogleReviewQuote[]) {
  const base = SITE_URL.replace(/\/$/, '');
  const googleBusinessUrl = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL?.trim();
  const sameAs = [
    ...(googleBusinessUrl ? [googleBusinessUrl] : []),
    'https://www.instagram.com/',
    'https://www.tiktok.com/',
    'https://www.facebook.com/',
    'https://www.youtube.com/',
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'DrivingSchool',
    '@id': `${base}/#organization`,
    name: "Maryo's Fahrschule GmbH",
    alternateName: "MARYO'S FAHRSCHULE",
    description: "Fahrschule in Mönchengladbach. Führerschein PKW Klasse B & BF17. FAHR IN DEIN GLÜCK.",
    url: base,
    logo: `${base}/logo.svg`,
    image: [`${base}/logo.png`],
    telephone: '+491784557528',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+491784557528',
        contactType: 'customer service',
        areaServed: 'DE',
        availableLanguage: ['de', 'en', 'tr', 'ar'],
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
      { '@type': 'AdministrativeArea', name: 'Mönchengladbach' },
      { '@type': 'PostalCode', postalCode: '41061', addressCountry: 'DE' },
      { '@type': 'PostalCode', postalCode: '41063', addressCountry: 'DE' },
      { '@type': 'PostalCode', postalCode: '41236', addressCountry: 'DE' },
    ],
    geo: { '@type': 'GeoCoordinates', latitude: 51.1952, longitude: 6.4417 },
    ...(googleBusinessUrl ? { hasMap: googleBusinessUrl } : {}),
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
    review: quotesToSchemaReviews(quotes),
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Apple Pay, Google Pay, Sofort, Klarna, Visa, Mastercard',
    foundingDate: '2025',
    legalName: "Maryo's Fahrschule GmbH",
    taxID: 'HRB 23787 Mönchengladbach',
    owner: { '@type': 'Person', name: 'Yaako Maryo Asoo' },
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
    sameAs,
    potentialAction: {
      '@type': 'CommunicateAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://wa.me/491784557528',
        actionPlatform: 'https://schema.org/WhatsAppAction',
      },
      expectsAcceptanceOf: { '@type': 'Offer', description: 'WhatsApp Kontakt' },
    },
  };
}
