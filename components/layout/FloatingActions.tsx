'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import FineFlashLauncher from '@/components/bussgeld/FineFlashLauncher';

const WHATSAPP_URL = 'https://wa.me/491784557528';

/** WhatsApp + Termin + Blitzer — unter lg (1024px) wie Mobil (u. a. iPhone quer); ab lg oben rechts. */
export default function FloatingActions() {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '';
  const tWa = useTranslations('whatsapp');
  const tTermine = useTranslations('booking');
  const [waHover, setWaHover] = useState(false);
  const [termineHover, setTermineHover] = useState(false);
  const [waReady, setWaReady] = useState(false);

  useEffect(() => {
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setWaReady(true);
    };
    window.addEventListener('scroll', show, { passive: true });
    window.addEventListener('pointerdown', show);
    const t = window.setTimeout(show, 2800);
    return () => {
      window.removeEventListener('scroll', show);
      window.removeEventListener('pointerdown', show);
      window.clearTimeout(t);
    };
  }, []);

  const buttonClass =
    'flex h-14 w-14 items-center justify-center rounded-full bg-green-primary text-white shadow-lg transition-transform hover:scale-105 lg:h-16 lg:w-16';

  return (
    <div
      className={`fixed right-4 z-50 flex flex-col gap-3 lg:right-6 lg:top-20 max-lg:bottom-[calc(5.25rem+env(safe-area-inset-bottom))] max-lg:top-auto ${!isHome ? 'max-lg:hidden' : ''}`}
    >
      {waReady && (
        <div className="relative">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`whatsapp-pulse group relative ${buttonClass}`}
            aria-label={tWa('ariaLabel')}
            onMouseEnter={() => setWaHover(true)}
            onMouseLeave={() => setWaHover(false)}
            data-cta
            data-testid="whatsapp-cta"
          >
            <svg className="h-7 w-7 lg:h-8 lg:w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          {waHover && (
            <div
              className="absolute right-full top-1/2 z-[60] mr-3 max-w-[min(85vw,16rem)] -translate-y-1/2 rounded-lg border border-[rgba(93,196,34,0.2)] bg-surface px-3 py-2 text-start font-body text-sm text-text shadow-lg"
              role="tooltip"
            >
              {tWa('tooltip')}
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <Link
          prefetch
          href="/termine"
          className={`relative ${buttonClass}`}
          aria-label={tTermine('cta')}
          onMouseEnter={() => setTermineHover(true)}
          onMouseLeave={() => setTermineHover(false)}
          data-cta
          data-testid="floating-termine-cta"
        >
          <svg className="h-7 w-7 lg:h-8 lg:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </Link>
        {termineHover && (
          <div
            className="absolute right-full top-1/2 z-[60] mr-3 max-w-[min(85vw,16rem)] -translate-y-1/2 rounded-lg border border-[rgba(93,196,34,0.2)] bg-surface px-3 py-2 text-start font-body text-sm text-text shadow-lg"
            role="tooltip"
          >
            {tTermine('cta')}
          </div>
        )}
      </div>

      <FineFlashLauncher />
    </div>
  );
}
