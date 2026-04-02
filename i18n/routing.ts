import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'tr', 'ar'],
  defaultLocale: 'de',
  localePrefix: 'always', // immer /de, /en, /tr, /ar
  /** Kein Accept-Language-Redirect: Crawler & Nutzer landen konsistent auf /de/ als Default. */
  localeDetection: false,
});
