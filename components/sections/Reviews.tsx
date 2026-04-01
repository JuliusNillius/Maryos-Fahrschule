'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GoogleReviewQuote } from '@/lib/site-data';

gsap.registerPlugin(ScrollTrigger);

type ReviewsProps = {
  stats?: {
    googleRating?: number;
    googleReviews?: number;
  } | null;
  quotes?: GoogleReviewQuote[] | null;
};

function Stars({ rating }: { rating: number }) {
  const r = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <span className="text-green-primary" aria-hidden>
      {'★'.repeat(r)}
      <span className="text-white/20">{'★'.repeat(5 - r)}</span>
    </span>
  );
}

function quoteBody(q: GoogleReviewQuote, locale: string): string {
  if (locale === 'tr' && q.text_tr?.trim()) return q.text_tr.trim();
  if (locale === 'ar' && q.text_ar?.trim()) return q.text_ar.trim();
  return (q.text_de ?? '').trim();
}

export default function Reviews({ stats, quotes }: ReviewsProps) {
  const t = useTranslations('reviews');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const rating = stats?.googleRating;
  const count = stats?.googleReviews;
  const hasStats = typeof rating === 'number' || typeof count === 'number';

  const validQuotes = useMemo(() => {
    const raw = quotes ?? [];
    return raw.filter((q) => quoteBody(q, locale).length > 0);
  }, [quotes, locale]);

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
    const list = listRef.current;
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
      if (list && validQuotes.length > 0) {
        tl.fromTo(list, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }, '-=0.45');
      }
    }, section);
    return () => ctx.revert();
  }, [validQuotes.length]);

  if (!hasStats && validQuotes.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="section-divider bg-bg py-20 md:py-28"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {hasStats && (
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
        )}

        {validQuotes.length > 0 && (
          <div ref={listRef} className={hasStats ? 'mt-12' : ''}>
            {!hasStats && (
              <h2
                id="reviews-heading"
                className="text-center font-heading text-3xl font-bold italic uppercase text-text md:text-4xl"
              >
                {t('quotesHeading')}
              </h2>
            )}
            <ul className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {validQuotes.map((q, i) => (
                <li key={i}>
                  <figure className="h-full rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface/60 p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-lg" title={`${Math.min(5, Math.max(0, Math.round(q.rating)))} / 5`}>
                        <Stars rating={q.rating} />
                      </div>
                      <span className="font-body text-xs uppercase tracking-wide text-text-muted">{t('sourceGoogle')}</span>
                    </div>
                    <blockquote className="mt-4 font-body text-sm leading-relaxed text-text md:text-base">
                      <span className="text-green-primary/80" aria-hidden>
                        „
                      </span>
                      {quoteBody(q, locale)}
                      <span className="text-green-primary/80" aria-hidden>
                        “
                      </span>
                    </blockquote>
                    <figcaption className="mt-4 font-body text-xs text-text-muted">
                      — {q.author?.trim() ? q.author.trim() : t('anonymousReviewer')}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center font-body text-xs text-text-muted">{t('quotesHint')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
