'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLEET, type FleetVehicle } from '@/lib/fleet';
import FleetSteckbriefCard from '@/components/fleet/FleetSteckbriefCard';
import FleetSteckbriefModal from '@/components/fleet/FleetSteckbriefModal';

gsap.registerPlugin(ScrollTrigger);

type FleetProps = { vehicles?: FleetVehicle[]; sectionId?: string };

export default function Fleet({ vehicles, sectionId = 'fahrzeuge' }: FleetProps) {
  const list = vehicles?.length ? vehicles : FLEET;
  const t = useTranslations('fleet');
  const [steckbriefId, setSteckbriefId] = useState<string | null>(null);
  const steckbriefVehicle = steckbriefId ? list.find((v) => v.id === steckbriefId) : undefined;
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
        if (!card) return;
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
      });
    }, section);

    return () => ctx.revert();
  }, [list.length]);

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
        {list.map((vehicle, index) => (
          <div
            key={vehicle.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="shrink-0 snap-center"
          >
            <FleetSteckbriefCard vehicle={vehicle} onOpenSteckbrief={() => setSteckbriefId(vehicle.id)} />
          </div>
        ))}
        <div className="w-4 shrink-0 md:w-8" aria-hidden />
      </div>

      {steckbriefVehicle ? (
        <FleetSteckbriefModal vehicle={steckbriefVehicle} onClose={() => setSteckbriefId(null)} />
      ) : null}
    </section>
  );
}
