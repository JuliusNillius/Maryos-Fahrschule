'use client';

import { useEffect } from 'react';

const RTL_LOCALES = ['ar'];

export default function LocaleHtmlAttrs({ locale }: { locale: string }) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    html.setAttribute('dir', RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr');
    return () => {
      html.removeAttribute('dir');
    };
  }, [locale]);
  return null;
}
