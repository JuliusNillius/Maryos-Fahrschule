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

const sectionClass = 'mt-8';
const headingClass =
  'font-heading text-lg font-bold italic uppercase text-green-primary mt-6 first:mt-0';
const pClass = 'font-body text-sm leading-relaxed text-text-muted mt-2';

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
  const email = contact.email?.trim();

  return (
    <main className="min-h-screen bg-bg px-4 py-20 text-text">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold italic uppercase text-green-primary">
          Impressum
        </h1>
        <p className="mt-6 font-body text-text-muted">
          <strong className="font-medium text-text">{company}</strong>
          <br />
          {street}
          <br />
          {zip} {city}
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>Vertreten durch</h2>
          <p className={pClass}>
            Geschäftsführung: {owner}
            <br />
            Handelsregister: {register}
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Kontakt</h2>
          <p className={pClass}>
            Telefon: {phone}
            {email ? (
              <>
                <br />
                E-Mail:{' '}
                <a href={`mailto:${email}`} className="text-green-primary underline">
                  {email}
                </a>
              </>
            ) : null}
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Online-Streitbeilegung und Verbraucherschlichtung</h2>
          <p className={pClass}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-primary underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
          <p className={pClass}>
            Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Haftung für Inhalte</h2>
          <p className={pClass}>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
          <p className={pClass}>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben unberührt. Eine diesbezügliche Haftung ist erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
            entsprechender Rechtsverletzungen entfernen wir diese Inhalte umgehend.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Haftung für Links</h2>
          <p className={pClass}>
            Unser Angebot kann Links zu externen Websites Dritter enthalten, auf deren Inhalte wir
            keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren dabei
            nicht erkennbar.
          </p>
          <p className={pClass}>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
            Rechtsverletzungen entfernen wir derartige Links umgehend.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Urheberrecht</h2>
          <p className={pClass}>
            Die durch uns erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
            Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
            außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der
            jeweils Berechtigten. Downloads und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet.
          </p>
          <p className={pClass}>
            Soweit Inhalte auf dieser Seite nicht von uns erstellt wurden, werden die Urheberrechte
            Dritter beachtet und entsprechend gekennzeichnet. Sollten Sie dennoch auf eine
            Urheberrechtsverletzung aufmerksam werden, bitten wir um einen Hinweis; bei Bekanntwerden
            entfernen wir derartige Inhalte umgehend.
          </p>
        </section>

        <p className="mt-8 font-body text-xs text-text-muted">
          Stand: März 2026. Bitte pflegen Sie Firmen- und Kontaktdaten im Backoffice aktuell.
        </p>

        <Link href="/" className="btn-ghost mt-10 inline-block">
          ← Zur Startseite
        </Link>
      </div>
    </main>
  );
}
