'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ReviewsProps = {
  stats?: {
    googleRating?: number;
    googleReviews?: number;
  } | null;
};

export default function Reviews({ stats }: ReviewsProps) {
  const t = useTranslations('reviews');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  const rating = stats?.googleRating;
  const count = stats?.googleReviews;
  const hasStats = typeof rating === 'number' || typeof count === 'number';

  const headingText = useMemo(() => {
    if (typeof rating === 'number' && Number.isFinite(rating)) return `${rating.toFixed(1)} / 5.0 ★★★★★`;
    return t('headingFallback');
  }, [rating, t]);

  const subText = useMemo(() => {
    if (typeof count === 'number' && Number.isFinite(count)) return t('subtextCount', { count });
    return t('subtextGeneric');
  }, [count, t]);

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

  if (!hasStats) return null;

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
            {headingText.split('★★★★★')[0]}
            <span className="text-green-primary">★★★★★</span>
          </h2>
          <p ref={subRef} className="mt-2 font-body text-text-muted">
            {subText}
          </p>
        </div>
      </div>
    </section>
  );
}
