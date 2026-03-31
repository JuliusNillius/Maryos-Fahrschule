import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AppShell from '@/components/layout/AppShell';
import LocaleHtmlAttrs from '@/components/layout/LocaleHtmlAttrs';
import PageTransition from '@/components/layout/PageTransition';
import { METADATA, getCanonicalUrl, type Locale } from '@/lib/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Nur gültige Locales erlauben – verhindert, dass /backoffice von [locale] abgefangen wird (404). */
export const dynamicParams = false;

const LOCALES = routing.locales as readonly string[];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) return {};
  const meta = METADATA[locale as Locale];
  const canonical = getCanonicalUrl('/', locale as Locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maryos-fahrschule.de';
  const ogImage = `${base}/logo.png`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.openGraphTitle ?? meta.title,
      description: meta.openGraphDescription ?? meta.description,
      url: canonical,
      siteName: "Maryo's Fahrschule",
      locale: locale === 'de' ? 'de_DE' : locale === 'tr' ? 'tr_TR' : locale === 'ar' ? 'ar_SA' : locale,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Maryo's Fahrschule" }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale as 'de' | 'tr' | 'ar');
  const messages = await getMessages();
  const isRtl = locale === 'ar';

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlAttrs locale={locale} />
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'rtl' : ''}>
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>
      </div>
    </NextIntlClientProvider>
  );
}
