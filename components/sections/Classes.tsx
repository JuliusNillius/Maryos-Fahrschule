'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { setRegistrationClass } from '@/lib/registration';

const CLASS_IDS = ['b', 'be', 'a', 'a2', 'a1', 'am'] as const;

type ClassesProps = { embedded?: boolean };

export default function Classes({ embedded }: ClassesProps) {
  const t = useTranslations('classes');
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
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out' },
          '-=0.5'
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const scrollToAnmelden = (classId: string) => {
    setRegistrationClass(classId.toUpperCase());
    const el = document.getElementById('anmelden');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const Wrapper = embedded ? 'div' : 'section';
  return (
    <Wrapper
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      {...(!embedded && { id: 'fuehrerscheine' })}
      className={embedded ? 'py-12 md:py-16' : 'section-divider scroll-mt-20 bg-bg py-20 md:py-28'}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className="mb-14 text-center font-heading text-3xl font-bold italic uppercase tracking-[-0.02em] text-white sm:text-4xl md:text-5xl"
        >
          {t('heading')}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CLASS_IDS.map((id, i) => {
            const badge = id === 'b' ? t('badgePopular') : id === 'a' ? t('badgePro') : null;
            return (
              <div
                key={id}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className="card-style group relative overflow-hidden p-6"
              >
                <span
                  className="pointer-events-none absolute right-4 top-4 font-display text-7xl font-bold text-green-primary opacity-[0.04] sm:text-8xl"
                  aria-hidden
                >
                  {id.toUpperCase()}
                </span>
                <div className="relative">
                  <h3 className="font-heading text-xl font-bold italic uppercase tracking-tight text-white">
                    {id.toUpperCase()} — {t(`${id}Title`)}
                  </h3>
                  <p className="mt-1 font-body text-sm text-green-primary">{t(`${id}Subtitle`)}</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                    {t(`${id}Detail`)}
                  </p>
                  {badge && (
                    <span className="mt-3 inline-block rounded-full border border-green-primary/50 bg-green-primary/10 px-3 py-1 font-body text-xs uppercase tracking-wide text-green-primary">
                      {badge}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => scrollToAnmelden(id)}
                    className="btn-ghost mt-4 gap-2"
                    data-cta
                    data-testid={`classes-cta-${id}`}
                  >
                    → {t('cta')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}
