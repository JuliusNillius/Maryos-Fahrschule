import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSiteData } from '@/lib/site-data';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import { staticPageMeta } from '@/lib/seo-static-pages';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const m = staticPageMeta('datenschutz', l);
  return buildPageMetadata({ locale: l, path: '/datenschutz', title: m.title, description: m.description });
}

const FALLBACK = {
  company: "Maryo's Fahrschule GmbH",
  street: 'Bahnhofstraße 25',
  zip: '41236',
  city: 'Mönchengladbach',
  phone: '0178 4557528',
};

const sectionClass = 'mt-8';
const headingClass =
  'font-heading text-lg font-bold italic uppercase text-green-primary mt-6 first:mt-0';
const pClass = 'font-body text-sm leading-relaxed text-text-muted mt-2';
const ulClass = 'mt-2 list-disc pl-5 font-body text-sm leading-relaxed text-text-muted';

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteData = await getSiteData();
  const imp = siteData.settings.impressum ?? {};
  const contact = siteData.settings.contact ?? {};
  const company = imp.company ?? FALLBACK.company;
  const street = imp.street ?? FALLBACK.street;
  const zip = imp.zip ?? FALLBACK.zip;
  const city = imp.city ?? FALLBACK.city;
  const phone = contact.phone ?? FALLBACK.phone;
  const email = contact.email?.trim();
  const plausibleEnabled = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim());

  return (
    <main className="min-h-screen bg-bg px-4 pt-20 pb-20 text-text max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom)+5rem)]">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold italic uppercase text-green-primary">
          Datenschutzerklärung
        </h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
          Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir Sie
          gemäß Art. 13 und 14 DSGVO über die Verarbeitung bei Nutzung unserer Website und
          Online-Anmeldung bei {company}.
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Verantwortlicher</h2>
          <p className={pClass}>
            Verantwortlich für die Datenverarbeitung ist:
            <br />
            <br />
            {company}
            <br />
            {street}, {zip} {city}
            <br />
            Telefon: {phone}
            {email ? (
              <>
                <br />
                E-Mail:{' '}
                <a href={`mailto:${email}`} className="text-green-primary underline">
                  {email}
                </a>
              </>
            ) : (
              <>
                <br />
                (E-Mail-Adresse siehe ggf. Kontaktbereich der Website oder Impressum, sobald
                hinterlegt.)
              </>
            )}
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Allgemeines zur Datenverarbeitung</h2>
          <p className={pClass}>
            Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder
            identifizierbare natürliche Person beziehen. Wir verarbeiten solche Daten nur, soweit dies
            zur Bereitstellung der Website, zur Bearbeitung von Anfragen und Anmeldungen, zur
            Durchführung von Fahrschulverträgen sowie zur Erfüllung gesetzlicher Pflichten erforderlich
            ist oder Sie eingewilligt haben.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Hosting und technische Bereitstellung</h2>
          <p className={pClass}>
            Unsere Website wird über einen Hosting- bzw. Plattform-Anbieter (Cloud-Hosting)
            bereitgestellt. Dabei können insbesondere IP-Adressen, Zeitstempel und technische
            Metadaten verarbeitet werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag
            bzw. vorvertragliche Maßnahmen) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            sicherem, stabilem Betrieb). Mit dem Hoster besteht – soweit erforderlich – ein Vertrag
            zur Auftragsverarbeitung gemäß Art. 28 DSGVO.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Server-Logdateien</h2>
          <p className={pClass}>
            Beim Aufruf der Website können automatisch Informationen in Server-Logdateien
            gespeichert werden, etwa Browsertyp, System, Referrer-URL, Zeitpunkt der Anfrage und eine
            gekürzte oder pseudonymisierte IP-Adresse, je nach Konfiguration des Hosters. Die
            Verarbeitung dient der Sicherheit (z. B. Abwehr von Angriffen) und der technischen
            Fehleranalyse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Online-Anmeldung, Datenbank (Supabase)</h2>
          <p className={pClass}>
            Wenn Sie sich über unsere Website anmelden, verarbeiten wir die von Ihnen eingegebenen
            Daten (z. B. Name, Kontaktdaten, Adresse, Geburtsdatum, gewünschte Führerscheinklasse,
            Präferenzen zur Ausbildung, ggf. Zahlungsbezug) zur Bearbeitung der Anmeldung und zur
            Vorbereitung bzw. Durchführung des Fahrschulvertrags. Die Speicherung erfolgt über den
            Dienst Supabase (Anbieter: Supabase Inc., mit EU-Bezug über zulässige Übermittlungsmechanismen
            wie Standardvertragsklauseln, soweit relevant). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
            DSGVO. Mit Supabase besteht ein Auftragsverarbeitungsvertrag, soweit gesetzlich
            vorgeschrieben.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Zahlungsabwicklung (Stripe)</h2>
          <p className={pClass}>
            Soweit Sie Online-Zahlungen nutzen, erfolgt die Zahlungsabwicklung über Stripe
            (Stripe Technology Europe Ltd. bzw. verbundene Unternehmen, je nach Produktkonfiguration).
            Dabei werden Zahlungsdaten von Stripe verarbeitet; wir erhalten keine vollständigen
            Kreditkartendaten. Es gelten die Datenschutzhinweise von Stripe. Rechtsgrundlage ist Art.
            6 Abs. 1 lit. b DSGVO.
          </p>
        </section>

        {plausibleEnabled ? (
          <section className={sectionClass}>
            <h2 className={headingClass}>7. Webanalyse (Plausible)</h2>
            <p className={pClass}>
              Diese Website kann Plausible Analytics (Plausible Insights OÜ) nutzen. Plausible wird
              häufig ohne Cookies und mit anonymisierten bzw. aggregierten Statistiken betrieben.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Analyse der Nutzung zur Optimierung des
              Angebots). Näheres entnehmen Sie der Datenschutzerklärung von Plausible unter{' '}
              <a
                href="https://plausible.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-primary underline"
              >
                plausible.io/privacy
              </a>
              .
            </p>
          </section>
        ) : null}

        <section className={sectionClass}>
          <h2 className={headingClass}>{plausibleEnabled ? '8' : '7'}. Schriftarten (Google Fonts / Next.js)</h2>
          <p className={pClass}>
            Zur einheitlichen Darstellung können Schriftarten über die eingesetzte Website-Software
            (Next.js) eingebunden werden. Je nach Konfiguration können die Schriftdateien auf unserer
            eigenen Domain ausgeliefert werden, sodass beim Seitenaufruf keine Verbindung zu Google
            zu Ihrem Endgerät nötig ist. Sollte eine direkte Einbindung durch einen Drittanbieter
            erfolgen, geschieht dies zur berechtigten Darstellung unseres Online-Angebots (Art. 6
            Abs. 1 lit. f DSGVO).
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>{plausibleEnabled ? '9' : '8'}. Google Maps</h2>
          <p className={pClass}>
            Wenn wir eine Karte von Google Maps einbinden, kann Google (insb. Google Ireland
            Limited) Daten verarbeiten (z. B. IP-Adresse, Nutzungsdaten). Rechtsgrundlage ist Art. 6
            Abs. 1 lit. f DSGVO (Anfahrtsplan) bzw. bei Einwilligung Art. 6 Abs. 1 lit. a DSGVO. Es
            gelten die Datenschutzhinweise von Google.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>{plausibleEnabled ? '10' : '9'}. Kontakt per E-Mail oder Telefon</h2>
          <p className={pClass}>
            Wenn Sie uns kontaktieren, verwenden wir Ihre Angaben ausschließlich zur Bearbeitung der
            Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO oder Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>{plausibleEnabled ? '11' : '10'}. Speicherdauer</h2>
          <p className={pClass}>
            Wir speichern personenbezogene Daten nur so lange, wie der Zweck es erfordert oder
            gesetzliche Aufbewahrungsfristen (z. B. handels- oder steuerrechtlich) bestehen.
            Anschließend löschen oder anonymisieren wir die Daten.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>{plausibleEnabled ? '12' : '11'}. Ihre Rechte</h2>
          <p className={pClass}>Sie haben insbesondere folgende Rechte:</p>
          <ul className={ulClass}>
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)</li>
            <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
            <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO), z. B. der für uns zuständigen Landesbehörde</li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>{plausibleEnabled ? '13' : '12'}. SSL/TLS</h2>
          <p className={pClass}>
            Diese Website nutzt aus Sicherheitsgründen Verschlüsselung (SSL/TLS), erkennbar an
            „https://“ und dem Schloss-Symbol im Browser.
          </p>
        </section>

        <p className="mt-8 font-body text-xs text-text-muted">
          Stand: März 2026. Diese Erklärung soll unsere aktuellen Verarbeitungen abbilden; bei
          Änderungen der Technik oder Anbieter passen wir sie an. Bitte lassen Sie die Fassung durch
          eine Rechtsberatung prüfen, wenn Sie unsicher sind.
        </p>

        <Link href="/" className="btn-ghost mt-10 inline-block">
          ← Zur Startseite
        </Link>
      </div>
    </main>
  );
}
