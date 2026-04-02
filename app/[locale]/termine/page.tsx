import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import BookingCalendar from '@/components/sections/BookingCalendar';
import { buildPageMetadata, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const TERMINE_META: Record<string, { title: string; description: string }> = {
  de: {
    title: "Fahrstunde & Theorie-Termin anfragen | Maryo's Fahrschule Mönchengladbach",
    description:
      "Wunschtermin für erste Fahrstunde oder Theorie bei Maryo's Fahrschule in Mönchengladbach anfragen. Wir melden uns zur Bestätigung.",
  },
  en: {
    title: "Request a driving or theory slot | Mary's Driving School Mönchengladbach",
    description:
      "Request your preferred date for a first lesson or theory session at Mary's Driving School in Mönchengladbach. We will confirm with you.",
  },
  tr: {
    title: "Direksiyon veya teori randevusu | Maryo's Sürücü Kursu Mönchengladbach",
    description:
      "Mönchengladbach'taki Maryo's için ilk ders veya teori için tarih talep edin. Onay için size döneriz.",
  },
  ar: {
    title: 'طلب موعد قيادة أو نظري | مدرسة ماريو مونشنغلادباخ',
    description:
      'اطلب تاريخك المفضل لأول حصة قيادة أو نظري في مدرسة ماريو بمونشنغلادباخ. سنعود إليك للتأكيد.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const m = TERMINE_META[locale] ?? TERMINE_META.de;
  return buildPageMetadata({ locale: l, path: '/termine', title: m.title, description: m.description });
}

export default async function TerminePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-text md:pb-8">
      <BookingCalendar />
    </main>
  );
}
