/** Lokale SEO-Signale (nur DE). */
export default function HomeLocalIntro({ locale }: { locale: string }) {
  if (locale !== 'de') return null;

  return (
    <section
      className="border-b border-[rgba(93,196,34,0.12)] bg-bg px-4 py-10 sm:px-6 lg:px-8"
      aria-label="Standort und Angebot"
    >
      <p className="mx-auto max-w-2xl text-center font-body text-sm leading-relaxed text-text-muted sm:max-w-3xl sm:text-base">
        Maryos Fahrschule ist deine Fahrschule in Mönchengladbach und Anlaufstelle für den Führerschein in Rheydt:
        Bahnhofstraße 25 am Bahnhof Rheydt (41236). Wir bieten Führerschein Klasse B, BF17, B197, BE und Intensivkurse
        für Schüler:innen aus Mönchengladbach, Odenkirchen, Wickrath, Giesenkirchen und der Region. Büro Mo–Fr 12–18 Uhr.
        Theorie: Di, Mi, Do 19–20:30 Uhr.
      </p>
    </section>
  );
}
