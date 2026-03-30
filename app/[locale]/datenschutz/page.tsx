import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

const sectionClass = 'mt-8';
const headingClass = 'font-heading text-lg font-bold italic uppercase text-green-primary mt-6 first:mt-0';
const pClass = 'font-body text-sm leading-relaxed text-text-muted mt-2';

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 py-20 text-text">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold italic uppercase text-green-primary">
          Datenschutzerklärung
        </h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
          Maryo&apos;s Fahrschule GmbH verarbeitet personenbezogene Daten im Einklang mit der
          Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Verantwortlicher</h2>
          <p className={pClass}>
            Verantwortlich für die Datenverarbeitung ist: Maryo&apos;s Fahrschule GmbH, Bahnhofstraße 25,
            41236 Mönchengladbach. Kontakt: siehe Impressum bzw. Kontaktseite.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className={pClass}>
            Wir erheben personenbezogene Daten nur, soweit dies für die Bereitstellung unserer
            Leistungen, die Anmeldung zum Führerscheinkurs, die Kommunikation (z.&#8203;B. Kontaktformular,
            E-Mail-Benachrichtigungen) sowie zur Erfüllung gesetzlicher Pflichten erforderlich ist.
            Dazu können gehören: Name, Anschrift, E-Mail, Telefonnummer, Geburtsdatum sowie
            fuhrerscheinbezogene Angaben.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Zweck und Rechtsgrundlage</h2>
          <p className={pClass}>
            Die Verarbeitung erfolgt auf Grundlage von Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO),
            berechtigtem Interesse (Art. 6 Abs. 1 lit. f DSGVO) sowie ggf. Ihrer Einwilligung (Art. 6
            Abs. 1 lit. a DSGVO). Einzelheiten zu den jeweiligen Verarbeitungszwecken können Sie bei
            den konkreten Erhebungen (z.&#8203;B. Anmeldeformular, Kontakt) entnehmen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Speicherdauer</h2>
          <p className={pClass}>
            Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke
            erforderlich ist oder gesetzliche Aufbewahrungsfristen (z.&#8203;B. steuer- oder
            handelsrechtlich) bestehen. Danach werden die Daten gelöscht oder anonymisiert.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Ihre Rechte (Betroffenenrechte)</h2>
          <p className={pClass}>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
            Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
            Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch (Art. 21 DSGVO). Sie haben ferner
            das Recht, sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Cookies und lokale Speicherung</h2>
          <p className={pClass}>
            Diese Website setzt technisch notwendige Speicherungen (z.&#8203;B. Session, Formular-Entwürfe)
            ein. Soweit wir optional Analyse- oder Marketing-Tools nutzen, erfolgt dies nur auf Basis
            Ihrer Einwilligung oder in anonymisierter Form. Details zu verwendeten Diensten finden Sie
            ggf. in den nachfolgenden Abschnitten.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Empfänger und Dienste (Drittanbieter)</h2>
          <p className={pClass}>
            Zur Bereitstellung der Website und der Anmelde-/Buchungsfunktionen können Daten an
            Diensteanbieter weitergegeben werden (z.&#8203;B. Hosting, E-Mail-Versand, Datenbanken,
            Zahlungsabwicklung). Diese handeln als Auftragsverarbeiter im Sinne von Art. 28 DSGVO.
            Sofern wir Dienste mit Sitz außerhalb des EWR nutzen, wird ein angemessenes
            Datenschutzniveau (z.&#8203;B. Standardvertragsklauseln) sichergestellt. Auf Wunsch können
            wir Ihnen die konkreten Empfänger und Garantien nennen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Kontakt zum Datenschutz</h2>
          <p className={pClass}>
            Für Fragen zum Datenschutz und zur Ausübung Ihrer Rechte wenden Sie sich bitte an uns
            über die im Impressum angegebenen Kontaktdaten.
          </p>
        </section>

        <p className="mt-8 font-body text-xs text-text-muted">
          Stand: März 2025. Diese Datenschutzerklärung kann bei Bedarf angepasst werden.
        </p>

        <Link href="/" className="btn-ghost mt-10 inline-block">
          ← Zur Startseite
        </Link>
      </div>
    </main>
  );
}
