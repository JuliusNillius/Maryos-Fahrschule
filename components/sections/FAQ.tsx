'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FaqItem } from '@/lib/site-data';

gsap.registerPlugin(ScrollTrigger);

const FAQ_KEYS = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9',
] as const;

type FAQProps = { faq?: FaqItem[] | null; locale?: string };

function AccordionItem({
  id,
  open,
  onToggle,
  question,
  answer,
}: {
  id: number;
  open: boolean;
  onToggle: () => void;
  question: string;
  answer: string;
}) {
  return (
    <div className="card-style overflow-hidden border-b border-[rgba(93,196,34,0.15)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 pr-4 text-left font-heading text-sm font-bold uppercase tracking-wide text-text transition-colors hover:text-green-primary md:text-base"
        aria-expanded={open}
        aria-controls={`faq-answer-${id}`}
        id={`faq-question-${id}`}
        data-testid={`faq-toggle-${id}`}
      >
        <span>{question}</span>
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
          <p className="pb-5 pr-4 font-body text-sm leading-relaxed text-text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ faq, locale = 'de' }: FAQProps) {
  const t = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [openId, setOpenId] = useState<number | null>(0);

  const qKey = locale === 'en' ? 'question_en' : locale === 'tr' ? 'question_tr' : locale === 'ar' ? 'question_ar' : locale === 'ru' ? 'question_ru' : 'question_de';
  const aKey = locale === 'en' ? 'answer_en' : locale === 'tr' ? 'answer_tr' : locale === 'ar' ? 'answer_ar' : locale === 'ru' ? 'answer_ru' : 'answer_de';
  const faqItems = faq?.length
    ? faq.map((item, i) => ({
        id: i,
        question: (item[qKey as keyof FaqItem] as string) || item.question_de,
        answer: (item[aKey as keyof FaqItem] as string) || item.answer_de,
      }))
    : FAQ_KEYS.map((key, i) => ({
        id: i,
        question: t(`${key}Q`),
        answer: t(`${key}A`),
      }));

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

  return (
    <section
      ref={sectionRef}
      className="section-divider bg-bg py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          ref={headingRef}
          className="font-heading text-3xl font-bold italic uppercase tracking-wide text-text md:text-4xl"
        >
          {t('heading')}
        </h2>

        <div className="mt-10 rounded-xl border border-[rgba(93,196,34,0.15)] bg-surface">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              id={i}
              open={openId === i}
              onToggle={() => setOpenId((prev) => (prev === i ? null : i))}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
