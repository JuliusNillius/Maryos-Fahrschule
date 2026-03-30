/**
 * Plausible Analytics — DSGVO-compliant, cookie-free.
 * Load script when consent given or use default (no cookies).
 */
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'maryos-fahrschule.de';

export function loadPlausible() {
  if (typeof window === 'undefined') return;
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window === 'undefined' || !(window as unknown as { plausible?: (n: string, o: { props: Record<string, string | number> }) => void }).plausible) return;
  (window as unknown as { plausible: (n: string, o?: { props: Record<string, string | number> }) => void }).plausible(name, props ? { props } : undefined);
}
