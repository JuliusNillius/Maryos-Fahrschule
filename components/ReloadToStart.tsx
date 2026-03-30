'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const DEFAULT_LOCALE = 'de';

/**
 * Bei Neuladen (F5) immer zur Startseite weiterleiten, außer wir sind schon dort.
 */
export default function ReloadToStart() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isReload = nav?.type === 'reload';
    const isStartPage = pathname === '/' || pathname === `/${DEFAULT_LOCALE}` || pathname === '';
    if (isReload && !isStartPage) {
      window.location.href = '/';
    }
  }, [pathname]);

  return null;
}
