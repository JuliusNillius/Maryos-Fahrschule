import { setRequestLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/site-data';
import RegistrationForm from '@/components/sections/RegistrationForm';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ ref?: string }>;
};

export default async function AnmeldenPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const initialRefCode = resolvedSearchParams.ref?.trim() ?? '';

  return (
    <main className="min-h-screen bg-bg pb-20 text-text md:pb-0">
      <div className="pt-20">
        <RegistrationForm instructors={siteData.instructors} initialRefCode={initialRefCode} />
      </div>
      <Contact contact={siteData.settings.contact} />
      <Footer contact={siteData.settings.contact} impressum={siteData.settings.impressum} social={siteData.settings.social} />
    </main>
  );
}
