import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getSiteData } from '@/lib/site-data';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { getCanonicalUrl, type Locale } from '@/lib/seo';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, klasse } = await params;
  const upper = normalizeKlasse(klasse);
  if (!upper) return {};
  const l = (locale as Locale) || 'de';
  const path = `/fuehrerschein/${klasse.toLowerCase()}`;
  const canonical = getCanonicalUrl(path, l);
  const t = await getTranslations({ locale, namespace: 'fuehrerscheinPage' });
  const prefix = upper === 'B' ? 'b' : 'bf17';
  const title = t(`${prefix}MetaTitle`);
  const description = t(`${prefix}MetaDescription`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Maryo's Fahrschule",
      type: 'website',
    },
  };
}

export default async function FuehrerscheinKlassePage({ params }: Props) {
  const { locale, klasse } = await params;
  setRequestLocale(locale);
  const upper = normalizeKlasse(klasse);
  if (!upper) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'fuehrerscheinPage' });
  const p = upper === 'B' ? 'b' : 'bf17';
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <article className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-primary">{t(`${p}Kicker`)}</p>
        <h1 className="mt-3 font-heading text-4xl font-bold uppercase italic text-white md:text-5xl">{t(`${p}H1`)}</h1>
        <p className="mt-4 font-body text-base leading-relaxed text-text-muted md:text-lg">{t(`${p}Lead`)}</p>

        <div className="mt-10 space-y-8 font-body text-sm leading-relaxed text-text-muted md:text-base">
          <section>
            <h2 className="font-heading text-lg font-bold uppercase italic text-white md:text-xl">{t(`${p}H2Ausbildung`)}</h2>
            <p className="mt-3 whitespace-pre-line">{t(`${p}BodyAusbildung`)}</p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold uppercase italic text-white md:text-xl">{t(`${p}H2MG`)}</h2>
            <p className="mt-3 whitespace-pre-line">{t(`${p}BodyMG`)}</p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold uppercase italic text-white md:text-xl">{t(`${p}H2Weitere`)}</h2>
            <p className="mt-3 whitespace-pre-line">{t(`${p}BodyWeitere`)}</p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold uppercase italic text-white md:text-xl">{t(`${p}H2Preise`)}</h2>
            <p className="mt-3 whitespace-pre-line">{t(`${p}BodyPreise`)}</p>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/preise" className="btn-primary inline-flex justify-center px-6 py-3 text-center text-sm">
            {t('ctaPreise')}
          </Link>
          <Link
            href="/anmelden"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-body text-sm text-white transition-colors hover:border-green-primary/50"
          >
            {t('ctaAnmelden')}
          </Link>
          <Link
            href="/erste-hilfe"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-body text-sm text-white transition-colors hover:border-green-primary/50"
          >
            {t('ctaErsteHilfe')}
          </Link>
          <Link href="/faq" className="inline-flex items-center justify-center text-sm text-green-500 underline hover:text-green-400">
            {t('ctaFaq')}
          </Link>
        </div>
      </article>
      <Contact contact={siteData.settings.contact} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
