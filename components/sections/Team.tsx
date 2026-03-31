'use client';

import { useTranslations } from 'next-intl';

export default function Team() {
  const t = useTranslations('team');

  return (
    <section
      id="team"
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-14 text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
          {t('heading')}
        </h2>

        <div className="space-y-16 md:space-y-20">
          {/* Geschäftsführer: Maryo Asoo — Bild kommt noch */}
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            <div
              className="flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-green-500/10 font-display text-5xl font-bold text-green-500/60 md:h-64 md:w-64"
              aria-hidden
            >
              MA
            </div>
            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="font-display text-xs uppercase tracking-wider text-green-500">
                {t('maryoRole')}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold italic text-white md:text-3xl">
                Maryo Asoo
              </h3>
              <p className="mt-4 font-body leading-relaxed text-text-muted">
                {t('maryoText')}
              </p>
            </div>
          </div>

          {/* Prokurist: Julius Nillius — Bild kommt noch */}
          <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:items-start md:gap-12">
            <div
              className="flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-green-500/10 font-display text-5xl font-bold text-green-500/60 md:h-64 md:w-64"
              aria-hidden
            >
              JN
            </div>
            <div className="min-w-0 flex-1 text-center md:text-right">
              <p className="font-display text-xs uppercase tracking-wider text-green-500">
                {t('juliusRole')}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold italic text-white md:text-3xl">
                Julius Nillius
              </h3>
              <p className="mt-4 font-body leading-relaxed text-text-muted">
                {t('juliusText')}
              </p>
            </div>
          </div>
        </div>

        {/* Bürokräfte & Fahrlehrer — unterhalb der Geschäftsführung, kompakter */}
        <div className="mt-20 border-t border-[rgba(93,196,34,0.12)] pt-16 md:mt-28 md:pt-20">
          <h3 className="mb-10 text-center font-heading text-xl font-bold italic uppercase tracking-wide text-white sm:text-2xl">
            {t('staffHeading')}
          </h3>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-8 md:gap-10">
            <div
              className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-green-500/10 font-display text-3xl font-bold text-green-500/60 sm:h-40 sm:w-40 sm:text-4xl"
              aria-hidden
            >
              LF
            </div>
            <div className="min-w-0 text-center sm:max-w-sm sm:text-left">
              <p className="font-display text-[10px] uppercase tracking-wider text-green-500 sm:text-xs">
                {t('lauraRole')}
              </p>
              <p className="mt-1 font-heading text-lg font-bold italic text-white sm:text-xl">{t('lauraName')}</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-text-muted sm:text-[15px]">{t('lauraText')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
