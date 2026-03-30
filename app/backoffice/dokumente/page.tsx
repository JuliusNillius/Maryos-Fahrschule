export default function BackofficeDokumentePage() {
  const docs = [
    { href: '/documents/rechnung-blanko.html', label: 'Rechnung (Blanko)' },
    { href: '/documents/quittung-blanko.html', label: 'Quittung (Blanko)' },
    { href: '/documents/bestaetigung-blanko.html', label: 'Bestätigung (Blanko)' },
    { href: '/documents/blanko-dokument.html', label: 'Allgemeines Dokument (Blanko)' },
    { href: '/documents/arbeitsvertrag-fahrlehrer-170ue.html', label: 'Arbeitsvertrag Fahrlehrer/in (170 UEs)' },
    { href: '/documents/arbeitsvertrag-fahrlehrer-180ue.html', label: 'Arbeitsvertrag Fahrlehrer/in (180 UEs)' },
    { href: '/documents/arbeitsvertrag-fahrlehrer-200ue.html', label: 'Arbeitsvertrag Fahrlehrer/in (200 UEs)' },
    { href: '/documents/arbeitsvertrag-fahrlehrer-220ue.html', label: 'Arbeitsvertrag Fahrlehrer/in (220 UEs)' },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold italic uppercase text-white mb-2">Dokumenten-Center</h1>
      <p className="text-text-muted mb-6">Blanko-Vorlagen zum Ausfüllen und Drucken (als PDF speichern).</p>
      <ul className="space-y-3">
        {docs.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0F0F0F] px-4 py-3 text-white transition-colors hover:border-green-500/30 hover:text-green-500"
            >
              <span aria-hidden>📄</span>
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-text-muted">Tipp: Seite öffnen → Drucken → „Als PDF speichern“ wählen.</p>
    </div>
  );
}
