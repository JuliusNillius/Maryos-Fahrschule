'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * WhatsApp & Termin nur über FloatingActions — hier Anruf + Anmeldung für schnellen Daumen-Zugriff.
 */
export default function MobileBottomBar() {
  const t = useTranslations('mobileBar');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[rgba(93,196,34,0.2)] bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        href="tel:+491784557528"
        className="flex flex-1 flex-col items-center gap-1 py-3 font-body text-xs font-medium text-text-muted transition-colors active:bg-surface2"
        aria-label={t('call')}
      >
        <span aria-hidden>📞</span>
        {t('call')}
      </a>
      <Link
        href="/anmelden"
        className="flex flex-1 flex-col items-center gap-1 bg-green-primary py-3 font-heading text-xs font-bold uppercase tracking-wide text-black transition-colors active:bg-green-dark"
        data-cta
      >
        <span aria-hidden>🏁</span>
        {t('register')}
      </Link>
    </div>
  );
}
