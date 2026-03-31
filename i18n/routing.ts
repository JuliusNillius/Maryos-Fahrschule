import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'tr', 'ar'],
  defaultLocale: 'de',
  localePrefix: 'always', // immer /de, /tr, /ar
});
