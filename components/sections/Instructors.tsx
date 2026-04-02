'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLangFlag, type Instructor, type InstructorLang } from '@/lib/instructors';
import { setRegistrationInstructor } from '@/lib/registration';

gsap.registerPlugin(ScrollTrigger);

const LANG_FILTERS: InstructorLang[] = ['de', 'ar', 'tr', 'en'];
function filterInstructors(
  instructors: Instructor[],
  langFilters: Set<InstructorLang>,
  availabilityOnly: boolean
): Instructor[] {
  return instructors.filter((inst) => {
    if (availabilityOnly && !inst.available) return false;
    if (langFilters.size > 0 && !inst.languages.some((l) => langFilters.has(l))) return false;
    return true;
  });
}

type InstructorsProps = { instructors?: Instructor[] };

export default function Instructors({ instructors }: InstructorsProps) {
  const list = instructors?.length ? instructors : [];
  const t = useTranslations('instructors');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [langFilters, setLangFilters] = useState<Set<InstructorLang>>(new Set());
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  const filtered = filterInstructors(list, langFilters, availabilityOnly);
  const slideIdsKey = useMemo(() => filtered.map((i) => i.id).join(','), [filtered]);

  const toggleLang = (lang: InstructorLang) => {
    setLangFilters((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang);
      else next.add(lang);
      return next;
    });
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
  });

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0);
  }, [emblaApi, slideIdsKey]);

  const scrollToAnmelden = (instructorId: string) => {
    setRegistrationInstructor(instructorId);
    document.getElementById('anmelden')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lehrer"
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className="mb-2 text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {t('heading')}
        </h2>
        <p className="mb-10 text-center font-body text-text-muted">{t('subheading')}</p>

        {/* Filter bar – fest über der Fahrlehrer-Liste, scrollt mit dem Inhalt */}
        <div className="z-10 mb-8 flex flex-wrap items-center justify-center gap-4 rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface/95 p-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-xs uppercase text-text-muted">{t('filterLang')}</span>
            {LANG_FILTERS.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLang(lang)}
                data-testid={`instructors-filter-lang-${lang}`}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  langFilters.has(lang)
                    ? 'bg-green-primary/25 text-green-primary'
                    : 'bg-surface2 text-text-muted hover:text-white'
                }`}
                title={lang}
              >
                {getLangFlag(lang)}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => setAvailabilityOnly(e.target.checked)}
              className="h-4 w-4 rounded border-green-primary bg-surface2 text-green-primary focus:ring-green-primary"
            />
            <span className="font-body text-sm text-text-muted">{t('filterAvailable')}</span>
          </label>
        </div>

        {/* Carousel — kein touch-pan-y: sonst blockiert der Browser horizontales Wischen auf dem Handy */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {filtered.length === 0 ? (
              <p className="w-full py-12 text-center font-body text-text-muted">
                {t('noResults')}
              </p>
            ) : (
              filtered.map((inst) => (
                <div
                  key={inst.id}
                  className="card-style relative min-w-[85vw] shrink-0 overflow-hidden sm:min-w-[45vw] lg:min-w-[32%]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface2">
                    <Image
                      src={inst.image}
                      alt={inst.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
                    />
                    {/* Starker unterer Verlauf: helle Fotos sonst „fressen“ grauen Text */}
                    <div
                      className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black from-[8%] via-black/85 via-[42%] to-transparent to-[78%]"
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-[2] p-4 pt-16 [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_0_20px_rgba(0,0,0,0.65)]">
                      <h3 className="font-heading text-lg font-bold italic uppercase tracking-tight text-white">
                        {inst.name}
                      </h3>
                      <p className="font-body text-sm font-medium text-green-primary [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                        {inst.title}
                      </p>
                      <div className="mt-1 flex gap-1 text-yellow-400 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]" aria-hidden>
                        {'★'.repeat(5)}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1 font-body text-sm text-white/90">
                        {inst.languages.map((l) => (
                          <span key={l}>{getLangFlag(l)}</span>
                        ))}
                        <span className="text-green-primary">·</span>
                        <span>{inst.classes.join(' · ')}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {inst.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-white/10 bg-black/55 px-2 py-0.5 font-body text-xs text-white/95 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            inst.available ? 'animate-pulse bg-green-primary' : 'bg-red-500'
                          }`}
                          aria-hidden
                        />
                        <span className="font-body text-xs text-white/90">
                          {inst.available ? t('available') : t('unavailable')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToAnmelden(inst.id)}
                        disabled={!inst.available}
                        className="btn-primary mt-3 w-full gap-2 text-center disabled:opacity-50"
                        data-cta
                        data-testid={`instructors-cta-${inst.id}`}
                      >
                        {t('cta', { name: inst.name })}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {filtered.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-12 min-w-[3rem] items-center justify-center rounded-full border border-green-primary/40 bg-surface2 px-4 font-heading text-lg text-green-primary active:scale-95"
              aria-label={t('carouselPrev')}
            >
              ←
            </button>
            <p className="max-w-[10rem] text-center font-body text-xs text-text-muted">{t('carouselSwipeHint')}</p>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-12 min-w-[3rem] items-center justify-center rounded-full border border-green-primary/40 bg-surface2 px-4 font-heading text-lg text-green-primary active:scale-95"
              aria-label={t('carouselNext')}
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
