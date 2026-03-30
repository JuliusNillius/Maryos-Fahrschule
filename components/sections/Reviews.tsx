'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    initials: 'KA',
    name: 'Khalid A.',
    date: 'Dez. 2025',
    text: "Maryo ist ein fantastischer Fahrlehrer! Sehr geduldig und erklärt alles auf Arabisch — das hat mir so geholfen.",
  },
  {
    initials: 'MS',
    name: 'Monika S.',
    date: 'Nov. 2025',
    text: "Hatte vorher Angst vor dem Fahren. Anna hat das komplett verändert. Beim ersten Versuch bestanden!",
  },
  {
    initials: 'TK',
    name: 'Tobias K.',
    date: 'Jan. 2026',
    text: "Super modern, alles online, Apple Pay — genau so muss eine Fahrschule 2025 sein.",
  },
  {
    initials: 'SB',
    name: 'Selin B.',
    date: 'Dez. 2025',
    text: "Can ist der beste Motorrad-Lehrer. Er nimmt sich Zeit und erklärt alles Schritt für Schritt.",
  },
  {
    initials: 'DM',
    name: 'Dmitrij M.',
    date: 'Nov. 2025',
    text: "Unterricht auf Russisch — endlich alles verstanden. Sehr professionell und freundlich.",
  },
  {
    initials: 'LY',
    name: 'Leyla Y.',
    date: 'Jan. 2026',
    text: "Von der Anmeldung bis zur Prüfung alles unkompliziert. Maryo's kann ich nur empfehlen!",
  },
  {
    initials: 'JW',
    name: 'Jan W.',
    date: 'Dez. 2025',
    text: "BF17 mit Maryo gemacht. Top Betreuung, faire Preise und immer erreichbar per WhatsApp.",
  },
  {
    initials: 'NK',
    name: 'Nadia K.',
    date: 'Nov. 2025',
    text: "Elena hat mich perfekt auf die Automatik-Prüfung vorbereitet. Danke für alles!",
  },
] as const;

function ReviewCard({
  initials,
  name,
  date,
  text,
  viaGoogle,
}: {
  initials: string;
  name: string;
  date: string;
  text: string;
  viaGoogle: string;
}) {
  return (
    <div className="card-style flex w-[320px] shrink-0 flex-col p-5 md:w-[360px]">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-primary font-display text-sm font-bold text-black"
          aria-hidden
        >
          {initials}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-text">{name}</p>
          <p className="text-xs text-text-muted">{viaGoogle}</p>
        </div>
      </div>
      <p className="mb-2 text-green-primary" aria-hidden>
        ★★★★★
      </p>
      <p className="font-body text-sm leading-relaxed text-text-muted">{text}</p>
      <p className="mt-2 text-xs text-text-muted">{date}</p>
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations('reviews');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const sub = subRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
      });
      if (heading) {
        tl.fromTo(heading, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
      }
      if (sub) {
        tl.fromTo(sub, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '-=0.6');
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const viaGoogle = t('viaGoogle');
  const row1 = REVIEWS.slice(0, 4);
  const row2 = REVIEWS.slice(4, 8);

  const Row1Content = () => (
    <div className="flex shrink-0 gap-6">
      {row1.map((r, i) => (
        <ReviewCard key={i} {...r} viaGoogle={viaGoogle} />
      ))}
    </div>
  );

  const Row2Content = () => (
    <div className="flex shrink-0 gap-6">
      {row2.map((r, i) => (
        <ReviewCard key={i} {...r} viaGoogle={viaGoogle} />
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="section-divider bg-bg py-20 md:py-28"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="reviews-heading"
            ref={headingRef}
            className="font-heading text-4xl font-bold italic uppercase tracking-wide text-text md:text-5xl"
          >
            5.0 / 5.0 <span className="text-green-primary">★★★★★</span>
          </h2>
          <p ref={subRef} className="mt-2 font-body text-text-muted">
            {t('subtext')}
          </p>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="flex w-max animate-reviews-marquee-left gap-6 py-2">
            <Row1Content />
            <Row1Content />
          </div>
          <div className="mt-6 flex w-max animate-reviews-marquee-right gap-6 py-2">
            <Row2Content />
            <Row2Content />
          </div>
        </div>
      </div>
    </section>
  );
}
