import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'tr', 'ar', 'ru'],
  defaultLocale: 'de',
  localePrefix: 'always', // immer /de, /en, … – vermeidet 404 bei Root /
});
