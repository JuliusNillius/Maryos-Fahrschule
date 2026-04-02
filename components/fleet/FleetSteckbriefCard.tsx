'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FleetVehicle } from '@/lib/fleet';

type FleetSteckbriefCardProps = {
  vehicle: FleetVehicle;
  onOpenSteckbrief: () => void;
};

export default function FleetSteckbriefCard({ vehicle, onOpenSteckbrief }: FleetSteckbriefCardProps) {
  const t = useTranslations('fleet');
  const psDisplay =
    vehicle.powerPs != null && Number.isFinite(vehicle.powerPs)
      ? `${vehicle.powerPs} ${t('powerUnit')}`
      : t('notSpecified');
  return (
    <article className="card-style relative flex w-[82vw] shrink-0 snap-center flex-col overflow-hidden border border-[rgba(93,196,34,0.18)] bg-gradient-to-b from-[#101010] to-bg shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:w-[420px]">
      <div className="flex items-stretch gap-0">
        <div className="w-1.5 shrink-0 bg-gradient-to-b from-green-primary via-green-primary/70 to-green-primary/30" aria-hidden />
        <div className="min-w-0 flex-1 px-4 pb-3 pt-4">
          <p className="font-display text-[10px] uppercase tracking-[0.35em] text-green-primary/90">{t('dossier')}</p>
          <h3 className="mt-2 font-heading text-xl font-bold italic uppercase tracking-tight text-white md:text-2xl">
            {vehicle.model}
          </h3>
          <p className="mt-1 font-body text-xs text-text-muted">{t('dossierSub')}</p>
        </div>
      </div>

      <div className="px-3 pb-1 md:px-4">
        <button
          type="button"
          onClick={onOpenSteckbrief}
          className="group relative block w-full overflow-hidden rounded-xl border border-[rgba(93,196,34,0.22)] bg-[#070707] text-left shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] outline-none ring-green-primary/40 transition hover:border-green-primary/50 focus-visible:ring-2"
          aria-label={t('openSteckbrief')}
        >
          <div className="relative aspect-[16/10] w-full">
            {vehicle.image ? (
              <Image
                src={vehicle.image}
                alt={vehicle.model}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                sizes="(max-width:768px) 85vw, 420px"
              />
            ) : (
              <div className="flex h-full min-h-[180px] items-center justify-center bg-surface2 text-4xl text-text-muted">🚗</div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/20 bg-bg/75 px-3 py-1 font-display text-[10px] uppercase tracking-wider text-white backdrop-blur-sm">
              {t('tapHint')}
            </span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-surface2/60 p-3">
          <p className="font-display text-[9px] uppercase tracking-widest text-text-muted">{t('transmissionLabel')}</p>
          <p className="mt-1 font-heading text-sm font-bold uppercase text-white">
            {vehicle.transmission === 'manual' ? t('manual') : t('automatic')}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-surface2/60 p-3">
          <p className="font-display text-[9px] uppercase tracking-widest text-text-muted">{t('psStatLabel')}</p>
          <p className="mt-1 font-heading text-sm font-bold uppercase text-green-primary">{psDisplay}</p>
        </div>
      </div>
    </article>
  );
}
