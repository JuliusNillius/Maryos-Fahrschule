import { SITE_URL } from '@/lib/seo';

type Props = {
  name: string;
  description: string;
  path: string;
  locale?: string;
};

export default function ServiceJsonLd({ name, description, path, locale = 'de' }: Props) {
  const base = SITE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = `${base}/${locale}${p}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'DrivingSchool',
      name: "Maryo's Fahrschule",
      url: base,
    },
    areaServed: { '@type': 'City', name: 'Mönchengladbach' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
