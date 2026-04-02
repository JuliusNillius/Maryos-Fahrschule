/** Statisches DrivingSchool-JSON-LD für alle öffentlichen Locale-Routen. */
export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DrivingSchool',
    name: "Maryo's Fahrschule",
    alternateName: ['Maryos Fahrschule', 'Maryos Fahrschule Mönchengladbach', 'Fahrschule Rheydt'],
    legalName: 'Maryos Fahrschule GmbH',
    description:
      'Fahrschule in Mönchengladbach am Bahnhof Rheydt (Bahnhofstraße 25): PKW-Führerschein Klasse B, BF17, B197 (Automatik-Prüfung mit Schaltkompetenz), BE und Intensivkurs. Mehrsprachige Ausbildung (Deutsch, Englisch, Türkisch, Arabisch). Motto: Fahr in dein Glück.',
    url: 'https://www.maryosfahrschule.de',
    logo: 'https://www.maryosfahrschule.de/logo.png',
    telephone: '+491784557528',
    email: 'info@maryosfahrschule.de',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bahnhofstraße 25',
      addressLocality: 'Mönchengladbach',
      postalCode: '41236',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.1775,
      longitude: 6.4525,
    },
    knowsLanguage: ['de', 'en', 'tr', 'ar'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '12:00',
        closes: '18:00',
      },
    ],
    priceRange: '€€',
    paymentAccepted: 'Cash, Credit Card, Apple Pay',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '20',
      bestRating: '5',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Führerschein-Klassen',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Führerschein Klasse B',
            description: 'PKW-Führerschein Klasse B in Mönchengladbach und Rheydt – praktische und theoretische Ausbildung',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'BF17 Begleitetes Fahren',
            description: 'BF17 begleitetes Fahren ab 17 in Mönchengladbach – Führerschein mit Begleitperson',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'B197 (Automatik mit Schaltkompetenz)',
            description: 'B197-Führerschein in Mönchengladbach – Automatikprüfung inkl. Schaltwissen',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'BE Anhängerführerschein',
            description: 'BE-Führerschein mit Anhänger in Mönchengladbach – Aufbau auf Klasse B',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Intensivkurs Führerschein',
            description: 'Intensivkurs Fahrschule Mönchengladbach – zügige Ausbildung bis zur Prüfung',
          },
        },
      ],
    },
    areaServed: [
      { '@type': 'City', name: 'Mönchengladbach' },
      { '@type': 'Place', name: 'Rheydt' },
      { '@type': 'Place', name: 'Odenkirchen' },
      { '@type': 'Place', name: 'Wickrath' },
      { '@type': 'Place', name: 'Giesenkirchen' },
    ],
    sameAs: ['https://www.instagram.com/maryosfahrschule'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
