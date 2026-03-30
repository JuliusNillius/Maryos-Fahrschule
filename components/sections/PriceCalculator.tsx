'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from '@/i18n/navigation';

/**
 * §12 INTERACTIVE PRICE CALCULATOR
 * Step 1: Class selector (B, BE, A, A2, A1, AM) — green border + glow, scale 1.05
 * Step 2: Fahrstunden slider 10–60, Schaltung/Automatik (B only), Intensivkurs toggle
 * Step 3: Live total (count-up), collapsible breakdown, CTA
 */
const CLASSES = ['B', 'BE', 'A', 'A2', 'A1', 'AM'] as const;
type ClassId = (typeof CLASSES)[number];

const REGISTRATION = 99;
const TUV = 170;
const OTHER = 270;
const THEORY = 0;
const MANUAL_SURCHARGE_B = 200;
const INTENSIVE_SURCHARGE = 150;

const EUR_PER_HOUR: Record<ClassId, number> = {
  B: 60,
  BE: 25,
  A: 45,
  A2: 40,
  A1: 35,
  AM: 30,
};

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
  const [hours, setHours] = useState(30);
  const [transmission, setTransmission] = useState<'manual' | 'automatic'>('manual');
  const [intensive, setIntensive] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const isB = selectedClass === 'B';
  const hoursCost = selectedClass ? hours * EUR_PER_HOUR[selectedClass] : 0;
  const manualSurcharge = isB && transmission === 'manual' ? MANUAL_SURCHARGE_B : 0;
  const intensiveSurcharge = intensive ? INTENSIVE_SURCHARGE : 0;

  const total =
    selectedClass == null
      ? 0
      : REGISTRATION + hoursCost + THEORY + TUV + OTHER + manualSurcharge + intensiveSurcharge;

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

        {/* Step 1 — Class selector */}
        <p className="mt-10 font-body text-sm font-medium uppercase tracking-wide text-text-muted">
          {t('step1')}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CLASSES.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              data-testid={`calculator-class-${cls}`}
              className={`flex h-14 items-center justify-center rounded-xl border-2 font-display text-xl font-bold transition-all duration-300 ${
                selectedClass === cls
                  ? 'scale-105 border-green-500 bg-green-500/10 text-green-500 shadow-glow'
                  : 'border-white/15 bg-card text-white hover:border-green-500/40'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Step 2 — Sliders / toggles (stagger after class select) */}
        {selectedClass && (
          <div className="mt-10 space-y-6">
            <div>
              <label className="block font-body text-sm font-medium text-text-muted">
                {t('step2Hours')}: <span className="font-display text-white">{hours}</span>
              </label>
              <input
                type="range"
                min={10}
                max={60}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-2 h-2 w-full appearance-none rounded-full bg-card accent-green-500"
              />
            </div>

            {isB && (
              <div className="flex items-center gap-4">
                <span className="font-body text-sm text-text-muted">{t('step2Transmission')}</span>
                <div className="flex rounded-lg border border-white/15 bg-card p-1">
                  <button
                    type="button"
                    onClick={() => setTransmission('manual')}
                    data-testid="calculator-transmission-manual"
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      transmission === 'manual'
                        ? 'bg-green-500/20 text-green-500'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    Schaltung
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransmission('automatic')}
                    data-testid="calculator-transmission-automatic"
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      transmission === 'automatic'
                        ? 'bg-green-500/20 text-green-500'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    Automatik
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-text-muted">{t('step2Intensive')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={intensive}
                onClick={() => setIntensive((v) => !v)}
                data-testid="calculator-intensive-toggle"
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  intensive ? 'bg-green-500' : 'bg-card'
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                    intensive ? 'left-8 translate-x-[-22px]' : 'left-1'
                  }`}
                />
              </button>
              {intensive && (
                <span className="font-body text-xs text-green-500">+{INTENSIVE_SURCHARGE} €</span>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Live result */}
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
              <span>Aufschlüsselung</span>
              <span className="transition-transform" style={{ transform: breakdownOpen ? 'rotate(180deg)' : 'none' }}>
                ▼
              </span>
            </button>
            {breakdownOpen && (
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 font-body text-sm">
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownRegistration')}</span>
                  <span className="font-display text-white">99 €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownHours')} ({hours})</span>
                  <span className="font-display text-white">{hoursCost.toLocaleString('de-DE')} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownTheory')}</span>
                  <span className="font-display text-white">{t('breakdownTheoryIncl')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">✓ {t('breakdownTuv')}</span>
                  <span className="font-display text-white">ca. 170 €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">~ {t('breakdownOther')}</span>
                  <span className="font-display text-white">ca. 270 €</span>
                </li>
                {manualSurcharge > 0 && (
                  <li className="flex justify-between">
                    <span className="text-text-muted">+ Schaltung</span>
                    <span className="font-display text-white">200 €</span>
                  </li>
                )}
                {intensiveSurcharge > 0 && (
                  <li className="flex justify-between">
                    <span className="text-text-muted">+ {t('intensiveSurcharge')}</span>
                    <span className="font-display text-white">{INTENSIVE_SURCHARGE} €</span>
                  </li>
                )}
              </ul>
            )}

            <p className="mt-4 text-xs text-text-muted">
              {t('disclaimer')}
            </p>

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
