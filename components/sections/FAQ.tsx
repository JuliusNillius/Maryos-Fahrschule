'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/navigation';
import type { FaqItem } from '@/lib/site-data';

gsap.registerPlugin(ScrollTrigger);

const FAQ_KEYS = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
] as const;

export type FAQVariant = 'default' | 'page';

type FAQProps = { faq?: FaqItem[] | null; locale?: string; variant?: FAQVariant };

const CATEGORY_ORDER = ['allgemein', 'preise', 'klassen', 'foerderung', 'anmeldung'] as const;
type CategoryId = (typeof CATEGORY_ORDER)[number] | 'alle';

/** Kategorie für die FAQ-Seite (Filter), nur für statische Keys aus messages. */
const FAQ_KEY_CATEGORIES: Partial<Record<(typeof FAQ_KEYS)[number], CategoryId>> = {
  q10: 'preise',
};

function AccordionItem({
  id,
  open,
  onToggle,
  question,
  answer,
  pageStyle,
}: {
  id: number;
  open: boolean;
  onToggle: () => void;
  question: string;
  answer: string;
  pageStyle: boolean;
}) {
  return (
    <div
      className={
        pageStyle
          ? 'rounded-xl border border-[rgba(93,196,34,0.12)] bg-surface/80 backdrop-blur-sm transition-colors hover:border-[rgba(93,196,34,0.28)]'
          : 'card-style overflow-hidden border-b border-[rgba(93,196,34,0.15)] last:border-b-0'
      }
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 py-5 pr-4 pl-4 text-left font-heading text-sm font-bold uppercase tracking-wide text-text transition-colors hover:text-green-primary md:text-base ${pageStyle ? 'md:pl-6 md:pr-6' : ''}`}
        aria-expanded={open}
        aria-controls={`faq-answer-${id}`}
        id={`faq-question-${id}`}
        data-testid={`faq-toggle-${id}`}
      >
        <span className="min-w-0">{question}</span>
        <span
          className={`shrink-0 text-green-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          ▼
        </span>
      </button>
      <div
        id={`faq-answer-${id}`}
        role="region"
        aria-labelledby={`faq-question-${id}`}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p
            className={`whitespace-pre-line pb-5 pr-4 pl-4 font-body text-sm leading-relaxed text-text-muted md:text-[15px] ${pageStyle ? 'md:pl-6 md:pr-6' : ''}`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ faq, locale = 'de', variant = 'default' }: FAQProps) {
  const t = useTranslations('faq');
  const tp = useTranslations('faqPage');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [openId, setOpenId] = useState<number | null>(variant === 'page' ? null : 0);
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const [filterCat, setFilterCat] = useState<CategoryId>('alle');
  const [query, setQuery] = useState('');

  const qKey =
    locale === 'tr' ? 'question_tr' : locale === 'ar' ? 'question_ar' : locale === 'en' ? 'question_en' : 'question_de';
  const aKey =
    locale === 'tr' ? 'answer_tr' : locale === 'ar' ? 'answer_ar' : locale === 'en' ? 'answer_en' : 'answer_de';

  const faqItems = useMemo(() => {
    if (faq?.length) {
      return faq.map((item, i) => ({
        id: i,
        category: (item.category as CategoryId) || 'allgemein',
        question: (item[qKey as keyof FaqItem] as string) || item.question_de,
        answer: (item[aKey as keyof FaqItem] as string) || item.answer_de,
      }));
    }
    return FAQ_KEYS.map((key, i) => ({
      id: i,
      category: (FAQ_KEY_CATEGORIES[key] ?? 'allgemein') as CategoryId,
      question: t(`${key}Q`),
      answer: t(`${key}A`),
    }));
  }, [faq, qKey, aKey, t]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqItems.filter((item) => {
      if (filterCat !== 'alle' && item.category !== filterCat) return false;
      if (!q) return true;
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    });
  }, [faqItems, filterCat, query]);

  const showCategoryBar = variant === 'page' && faq?.length;

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section) return;

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

  const togglePageItem = (i: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const pageStyle = variant === 'page';

  return (
    <section
      ref={sectionRef}
      className={
        pageStyle
          ? 'section-divider relative overflow-hidden bg-bg py-16 md:py-24'
          : 'section-divider bg-bg py-20 md:py-28'
      }
      aria-labelledby="faq-heading"
    >
      {pageStyle && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(93,196,34,0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(93,196,34,0.08), transparent)',
          }}
        />
      )}

      <div className={`relative mx-auto px-4 sm:px-6 lg:px-8 ${pageStyle ? 'max-w-4xl' : 'max-w-3xl'}`}>
        {pageStyle && (
          <div className="mb-10 text-center md:mb-14">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-primary">{tp('kicker')}</p>
            <h1
              id="faq-heading"
              ref={headingRef}
              className="mt-3 font-heading text-3xl font-bold italic uppercase tracking-wide text-text md:text-5xl"
            >
              {tp('heroTitle')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-relaxed text-text-muted md:text-base">
              {tp('heroLead')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/preise" className="btn-primary inline-flex justify-center px-6 py-3 text-sm">
                {tp('ctaPreise')}
              </Link>
              <Link
                href="/anmelden"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-body text-sm text-white transition-colors hover:border-green-primary/50"
              >
                {tp('ctaAnmelden')}
              </Link>
            </div>
          </div>
        )}

        {!pageStyle && (
          <h2
            id="faq-heading"
            ref={headingRef}
            className="font-heading text-3xl font-bold italic uppercase tracking-wide text-text md:text-4xl"
          >
            {t('heading')}
          </h2>
        )}

        {showCategoryBar && (
          <div className="mb-6 space-y-4">
            <label className="sr-only" htmlFor="faq-search">
              {tp('searchLabel')}
            </label>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tp('searchPlaceholder')}
              className="w-full rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface/90 px-4 py-3 font-body text-sm text-text placeholder:text-text-muted/70 focus:border-green-primary focus:outline-none focus:ring-1 focus:ring-green-primary/40"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label={tp('filterAria')}>
              <button
                type="button"
                onClick={() => setFilterCat('alle')}
                className={`rounded-full px-4 py-2 font-body text-xs font-medium uppercase tracking-wide transition-colors md:text-sm ${
                  filterCat === 'alle'
                    ? 'bg-green-primary text-black'
                    : 'border border-white/15 bg-surface/60 text-text-muted hover:border-green-primary/30 hover:text-text'
                }`}
              >
                {tp('filterAll')}
              </button>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCat(cat)}
                  className={`rounded-full px-4 py-2 font-body text-xs font-medium uppercase tracking-wide transition-colors md:text-sm ${
                    filterCat === cat
                      ? 'bg-green-primary text-black'
                      : 'border border-white/15 bg-surface/60 text-text-muted hover:border-green-primary/30 hover:text-text'
                  }`}
                >
                  {tp(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className={
            pageStyle
              ? 'mt-6 flex flex-col gap-3 md:mt-8'
              : 'mt-10 rounded-xl border border-[rgba(93,196,34,0.15)] bg-surface'
          }
        >
          {filteredItems.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-surface/50 px-6 py-10 text-center text-sm text-text-muted">
              {tp('empty')}
            </p>
          ) : (
            filteredItems.map((item) => {
              const displayIndex = item.id;
              const isOpen =
                variant === 'page' ? openIds.has(displayIndex) : openId === displayIndex;
              const onToggle =
                variant === 'page'
                  ? () => togglePageItem(displayIndex)
                  : () => setOpenId((prev) => (prev === displayIndex ? null : displayIndex));

              return (
                <AccordionItem
                  key={`${filterCat}-${query}-${displayIndex}-${item.question.slice(0, 24)}`}
                  id={displayIndex}
                  open={isOpen}
                  onToggle={onToggle}
                  question={item.question}
                  answer={item.answer}
                  pageStyle={pageStyle}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
