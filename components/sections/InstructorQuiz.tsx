'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Link } from '@/i18n/navigation';
import { type Instructor, type InstructorLang, type InstructorClass } from '@/lib/instructors';
import { setRegistrationInstructor } from '@/lib/registration';

type Step = 1 | 2 | 3 | 'result';
const LANG_OPTIONS: InstructorLang[] = ['de', 'ar', 'tr', 'ru', 'en', 'fr'];
const CLASS_OPTIONS: { value: 'pkw' | 'motorrad'; classes: InstructorClass[] }[] = [
  { value: 'pkw', classes: ['B', 'BE'] },
  { value: 'motorrad', classes: ['A', 'A1', 'A2', 'AM'] },
];

function matchInstructor(
  list: Instructor[],
  lang: InstructorLang,
  classType: 'pkw' | 'motorrad'
): Instructor | null {
  const hasPkw = (c: InstructorClass[]) => c.some((x) => x === 'B' || x === 'BE');
  const hasMoto = (c: InstructorClass[]) => c.some((x) => ['A', 'A1', 'A2', 'AM'].includes(x));
  const wantPkw = classType === 'pkw';
  const filtered = list.filter((i) => {
    if (!i.languages.includes(lang)) return false;
    if (wantPkw && !hasPkw(i.classes)) return false;
    if (!wantPkw && !hasMoto(i.classes)) return false;
    return true;
  });
  const available = filtered.filter((i) => i.available);
  const pool = available.length ? available : filtered;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

type InstructorQuizProps = { instructors?: Instructor[] };

export default function InstructorQuiz({ instructors }: InstructorQuizProps) {
  const list = instructors?.length ? instructors : [];
  const t = useTranslations('instructorQuiz');
  const [step, setStep] = useState<Step>(1);
  const [lang, setLang] = useState<InstructorLang | null>(null);
  const [classType, setClassType] = useState<'pkw' | 'motorrad' | null>(null);
  const [result, setResult] = useState<Instructor | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLang = (l: InstructorLang) => {
    setLang(l);
    setStep(2);
  };
  const handleClass = (c: 'pkw' | 'motorrad') => {
    setClassType(c);
    setStep(3);
  };
  const handleFinish = () => {
    if (lang && classType) {
      const inst = matchInstructor(list, lang, classType);
      setResult(inst);
    }
    setStep('result');
  };

  useEffect(() => {
    if (step === 'result' && cardRef.current) {
      gsap.fromTo(cardRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    }
  }, [step]);

  return (
    <section
      id="quiz"
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-16 md:py-24"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-green-500">
            {t('badge')}
          </p>
          <h2 className="font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl">
            {t('heading')}
          </h2>
          <p className="mt-3 font-body text-text-muted">{t('subheading')}</p>
        </header>

        {step !== 'result' && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  step >= s ? 'bg-green-500' : 'bg-white/20'
                }`}
                aria-hidden
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-10">
            <p className="mb-4 font-body font-medium text-white">{t('q1')}</p>
            <div className="flex flex-wrap gap-3">
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLang(l)}
                  data-testid={`quiz-lang-${l}`}
                  className="rounded-xl border border-white/20 bg-card px-5 py-3 font-body text-white transition-all hover:border-green-500 hover:bg-green-500/10"
                >
                  {t(`lang_${l}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-10">
            <p className="mb-4 font-body font-medium text-white">{t('q2')}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleClass('pkw')}
                data-testid="quiz-class-pkw"
                className="rounded-xl border border-white/20 bg-card px-6 py-3 font-body text-white transition-all hover:border-green-500 hover:bg-green-500/10"
              >
                🚗 {t('pkw')}
              </button>
              <button
                type="button"
                onClick={() => handleClass('motorrad')}
                data-testid="quiz-class-motorrad"
                className="rounded-xl border border-white/20 bg-card px-6 py-3 font-body text-white transition-all hover:border-green-500 hover:bg-green-500/10"
              >
                🏍️ {t('motorrad')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-10 text-center">
            <p className="mb-6 font-body text-text-muted">{t('q3')}</p>
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary px-8 py-4"
              data-testid="quiz-finish"
            >
              {t('showResult')}
            </button>
          </div>
        )}

        {step === 'result' && (
          <div ref={cardRef} className="mt-10">
            {result ? (
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-card">
                <div className="p-6 sm:flex sm:items-center sm:gap-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-40">
                    <Image
                      src={result.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <p className="font-display text-xs uppercase tracking-wider text-green-500">
                      {t('yourMatch')}
                    </p>
                    <h3 className="mt-1 font-heading text-2xl font-bold italic text-white">
                      {result.name}
                    </h3>
                    <p className="font-body text-sm text-text-muted">{result.title}</p>
                    <p className="mt-2 font-body text-white/90">&ldquo;{result.quote}&rdquo;</p>
                    <Link
                      href="/anmelden"
                      className="btn-primary mt-4 inline-block"
                      onClick={() => setRegistrationInstructor(result.id)}
                      data-testid="quiz-cta-result"
                    >
                      {t('cta')}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/15 bg-card p-8 text-center">
                <p className="font-body text-text-muted">{t('noMatch')}</p>
                <Link href="/lehrer" className="btn-primary mt-4 inline-block" data-testid="quiz-browse-all">
                  {t('browseAll')}
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => { setStep(1); setLang(null); setClassType(null); setResult(null); }}
              className="mt-4 w-full font-body text-sm text-text-muted underline hover:text-white"
              data-testid="quiz-restart"
            >
              {t('restart')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
