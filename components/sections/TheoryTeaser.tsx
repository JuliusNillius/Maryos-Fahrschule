'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/navigation';

gsap.registerPlugin(ScrollTrigger);

const PILLS = [
  { key: 'pill1', icon: '📱' },
  { key: 'pill2', icon: '🖐️' },
  { key: 'pill3', icon: '✅' },
] as const;

export default function TheoryTeaser() {
  const t = useTranslations('theoryTeaser');
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const pillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const sub = subRef.current;
    const pills = pillsRef.current.filter(Boolean);
    const cta = ctaRef.current;
    const glow = glowRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      if (glow) {
        gsap.set(glow, { scale: 0.8, opacity: 0 });
        tl.to(glow, { scale: 1.2, opacity: 0.4, duration: 1.2, ease: 'power2.out' }, 0);
      }
      if (headline) {
        tl.fromTo(
          headline,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.1)' },
          '-=0.8'
        );
      }
      if (sub) {
        tl.fromTo(sub, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.5');
      }
      pills.forEach((pill, i) => {
        tl.fromTo(
          pill,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.2)', stagger: 0.08 },
          '-=0.35'
        );
      });
      if (cta) {
        tl.fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2');
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="theorie"
      ref={sectionRef}
      className="section-divider scroll-mt-20 overflow-hidden bg-bg py-20 md:py-28"
    >
      {/* Hintergrund-Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(93,196,34,0.12) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div ref={wrapRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="relative text-center">
          <p className="mb-3 font-display text-xs uppercase tracking-[0.35em] text-green-500">
            {t('badge')}
          </p>
          <h2
            ref={headlineRef}
            className="font-heading text-4xl font-bold italic uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t('headline')}
          </h2>
          <p
            ref={subRef}
            className="mx-auto mt-5 max-w-2xl font-body text-lg text-text-muted md:text-xl"
          >
            {t('subheadline')}
          </p>
        </header>

        {/* 3 Pills – jung & dynamisch */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {PILLS.map(({ key, icon }, i) => (
            <div
              key={key}
              ref={(el) => {
                if (el) pillsRef.current[i] = el;
              }}
              className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-card/80 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:shadow-glow sm:px-6 sm:py-5"
            >
              <span className="text-2xl sm:text-3xl" aria-hidden>{icon}</span>
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wide text-green-500">
                  {t(`${key}Label`)}
                </p>
                <p className="font-body text-base font-medium text-white sm:text-lg">
                  {t(`${key}Text`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="mt-12 text-center">
          <Link
            href="/ablauf"
            className="btn-primary inline-flex h-14 items-center gap-2 px-8 text-base"
            data-cta
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
