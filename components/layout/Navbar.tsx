'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { useEffect, useState, useRef } from 'react';
import Logo from '@/components/layout/Logo';

/**
 * Eine Navigationsleiste: alle Inhalte über Anker erreichbar.
 * Keine Duplikate; „Über uns“ als Dropdown (Fahrzeuge, Ablauf & Flotte).
 */
const mainNavItems = [
  { href: '/preise', key: 'prices' as const },
  { href: '/flotte', key: 'fleet' as const },
  { href: '/lehrer', key: 'teachers' as const },
  { href: '/team', key: 'more' as const },
  { href: '/faq', key: 'faqContact' as const },
];

const languages = [
  { code: 'de' as const, flag: '🇩🇪', label: 'DE' },
  { code: 'tr' as const, flag: '🇹🇷', label: 'TR' },
  { code: 'ar' as const, flag: '🇸🇦', label: 'AR' },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) setLangOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const [hash, setHash] = useState('');
  useEffect(() => {
    setHash(typeof window !== 'undefined' ? window.location.hash : '');
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith('#')) return href === hash;
    return pathname === href || pathname?.endsWith(href);
  };

  const currentLang = languages.find((l) => l.code === locale) ?? languages[0];

  const linkClass = (href: string) =>
    `group relative py-2 font-body text-sm font-medium uppercase tracking-wide ${
      isActive(href) ? 'text-green-500' : 'text-white'
    }`;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-transparent bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="relative flex shrink-0 items-center" aria-label="Maryo's Fahrschule Startseite">
            <Logo variant="navbar" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Hauptmenü">
            {mainNavItems.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={linkClass(href)}
                >
                {t(key)}
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full rtl:left-auto rtl:right-0 rtl:group-hover:w-full"
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-body text-sm text-white transition-colors hover:border-green-500/30 hover:bg-white/10"
                aria-label="Sprache wählen"
                aria-expanded={langOpen}
                data-testid="navbar-lang-toggle"
              >
                <span aria-hidden>🌐</span>
                <span>{currentLang.label}</span>
                <span className="text-green-500" aria-hidden>▾</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-white/10 bg-[#0F0F0F] py-1 shadow-xl">
                  {languages.map(({ code, flag, label }) => (
                    <Link
                      key={code}
                      href={pathname || '/'}
                      locale={code}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-green-500/10 hover:text-green-500 ${
                        locale === code ? 'text-green-500' : 'text-white'
                      }`}
                    >
                      {flag} {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/backoffice"
              className="btn-primary shrink-0"
              data-cta
              data-magnetic
              data-testid="navbar-backoffice"
            >
              Backoffice
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={t('menuOpen')}
            aria-expanded={mobileOpen}
            data-testid="navbar-mobile-open"
          >
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-bg transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-full flex-col bg-[#080808]">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center">
              <Logo variant="navbar" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center"
              aria-label={t('menuClose')}
              data-testid="navbar-mobile-close"
            >
              <span className="absolute h-0.5 w-6 rotate-45 bg-white" style={{ marginBottom: '-2px' }} />
              <span className="absolute h-0.5 w-6 -rotate-45 bg-white" />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col justify-center px-8" aria-label="Mobile Menü">
            <div
              className="absolute left-6 top-0 w-0.5 bg-green-500 transition-all duration-500 ease-out"
              style={{
                height: mobileOpen ? '100%' : '0%',
                transitionDelay: mobileOpen ? '0.1s' : '0s',
              }}
              aria-hidden
            />
            {mainNavItems.map(({ href, key }, i) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`relative py-4 font-heading text-3xl font-bold italic uppercase tracking-wide text-white ${
                  mobileOpen ? 'animate-nav-stagger opacity-100' : 'opacity-0'
                }`}
                style={mobileOpen ? { animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' } : undefined}
              >
                {t(key)}
              </Link>
            ))}
            </nav>

          <div className="border-t border-[rgba(93,196,34,0.2)] p-4">
            <p className="mb-3 text-center font-body text-xs text-text-muted">
              {t('floatActionsHint')}
            </p>
            <a
              href="tel:+491784557528"
              className="btn-primary flex w-full items-center justify-center gap-2"
              data-cta
            >
              <span aria-hidden>📞</span>
              {t('phone')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
