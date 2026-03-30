'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { key: 'step1', icon: '📱' },
  { key: 'step2', icon: '💳' },
  { key: 'step3', icon: '📚' },
  { key: 'step4', icon: '🚗' },
  { key: 'step5', icon: '✅' },
  { key: 'step6', icon: '🏆' },
] as const;

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const line = lineRef.current;
    const steps = stepRefs.current.filter(Boolean);

    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
      });
      if (heading) {
        tl.fromTo(heading, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
      }
      if (line) {
        tl.fromTo(
          line,
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 1.2, ease: 'power2.inOut' },
          '-=0.5'
        );
      }
      steps.forEach((step, i) => {
        const fromSide = i % 2 === 0 ? -80 : 80;
        gsap.fromTo(
          step,
          { x: fromSide, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, section);

    return function cleanup() {
      ctx.revert();
    };
  }, []);

  const headingText = t('heading');
  return (
    <section
      id="ablauf"
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className="mb-16 text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {headingText}
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Green progress line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-green-primary"
            style={{ transform: 'translateX(-50%) scaleY(0)', transformOrigin: 'top center' }}
            aria-hidden
          />

          {STEPS.map(({ key: stepKey, icon }, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={stepKey}
                ref={(el) => {
                  if (el) stepRefs.current[i] = el;
                }}
                className="relative flex w-full items-stretch gap-0 py-8 md:py-10"
              >
                {/* Left column: content when isLeft */}
                <div className="flex flex-1 flex-col justify-center pr-4 md:pr-8">
                  {isLeft && (
                    <div className="rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface p-6 md:mr-4 md:max-w-sm md:text-right">
                      <span className="text-3xl" aria-hidden>{icon}</span>
                      <h3 className="mt-2 font-heading text-lg font-bold italic uppercase tracking-tight text-white">
                        {t(stepKey + 'Title')}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
                        {t(stepKey + 'Desc')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center: dot (line is drawn by lineRef behind) */}
                <div className="relative flex w-8 shrink-0 items-center justify-center md:w-12">
                  <div className="z-10 h-4 w-4 shrink-0 rounded-full border-2 border-green-primary bg-bg md:h-5 md:w-5" aria-hidden />
                </div>

                {/* Right column: content when !isLeft */}
                <div className="flex flex-1 flex-col justify-center pl-4 md:pl-8">
                  {!isLeft && (
                    <div className="rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface p-6 md:ml-4 md:max-w-sm md:text-left">
                      <span className="text-3xl" aria-hidden>{icon}</span>
                      <h3 className="mt-2 font-heading text-lg font-bold italic uppercase tracking-tight text-white">
                        {t(stepKey + 'Title')}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
                        {t(stepKey + 'Desc')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Step number (background) */}
                <div
                  className={
                    'pointer-events-none absolute top-1/2 -translate-y-1/2 font-display text-7xl font-bold text-green-primary opacity-20 sm:text-8xl md:text-9xl ' +
                    (isLeft ? 'left-0 md:left-4' : 'right-0 md:right-4')
                  }
                  aria-hidden
                >
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
