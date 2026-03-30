import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function LehrerPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 py-16 text-text">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-3xl font-bold uppercase italic text-white">
          Lehrer: {id}
        </h1>
        <p className="mt-4 text-text-muted">
          Instructor-Detail + Buchung (Cal.com). Wird in Schritt 19 verknüpft.
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
