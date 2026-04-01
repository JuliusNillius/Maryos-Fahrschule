'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from '@/i18n/navigation';
import {
  PRICING_REGISTRATION_EUR,
  PRICING_APP_EUR,
  PRICING_LESSON_HOUR_EUR,
  PRICING_TUV_EUR,
  PRICING_OTHER_EUR,
  PRICING_ERSTE_HILFE_EUR,
} from '@/lib/pricing';

/**
 * PKW: B, BF17, B197, BE — Anmeldung + App, Fahrstunden 65 €, Richtwerte Gesamtbudget.
 */
const CLASSES = ['B', 'BF17', 'B197', 'BE'] as const;
type ClassId = (typeof CLASSES)[number];

const THEORY = 0;

function useCountUp(value: number, duration = 0.6) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(value);

  useEffect(() => {
    const from = ref.current;
    ref.current = value;
    const obj = { v: from };
    gsap.to(obj, {
      v: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(obj.v)),
    });
  }, [value, duration]);

  return display;
}

export default function PriceCalculator() {
  const t = useTranslations('priceCalculator');
  const [selectedClass, setSelectedClass] = useState<ClassId | null>(null);
  const [hours, setHours] = useState(24);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const hoursCost = selectedClass ? hours * PRICING_LESSON_HOUR_EUR : 0;

  const total =
    selectedClass == null
      ? 0
      : PRICING_REGISTRATION_EUR +
        PRICING_APP_EUR +
        hoursCost +
        THEORY +
        PRICING_TUV_EUR +
        PRICING_OTHER_EUR;

  const displayTotal = useCountUp(total);

  return (
    <section
      id="preisrechner"
      className="scroll-mt-20 border-b border-[rgba(93,196,34,0.18)] bg-bg py-16 md:py-24"
      aria-label="Preisrechner"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl">
          {t('heading')}
        </h2>
        <p className="mt-3 text-center font-body text-lg text-text-muted">
          {t('sub')}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center font-body text-sm text-text-muted">
          {t('ersteHilfeTeaser', { price: PRICING_ERSTE_HILFE_EUR })}{' '}
          <Link href="/erste-hilfe" className="text-green-500 underline hover:text-green-400">
            {t('ersteHilfeCta')}
          </Link>
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-sm text-text-muted">
          {t('budgetHint')}
        </p>

        <p className="mt-10 font-body text-sm font-medium uppercase tracking-wide text-text-muted">
          {t('step1')}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {CLASSES.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              data-testid={`calculator-class-${cls}`}
              className={`min-w-[140px] rounded-xl border-2 px-6 py-4 font-heading text-lg font-bold italic uppercase transition-all duration-300 ${
                selectedClass === cls
                  ? 'scale-105 border-green-500 bg-green-500/10 text-green-500 shadow-glow'
                  : 'border-white/15 bg-card text-white hover:border-green-500/40'
              }`}
            >
              {cls === 'B'
                ? t('classBLabel')
                : cls === 'BF17'
                  ? t('classBF17Label')
                  : cls === 'B197'
                    ? t('classB197Label')
                    : t('classBELabel')}
            </button>
          ))}
        </div>

        {selectedClass && (
          <div className="mt-10 space-y-6">
            <div>
              <label className="block font-body text-sm font-medium text-text-muted">
                {t('step2Hours')}: <span className="font-display text-white">{hours}</span>
              </label>
              <input
                type="range"
                min={15}
                max={38}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-2 h-2 w-full appearance-none rounded-full bg-card accent-green-500"
              />
              <p className="mt-2 font-body text-xs text-text-muted">{t('hoursHint')}</p>
            </div>
          </div>
        )}

        {selectedClass && (
          <div className="mt-12 rounded-xl border border-[rgba(93,196,34,0.2)] bg-card p-6 md:p-8">
            <p className="font-body text-sm uppercase tracking-wide text-text-muted">
              {t('resultLabel')}
            </p>
            <p className="mt-2 font-display text-4xl font-bold text-green-500 sm:text-5xl">
              ~{displayTotal.toLocaleString('de-DE')} €
            </p>

            <button
              type="button"
              onClick={() => setBreakdownOpen((o) => !o)}
              className="mt-4 flex w-full items-center justify-between font-body text-sm text-text-muted hover:text-white"
              data-testid="calculator-breakdown-toggle"
            >
              <span>{t('breakdownToggle')}</span>
              <span className="transition-transform" style={{ transform: breakdownOpen ? 'rotate(180deg)' : 'none' }}>
                ▼
              </span>
            </button>
            {breakdownOpen && (
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 font-body text-sm">
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownRegistration')}</span>
                  <span className="font-display text-white">{PRICING_REGISTRATION_EUR} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownApp')}</span>
                  <span className="font-display text-white">{PRICING_APP_EUR} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">
                    ✓ {t('breakdownHours')} ({hours} × {PRICING_LESSON_HOUR_EUR} €)
                  </span>
                  <span className="font-display text-white">{hoursCost.toLocaleString('de-DE')} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownTheory')}</span>
                  <span className="font-display text-white">{t('breakdownTheoryIncl')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownTuv')}</span>
                  <span className="font-display text-white">ca. {PRICING_TUV_EUR} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">~ {t('breakdownOther')}</span>
                  <span className="font-display text-white">ca. {PRICING_OTHER_EUR} €</span>
                </li>
              </ul>
            )}

            <p className="mt-4 text-xs text-text-muted">{t('disclaimer')}</p>

            <Link
              href="/anmelden"
              className="btn-primary mt-8 flex w-full items-center justify-center gap-2 py-4 text-base"
              data-cta
              data-magnetic
            >
              🏁 {t('cta')}
            </Link>
            <Link
              href="/anmelden"
              className="mt-3 block text-center font-body text-sm text-green-500 underline hover:text-green-400"
            >
              {t('ctaSub')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
