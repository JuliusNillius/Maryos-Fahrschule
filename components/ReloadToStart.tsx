'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { routing } from '@/i18n/routing';

const LOCALES = routing.locales as readonly string[];

/**
 * Bei Neuladen (F5) zur Startseite in derselben Sprache, außer wir sind schon auf /de, /tr, /ar.
 */
export default function ReloadToStart() {
  const pathname = usePathname() ?? '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isReload = nav?.type === 'reload';

    const segments = pathname.split('/').filter(Boolean);
    const firstSeg = segments[0] ?? '';
    const locale = LOCALES.includes(firstSeg) ? firstSeg : null;

    // Nur /de/…, /tr/…, /ar/… (Marketing); nicht /backoffice, /api, /documents, unbekannte Pfade
    if (locale === null && pathname !== '/' && pathname !== '') return;

    const isStartPage =
      pathname === '/' || pathname === '' || (locale !== null && segments.length === 1);

    if (isReload && !isStartPage && locale !== null) {
      window.location.replace(`/${locale}`);
    }
  }, [pathname]);

  return null;
}
