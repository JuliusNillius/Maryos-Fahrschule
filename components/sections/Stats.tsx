'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type StatsProps = {
  stats?: {
    googleRating?: number;
    googleReviews?: number;
    languages?: number;
    classes?: number;
  } | null;
};

const STATS_FALLBACK = [
  { key: 'google', value: 5, decimals: 1, suffix: '' },
  { key: 'reviews', value: 18, decimals: 0, suffix: '' },
  { key: 'languages', value: 3, decimals: 0, suffix: '' },
  { key: 'classes', value: 4, decimals: 0, suffix: '' },
] as const;

export default function Stats({ stats }: StatsProps) {
  const t = useTranslations('stats');
  const STATS = stats
    ? [
        { key: 'google' as const, value: stats.googleRating ?? 5, decimals: 1, suffix: '' },
        { key: 'reviews' as const, value: stats.googleReviews ?? 18, decimals: 0, suffix: '' },
        { key: 'languages' as const, value: stats.languages ?? 3, decimals: 0, suffix: '' },
        { key: 'classes' as const, value: stats.classes ?? 4, decimals: 0, suffix: '' },
      ]
    : STATS_FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const els = numberRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!section || els.length === 0) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        STATS.forEach((stat, i) => {
          const el = els[i];
          if (!el) return;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: stat.value,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent =
                stat.decimals > 0 ? obj.v.toFixed(stat.decimals) : String(Math.round(obj.v));
            },
          });
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/10 bg-surface/50 py-12 md:py-16"
      aria-label={t('ariaLabel')}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 px-4 sm:gap-14 md:gap-20">
        {STATS.map((stat, i) => (
          <div key={stat.key} className="flex flex-col items-center text-center">
            <span
              ref={(el) => {
                if (el) numberRefs.current[i] = el;
              }}
              className="font-display text-4xl font-bold text-green-500 sm:text-5xl md:text-6xl"
            >
              0
            </span>
            <span className="mt-1 font-body text-sm uppercase tracking-wider text-text-muted">
              {t(stat.key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
