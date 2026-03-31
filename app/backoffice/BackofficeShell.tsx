'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const nav = [
  { href: '/backoffice', label: 'Übersicht' },
  { href: '/backoffice/lehrer', label: 'Fahrlehrer' },
  { href: '/backoffice/flotte', label: 'Flotte' },
  { href: '/backoffice/preise', label: 'Preise' },
  { href: '/backoffice/einstellungen', label: 'Einstellungen' },
  { href: '/backoffice/faq', label: 'FAQ' },
  { href: '/backoffice/anmeldungen', label: 'Anmeldungen' },
  { href: '/backoffice/buchungen', label: 'Buchungen' },
  { href: '/backoffice/dokumente', label: 'Dokumente' },
];

export default function BackofficeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase?.auth.signOut();
    router.push('/backoffice/login');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[#0F0F0F] p-4">
        <p className="font-heading text-lg font-bold italic text-green-500 mb-6">Backoffice</p>
        <nav className="space-y-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === href ? 'bg-green-500/20 text-green-500' : 'text-white hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            data-testid="backoffice-logout"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-muted hover:bg-white/10 hover:text-white"
          >
            Abmelden
          </button>
          <Link
            href="/"
            className="mt-2 block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-white/10 hover:text-white"
          >
            Zur Website
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
