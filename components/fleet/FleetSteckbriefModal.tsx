'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FleetVehicle } from '@/lib/fleet';

type FleetSteckbriefModalProps = {
  vehicle: FleetVehicle;
  onClose: () => void;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/10 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="font-display text-[10px] uppercase tracking-widest text-text-muted">{label}</span>
      <span className="font-body text-sm font-medium text-white sm:text-right">{children}</span>
    </div>
  );
}

export default function FleetSteckbriefModal({ vehicle, onClose }: FleetSteckbriefModalProps) {
  const t = useTranslations('fleet');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const yesNo = (v: boolean) => (v ? t('yes') : t('no'));
  const ps =
    vehicle.powerPs != null && Number.isFinite(vehicle.powerPs)
      ? `${vehicle.powerPs} ${t('powerUnit')}`
      : t('notSpecified');

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/85 p-4 md:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-lg overflow-hidden rounded-xl border border-[rgba(93,196,34,0.25)] bg-gradient-to-b from-[#121212] to-bg shadow-[0_24px_100px_rgba(0,0,0,0.55)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fleet-steckbrief-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-stretch gap-0 border-b border-white/10">
          <div className="w-1.5 shrink-0 bg-gradient-to-b from-green-primary via-green-primary/60 to-green-primary/20" aria-hidden />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3 px-4 py-4">
            <div className="min-w-0">
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-green-primary/90">{t('steckbriefBadge')}</p>
              <h2 id="fleet-steckbrief-title" className="mt-1 font-heading text-xl font-bold italic uppercase tracking-tight text-white md:text-2xl">
                {vehicle.model}
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 font-body text-sm text-white hover:bg-white/10"
            >
              {t('close')}
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/10] w-full bg-surface2">
          {vehicle.image ? (
            <Image src={vehicle.image} alt={vehicle.model} fill className="object-cover" sizes="(max-width:768px) 100vw, 512px" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-text-muted" aria-hidden>
              🚗
            </div>
          )}
        </div>

        <div className="px-4 pb-5 pt-2 md:px-5">
          <Row label={t('powerLabel')}>{ps}</Row>
          <Row label={t('transmissionLabel')}>
            {vehicle.transmission === 'manual' ? t('manual') : t('automatic')}
          </Row>
          <Row label={t('assistanceLabel')}>{yesNo(!!vehicle.hasDriverAssistance)}</Row>
          <Row label={t('carplayLabel')}>{yesNo(!!vehicle.hasAppleCarplay)}</Row>
          {vehicle.steckbriefNotes ? (
            <div className="pt-4">
              <p className="font-display text-[10px] uppercase tracking-widest text-text-muted">{t('notesLabel')}</p>
              <p className="mt-2 whitespace-pre-wrap font-body text-sm leading-relaxed text-white/90">{vehicle.steckbriefNotes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
