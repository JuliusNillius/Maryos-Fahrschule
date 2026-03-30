import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

const sectionClass = 'mt-8';
const headingClass = 'font-heading text-lg font-bold italic uppercase text-green-primary mt-6 first:mt-0';
const pClass = 'font-body text-sm leading-relaxed text-text-muted mt-2';

export default async function AGBPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 py-20 text-text">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold italic uppercase text-green-primary">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
          Gültig für Verträge zwischen Maryo&apos;s Fahrschule GmbH und Teilnehmer:innen von
          Führerscheinausbildungen und Fahrsicherheitstrainings.
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Geltungsbereich</h2>
          <p className={pClass}>
            Diese AGB gelten für alle Verträge über die Teilnahme an der Führerscheinausbildung
            (Klassen B, BE, A, A1, A2, AM o.&#8203;ä.) sowie für damit verbundene Leistungen. Abweichende
            Bedingungen des Kunden werden nicht anerkannt, sofern wir nicht ausdrücklich schriftlich
            zugestimmt haben.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Vertragsschluss</h2>
          <p className={pClass}>
            Die Anmeldung über die Website oder vor Ort stellt ein verbindliches Angebot des Kunden
            dar. Der Vertrag kommt zustande, wenn wir die Anmeldung durch schriftliche oder
            elektronische Bestätigung annehmen. Die aktuellen Preise und Leistungsumfang ergeben sich
            aus der Leistungsbeschreibung bzw. der Preisliste zum Zeitpunkt der Anmeldung.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Leistungen und Preise</h2>
          <p className={pClass}>
            Die Fahrschule erbringt die vereinbarte theoretische und praktische Ausbildung gemäß
            Fahrschüler-Ausbildungsordnung. Die Preise verstehen sich in Euro inkl. der gesetzlichen
            MwSt., sofern nicht anders angegeben. Zusätzliche Kosten (z.&#8203;B. TÜV-Gebühren,
            Führerscheinantrag) können gesondert anfallen und werden transparent kommuniziert.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Zahlung</h2>
          <p className={pClass}>
            Die Zahlungsmodalitäten (Anzahlung, Raten, Fälligkeit) werden bei Vertragsschluss
            vereinbart. Bei Verzug können Verzugszinsen und ggf. Mahngebühren berechnet werden.
            Die Zahlung der vereinbarten Beträge ist Voraussetzung für die Durchführung der
            Ausbildung.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Stornierung und Rücktritt</h2>
          <p className={pClass}>
            Ein Rücktritt des Kunden von der Anmeldung bedarf der Schriftform. Über die
            Rücktrittsfristen und ggf. anfallende Stornierungsgebühren informieren wir bei
            Vertragsschluss bzw. in der Bestätigung. Das gesetzliche Widerrufsrecht für
            Verbraucher bleibt unberührt, soweit anwendbar.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Haftung</h2>
          <p className={pClass}>
            Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der
            Verletzung des Lebens, des Körpers oder der Gesundheit. Im Übrigen ist die Haftung auf
            den vorhersehbaren, typischerweise eintretenden Schaden begrenzt, sofern nicht
            zwingende gesetzliche Vorschriften entgegenstehen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Schlussbestimmungen</h2>
          <p className={pClass}>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für Streitigkeiten ist,
            soweit gesetzlich zulässig, der Sitz der Fahrschule. Sollten einzelne Klauseln unwirksam
            sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>
        </section>

        <p className="mt-8 font-body text-xs text-text-muted">
          Stand: März 2025. Maryo&apos;s Fahrschule GmbH behält sich Anpassungen der AGB vor;
          die zum Zeitpunkt des Vertragsschlusses gültige Fassung gilt für den jeweiligen Vertrag.
        </p>

        <Link href="/" className="btn-ghost mt-10 inline-block">
          ← Zur Startseite
        </Link>
      </div>
    </main>
  );
}
