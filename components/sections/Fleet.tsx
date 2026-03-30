'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLEET, type FleetVehicle } from '@/lib/fleet';

gsap.registerPlugin(ScrollTrigger);

type FleetProps = { vehicles?: FleetVehicle[]; sectionId?: string };

export default function Fleet({ vehicles, sectionId = 'fahrzeuge' }: FleetProps) {
  const list = vehicles?.length ? vehicles : FLEET;
  const t = useTranslations('fleet');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
      });
      if (heading) {
        tl.fromTo(heading, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
      }
      cards.forEach((card, i) => {
        const img = card?.querySelector('[data-parallax]');
        if (card && img) {
          gsap.fromTo(
            card,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
              delay: i * 0.06,
            }
          );
          gsap.to(img, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className="mb-12 text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {t('heading')}
        </h2>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden pb-6 pt-4 md:gap-8 md:pb-8"
      >
        <div className="w-4 shrink-0 md:w-8" aria-hidden />
        {list.map((vehicle, i) => (
          <div
            key={vehicle.id}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            className="card-style relative w-[75vw] shrink-0 snap-center overflow-hidden md:w-[380px]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface2">
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
              <div
                className="absolute inset-0 h-[120%] w-full"
                data-parallax
              >
                <Image
                  src={vehicle.image}
                  alt={vehicle.model}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 75vw, 380px"
                />
              </div>
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-green-primary/50 bg-bg/80 px-3 py-1 font-body text-xs uppercase tracking-wide text-green-primary backdrop-blur-sm">
                  {vehicle.transmission === 'manual' ? t('manual') : t('automatic')}
                </span>
                {vehicle.classes.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-green-primary/20 px-3 py-1 font-display text-xs font-bold text-green-primary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-heading text-lg font-bold italic uppercase tracking-tight text-white">
                {vehicle.model}
              </h3>
              <p className="mt-1 font-body text-sm text-text-muted">
                {t('class')}: {vehicle.classes.join(', ')}
              </p>
            </div>
          </div>
        ))}
        <div className="w-4 shrink-0 md:w-8" aria-hidden />
      </div>
    </section>
  );
}
