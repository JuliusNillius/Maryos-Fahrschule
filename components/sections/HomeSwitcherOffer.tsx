'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** Kompaktes ANGEBOT: Fahrschulwechsler — unter der Trust-Bar auf der Startseite. */
export default function HomeSwitcherOffer() {
  const t = useTranslations('homeSwitcher');

  return (
    <section
      className="border-b border-[rgba(93,196,34,0.15)] bg-[rgba(93,196,34,0.06)] px-4 py-3 sm:px-6"
      aria-label={t('ariaLabel')}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:flex-wrap sm:gap-3">
        <span className="shrink-0 rounded-full border border-green-primary/40 bg-green-primary/15 px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-green-primary">
          {t('badge')}
        </span>
        <p className="max-w-2xl font-body text-xs leading-relaxed text-text-muted sm:text-sm">{t('line')}</p>
        <Link
          href="/preise"
          className="shrink-0 font-body text-xs font-medium text-green-primary underline decoration-green-primary/40 underline-offset-2 transition-colors hover:text-green-400 sm:text-sm"
        >
          {t('linkLabel')}
        </Link>
      </div>
    </section>
  );
}
