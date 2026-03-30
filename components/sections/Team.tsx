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
      </div>
    </section>
  );
}
