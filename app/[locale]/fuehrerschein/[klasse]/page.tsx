import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';

/** Nur Angebotsklassen; URLs kleingeschrieben (/b, /bf17). */
const KLASSEN_SLUG = ['b', 'bf17'] as const;

type Props = {
  params: Promise<{ locale: string; klasse: string }>;
};

export function generateStaticParams() {
  return KLASSEN_SLUG.map((klasse) => ({ klasse }));
}

function normalizeKlasse(slug: string): 'B' | 'BF17' | null {
  const u = slug.toUpperCase();
  if (u === 'B') return 'B';
  if (u === 'BF17') return 'BF17';
  return null;
}

export default async function FuehrerscheinKlassePage({ params }: Props) {
  const { locale, klasse } = await params;
  setRequestLocale(locale);
  const upper = normalizeKlasse(klasse);
  if (!upper) {
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
        <Link href="/" className="mt-6 inline-block text-green-500 underline">
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
