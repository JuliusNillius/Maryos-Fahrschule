import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

const sectionClass = 'mt-8';
const headingClass =
  'font-heading text-lg font-bold italic uppercase text-green-primary mt-6 first:mt-0';
const pClass = 'font-body text-sm leading-relaxed text-text-muted mt-2';

export default async function AGBPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-bg px-4 pt-20 pb-20 text-text max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom)+5rem)]">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold italic uppercase text-green-primary">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
          Gültig für Verträge zwischen Maryo&apos;s Fahrschule GmbH (nachfolgend „Fahrschule“) und
          Fahrschülerinnen und Fahrschülern (nachfolgend „Kunde“) über Ausbildungsleistungen zur
          Erlangung von Führerscheinberechtigungen sowie damit verbundene Nebenleistungen.
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. Geltungsbereich</h2>
          <p className={pClass}>
            Diese AGB gelten für alle Leistungen der Fahrschule, insbesondere für die theoretische
            und praktische Ausbildung in den angebotenen Klassen (z. B. Klasse B und begleitetes
            Fahren ab 17 / BF17, soweit angeboten). Entgegenstehende oder abweichende Bedingungen des
            Kunden finden keine Anwendung, es sei denn, deren Geltung ist schriftlich ausdrücklich
            vereinbart.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Rechtsgrundlagen der Ausbildung</h2>
          <p className={pClass}>
            Die Ausbildung richtet sich nach den einschlägigen gesetzlichen Vorschriften,
            insbesondere dem Fahrschulgesetz und der Fahrschüler-Ausbildungsordnung (Fahrschüler-AusbVO)
            in der jeweils geltenden Fassung sowie den hierzu erlassenen Verwaltungsvorschriften.
            Der Umfang der vertraglich geschuldeten Ausbildung bemisst sich danach, nicht nach einer
            festen Stundenzahl, sofern nicht ausdrücklich anderes schriftlich vereinbart wurde.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Vertragsschluss</h2>
          <p className={pClass}>
            Anmeldungen über die Website, schriftlich oder vor Ort sind für den Kunden verbindlich.
            Der Ausbildungsvertrag kommt erst durch Annahmeerklärung der Fahrschule (schriftlich,
            per E-Mail oder in Textform) zustande. Maßgeblich für Preise und Leistungsumfang sind die
            zum Zeitpunkt der Annahme gültige Preisliste bzw. Leistungsbeschreibung der Fahrschule.
          </p>
          <p className={pClass}>
            Online-Zahlungen auf der Website werden über den Zahlungsdienstleister Stripe abgewickelt;
            je nach Angebot können u. a. Karte, Apple Pay, Google Pay, Sofort oder Klarna angeboten
            werden. Soweit auf der Website nicht ausdrücklich anders ausgewiesen, umfasst die jeweils
            bezahlte Online-Leistung die dort beschriebene Anmelde-/Paketposition (z. B. Anmeldegebühr
            und App-Zugang) und nicht automatisch den gesamten Ausbildungsumfang; Fahrstunden,
            Prüfungsgebühren und weitere Leistungen werden gesondert nach der gültigen Preisliste
            abgerechnet, sofern nicht gesondert schriftlich vereinbart.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Leistungen und Mitwirkung</h2>
          <p className={pClass}>
            Die Fahrschule erbringt die vereinbarte Ausbildung mit der gebotenen fachlichen
            Sorgfalt. Der Kunde ist verpflichtet, den Anweisungen der Ausbilderinnen und Ausbilder
            Folge zu leisten, pünktlich zu erscheinen, ausreichend zu lernen und alle für die
            Ausbildung und Prüfung erforderlichen Unterlagen rechtzeitig zu beschaffen (z. B.
            Sehtest, Erste-Hilfe-Kurs, Antragsunterlagen, ggf. ärztliche Bescheinigungen).
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Termine, Versäumnis, Rücktritt vom Einzeltermin</h2>
          <p className={pClass}>
            Vereinbarte Fahrstunden und Unterrichtstermine sind verbindlich. Versäumt der Kunde
            einen Termin ohne rechtzeitige Absage oder liegt ein wichtiger Grund seitens des Kunden
            nicht vor, kann die Fahrschule den vollen oder einen angemessenen Anteil der Gebühr für
            die ausgefallene Einheit berechnen, sofern dies im Einzelfall gesondert vereinbart oder in
            der Preisliste ausgewiesen ist. Eine rechtzeitige Absage ist in der Regel mindestens 24
            Stunden vor dem Termin schriftlich oder telefonisch an die Fahrschule zu richten, sofern
            nicht anderes vereinbart.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Preise und Zahlung</h2>
          <p className={pClass}>
            Es gelten die veröffentlichten bzw. ausgehändigten Preise. Alle Preise verstehen sich in
            Euro; die gesetzliche Umsatzsteuer ist enthalten, soweit nicht ausdrücklich als netto
            gekennzeichnet. Gebühren Dritter (z. B. TÜV, Verwaltungsgebühren, ärztliche
            Gutachten) trägt der Kunde gesondert, soweit gesetzlich vorgesehen.
          </p>
          <p className={pClass}>
            Zahlungsmodalitäten (Anzahlung, Ratenzahlung, Fälligkeit) werden bei Vertragsschluss
            vereinbart. Bei Zahlungsverzug sind die gesetzlichen Regelungen zur Mahnung und zu
            Verzugszinsen anwendbar; die Fortsetzung der Ausbildung kann von der Erfüllung der
            Zahlungsverpflichtungen abhängig gemacht werden.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>7. Rücktritt und Kündigung</h2>
          <p className={pClass}>
            Ein Rücktritt vom Vertrag oder eine außerordentliche Kündigung bedürfen zu Beweiszwecken
            der Textform, soweit nicht gesetzlich anderes vorgeschrieben ist. Bereits erbrachte
            Leistungen und vereinbarte Pauschalen, soweit geschuldet, werden abgerechnet. Über
            Rücktrittsfolgen und ggf. angemessene Stornokosten wird der Kunde bei Vertragsschluss
            gesondert informiert.
          </p>
          <p className={pClass}>
            Soweit für Verbraucher ein gesetzliches Widerrufsrecht bei Fernabsatzverträgen besteht,
            erhalten Sie die gesetzlich vorgeschriebene Belehrung gesondert; es gelten die dort
            genannten Fristen und Ausnahmen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>8. Prüfung</h2>
          <p className={pClass}>
            Die Anmeldung zu theoretischen und praktischen Prüfungen erfolgt durch die Fahrschule
            nur, wenn die Voraussetzungen der Fahrschüler-AusbVO erfüllt sind und der Kunde die
            hierfür erforderlichen Nachweise erbracht hat. Prüfungstermine obliegen der Zulassungs-
            und Prüfungsbehörde bzw. dem TÜV; die Fahrschule hat darauf keinen Einfluss. Bei
            Nichtbestehen können erneute Prüfungsgebühren und weitere Ausbildungsleistungen
            anfallen.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>9. Haftung</h2>
          <p className={pClass}>
            Die Fahrschule haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei
            Verletzung von Leben, Körper oder Gesundheit. Im Übrigen haftet die Fahrschule nur bei
            Verletzung wesentlicher Vertragspflichten (Kardinalpflichten); in diesem Fall ist die
            Haftung auf den typischerweise vorhersehbaren Schaden begrenzt, sofern nicht zwingendes
            Recht entgegensteht.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>10. Datenschutz</h2>
          <p className={pClass}>
            Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer
            Datenschutzerklärung auf dieser Website.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>11. Schlussbestimmungen</h2>
          <p className={pClass}>
            Es gilt das Recht der Bundesrepublik Deutschland. Zwingende Verbraucherschutzvorschriften
            des Staates, in dem der Kunde seinen gewöhnlichen Aufenthalt hat, bleiben unberührt,
            sofern sie günstiger sind.
          </p>
          <p className={pClass}>
            Gerichtsstand für Kaufleute und für Personen ohne allgemeinen Gerichtsstand in
            Deutschland ist der Sitz der Fahrschule, soweit zulässig. Für Verbraucher mit Wohnsitz in
            der EU gilt der gesetzliche Gerichtsstand.
          </p>
          <p className={pClass}>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
            Wirksamkeit der übrigen Regelungen unberührt. An die Stelle der unwirksamen Regelung
            tritt – soweit möglich – eine wirtschaftlich gleichwertige, rechtswirksame Ersatzregelung.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>12. Änderungen der AGB</h2>
          <p className={pClass}>
            Für laufende Verträge gilt die zum Zeitpunkt des Vertragsschlusses gültige Fassung der
            AGB. Änderungen für bestehende Verträge werden dem Kunden in Textform mitgeteilt; widerspricht
            der Kunde nicht innerhalb einer angemessenen Frist, gelten die geänderten Bedingungen als
            angenommen, sofern der Kunde hierauf ausdrücklich hingewiesen wurde und das Widerspruchsrecht
            klar benannt war. Das gesetzliche Widerrufs- und Kündigungsrecht bleibt unberührt.
          </p>
        </section>

        <p className="mt-8 font-body text-xs text-text-muted">
          Stand: März 2026. Maryo&apos;s Fahrschule GmbH, Mönchengladbach. Diese AGB ersetzen keine
          individuelle Rechtsberatung; lassen Sie sie bei Bedarf von einer Kammer oder einem
          Rechtsanwalt prüfen.
        </p>

        <Link href="/" className="btn-ghost mt-10 inline-block">
          ← Zur Startseite
        </Link>
      </div>
    </main>
  );
}
