import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSiteData } from '@/lib/site-data';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { PRICING_ERSTE_HILFE_EUR } from '@/lib/pricing';
import { buildPageMetadata, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const t = await getTranslations({ locale: locale as string, namespace: 'ersteHilfePage' });
  return buildPageMetadata({
    locale: l,
    path: '/erste-hilfe',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function ErsteHilfePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: locale as string, namespace: 'ersteHilfePage' });
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <div className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-text-muted">{t('kicker')}</p>
        <h1 className="mt-2 font-heading text-4xl font-bold uppercase italic text-white md:text-5xl">
          {t('heading')}
        </h1>
        <p className="mt-2 font-display text-3xl font-bold text-green-primary md:text-4xl">
          {t('priceLine', { price: PRICING_ERSTE_HILFE_EUR })}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-text-muted md:text-base">{t('intro')}</p>
        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-text-muted">
          {t('notInLicensePackage')}
        </p>
        <ul className="mt-8 space-y-3 text-sm text-text-muted md:text-base">
          <li className="flex gap-2">
            <span className="text-green-primary">✓</span>
            {t('bullet1')}
          </li>
          <li className="flex gap-2">
            <span className="text-green-primary">✓</span>
            {t('bullet2')}
          </li>
          <li className="flex gap-2">
            <span className="text-green-primary">✓</span>
            {t('bullet3')}
          </li>
        </ul>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/termine" className="btn-primary inline-flex justify-center py-4 text-center" data-cta>
            {t('ctaTermin')}
          </Link>
          <Link
            href="/preise"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 font-body text-sm text-white transition-colors hover:border-green-primary/40"
          >
            {t('ctaPrices')}
          </Link>
        </div>
      </div>
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
