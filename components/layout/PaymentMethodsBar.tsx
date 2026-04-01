'use client';

import { useTranslations } from 'next-intl';

/** Kompakte Zahlungsmarken (Footer) — orientiert an gängigen Checkout-Leisten; Abrechnung über Stripe. */
export default function PaymentMethodsBar() {
  const t = useTranslations('footer');

  return (
    <div className="border-t border-[rgba(93,196,34,0.12)] bg-black/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-body text-xs font-medium uppercase tracking-[0.2em] text-green-primary/90">
          {t('paymentSecure')}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-center font-body text-xs leading-relaxed text-text-muted">
          {t('paymentHint')}
        </p>
        <ul
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-4 md:gap-x-8"
          aria-label={t('paymentAria')}
        >
          <li>
            <span className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white px-2.5">
              <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold text-black">
                <AppleGlyph className="h-5 w-4 shrink-0 text-black" aria-hidden />
                Pay
              </span>
            </span>
          </li>
          <li>
            <span className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white px-2.5">
              <span className="flex items-center gap-1 font-sans text-[12px] font-medium text-[#5F6368]">
                <GoogleG className="h-5 w-5 shrink-0" aria-hidden />
                <span className="text-[#5F6368]">Pay</span>
              </span>
            </span>
          </li>
          <li>
            <span className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white px-3">
              <span className="font-sans text-[14px] font-bold italic tracking-tight" aria-hidden>
                <span className="text-[#003087]">Pay</span>
                <span className="text-[#009CDE]">Pal</span>
              </span>
            </span>
          </li>
          <li>
            <span className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white px-2.5">
              <span className="font-sans text-[13px] font-black tracking-tight text-[#1434CB]">VISA</span>
            </span>
          </li>
          <li>
            <span className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white px-3">
              <MastercardSymbol className="h-6 w-10" aria-hidden />
            </span>
          </li>
          <li>
            <span className="inline-flex h-9 items-center rounded-md border border-white/10 bg-[#FFB3C7] px-3">
              <span className="font-sans text-[13px] font-bold tracking-tight text-[#0B0515]">Klarna</span>
            </span>
          </li>
          <li>
            <span className="inline-flex h-9 items-center rounded-md border border-white/15 bg-white/10 px-3">
              <span className="font-sans text-[11px] font-semibold tracking-wide text-white/90">
                {t('paymentDebit')}
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M11.6 9c0-2.5 2.1-3.7 2.2-3.8-1.2-1.8-3.1-2-3.8-2-1.6.2-3.1 1-3.9 1-.8 0-2-.9-3.3-.9C1.5 3.3 0 5.2 0 7.6c0 1.6.6 3.3 1.4 4.2.7.8 1.9 1.8 3.2 1.8 1.2 0 1.7-.5 3.1-.5 1.5 0 1.9.5 3.2.5 1.3 0 2.2-1.1 2.9-2 .9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.5-3.8zM9.5 2.4c.7-.8 1.1-1.9 1-3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.9-1.4z" />
    </svg>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function MastercardSymbol({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block h-6 w-10 shrink-0 ${className ?? ''}`} aria-hidden>
      <span className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#EB001B]" />
      <span className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#F79E1B] opacity-[0.92]" />
    </span>
  );
}
