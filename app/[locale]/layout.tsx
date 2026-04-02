import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AppShell from '@/components/layout/AppShell';
import LocaleHtmlAttrs from '@/components/layout/LocaleHtmlAttrs';
import PageTransition from '@/components/layout/PageTransition';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Nur gültige Locales erlauben – verhindert, dass /backoffice von [locale] abgefangen wird (404). */
export const dynamicParams = false;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const isRtl = locale === 'ar';

  return (
    <NextIntlClientProvider messages={messages}>
      <LocalBusinessSchema />
      <LocaleHtmlAttrs locale={locale} />
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'rtl' : ''}>
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>
      </div>
    </NextIntlClientProvider>
  );
}
