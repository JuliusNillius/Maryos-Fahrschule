import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const KLASSEN = ['B', 'BE', 'A', 'A2', 'A1', 'AM'] as const;

type Props = {
  params: Promise<{ locale: string; klasse: string }>;
};

export function generateStaticParams() {
  return KLASSEN.map((klasse) => ({ klasse }));
}

export default async function FuehrerscheinKlassePage({ params }: Props) {
  const { locale, klasse } = await params;
  setRequestLocale(locale);
  const upper = klasse.toUpperCase();
  if (!KLASSEN.includes(upper as (typeof KLASSEN)[number])) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-16 text-text">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-4xl font-bold uppercase italic text-white">
          Klasse {upper}
        </h1>
        <p className="mt-4 text-text-muted">
          Detailseite für Führerscheinklasse {upper}. Content aus Spec §14.
        </p>
        <Link
          href={locale === 'de' ? '/' : `/${locale}`}
          className="mt-6 inline-block text-green-500 underline"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
