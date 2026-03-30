import Link from 'next/link';

export default function BackofficeDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold italic uppercase text-white mb-2">Übersicht</h1>
      <p className="text-text-muted mb-8">Willkommen im Backoffice. Wähle einen Bereich in der Sidebar.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: '/backoffice/lehrer', label: 'Fahrlehrer', desc: 'Lehrer anlegen, bearbeiten, Reihenfolge' },
          { href: '/backoffice/preise', label: 'Preise', desc: 'Preise pro Klasse' },
          { href: '/backoffice/einstellungen', label: 'Einstellungen', desc: 'Kontakt, Öffnung, Stats, Impressum' },
          { href: '/backoffice/faq', label: 'FAQ', desc: 'Fragen & Antworten' },
          { href: '/backoffice/anmeldungen', label: 'Anmeldungen', desc: 'Registrierungen & Zahlungsstatus' },
          { href: '/backoffice/buchungen', label: 'Buchungen', desc: 'Terminanfragen Kalender' },
          { href: '/backoffice/dokumente', label: 'Dokumente', desc: 'Blanko-Vorlagen' },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="block rounded-xl border border-white/10 bg-[#0F0F0F] p-5 transition-colors hover:border-green-500/30 hover:bg-white/5"
          >
            <span className="font-heading font-bold italic text-green-500">{label}</span>
            <p className="mt-1 text-sm text-text-muted">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
