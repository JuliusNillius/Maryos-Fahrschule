import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import RegistrationForm from '@/components/sections/RegistrationForm';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import { staticPageMeta } from '@/lib/seo-static-pages';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ ref?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const m = staticPageMeta('anmelden', l);
  return buildPageMetadata({ locale: l, path: '/anmelden', title: m.title, description: m.description });
}

export default async function AnmeldenPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const initialRefCode = resolvedSearchParams.ref?.trim() ?? '';

  return (
    <main className="min-h-screen bg-bg pb-0 text-text">
      <div className="pt-20">
        <RegistrationForm instructors={siteData.instructors} initialRefCode={initialRefCode} />
      </div>
      <Contact contact={siteData.settings.contact} social={siteData.settings.social} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
