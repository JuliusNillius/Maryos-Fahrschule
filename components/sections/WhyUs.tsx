'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { icon: '🎯', key: 'card1' },
  { icon: '🏍️', key: 'card2' },
  { icon: '🌍', key: 'card3' },
  { icon: '⭐', key: 'card4' },
  { icon: '📱', key: 'card5' },
  { icon: '💶', key: 'card6' },
] as const;

export default function WhyUs() {
  const t = useTranslations('whyUs');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
      if (heading) {
        tl.fromTo(heading, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
      }
      if (subheading) {
        tl.fromTo(subheading, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '-=0.6');
      }
      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)' },
          '-=0.4'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="warum"
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <h2
            ref={headingRef}
            className="font-heading text-3xl font-bold italic uppercase tracking-[-0.02em] text-white sm:text-4xl md:text-5xl"
          >
            {t('headingBefore')}{' '}
            <span className="text-green-primary">{t('headingHighlight')}</span>
          </h2>
          <p
            ref={subheadingRef}
            className="mt-4 font-body text-lg tracking-wide text-text-muted sm:text-xl"
          >
            {t('subheading')}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ icon, key }, i) => (
            <div
              key={key}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="group flex flex-col rounded-lg border border-white/10 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-green-500 hover:shadow-glow border-l-[3px] border-l-green-500"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 ring-1 ring-green-primary/20 text-2xl">
                {icon}
              </div>
              <h3 className="font-heading text-lg font-bold italic uppercase tracking-tight text-white">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-text-muted">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
