import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import PriceCalculator from '@/components/sections/PriceCalculator';
import Link from 'next/link';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { buildPageMetadata, type Locale } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const t = await getTranslations({ locale, namespace: 'preisePage' });
  return buildPageMetadata({
    locale: l,
    path: '/preise',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function PreisePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const t = await getTranslations({ locale, namespace: 'preisePage' });

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <div className="pt-20">
        <PriceCalculator />
        <section className="border-t border-[rgba(93,196,34,0.12)] bg-bg px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-green-primary/35 bg-[rgba(93,196,34,0.08)] p-5 md:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-green-primary/50 bg-green-primary/15 px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-green-primary">
                  {t('switcherOfferBadge')}
                </span>
                <h2 className="font-heading text-lg font-bold italic uppercase tracking-tight text-white md:text-xl">
                  {t('switcherOfferTitle')}
                </h2>
              </div>
              <p className="font-body text-sm leading-relaxed text-text-muted md:text-base">{t('switcherOfferBody')}</p>
              <p className="mt-4 font-body text-xs text-text-muted md:text-sm">{t('switcherOfferFaqHint')}</p>
              <Link
                href={`/${locale}/faq`}
                className="mt-2 inline-block font-body text-sm font-medium text-green-primary underline decoration-green-primary/40 underline-offset-2 hover:text-green-400"
              >
                {t('switcherOfferFaqLink')}
              </Link>
            </div>
          </div>
        </section>
        <section className="border-t border-[rgba(93,196,34,0.12)] bg-bg px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-primary">{t('kicker')}</p>
            <h1 className="mt-3 font-heading text-3xl font-bold italic uppercase tracking-tight text-white md:text-4xl">
              {t('heading')}
            </h1>
            <p className="mt-4 font-body text-sm leading-relaxed text-text-muted md:text-base">{t('intro1')}</p>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-muted md:text-base">{t('intro2')}</p>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-muted md:text-base">{t('intro3')}</p>
          </div>
        </section>
      </div>
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
