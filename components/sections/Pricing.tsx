'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/navigation';
import { setRegistrationClass } from '@/lib/registration';
import type { PricingItem } from '@/lib/site-data';

gsap.registerPlugin(ScrollTrigger);

const PRICING_FALLBACK = [
  { id: 'b', price: '1.800', popular: true },
  { id: 'be', price: '500', note: 'addOn' },
  { id: 'a', price: '900' },
  { id: 'a2', price: '800' },
  { id: 'a1', price: '700' },
  { id: 'am', price: '500' },
] as const;

type PricingProps = { pricing?: PricingItem[] | null; embedded?: boolean };

export default function Pricing({ pricing, embedded }: PricingProps) {
  const items = pricing?.length
    ? pricing.map((p) => ({
        id: p.class_id,
        price: p.price,
        popular: p.popular,
        note: p.note ?? undefined,
      }))
    : [...PRICING_FALLBACK];
  const t = useTranslations('pricing');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
      });
      if (heading) {
        tl.fromTo(heading, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
      }
      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' },
          '-=0.5'
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const Wrapper = embedded ? 'div' : 'section';
  return (
    <Wrapper
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      {...(!embedded && { id: 'preise' })}
      className={embedded ? 'py-12 md:py-16' : 'section-divider scroll-mt-20 bg-bg py-20 md:py-28'}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className="mb-14 text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {t('heading')}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className={`relative overflow-hidden rounded-xl border bg-surface/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-primary/40 hover:shadow-[0_0_25px_rgba(93,196,34,0.15)] ${
                'popular' in item && item.popular
                  ? 'border-green-primary/50 shadow-[0_0_30px_rgba(93,196,34,0.12)]'
                  : 'border-[rgba(93,196,34,0.15)]'
              }`}
            >
              <span
                className="pointer-events-none absolute right-4 top-4 font-display text-6xl font-bold text-green-primary opacity-[0.03] sm:text-7xl"
                aria-hidden
              >
                {item.id.toUpperCase()}
              </span>
              <div className="relative">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-heading text-xl font-bold italic uppercase text-white">
                    {item.id.toUpperCase()}
                  </span>
                  {'popular' in item && item.popular && (
                    <span className="rounded-full border border-green-primary/50 bg-green-primary/15 px-3 py-1 font-body text-xs uppercase tracking-wide text-green-primary">
                      {t('badgePopular')}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-display text-2xl font-bold text-green-primary">
                  {t('from')} {item.price} €
                </p>
                {'note' in item && item.note === 'addOn' && (
                  <p className="mt-1 font-body text-xs text-text-muted">{t('addOnNote')}</p>
                )}
                <ul className="mt-6 space-y-2 font-body text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <span className="text-green-primary">✓</span> {t('inclRegistration')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-primary">✓</span> {t('inclMaterial')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-primary">✓</span> {t('inclTheory')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-primary">✓</span> {t('inclFirstAid')}
                  </li>
                  <li className="flex items-center gap-2 text-text-muted/80">
                    <span className="text-red-500/80">✗</span> {t('exclDriving')}
                  </li>
                  <li className="flex items-center gap-2 text-text-muted/80">
                    <span className="text-red-500/80">✗</span> {t('exclExam')}
                  </li>
                </ul>
                <Link
                  href="/anmelden"
                  onClick={() => setRegistrationClass(item.id.toUpperCase())}
                  className="btn-primary mt-6 w-full justify-center"
                  data-cta
                  data-testid={`pricing-cta-${item.id}`}
                >
                  {t('cta')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-2xl font-body text-xs leading-relaxed text-text-muted">
          {t('disclaimer')}
        </p>
      </div>
    </Wrapper>
  );
}
