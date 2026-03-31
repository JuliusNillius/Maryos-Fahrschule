import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import BookingCalendar from '@/components/sections/BookingCalendar';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    de: 'Termin anfragen',
    tr: 'Randevu',
    ar: 'طلب موعد',
    en: 'Request appointment',
  };
  return { title: titles[locale] ?? titles.de };
}

export default async function TerminePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg pb-24 text-text md:pb-8">
      <BookingCalendar />
    </main>
  );
}
