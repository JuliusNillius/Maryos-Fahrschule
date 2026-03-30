import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSiteData } from '@/lib/site-data';

type Props = { params: Promise<{ locale: string }> };

const FALLBACK = {
  company: "Maryo's Fahrschule GmbH",
  street: 'Bahnhofstraße 25',
  zip: '41236',
  city: 'Mönchengladbach',
  register: 'HRB 23787 Mönchengladbach',
  owner: 'Yaako Maryo Asoo',
  phone: '0178 4557528',
};

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const imp = siteData.settings.impressum ?? {};
  const contact = siteData.settings.contact ?? {};
  const company = imp.company ?? FALLBACK.company;
  const street = imp.street ?? FALLBACK.street;
  const zip = imp.zip ?? FALLBACK.zip;
  const city = imp.city ?? FALLBACK.city;
  const register = imp.register ?? FALLBACK.register;
  const owner = imp.owner ?? FALLBACK.owner;
  const phone = contact.phone ?? FALLBACK.phone;

  return (
    <main className="min-h-screen bg-bg px-4 py-20 text-text">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold italic uppercase text-green-primary">
          Impressum
        </h1>
        <p className="mt-6 font-body text-text-muted">
          {company}
          <br />
          {street}
          <br />
          {zip} {city}
        </p>
        <p className="mt-4 font-body text-text-muted">
          Inhaber: {owner}
          <br />
          {register}
        </p>
        <p className="mt-4 font-body text-sm text-text-muted">
          Tel: {phone}
        </p>
        <Link href="/" className="btn-ghost mt-10 inline-block">
          ← Zur Startseite
        </Link>
      </div>
    </main>
  );
}
