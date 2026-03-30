import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 py-16 text-text">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-3xl font-bold uppercase italic text-white">
          Schüler-Dashboard
        </h1>
        <p className="mt-4 text-text-muted">
          Geschützter Bereich (Supabase Auth). Wird in Schritt 30 umgesetzt.
        </p>
      </div>
    </main>
  );
}
