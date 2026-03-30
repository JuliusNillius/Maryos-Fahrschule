'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLangFlag, getClassesForFilter, type Instructor, type InstructorLang } from '@/lib/instructors';
import { setRegistrationInstructor } from '@/lib/registration';

gsap.registerPlugin(ScrollTrigger);

const LANG_FILTERS: InstructorLang[] = ['de', 'ar', 'tr', 'ru', 'en', 'fr'];
const CLASS_FILTERS = ['all', 'pkw', 'motorrad'] as const;

function filterInstructors(
  instructors: Instructor[],
  langFilters: Set<InstructorLang>,
  classFilter: (typeof CLASS_FILTERS)[number],
  availabilityOnly: boolean
): Instructor[] {
  return instructors.filter((inst) => {
    if (availabilityOnly && !inst.available) return false;
    if (langFilters.size > 0 && !inst.languages.some((l) => langFilters.has(l))) return false;
    const instType = getClassesForFilter(inst.classes);
    if (classFilter === 'pkw' && instType !== 'pkw' && instType !== 'both') return false;
    if (classFilter === 'motorrad' && instType !== 'motorrad' && instType !== 'both') return false;
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
  const [classFilter, setClassFilter] = useState<(typeof CLASS_FILTERS)[number]>('all');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  const filtered = filterInstructors(list, langFilters, classFilter, availabilityOnly);

  const toggleLang = (lang: InstructorLang) => {
    setLangFilters((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang);
      else next.add(lang);
      return next;
    });
  };

  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
  });

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-xs uppercase text-text-muted">{t('filterClass')}</span>
            {CLASS_FILTERS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setClassFilter(c)}
                data-testid={`instructors-filter-class-${c}`}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  classFilter === c
                    ? 'bg-green-primary/25 text-green-primary'
                    : 'bg-surface2 text-text-muted hover:text-white'
                }`}
              >
                {t(c === 'all' ? 'filterAll' : c === 'pkw' ? 'filterPkw' : 'filterMotorrad')}
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

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-6">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading text-lg font-bold italic uppercase tracking-tight text-white">
                        {inst.name}
                      </h3>
                      <p className="font-body text-sm text-green-primary">{inst.title}</p>
                      <div className="mt-1 flex gap-1 text-yellow-400" aria-hidden>
                        {'★'.repeat(5)}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1 font-body text-sm text-text-muted">
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
                            className="rounded bg-white/10 px-2 py-0.5 font-body text-xs text-text-muted"
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
                        <span className="font-body text-xs text-text-muted">
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
      </div>
    </section>
  );
}
