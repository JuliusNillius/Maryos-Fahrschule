import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'tr', 'ar'],
  defaultLocale: 'de',
  localePrefix: 'always', // immer /de, /en, /tr, /ar
});
